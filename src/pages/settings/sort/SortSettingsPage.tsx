import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useServerFn } from "@tanstack/react-start";
import { useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { fetchSortOption, saveSortOption, type SortOption } from "@/lib/app-settings-fn";
import { ArrowLeft } from "lucide-react";

const OPTIONS: { value: SortOption; label: string }[] = [
  { value: "newest", label: "Newest first" },
  { value: "oldest", label: "Oldest first" },
  { value: "volume desc", label: "Volume ↓" },
  { value: "volume asc", label: "Volume ↑" },
];

export function SortSettingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const saveFn = useServerFn(saveSortOption);

  const { data: current } = useQuery({
    queryKey: ["appSetting", "sort"],
    queryFn: () => fetchSortOption(),
  });

  const [selected, setSelected] = useState<SortOption>(current ?? "newest");
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      await saveFn({ data: { option: selected } });
      void queryClient.invalidateQueries({ queryKey: ["appSetting", "sort"] });
      navigate({ to: "/settings" });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => navigate({ to: "/settings" })}
          className="shrink-0 rounded-full p-1.5 text-muted-foreground hover:bg-accent"
          aria-label="Back to settings"
        >
          <ArrowLeft className="size-5" />
        </button>
        <h2 className="text-lg font-semibold">Default Sort Order</h2>
      </div>

      {/* Radio options */}
      <div className="space-y-1">
        {OPTIONS.map((opt) => {
          const isActive = selected === opt.value;
          return (
            <label
              key={opt.value}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border px-4 py-3 transition-colors ${
                isActive
                  ? "border-primary bg-primary/10"
                  : "border-input bg-transparent hover:border-gray-800"
              }`}
            >
              <input
                type="radio"
                name="sortOption"
                value={opt.value}
                checked={isActive}
                onChange={() => setSelected(opt.value)}
                className="sr-only"
              />
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 ${
                  isActive ? "border-primary" : "border-gray-400"
                }`}
              >
                {isActive && <div className="h-2.5 w-2.5 rounded-full bg-primary" />}
              </div>
              <span className="text-sm">{opt.label}</span>
            </label>
          );
        })}
      </div>

      <Button
        type="button"
        className="w-full"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? "Saving…" : "Save"}
      </Button>
    </div>
  );
}
