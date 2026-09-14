/** 브라우저에서만 쓴다. Vercel Function 본문 4.5MB를 넘기지 않게 사진을 줄인다. */

const MAX_EDGE = 2400;

export async function compressImageForUpload(file: File, maxBytes: number): Promise<File> {
  if (file.size <= maxBytes) return file;

  const bitmap = await createImageBitmap(file);
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
