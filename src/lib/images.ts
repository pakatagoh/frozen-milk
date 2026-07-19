import sharp from "sharp";
import { writeFile } from "node:fs/promises";
import { mkdirSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ORIGINALS = process.env.IMAGE_ORIGINALS_DIR || "/images/originals";
const MAX_DIM = 2000;
const JPEG_QUALITY = 82;

const IMGPROXY_BASE =
  process.env.IMGPROXY_BASE_URL || "https://app.pakatagoh.com/img";
const IMGPROXY_KEY = hexToBytes(process.env.IMGPROXY_KEY!);
const IMGPROXY_SALT = hexToBytes(process.env.IMGPROXY_SALT!);

export async function saveUpload(
  file: File,
  category: "milk" | "general",
): Promise<{ storedPath: string; optimizedBase64: string }> {
  const buffer = Buffer.from(await file.arrayBuffer());

  const optimized = await sharp(buffer)
    .rotate()
    .resize(MAX_DIM, MAX_DIM, { fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: JPEG_QUALITY, mozjpeg: true })
    .toBuffer();

  const id = crypto.randomUUID();
  const datePath = new Date().toISOString().slice(0, 7); // "2026-07"
  const relativePath = `${category}/${datePath}/${id}.jpg`;
  const fullPath = path.join(ORIGINALS, relativePath);

  mkdirSync(path.dirname(fullPath), { recursive: true });
  await writeFile(fullPath, optimized);

  return {
    storedPath: relativePath,
    optimizedBase64: optimized.toString("base64"),
  };
}

export function generateImgproxyUrl(
  storedPath: string,
  width: number,
  height?: number,
): string {
  const resize = height
    ? `rs:fill:${width}:${height}`
    : `rs:fit:${width}:0`;
  const source = `local:///images/originals/${storedPath}`;
  const unsigned = `/${resize}/plain/${source}`;

  const signature = crypto
    .createHmac("sha256", IMGPROXY_KEY)
    .update(IMGPROXY_SALT)
    .update(unsigned)
    .digest("base64url");

  return `${IMGPROXY_BASE}/${signature}${unsigned}`;
}

function hexToBytes(hex: string): Buffer {
  return Buffer.from(hex, "hex");
}
