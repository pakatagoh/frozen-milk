import { createServerFn } from "@tanstack/react-start";
import { getSortOption, setSortOption } from "./app-settings";
import type { SortOption } from "./app-settings";
import type { SortKey } from "@/pages/storage/SortDropdown";

export { type SortOption } from "./app-settings";

/** Map sheet sort option → SortDropdown SortKey. */
export function sortOptionToSortKey(option: SortOption): SortKey {
  const map: Record<SortOption, SortKey> = {
    "newest": "newest",
    "oldest": "oldest",
    "volume desc": "largest",
    "volume asc": "least",
  };
  return map[option];
}

/** Map SortDropdown SortKey → sheet sort option. */
export function sortKeyToSortOption(key: SortKey): SortOption {
  const map: Record<SortKey, SortOption> = {
    newest: "newest",
    oldest: "oldest",
    largest: "volume desc",
    least: "volume asc",
  };
  return map[key];
}

/** Fetch the current sort option from the 'app settings' sheet. */
export const fetchSortOption = createServerFn({ method: "GET" }).handler(
  async (): Promise<SortOption> => {
    return getSortOption();
  },
);

/** Save the sort option to the 'app settings' sheet. */
export const saveSortOption = createServerFn({ method: "POST" })
  .validator((data: unknown): SortOption => {
    const value = String((data as Record<string, unknown>).option ?? "").trim();
    const valid = new Set(["newest", "oldest", "volume desc", "volume asc"]);
    if (!valid.has(value)) throw new Error(`Invalid sort option: ${value}`);
    return value as SortOption;
  })
  .handler(async ({ data }) => {
    await setSortOption(data);
  });
