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
    <div className="flex flex-col items-center rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-border/50">
      <p className="text-2xl font-bold">{value}</p>
      <p className="mt-0.5 text-center text-xs text-muted-foreground">{label}</p>
    </div>
  );
}

export function StatsGrid({ bagCount, upcomingExpiry, expiringSoon }: StatsGridProps) {
  return (
    <div className="grid grid-cols-3 gap-3">
      <StatBox label="Bags" value={String(bagCount)} />
      <StatBox
        label="Next expiry"
        value={upcomingExpiry ?? "—"}
      />
      <StatBox label="Expiring soon" value={String(expiringSoon)} />
    </div>
  );
}
