import { ArrowUpDown, ChevronDown, ArrowDown, ArrowUp } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type SortKey = "newest" | "oldest" | "largest" | "least";

const SORT_LABELS: Record<SortKey, string> = {
  newest: "Newest first",
  oldest: "Oldest first",
  largest: "Volume \u2193",
  least: "Volume \u2191",
};

interface SortDropdownProps {
  sortKey: SortKey;
  onSortChange: (key: SortKey) => void;
}

export function SortDropdown({ sortKey, onSortChange }: SortDropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-sm transition-colors hover:text-foreground"
        >
          <ArrowUpDown className="size-3.5" />
          {SORT_LABELS[sortKey]}
          <ChevronDown className="size-3.5" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44 bg-white text-gray-900">
        <DropdownMenuRadioGroup
          value={sortKey}
          onValueChange={(v) => onSortChange(v as SortKey)}
        >
          <DropdownMenuRadioItem value="newest">Newest first</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="oldest">Oldest first</DropdownMenuRadioItem>
          <DropdownMenuSeparator />
          <DropdownMenuRadioItem value="largest">
            Volume <ArrowDown className="size-3.5" />
          </DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="least">
            Volume <ArrowUp className="size-3.5" />
          </DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
