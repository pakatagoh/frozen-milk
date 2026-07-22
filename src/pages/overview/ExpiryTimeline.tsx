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

/** Generate a lighter shade of the primary rose using color-mix() */
function shade(lightness: number): string {
  return `color-mix(in srgb, hsl(var(--primary)), white ${lightness}%)`;
}

const URGENCY_SHADE: Record<string, number> = {
  red: 0,    // ≤1 week: pure primary — most urgent
  orange: 7,  // 1-2 weeks
  amber: 14,  // 2-4 weeks
  green: 21,  // 1-3 months: lightest
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
              <div className="h-3 w-full overflow-hidden rounded-full bg-gray-200">
                <div
                  className="h-full rounded-full transition-[width] duration-700 ease-out"
                  style={{
                    width: `${Math.max(pct, b.bags > 0 ? 5 : 0)}%`,
                    backgroundColor: shade(URGENCY_SHADE[b.color] ?? 50),
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
