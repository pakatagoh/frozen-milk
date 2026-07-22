import { createFileRoute } from "@tanstack/react-router";
import { StatsPage } from "@/pages/stats/StatsPage";
import { getEntries } from "@/lib/entries-fn";

export const Route = createFileRoute("/stats")({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["entries"],
      queryFn: () => getEntries(),
    }),
  component: StatsPage,
});
