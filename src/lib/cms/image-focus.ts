export const DEFAULT_IMAGE_FOCUS = "50% 20%";

function clampPercent(value: number) {
  if (!Number.isFinite(value)) return 50;
  return Math.min(100, Math.max(0, Math.round(value)));
}

/** `50% 20%` 만 허용. 그 외는 얼굴이 위에 오도록 기본값. */
export function sanitizeImageFocus(raw: unknown): string {
  const text = typeof raw === "string" ? raw.trim() : "";
  const match = /^(\d{1,3})\s*%\s+(\d{1,3})\s*%$/.exec(text);
  if (!match) return DEFAULT_IMAGE_FOCUS;
  return `${clampPercent(Number(match[1]))}% ${clampPercent(Number(match[2]))}%`;
}

export function parseImageFocus(raw: unknown): { x: number; y: number } {
  const [x, y] = sanitizeImageFocus(raw)
    .replace(/%/g, "")
    .split(/\s+/)
    .map(Number);
  return { x: clampPercent(x ?? 50), y: clampPercent(y ?? 20) };
}

export function imageFocusOf(x: number, y: number) {
  return `${clampPercent(x)}% ${clampPercent(y)}%`;
}
