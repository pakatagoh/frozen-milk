import type { MilkSheetEntry } from "@/lib/sheets";
import { getExpiryDate, formatExpiryShort } from "@/lib/expiry";

interface RecentEntriesProps {
  entries: MilkSheetEntry[];
}

export function RecentEntries({ entries }: RecentEntriesProps) {
  if (entries.length === 0) return null;

  return (
    <div>
      <h2 className="mb-3 text-sm font-semibold">
        Recently Added
      </h2>
      <div className="space-y-2">
        {entries.slice(0, 3).map((entry) => (
          <div
            key={entry.id}
            className="flex items-center gap-3 rounded-lg border bg-card p-3"
          >
            {entry.imageUrl ? (
              <img
                src={entry.imageUrl}
                srcSet={entry.srcSetThumb}
                sizes="48px"
                alt={`Milk packet ${entry.date}`}
                className="h-14 w-12 shrink-0 rounded-md bg-muted object-cover"
              />
            ) : (
              <div className="flex h-14 w-12 shrink-0 items-center justify-center rounded-md bg-muted">
                <svg width="22" height="34" viewBox="0 0 28 40" fill="none" aria-hidden="true">
                  <rect x="5" y="12" width="18" height="26" rx="4" fill="#fce5dd" stroke="#F08A75" strokeWidth="1.5" />
                  <rect x="9" y="16" width="10" height="18" rx="2" fill="#fdf2ee" />
                  <rect x="9" y="7" width="10" height="6" rx="1.5" fill="#fce5dd" stroke="#F08A75" strokeWidth="1.5" />
                  <rect x="10" y="2" width="8" height="6" rx="1.5" fill="#F08A75" />
                  <line x1="9" y1="22" x2="19" y2="22" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
                  <line x1="9" y1="27" x2="19" y2="27" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
                  <line x1="9" y1="32" x2="15" y2="32" stroke="#F08A75" strokeWidth="0.6" opacity="0.5" />
                </svg>
              </div>
            )}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">
                {entry.amount}ml · {entry.date}
              </p>
              <p className="text-xs text-muted-foreground">
                {(() => {
                  const d = getExpiryDate(entry);
                  return d ? `Expires ${formatExpiryShort(d)}` : "—";
                })()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
