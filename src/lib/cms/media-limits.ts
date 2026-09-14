/** 원본을 고를 때 허용. 올리기 전에 4MB 이하로 줄인다. */
export const IMAGE_MAX_BYTES = 40 * 1024 * 1024;
/** Vercel Function 본문 4.5MB. multipart 여유를 빼 4MB. */
export const IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;
export const VIDEO_MAX_BYTES = 1024 * 1024 * 1024;

export const IMAGE_ACCEPT =
  "image/jpeg,image/png,image/gif,image/webp,image/avif,.jpg,.jpeg,.png,.gif,.webp,.avif";

export const VIDEO_ACCEPT =
  "video/mp4,video/quicktime,video/x-msvideo,video/x-ms-wmv,video/webm,video/mpeg,video/x-m4v,.mp4,.mov,.m4v,.avi,.wmv,.webm,.mpeg,.mpg,.mkv";

export function classifyUpload(file: File): "image" | "video" | null {
  if (file.type.startsWith("image/")) return "image";
  if (file.type.startsWith("video/")) return "video";
  const ext = file.name.split(".").pop()?.toLowerCase() ?? "";
  if (["jpg", "jpeg", "png", "gif", "webp", "avif"].includes(ext)) return "image";
  if (["mp4", "mov", "m4v", "avi", "wmv", "webm", "mpeg", "mpg", "mkv"].includes(ext)) return "video";
  return null;
}

export function formatMegabytes(bytes: number) {
  if (bytes >= 1024 * 1024 * 1024) return `${Math.round(bytes / (1024 * 1024 * 1024))}GB`;
  return `${Math.round(bytes / (1024 * 1024))}MB`;
}
