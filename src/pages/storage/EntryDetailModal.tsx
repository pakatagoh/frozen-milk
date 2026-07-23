import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { updateEntry } from "@/lib/update-entry-fn";
import { getExpiryDate } from "@/lib/expiry";
import type { MilkSheetEntry } from "@/lib/sheets";
import { X } from "lucide-react";

interface EntryDetailModalProps {
  entry: MilkSheetEntry | null;
  open: boolean;
  onClose: () => void;
}

export function EntryDetailModal({ entry, open, onClose }: EntryDetailModalProps) {
  const queryClient = useQueryClient();
  const updateFn = useServerFn(updateEntry);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [amount, setAmount] = useState("");
  const [used, setUsed] = useState(false);
  const [saving, setSaving] = useState(false);

  // Reset form whenever a new entry is opened
  useEffect(() => {
    if (entry && open) {
      setDate(entry.date);
      setTime(entry.time);
      setAmount(String(entry.amount));
      setUsed(entry.used);
    }
  }, [entry?.id, open]);

  if (!entry) return null;

  const handleSave = async () => {
    if (!entry.rowIndex) return;
    setSaving(true);
    try {
      await updateFn({
        data: {
          rowIndex: entry.rowIndex,
          date,
          time,
          amount: Number(amount) || 0,
          used,
          usedAt: used ? (entry.usedAt || new Date().toISOString()) : "",
          totalUsed: used ? entry.packets : 0,
        },
      });
      void queryClient.invalidateQueries({ queryKey: ["entries"] });
      onClose();
    } finally {
      setSaving(false);
    }
  };

  const expiryDate = getExpiryDate(entry);

  return (
    <Dialog open={open} onOpenChange={(o) => { if (!o) onClose(); }}>
      <DialogContent className="max-w-sm gap-0 overflow-hidden rounded-2xl border-0 bg-white p-0 shadow-lg" showCloseButton={false}>
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-10 flex size-7 items-center justify-center rounded-full bg-black/30 text-white"
        >
          <X className="size-4" />
        </button>

        {/* Image */}
        <div className="bg-black">
          {entry.imageUrl ? (
            <img
              src={entry.imageUrl}
              alt={`Milk packet ${entry.date}`}
              className="mx-auto h-64 w-full object-contain"
            />
          ) : (
            <div className="flex h-48 items-center justify-center">
              <svg width="42" height="56" viewBox="0 0 28 40" fill="none" aria-hidden="true">
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
        </div>

        {/* Fields */}
        <div className="flex flex-col gap-3 px-4 py-4">
          <div className="flex items-center gap-2">
            <label className="w-16 shrink-0 text-sm text-muted-foreground">Date</label>
            <Input
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="flex-1"
              placeholder="DD-Mon-YY"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 shrink-0 text-sm text-muted-foreground">Time</label>
            <Input
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="flex-1"
              placeholder="HH:MM"
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="w-16 shrink-0 text-sm text-muted-foreground">Amount</label>
            <Input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="flex-1"
              placeholder="ml"
            />
            <span className="text-sm text-muted-foreground">ml</span>
          </div>

          {expiryDate && (
            <p className="text-xs text-muted-foreground">
              Expires: {expiryDate}
            </p>
          )}

          {/* Mark as Used */}
          <div className="flex items-center gap-2">
            <Checkbox
              id={`used-${entry.id}`}
              checked={used}
              onCheckedChange={(c) => setUsed(!!c)}
              className="size-5"
            />
            <label htmlFor={`used-${entry.id}`} className="text-sm">
              Mark as Used
            </label>
          </div>
        </div>

        {/* Save */}
        <div className="border-t px-4 py-3">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="w-full bg-primary text-primary-foreground hover:bg-primary/80"
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
