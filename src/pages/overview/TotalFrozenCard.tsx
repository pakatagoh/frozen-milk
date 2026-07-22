interface TotalFrozenCardProps {
  totalMl: number;
}

export function TotalFrozenCard({ totalMl }: TotalFrozenCardProps) {
  return (
    <div className="rounded-2xl bg-primary/15 px-6 py-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-primary">Total Frozen Milk</p>
          <p className="mt-1 text-4xl font-bold tracking-tight text-foreground">
            {totalMl.toLocaleString()} ml
          </p>
        </div>
        {/* Milk bag icon — rose-toned */}
        <svg
          width="56"
          height="72"
          viewBox="0 0 56 72"
          fill="none"
          className="shrink-0"
        >
          <rect
            x="8"
            y="20"
            width="40"
            height="52"
            rx="4"
            fill="#e8c0cc"
            stroke="#c07d8e"
            strokeWidth="1.5"
          />
          <rect x="18" y="26" width="20" height="36" rx="2" fill="#f5e0e5" />
          <line x1="18" y1="35" x2="38" y2="35" stroke="#c07d8e" strokeWidth="0.8" />
          <line x1="18" y1="42" x2="38" y2="42" stroke="#c07d8e" strokeWidth="0.8" />
          <line x1="18" y1="49" x2="34" y2="49" stroke="#c07d8e" strokeWidth="0.8" />
          <line x1="18" y1="56" x2="30" y2="56" stroke="#c07d8e" strokeWidth="0.8" />
          <rect
            x="20"
            y="12"
            width="16"
            height="10"
            rx="2"
            fill="#e8c0cc"
            stroke="#c07d8e"
            strokeWidth="1.5"
          />
          <path d="M22 12V8L34 8V12" stroke="#c07d8e" strokeWidth="1.5" />
        </svg>
      </div>
    </div>
  );
}
