import { createFileRoute } from "@tanstack/react-router";
import { StoragePage } from "@/pages/storage/StoragePage";
import { getEntries } from "@/lib/entries-fn";

export const Route = createFileRoute("/storage")({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["entries"],
      queryFn: () => getEntries(),
    }),
  component: StoragePage,
});
