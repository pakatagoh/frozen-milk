import { createFileRoute } from "@tanstack/react-router";
import { ActivityPage } from "@/pages/activity/ActivityPage";
import { getActivities } from "@/lib/activity-log-fn";
import { getEntries } from "@/lib/entries-fn";

export const Route = createFileRoute("/activity")({
  loader: ({ context }) => {
    const activities = context.queryClient.prefetchQuery({
      queryKey: ["activities"],
      queryFn: () => getActivities(),
    });
    const entries = context.queryClient.prefetchQuery({
      queryKey: ["entries"],
      queryFn: () => getEntries(),
    });
    return Promise.all([activities, entries]);
  },
  component: ActivityPage,
});
