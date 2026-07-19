import { db, type JobRow, type JobPayload } from "./db";
import crypto from "node:crypto";

export type { JobPayload };

export function createJob(payload: object): string {
  const id = crypto.randomUUID();
  db.prepare(
    "INSERT INTO jobs (id, status, payload) VALUES (?, 'pending', ?)",
  ).run(id, JSON.stringify(payload));
  return id;
}

export function getJob(id: string): JobRow | undefined {
  return db.prepare("SELECT * FROM jobs WHERE id = ?").get(id) as
    | JobRow
    | undefined;
}

export function markProcessing(id: string): void {
  db.prepare(
    `UPDATE jobs SET status = 'processing', attempts = attempts + 1, updated_at = datetime('now') WHERE id = ?`,
  ).run(id);
}

export function markDone(id: string, result: object): void {
  db.prepare(
    `UPDATE jobs SET status = 'done', result = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(JSON.stringify(result), id);
}

export function markFailed(id: string, error: string): void {
  db.prepare(
    `UPDATE jobs SET status = 'failed', error = ?, updated_at = datetime('now') WHERE id = ?`,
  ).run(error, id);
}

export function getNextPending(): JobRow | undefined {
  return db.prepare(
    `SELECT * FROM jobs WHERE status = 'pending' AND attempts < 3 ORDER BY created_at ASC LIMIT 1`,
  ).get() as JobRow | undefined;
}

export function hasPendingJobs(): boolean {
  const row = db.prepare(
    "SELECT COUNT(*) as count FROM jobs WHERE status = 'pending'",
  ).get() as { count: number };
  return row?.count > 0;
}

export function recoverStaleJobs(): void {
  db.prepare(
    `UPDATE jobs SET status = 'pending', updated_at = datetime('now') WHERE status = 'processing' AND updated_at < datetime('now', '-5 minutes')`,
  ).run();
}
