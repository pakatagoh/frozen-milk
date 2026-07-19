import {
  getNextPending,
  markProcessing,
  markDone,
  markFailed,
  hasPendingJobs,
  type JobPayload,
} from "./jobs";
import { analyzeMilkPacket } from "./ai";
import { appendToSheet } from "./sheets";
import { generateImgproxyUrl } from "./images";

let processing = false;

export async function processPendingJobs(): Promise<void> {
  if (processing) return;
  processing = true;

  try {
    const job = getNextPending();
    if (!job) return;

    markProcessing(job.id);

    try {
      const payload: JobPayload = JSON.parse(job.payload);

      // AI extraction
      const result = await analyzeMilkPacket(payload.base64, payload.mimeType);

      // Generate image URL
      const imageUrl = generateImgproxyUrl(payload.storedPath, 400, 400);

      // Append to Google Sheets
      await appendToSheet({
        date: result.date,
        time: result.time,
        amount: result.amount_ml,
        packets: result.packets,
        notes: result.notes || "",
        imageUrl,
      });

      markDone(job.id, result);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      markFailed(job.id, msg);
    }
  } finally {
    processing = false;
    if (hasPendingJobs()) {
      setImmediate(processPendingJobs);
    }
  }
}
