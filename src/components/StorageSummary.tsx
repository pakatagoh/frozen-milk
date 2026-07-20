import { useMemo } from "react";
import type { MilkSheetEntry } from "@/lib/sheets";
import { getExpiryMonth, formatExpiryMonth } from "@/lib/expiry";

interface StorageSummaryProps {
  entries: MilkSheetEntry[];
}

/** Group entries by expiry month, summing packets & ml per amount. */
function buildStats(entries: MilkSheetEntry[]) {
  const frozen = entries.filter((e) => e.totalFrozen > 0);

  const totalPackets = frozen.reduce((s, e) => s + e.totalFrozen, 0);
  const totalMl = frozen.reduce((s, e) => s + e.amount * e.totalFrozen, 0);

  // Group by expiry month
  const byMonth = new Map<
    string,
    {
      packets: number;
      ml: number;
      /** amount → totalFrozen count */
      byAmount: Map<number, number>;
    }
  >();

  for (const e of frozen) {
    const key = getExpiryMonth(e);
    if (!key) continue;

    let group = byMonth.get(key);
    if (!group) {
      group = { packets: 0, ml: 0, byAmount: new Map() };
      byMonth.set(key, group);
    }
    group.packets += e.totalFrozen;
    group.ml += e.amount * e.totalFrozen;
    group.byAmount.set(
      e.amount,
      (group.byAmount.get(e.amount) ?? 0) + e.totalFrozen,
    );
  }

  // Find earliest month
  const sortedMonths = [...byMonth.keys()].sort();
  const nextMonthKey = sortedMonths[0] ?? null;
  const nextMonth = nextMonthKey ? byMonth.get(nextMonthKey)! : null;

  return { totalPackets, totalMl, nextMonthKey, nextMonth, frozenCount: frozen.length };
}

/** "80ml × 2 pkt, 90ml × 1 pkt" — sorted by amount ascending */
function formatBreakdown(byAmount: Map<number, number>): string {
  return [...byAmount.entries()]
    .sort(([a], [b]) => a - b)
    .map(([amount, pkts]) => `${amount}ml × ${pkts} pkt`)
    .join(", ");
}

export function StorageSummary({ entries }: StorageSummaryProps) {
  const stats = useMemo(() => buildStats(entries), [entries]);

  if (entries.length === 0) return null;

  return (
    <details className="mb-4 rounded-lg border bg-card text-sm" open>
      <summary className="cursor-pointer select-none px-3 py-2 font-medium">
        📊 Storage Summary
      </summary>

      <div className="space-y-2 px-3 pb-3">
        {/* ── Overall ─────────────────────────────────── */}
        <p className="text-muted-foreground">
          <span className="font-semibold text-foreground">{stats.totalPackets}</span>{" "}
          packets frozen ·{" "}
          <span className="font-semibold text-foreground">{stats.totalMl}</span>{" "}
          ml total
        </p>

        {/* ── Next expiry ─────────────────────────────── */}
        {stats.nextMonth && stats.nextMonthKey && (
          <>
            <hr className="border-border" />
            <div>
              <p className="font-medium">
                Next expiry:{" "}
                <span className="font-semibold">
                  {formatExpiryMonth(stats.nextMonthKey)}
                </span>
              </p>
              <p className="text-muted-foreground">
                {stats.nextMonth.packets} packets · {stats.nextMonth.ml} ml
              </p>
              <p className="text-xs text-muted-foreground">
                {formatBreakdown(stats.nextMonth.byAmount)}
              </p>
            </div>
          </>
        )}
      </div>
    </details>
  );
}
