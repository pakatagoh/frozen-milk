import { createFileRoute } from "@tanstack/react-router";
import { getJob } from "@/lib/jobs";

export const Route = createFileRoute("/api/jobs/$jobId")({
  server: {
    handlers: {
      GET: async ({ params }) => {
        const job = getJob(params.jobId);
        if (!job) {
          return new Response(JSON.stringify({ error: "Job not found" }), {
            status: 404,
            headers: { "Content-Type": "application/json" },
          });
        }
        return new Response(
          JSON.stringify({
            id: job.id,
            status: job.status,
            result: job.result ? JSON.parse(job.result) : undefined,
            error: job.error,
            createdAt: job.created_at,
          }),
          { headers: { "Content-Type": "application/json" } },
        );
      },
    },
  },
});
