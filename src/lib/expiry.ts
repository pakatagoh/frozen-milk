import type { MilkSheetEntry } from "@/lib/sheets";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Parse a sheet date string ("DD-Mon-YY") and add `months` offset.
 * Returns "Mon-YY" (e.g., "Oct-26") or `null` if unparseable.
 */
export function getExpiryMonth(
  entry: MilkSheetEntry,
  offsetMonths = 3,
): string | null {
  const m = entry.date.match(/^(\d{1,2})-(\w{3})-(\d{2})$/);
  if (!m) return null;

  const monthIdx = MONTHS.indexOf(m[2] as (typeof MONTHS)[number]);
  if (monthIdx === -1) return null;

  const d = new Date(2000 + Number(m[3]), monthIdx, Number(m[1]));
  if (isNaN(d.getTime())) return null;

  d.setMonth(d.getMonth() + offsetMonths);

  return `${MONTHS[d.getMonth()]}-${String(d.getFullYear()).slice(2)}`;
}

/** "Oct-26" → "October 2026" */
export function formatExpiryMonth(key: string): string {
  const [mon, yy] = key.split("-");
  const idx = MONTHS.indexOf(mon as (typeof MONTHS)[number]);
  if (idx === -1) return key;
  const full = new Date(2000 + Number(yy), idx, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });
  return full;
}
