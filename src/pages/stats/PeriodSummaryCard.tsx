import { ChevronLeft, ChevronRight } from "lucide-react";

interface PeriodSummaryCardProps {
  subtitle: string;
  added: number;
  used: number;
  onPrev: () => void;
  onNext: () => void;
}

export function PeriodSummaryCard({ subtitle, added, used, onPrev, onNext }: PeriodSummaryCardProps) {
  const net = added - used;
  const netColor = net >= 0 ? "text-emerald-600" : "text-red-500";
  const netSign = net >= 0 ? "+" : "";

  return (
    <div className="rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-border/50">
      {/* Navigation row */}
      <div className="mb-2 flex items-center justify-between">
        <button onClick={onPrev} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
          <ChevronLeft className="size-4" />
        </button>
        <p className="text-xs text-muted-foreground">{subtitle}</p>
        <button onClick={onNext} className="rounded p-0.5 text-muted-foreground hover:text-foreground">
          <ChevronRight className="size-4" />
        </button>
      </div>

      {/* Stats */}
      <div className="space-y-1">
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
