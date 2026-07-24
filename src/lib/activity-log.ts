import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

/** A row from the 'app events' tab. */
export interface AppActivity {
  id: string;
  createdAt: string; // ISO 8601
  eventType: string;
  frozenMilkEntryId: string | null;
}

// ─── Helpers ────────────────────────────────────────────────────────────────

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

// ─── Public API ─────────────────────────────────────────────────────────────

/** Read all events, newest first. */
export async function getAllActivities(): Promise<AppActivity[]> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "'app events'!A2:D",
  });

  const rows = result.data.values || [];
  return rows
    .map((row) => ({
      id: String(row[0] || ""),
      createdAt: String(row[1] || ""),
      eventType: String(row[2] || ""),
      frozenMilkEntryId: String(row[3] || "") || null,
    }))
    .filter((a) => a.id !== "")
    .reverse(); // newest first (sheet appends at bottom)
}

/** Append a new event row (atomic — uses sheets.values.append). */
export async function appendActivity(activity: {
  eventType: string;
  frozenMilkEntryId?: string | null;
}): Promise<AppActivity> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "'app events'!A2:D",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[id, createdAt, activity.eventType, activity.frozenMilkEntryId ?? ""]],
    },
  });

  return {
    id,
    createdAt,
    eventType: activity.eventType,
    frozenMilkEntryId: activity.frozenMilkEntryId ?? null,
  };
}
