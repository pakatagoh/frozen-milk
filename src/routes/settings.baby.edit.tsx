import { createFileRoute } from "@tanstack/react-router";
import { BabyProfileEditPage } from "@/pages/settings/baby/BabyProfileEditPage";

export const Route = createFileRoute("/settings/baby/edit")({
  component: BabyProfileEditPage,
});
