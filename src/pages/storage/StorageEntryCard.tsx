import type { MilkSheetEntry } from "@/lib/sheets";
import { getExpiryDate } from "@/lib/expiry";

interface StorageEntryCardProps {
  entry: MilkSheetEntry;
  checked: boolean;
  onToggle: () => void;
  onOpenDetail: () => void;
}

function parseSheetDate(s: string): number {
  const m = s.match(/^(\d{1,2})-(\w{3})-(\d{2})$/);
  if (!m) return NaN;
  const d = new Date(`${m[2]} ${m[1]}, 20${m[3]}`);
  return d.getTime();
}

function daysFromNow(dateStr: string): number | null {
  const ms = parseSheetDate(dateStr);
  if (Number.isNaN(ms)) return null;
  return Math.ceil((ms - Date.now()) / (24 * 60 * 60 * 1000));
}

function expiryColor(days: number): string {
  if (days <= 7) return "text-red-500";
  if (days <= 30) return "text-orange-500";
  return "text-emerald-600";
}

export function StorageEntryCard({ entry, checked, onToggle, onOpenDetail }: StorageEntryCardProps) {
  const expiryDate = getExpiryDate(entry);
  const days = expiryDate ? daysFromNow(expiryDate) : null;

  return (
    <div
      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
        checked ? "bg-accent" : "bg-card hover:bg-accent/50"
      }`}
      onClick={onOpenDetail}
    >
      {/* Checkbox */}
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => {
          e.stopPropagation();
          onToggle();
        }}
        onClick={(e) => e.stopPropagation()}
        className="size-4 shrink-0 rounded accent-primary"
      />

      {/* Thumbnail */}
      {entry.imageUrl ? (
        <img
          src={entry.imageUrl}
          srcSet={entry.srcSetThumb}
          sizes="48px"
          alt={`Milk packet ${entry.date}`}
          className="h-12 w-12 shrink-0 rounded-md bg-muted object-cover"
        />
      ) : (
        <div className="h-12 w-12 shrink-0 rounded-md bg-muted" />
      )}

      {/* Info */}
      <div className="min-w-0 flex-1">
        <p className="text-base font-medium">{entry.amount}ml</p>
        {days !== null && (
          <p className={`text-sm font-medium ${expiryColor(days)}`}>
            Expires in {days} day{days !== 1 ? "s" : ""}
          </p>
        )}
        {expiryDate && (
          <p className="text-xs text-muted-foreground">Expires {expiryDate}</p>
        )}
      </div>
    </div>
  );
}
