import { createFileRoute } from "@tanstack/react-router";
import { SortSettingsPage } from "@/pages/settings/sort/SortSettingsPage";
import { fetchSortOption } from "@/lib/app-settings-fn";

export const Route = createFileRoute("/settings/sort")({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["appSetting", "sort"],
      queryFn: () => fetchSortOption(),
    }),
  component: SortSettingsPage,
});
