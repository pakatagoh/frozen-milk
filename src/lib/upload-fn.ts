import { createServerFn } from "@tanstack/react-start";

export const uploadMilk = createServerFn({ method: "POST" })
  .validator((form: FormData) => {
    const file = form.get("image") as File;
    if (!file) throw new Error("No image provided");
    if (!file.type.startsWith("image/"))
      throw new Error("File must be an image");
    if (file.size > 20 * 1024 * 1024)
      throw new Error("File too large (max 20MB)");
    return file;
  })
  .handler(async ({ data: file }) => {
    // Dynamic imports — these modules use Node builtins and run only on the server
    const { saveUpload, generateImgproxyUrl } = await import("./images");
    const { createJob } = await import("./jobs");
    const { processPendingJobs } = await import("./worker");

    const { storedPath, optimizedBase64 } = await saveUpload(file, "milk");
    const previewUrl = generateImgproxyUrl(storedPath, 400, 400);

    const jobId = createJob({
      storedPath,
      fileName: file.name,
      mimeType: "image/jpeg",
      base64: optimizedBase64,
    });

    processPendingJobs();

    return { jobId, previewUrl };
  });
