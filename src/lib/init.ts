// Server startup: recover stale jobs and kick the worker.
// Import this from your server entry point (or app.config.ts).

import { recoverStaleJobs } from "./jobs";
import { processPendingJobs } from "./worker";

export function initWorker(): void {
  recoverStaleJobs();
  setTimeout(() => processPendingJobs(), 1000);
}
