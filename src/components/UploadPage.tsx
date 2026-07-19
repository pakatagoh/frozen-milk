import { useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Button } from "@/components/ui/button";
import { uploadMilk } from "@/lib/upload-fn";
import type { MilkPacketResult } from "@/lib/ai";
import { Camera, RotateCcw } from "lucide-react";

interface PendingEntry {
  id: string;
  previewUrl: string;
  status: "processing" | "done" | "error";
  result?: MilkPacketResult;
  error?: string;
}

const STATUS_ICON: Record<PendingEntry["status"], string> = {
  processing: "🔍",
  done: "✅",
  error: "❌",
};

const STATUS_LABEL: Record<PendingEntry["status"], string> = {
  processing: "Reading label...",
  done: "Done",
  error: "Failed",
};

export function UploadPage() {
  const [entries, setEntries] = useState<PendingEntry[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Keeps the original File for each entry so a failed upload can be resubmitted.
  const filesRef = useRef<Map<string, File>>(new Map());
  const uploadMilkFn = useServerFn(uploadMilk);

  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    handleFile(file);
    e.target.value = "";
  }

  function handleFile(file: File) {
    const id = crypto.randomUUID();
    filesRef.current.set(id, file);
    const previewUrl = URL.createObjectURL(file);

    // Optimistic entry appears immediately. The upload runs in the background,
    // so the user can keep snapping more photos without waiting for this one.
    setEntries((prev) => [{ id, previewUrl, status: "processing" }, ...prev]);
    void runUpload(id, file);
  }

  function retry(id: string) {
    const file = filesRef.current.get(id);
    if (!file) return;
    setEntries((prev) =>
      prev.map((e) =>
        e.id === id ? { ...e, status: "processing", error: undefined } : e,
      ),
    );
    void runUpload(id, file);
  }

  async function runUpload(id: string, file: File) {
    const form = new FormData();
    form.append("image", file);
    try {
      const { result } = await uploadMilkFn({ data: form });
      setEntries((prev) =>
        prev.map((e) => (e.id === id ? { ...e, status: "done", result } : e)),
      );
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      setEntries((prev) =>
        prev.map((e) =>
          e.id === id ? { ...e, status: "error", error: msg } : e,
        ),
      );
    }
  }

  return (
    <main className="mx-auto max-w-md px-4 py-8">
      <h1 className="mb-6 text-center text-2xl font-bold">🍼 Baby Tracker</h1>

      <div className="mb-6 flex justify-center">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          className="hidden"
          onChange={handleFileSelect}
        />
        <Button size="lg" onClick={() => fileInputRef.current?.click()}>
          <Camera /> Snap Milk Packet
        </Button>
      </div>

      {entries.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          No milk packets recorded yet. Tap the button to snap a photo.
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`flex items-center gap-3 rounded-lg border p-3 ${
                entry.status === "done"
                  ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950"
                  : entry.status === "error"
                    ? "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950"
                    : "bg-card"
              }`}
            >
              <img
                src={entry.previewUrl}
                alt="Milk packet"
                className="h-16 w-16 rounded-md object-cover"
              />
              <div className="flex-1">
                <span className="text-sm font-medium">
                  {STATUS_ICON[entry.status]} {STATUS_LABEL[entry.status]}
                </span>
                {entry.status === "done" && entry.result && (
                  <p className="mt-1 text-xs text-muted-foreground">
                    Saved {entry.result.amount_ml}ml · {entry.result.date}{" "}
                    {entry.result.time}
                  </p>
                )}
                {entry.error && (
                  <p className="mt-1 text-xs text-red-600">{entry.error}</p>
                )}
                {entry.status === "error" && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="mt-2"
                    onClick={() => retry(entry.id)}
                  >
                    <RotateCcw /> Resubmit
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
