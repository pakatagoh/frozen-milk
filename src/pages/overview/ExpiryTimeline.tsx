interface TimelineBucket {
  label: string;
  color: string;
  bags: number;
  ml: number;
  maxBags: number;
}

interface ExpiryTimelineProps {
  buckets: TimelineBucket[];
}

const COLOR_MAP: Record<string, string> = {
  red: "bg-red-400",
  orange: "bg-orange-400",
  amber: "bg-amber-400",
  green: "bg-emerald-400",
};

export function ExpiryTimeline({ buckets }: ExpiryTimelineProps) {
  if (buckets.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold text-muted-foreground">
        Expiry Timeline
      </h2>
      <div className="space-y-3">
        {buckets.map((b) => {
          const pct = b.maxBags > 0 ? (b.bags / b.maxBags) * 100 : 0;
          return (
            <div key={b.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs text-muted-foreground">{b.label}</span>
                <span className="text-xs text-muted-foreground">
                  {b.bags} bags · {b.ml}ml
                </span>
              </div>
              <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                <div
                  className={`h-full rounded-full ${COLOR_MAP[b.color] || "bg-muted-foreground"}`}
                  style={{ width: `${Math.max(pct, b.bags > 0 ? 4 : 0)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
