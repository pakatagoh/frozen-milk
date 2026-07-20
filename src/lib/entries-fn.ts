import { createServerFn } from "@tanstack/react-start";
import { getAllEntries } from "./sheets";
import { parseStoredPathFromUrl, generateImgproxySrcSet } from "./imgproxy-url";

// Read every milk-packet row from the Google Sheet. GET so it can be called
// from loaders / useQuery and preloaded on intent.
export const getEntries = createServerFn({ method: "GET" }).handler(
  async () => {
    const entries = await getAllEntries();

    // Enrich each entry with pre-computed srcsets so the client never
    // imports server-only modules (node:crypto).
    for (const entry of entries) {
      const storedPath = parseStoredPathFromUrl(entry.imageUrl);
      if (storedPath) {
        entry.srcSetThumb = generateImgproxySrcSet(storedPath, [64, 128, 256]);
        entry.srcSetLightbox = generateImgproxySrcSet(storedPath, [384, 768, 1152]);
      }
    }

    return entries;
  },
);
