interface PeriodSummaryCardProps {
  title: string;
  subtitle: string;
  added: number;
  used: number;
}

export function PeriodSummaryCard({ title, subtitle, added, used }: PeriodSummaryCardProps) {
  const net = added - used;
  const netColor = net >= 0 ? "text-emerald-600" : "text-red-500";
  const netSign = net >= 0 ? "+" : "";

  return (
    <div className="rounded-xl bg-white px-4 py-4 shadow-sm ring-1 ring-border/50">
      <p className="text-sm font-medium">{title}</p>
      <p className="text-xs text-muted-foreground">{subtitle}</p>
      <div className="mt-3 space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Added</span>
          <span className="font-medium">{added} ml</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Used</span>
          <span className="font-medium">{used} ml</span>
        </div>
        <div className="flex justify-between text-xs font-medium">
          <span className="text-muted-foreground">Net</span>
          <span className={netColor}>
            {netSign}{net} ml
          </span>
        </div>
      </div>
    </div>
  );
}
