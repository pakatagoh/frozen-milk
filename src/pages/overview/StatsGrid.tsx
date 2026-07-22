interface StatsGridProps {
  bagCount: number;
  upcomingExpiry: string | null;
  expiringSoon: number;
}

function StatBox({
  label,
  value,
  span = 1,
}: {
  label: string;
  value: string;
  span?: 1 | 2;
}) {
  return (
    <div
      className="flex flex-col items-center justify-center rounded-xl bg-white px-2 py-4 shadow-sm ring-1 ring-border/50"
      style={{ flex: span }}
    >
      <p className="text-center text-base font-bold leading-tight">{value}</p>
      <p className="mt-0.5 text-center text-[11px] leading-tight">
        {label}
      </p>
    </div>
  );
}

export function StatsGrid({ bagCount, upcomingExpiry, expiringSoon }: StatsGridProps) {
  return (
    <div className="flex gap-3">
      <StatBox label="Frozen bags" value={String(bagCount)} />
      <StatBox
        label="Next expiry"
        value={upcomingExpiry ?? "—"}
        span={2}
      />
      <StatBox label="Expiring soon" value={String(expiringSoon)} />
    </div>
  );
}
