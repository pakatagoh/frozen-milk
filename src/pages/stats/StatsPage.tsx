import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getEntries } from "@/lib/entries-fn";
import { PeriodSummaryCard } from "@/pages/stats/PeriodSummaryCard";
import { DailyFrozenChart } from "@/pages/stats/DailyFrozenChart";

function parseSheetDate(s: string): number {
  const m = s.match(/^(\d{1,2})-(\w{3})-(\d{2})$/);
  if (!m) return NaN;
  const d = new Date(`${m[2]} ${m[1]}, 20${m[3]}`);
  return d.getTime();
}

/** Check if a timestamp falls within the current week (Mon–Sun in SG time). */
function isThisWeek(ts: number): boolean {
  const now = new Date();
  const monday = new Date(now);
  monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(23, 59, 59, 999);
  return ts >= monday.getTime() && ts <= sunday.getTime();
}

/** Check if a timestamp falls within the current month. */
function isThisMonth(ts: number): boolean {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return ts >= start.getTime() && ts <= end.getTime();
}

export function StatsPage() {
  const { data: entries = [] } = useQuery({
    queryKey: ["entries"],
    queryFn: () => getEntries(),
  });

  // ── Period summaries ─────────────────────────────────────────
  const { weekAdded, weekUsed, monthAdded, monthUsed } = useMemo(() => {
    let weekAdded = 0, weekUsed = 0, monthAdded = 0, monthUsed = 0;

    for (const e of entries) {
      const freezeMs = parseSheetDate(e.date);
      if (!Number.isNaN(freezeMs)) {
        if (isThisWeek(freezeMs)) weekAdded += e.amount;
        if (isThisMonth(freezeMs)) monthAdded += e.amount;
      }

      if (e.used && e.usedAt) {
        const usedMs = Date.parse(e.usedAt);
        if (!Number.isNaN(usedMs)) {
          if (isThisWeek(usedMs)) weekUsed += e.amount;
          if (isThisMonth(usedMs)) monthUsed += e.amount;
        }
      }
    }

    return { weekAdded, weekUsed, monthAdded, monthUsed };
  }, [entries]);

  // ── Daily frozen (last 7 days Mon–Sun) ──────────────────────
  const dailyData = useMemo(() => {
    const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    monday.setHours(0, 0, 0, 0);

    const daily: Record<string, number> = {};
    for (const day of DAYS) daily[day] = 0;

    for (const e of entries) {
      const freezeMs = parseSheetDate(e.date);
      if (Number.isNaN(freezeMs)) continue;
      const d = new Date(freezeMs);
      // Only count if this week
      if (d.getTime() >= monday.getTime()) {
        const dayIdx = (d.getDay() + 6) % 7; // Sun=6, Mon=0
        daily[DAYS[dayIdx]] += e.amount;
      }
    }

    return DAYS.map((day, i) => {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const label = `${day} ${date.getDate()}/${date.getMonth() + 1}`;
      return { day, label, ml: daily[day] };
    });
  }, [entries]);

  // ── Date range labels ───────────────────────────────────────
  const weekLabel = useMemo(() => {
    const now = new Date();
    const monday = new Date(now);
    monday.setDate(now.getDate() - ((now.getDay() + 6) % 7));
    const sun = new Date(monday);
    sun.setDate(monday.getDate() + 6);

    const fmt = (d: Date) =>
      d.toLocaleDateString("en-SG", { day: "numeric", month: "short" });
    return `${fmt(monday)} – ${fmt(sun)}`;
  }, []);

  const monthLabel = useMemo(() => {
    const now = new Date();
    return now.toLocaleDateString("en-SG", { month: "short", year: "numeric" });
  }, []);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 px-4 py-6">
      <h1 className="text-2xl font-bold">📊 Stats</h1>

      {/* Period cards */}
      <div className="grid grid-cols-2 gap-3">
        <PeriodSummaryCard
          title="This Week"
          subtitle={weekLabel}
          added={weekAdded}
          used={weekUsed}
        />
        <PeriodSummaryCard
          title="This Month"
          subtitle={monthLabel}
          added={monthAdded}
          used={monthUsed}
        />
      </div>

      {/* Daily chart */}
      <DailyFrozenChart data={dailyData} />
    </main>
  );
}
