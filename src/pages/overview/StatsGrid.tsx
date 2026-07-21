interface StatsGridProps {
  bagCount: number;
  upcomingExpiry: string | null;
  expiringSoon: number;
}

function StatBox({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl bg-white px-2 py-4 shadow-sm ring-1 ring-border/50">
      <p className="text-center text-xl font-bold leading-tight">{value}</p>
      <p className="mt-0.5 text-center text-[11px] leading-tight text-muted-foreground">
        {label}
      </p>
    </div>
  );
}

export function StatsGrid({ bagCount, upcomingExpiry, expiringSoon }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatBox label="Frozen bags" value={String(bagCount)} />
      <StatBox
        label="Next expiry"
        value={upcomingExpiry ?? "—"}
      />
      <StatBox label="Expiring soon" value={String(expiringSoon)} />
    </div>
  );
}
