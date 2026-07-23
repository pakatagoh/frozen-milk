import { createFileRoute } from "@tanstack/react-router";
import { BabyProfileEditPage } from "@/pages/settings/baby/BabyProfileEditPage";
import { getBabyProfile } from "@/lib/baby-profile-fn";

export const Route = createFileRoute("/settings/baby/edit")({
  loader: ({ context }) =>
    context.queryClient.prefetchQuery({
      queryKey: ["babyProfile"],
      queryFn: () => getBabyProfile(),
    }),
  component: BabyProfileEditPage,
});
