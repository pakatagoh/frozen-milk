import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X } from "lucide-react";

export type NumOp = "eq" | "gte" | "lte";

export interface FilterState {
  dateStart: string;
  dateEnd: string;
  amountOp: NumOp;
  amountVal: string;
}

interface FilterModalProps {
  open: boolean;
  onClose: () => void;
  filter: FilterState;
  onApply: (filter: FilterState) => void;
}

const defaultFilter: FilterState = {
  dateStart: "",
  dateEnd: "",
  amountOp: "eq",
  amountVal: "",
};

export function FilterModal({ open, onClose, filter, onApply }: FilterModalProps) {
  const [draft, setDraft] = useState<FilterState>(filter);

  // Reset draft when modal opens
  const handleOpenChange = (isOpen: boolean) => {
    if (isOpen) {
      setDraft(filter);
    } else {
      onClose();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-lg" showCloseButton={false}>
        <DialogHeader className="flex flex-row items-center justify-between px-4 pt-4 pb-2">
          <DialogTitle>Filter</DialogTitle>
          <button onClick={onClose} className="rounded-full p-1 hover:bg-muted">
            <X className="size-4" />
          </button>
        </DialogHeader>

        <div className="flex flex-col gap-4 px-4 py-3">
          {/* Date range */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Date range</p>
            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={draft.dateStart}
                onChange={(e) => setDraft((d) => ({ ...d, dateStart: e.target.value }))}
                className="flex-1"
              />
              <span className="text-xs text-muted-foreground">to</span>
              <Input
                type="date"
                value={draft.dateEnd}
                onChange={(e) => setDraft((d) => ({ ...d, dateEnd: e.target.value }))}
                className="flex-1"
              />
            </div>
          </div>

          {/* Amount filter */}
          <div>
            <p className="mb-2 text-xs font-medium text-muted-foreground">Amount (ml)</p>
            <div className="flex items-center gap-2">
              <select
                value={draft.amountOp}
                onChange={(e) => setDraft((d) => ({ ...d, amountOp: e.target.value as NumOp }))}
                className="h-9 rounded-md border border-input bg-transparent px-2 text-sm"
              >
                <option value="eq">=</option>
                <option value="gte">≥</option>
                <option value="lte">≤</option>
              </select>
              <Input
                type="number"
                value={draft.amountVal}
                onChange={(e) => setDraft((d) => ({ ...d, amountVal: e.target.value }))}
                placeholder="ml"
                className="flex-1"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 border-t px-4 py-3">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => {
              setDraft(defaultFilter);
              onApply(defaultFilter);
              onClose();
            }}
          >
            Clear All
          </Button>
          <Button
            className="flex-1 bg-primary text-primary-foreground hover:bg-primary/80"
            onClick={() => {
              onApply(draft);
              onClose();
            }}
          >
            Apply
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
