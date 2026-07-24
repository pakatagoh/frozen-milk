import { createServerFn } from "@tanstack/react-start";
import { getAllActivities } from "./activity-log";
import type { AppActivity } from "./activity-log";

export { type AppActivity } from "./activity-log";

/** Fetch all app activities, newest first. */
export const getActivities = createServerFn({ method: "GET" }).handler(
  async (): Promise<AppActivity[]> => {
    return getAllActivities();
  },
);
