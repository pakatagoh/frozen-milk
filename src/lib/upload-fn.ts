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
    // Dynamic import — this module uses Node builtins and runs only on the server.
    const { processUpload } = await import("./process-upload");
    return processUpload(file);
  });
