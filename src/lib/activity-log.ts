import { google } from "googleapis";
import type { sheets_v4 } from "googleapis";
import { readFileSync } from "node:fs";
import { randomUUID } from "node:crypto";

/** A row from the 'app activities' tab. */
export interface AppActivity {
  id: string;
  createdAt: string; // ISO 8601
  eventType: string;
  activity: string;
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

/** Read all activities, newest first. */
export async function getAllActivities(): Promise<AppActivity[]> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  const result = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: "'app activities'!A2:E",
  });

  const rows = result.data.values || [];
  return rows
    .map((row) => ({
      id: String(row[0] || ""),
      createdAt: String(row[1] || ""),
      eventType: String(row[2] || ""),
      activity: String(row[3] || ""),
      frozenMilkEntryId: String(row[4] || "") || null,
    }))
    .filter((a) => a.id !== "")
    .reverse(); // newest first (sheet appends at bottom)
}

/** Append a new activity row (atomic — uses sheets.values.append). */
export async function appendActivity(activity: {
  eventType: string;
  activity: string;
  frozenMilkEntryId?: string | null;
}): Promise<AppActivity> {
  const sheetId = requireEnv("GOOGLE_SHEET_ID");
  const sheets = getSheetsClient();

  const id = randomUUID();
  const createdAt = new Date().toISOString();

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: "'app activities'!A2:E",
    valueInputOption: "USER_ENTERED",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [[id, createdAt, activity.eventType, activity.activity, activity.frozenMilkEntryId ?? ""]],
    },
  });

  return {
    id,
    createdAt,
    eventType: activity.eventType,
    activity: activity.activity,
    frozenMilkEntryId: activity.frozenMilkEntryId ?? null,
  };
}
