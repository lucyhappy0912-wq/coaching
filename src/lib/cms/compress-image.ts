/** 브라우저에서만 쓴다. Vercel Function 본문 4.5MB를 넘기지 않게 사진을 줄인다. */

const MAX_EDGE = 2400;
const HEIC_BRANDS = new Set(["heic", "heix", "hevc", "hevx", "mif1", "msf1"]);

function ascii(bytes: Uint8Array, start: number, end: number) {
  return String.fromCharCode(...bytes.subarray(start, end));
}

export async function fileLooksHeic(file: File) {
  const type = file.type.toLowerCase();
  if (type.includes("heic") || type.includes("heif")) return true;
  const ext = file.name.split(".").pop()?.toLowerCase();
  if (ext === "heic" || ext === "heif") return true;
  const buf = new Uint8Array(await file.slice(0, 64).arrayBuffer());
  if (buf.length < 16 || ascii(buf, 4, 8) !== "ftyp") return false;
  const size = new DataView(buf.buffer, buf.byteOffset, buf.byteLength).getUint32(0);
  const end = Math.min(buf.length, size > 8 ? size : buf.length);
  const brands = [ascii(buf, 8, 12)];
  for (let i = 16; i + 4 <= end; i += 4) brands.push(ascii(buf, i, i + 4));
  const list = brands.map((item) => item.replace(/\0/g, "").trim());
  if (list.some((item) => item === "avif" || item === "avis" || item === "avia")) return false;
  return list.some((item) => HEIC_BRANDS.has(item));
}

async function decodeBitmap(file: File) {
  try {
    return await createImageBitmap(file);
  } catch {
    const url = URL.createObjectURL(file);
    try {
      const image = await new Promise<HTMLImageElement>((resolve, reject) => {
        const el = new Image();
        el.onload = () => resolve(el);
        el.onerror = () => reject(new Error("CMS_MEDIA_COMPRESS"));
        el.src = url;
      });
      return await createImageBitmap(image);
    } finally {
      URL.revokeObjectURL(url);
    }
  }
}

export async function compressImageForUpload(file: File, maxBytes: number): Promise<File> {
  if (await fileLooksHeic(file)) throw new Error("CMS_MEDIA_HEIC");
  if (file.size <= maxBytes) return file;

  const bitmap = await decodeBitmap(file);
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const width = Math.max(1, Math.round(bitmap.width * scale));
  const height = Math.max(1, Math.round(bitmap.height * scale));

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    bitmap.close();
    throw new Error("CMS_MEDIA_COMPRESS");
  }
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);
  ctx.drawImage(bitmap, 0, 0, width, height);
  bitmap.close();

  for (const quality of [0.86, 0.75, 0.62, 0.5, 0.4]) {
    const blob = await new Promise<Blob | null>((resolve) => {
      canvas.toBlob(resolve, "image/jpeg", quality);
    });
    if (!blob) continue;
    if (blob.size <= maxBytes) {
      return new File([blob], withJpegName(file.name), { type: "image/jpeg" });
    }
  }
  throw new Error("CMS_MEDIA_STILL_LARGE");
}

function withJpegName(name: string) {
  return name.replace(/\.[^.]+$/, "") + ".jpg";
}
