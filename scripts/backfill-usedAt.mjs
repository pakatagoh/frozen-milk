/**
 * Backfill usedAt field using updatedAt for rows where used=true and usedAt is empty.
 * Run from project root: node scripts/backfill-usedAt.mjs
 */
import { readFile } from "node:fs/promises";
import path from "node:path";

const SHEET_ID = process.env.GOOGLE_SHEET_ID;
const TOKEN_PATH = process.env.GOOGLE_TOKEN_PATH || path.join(process.env.HOME, ".google-token.json");

if (!SHEET_ID) {
  console.error("❌ GOOGLE_SHEET_ID not set");
  process.exit(1);
}

// Simple inline OAuth + sheets read/write
async function getToken() {
  const raw = await readFile(TOKEN_PATH, "utf-8");
  const { token, refresh_token, client_id, client_secret } = JSON.parse(raw);
  return { access_token: token, refresh_token, client_id, client_secret };
}

async function fetchGoogle(url, token, opts = {}) {
  let res = await fetch(url, {
    headers: { Authorization: `Bearer ${token.access_token}`, ...opts.headers },
    ...opts,
  });
  if (res.status === 401 && token.refresh_token) {
    const refreshRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        client_id: token.client_id,
        client_secret: token.client_secret,
        refresh_token: token.refresh_token,
        grant_type: "refresh_token",
      }),
    });
    const refreshed = await refreshRes.json();
    token.access_token = refreshed.access_token;
    res = await fetch(url, {
      headers: { Authorization: `Bearer ${token.access_token}`, ...opts.headers },
      ...opts,
    });
  }
  return res.ok ? res.json() : Promise.reject(new Error(`${res.status} ${res.statusText}`));
}

async function main() {
  const token = await getToken();
  console.log(`📄 Reading sheet ${SHEET_ID}…`);

  const range = encodeURIComponent("Frozen Breast Milk") + "!A2:M1000";
  const data = await fetchGoogle(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
    token,
  );

  const rows = data.values || [];
  console.log(`   ${rows.length} rows read`);

  const fixes = [];
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i];
    const used = String(row[11] || "").toUpperCase() === "TRUE";
    const usedAt = String(row[12] || "").replace(/^'/, "").trim();
    const updatedAt = String(row[10] || "").replace(/^'/, "").trim();

    if (used && !usedAt && updatedAt) {
      fixes.push({ rowIndex: i + 2, updatedAt }); // 1-based + header
      console.log(`  🔧 Row ${i + 2}: used=TRUE, usedAt empty, updatedAt="${updatedAt}"`);
    }
  }

  if (fixes.length === 0) {
    console.log("✅ No rows to fix.");
    return;
  }

  console.log(`\n📝 Updating ${fixes.length} rows…`);
  for (const f of fixes) {
    const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${encodeURIComponent("Frozen Breast Milk")}!M${f.rowIndex}?valueInputOption=USER_ENTERED`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        range: `Frozen Breast Milk!M${f.rowIndex}`,
        values: [[`'${f.updatedAt}`]],
      }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(`PUT row ${f.rowIndex}: ${res.status} ${res.statusText} — ${text}`);
    }
    console.log(`  ✅ Row ${f.rowIndex} → usedAt = "${f.updatedAt}"`);
  }

  console.log(`\n🎉 Backfill complete. ${fixes.length} rows fixed.`);
}

main().catch((err) => {
  console.error("❌", err);
  process.exit(1);
});
