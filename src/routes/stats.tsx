import { createFileRoute } from "@tanstack/react-router";
import { StatsPage } from "@/pages/stats/StatsPage";

export const Route = createFileRoute("/stats")({
  component: StatsPage,
});
