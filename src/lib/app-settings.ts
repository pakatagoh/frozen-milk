import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { readFileSync } from "node:fs";

/** Valid sort option values stored in the sheet. */
export type SortOption = "newest" | "oldest" | "volume desc" | "volume asc";

const VALID_SORT_OPTIONS: Set<string> = new Set([
  "newest",
  "oldest",
  "volume desc",
  "volume asc",
]);

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required environment variable: ${name}`);
  return value;
}

function getSheetsClient(): sheets_v4.Sheets {
  const tokenData = JSON.parse(
    readFileSync(requireEnv("GOOGLE_TOKEN_PATH"), "utf-8"),
  );
  const auth = new google.auth.OAuth2(
    tokenData.client_id,
    tokenData.client_secret,
    tokenData.redirect_uris?.[0],
  );
  auth.setCredentials({
    access_token: tokenData.token,
    refresh_token: tokenData.refresh_token,
  });
  return google.sheets({ version: "v4", auth });
}

/** Read the sort option from A2 of the 'app settings' tab. Falls back to 'newest'. */
export async function getSortOption(): Promise<SortOption> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  try {
    const result = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "'app settings'!A2",
    });
    const value = String(result.data.values?.[0]?.[0] ?? "").trim();
    if (VALID_SORT_OPTIONS.has(value)) return value as SortOption;
  } catch {
    // Sheet or value missing — fall back to default
  }
  return "newest";
}

/** Write the sort option to A2 of the 'app settings' tab. */
export async function setSortOption(option: SortOption): Promise<void> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range: "'app settings'!A2",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [[option]],
    },
  });
}
