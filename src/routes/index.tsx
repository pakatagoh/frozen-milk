import { createFileRoute } from "@tanstack/react-router";
import { OverviewPage } from "@/pages/overview/OverviewPage";
import { getEntries } from "@/lib/entries-fn";
import { getBabyProfile } from "@/lib/baby-profile-fn";
import { getActivities } from "@/lib/activity-log-fn";

export const Route = createFileRoute("/")({
  loader: ({ context }) => {
    const entriesPromise = context.queryClient.prefetchQuery({
      queryKey: ["entries"],
      queryFn: () => getEntries(),
    });
    const profilePromise = context.queryClient.prefetchQuery({
      queryKey: ["babyProfile"],
      queryFn: () => getBabyProfile(),
    }).catch(() => {});
    const activitiesPromise = context.queryClient.prefetchQuery({
      queryKey: ["activities"],
      queryFn: () => getActivities(),
    }).catch(() => {});
    return Promise.all([entriesPromise, profilePromise, activitiesPromise]);
  },
  component: OverviewPage,
});
