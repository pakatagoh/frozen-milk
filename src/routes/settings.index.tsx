import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ChevronRight } from "lucide-react";
import { getBabyProfile } from "@/lib/baby-profile-fn";

export const Route = createFileRoute("/settings/")({
  component: SettingsMenu,
});

function SettingsMenu() {
  const { data: profile } = useQuery({
    queryKey: ["babyProfile"],
    queryFn: () => getBabyProfile(),
  });

  return (
    <div className="space-y-1">
      <Link
        to="/settings/baby/edit"
        className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50"
      >
        <div className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted">
          {profile?.imageUrl ? (
            <img
              src={profile.imageUrl}
              alt="Baby"
              className="h-full w-full object-cover"
            />
          ) : (
            <span className="text-lg">👶</span>
          )}
        </div>
        <span className="flex-1 text-sm font-medium">Baby Profile</span>
        <ChevronRight className="size-4 text-muted-foreground" />
      </Link>
    </div>
  );
}
