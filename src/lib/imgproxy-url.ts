import crypto from "node:crypto";

const IMGPROXY_BASE =
  process.env.IMGPROXY_BASE_URL || "https://app.pakatagoh.com/img";

function getImgproxyKey(): Buffer {
  const key = process.env.IMGPROXY_KEY;
  if (!key) throw new Error("IMGPROXY_KEY is not set");
  return Buffer.from(key, "hex");
}

function getImgproxySalt(): Buffer {
  const salt = process.env.IMGPROXY_SALT;
  if (!salt) throw new Error("IMGPROXY_SALT is not set");
  return Buffer.from(salt, "hex");
}

export function generateImgproxyUrl(
  storedPath: string,
  width: number,
  height?: number,
): string {
  const resize = height
    ? `rs:fill:${width}:${height}`
    : `rs:fit:${width}:0`;
  const source = `local:///${storedPath}`;
  const unsigned = `/${resize}/plain/${source}`;

  const key = getImgproxyKey();
  const salt = getImgproxySalt();

  const signature = crypto
    .createHmac("sha256", key)
    .update(salt)
    .update(unsigned)
    .digest("base64url");

  return `${IMGPROXY_BASE}/${signature}${unsigned}`;
}

/** Extract the storedPath from an imgproxy signed URL. */
export function parseStoredPathFromUrl(url: string): string | null {
  const marker = "/plain/local:///";
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return url.slice(idx + marker.length);
}

/** Generate a srcset string with multiple resolutions for the same stored image. */
export function generateImgproxySrcSet(
  storedPath: string,
  widths: number[],
): string {
  return widths
    .map((w) => {
      const url = generateImgproxyUrl(storedPath, w, w);
      return `${url} ${w}w`;
    })
    .join(", ");
}
