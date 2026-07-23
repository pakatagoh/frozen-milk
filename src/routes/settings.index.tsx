import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight } from "lucide-react";

export const Route = createFileRoute("/settings/")({
  component: SettingsMenu,
});

function SettingsMenu() {
  return (
    <div className="space-y-1">
      <Link
        to="/settings/baby/edit"
        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-primary/10 text-primary">
          👶
        </div>
        <span className="flex-1 text-sm font-medium">Baby Profile</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </div>
  );
}
