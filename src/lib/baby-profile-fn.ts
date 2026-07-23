import { createServerFn } from "@tanstack/react-start";
import { fetchBabyProfile } from "./baby-profile";
import type { BabyProfile } from "./baby-profile";

export { type BabyProfile } from "./baby-profile";

/** Fetch the baby profile (metadata + latest weight) from Google Sheets. */
export const getBabyProfile = createServerFn({ method: "GET" }).handler(
  async (): Promise<BabyProfile | null> => {
    return fetchBabyProfile();
  },
);
