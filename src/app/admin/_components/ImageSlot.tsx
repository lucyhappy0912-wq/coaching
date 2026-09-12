"use client";

import { useRef, useState, type ReactNode } from "react";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import {
  IMAGE_ACCEPT,
  IMAGE_MAX_BYTES,
  VIDEO_ACCEPT,
  VIDEO_MAX_BYTES,
  classifyUpload,
  formatMegabytes,
} from "@/lib/cms/media-limits";
import { cn } from "@/lib/utils";

function postFile(file: File, kind: "image" | "video", onProgress: (percent: number) => void) {
  return new Promise<{ url?: string; error?: string }>((resolve) => {
    const data = new FormData();
    data.append("file", file);
    data.append("kind", kind);
    const xhr = new XMLHttpRequest();
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => {
      try {
        resolve(JSON.parse(xhr.responseText) as { url?: string; error?: string });
      } catch {
        resolve({ error: "올리지 못했습니다." });
      }
    };
    xhr.onerror = () => resolve({ error: "올리지 못했습니다." });
    xhr.open("POST", "/api/admin/upload");
    xhr.send(data);
  });
}

export function ImageSlot({
  name,
  value,
  videoName,
  videoValue = "",
  tone = "forest",
  onChange,
  onVideoChange,
  label = "사진을 올려 주세요",
  children,
}: {
  name: string;
  value: string;
  videoName?: string;
  videoValue?: string;
  tone?: PhotoTone;
  onChange: (url: string) => void;
  onVideoChange?: (url: string) => void;
  label?: string;
  children?: ReactNode;
}) {
  const imageRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState<"image" | "video" | null>(null);
  const [progress, setProgress] = useState(0);
  const allowVideo = Boolean(videoName && onVideoChange);

  async function upload(file: File, kind: "image" | "video") {
    const limit = kind === "image" ? IMAGE_MAX_BYTES : VIDEO_MAX_BYTES;
    if (file.size > limit) {
      setError(`${kind === "image" ? "사진" : "영상"}은 ${formatMegabytes(limit)}까지 올릴 수 있습니다.`);
      return;
    }
    setError(null);
    setPending(kind);
    setProgress(0);
    const json = await postFile(file, kind, setProgress);
    setPending(null);
    if (!json.url) {
      setError(json.error ?? "올리지 못했습니다.");
      return;
    }
    if (kind === "video") onVideoChange?.(json.url);
    else onChange(json.url);
  }

  function takeFile(file: File | undefined, forced?: "image" | "video") {
    if (!file) return;
    const kind = forced ?? classifyUpload(file);
    if (!kind) {
      setError("이 형식은 올릴 수 없습니다.");
      return;
    }
    if (kind === "video" && !allowVideo) {
      setError("이 칸에는 사진만 올릴 수 있습니다.");
      return;
    }
    void upload(file, kind);
  }

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      {videoName ? <input type="hidden" name={videoName} value={videoValue} /> : null}
      <button
        type="button"
        onClick={() => imageRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          takeFile(event.dataTransfer.files[0]);
        }}
        className="relative block aspect-video w-full overflow-hidden rounded-[4px] border border-ink-50 bg-white text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest"
      >
        <Photo src={value} video={videoValue} tone={tone} className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/40" />
        {children}
        <span className="absolute inset-x-3 top-3 z-10 adm-body text-white/90">
          {pending === "image"
            ? `사진 올리는 중… ${progress}%`
            : value
              ? "클릭해서 사진 바꾸기"
              : label}
        </span>
      </button>
      <input
        ref={imageRef}
        type="file"
        accept={IMAGE_ACCEPT}
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          takeFile(file, "image");
        }}
      />
      <p className="adm-body mt-2 text-ink-70">사진: JPG, PNG, GIF, WebP, AVIF · {formatMegabytes(IMAGE_MAX_BYTES)}까지</p>
      {allowVideo ? (
        <div className="mt-3">
          <input
            ref={videoRef}
            type="file"
            accept={VIDEO_ACCEPT}
            className="hidden"
            onChange={(event) => {
              const file = event.target.files?.[0];
              event.target.value = "";
              takeFile(file, "video");
            }}
          />
          <button
            type="button"
            onClick={() => videoRef.current?.click()}
            className="adm-body h-10 rounded-[4px] border border-ink-50 bg-white px-4 text-forest hover:bg-ink-05"
          >
            {pending === "video" ? `영상 올리는 중… ${progress}%` : videoValue ? "영상 바꾸기" : "영상 파일 올리기"}
          </button>
          <p className="adm-body mt-1.5 text-ink-70">
            영상: MP4, MOV, AVI, WMV, WebM 등 · {formatMegabytes(VIDEO_MAX_BYTES)}까지
          </p>
        </div>
      ) : null}
      {error ? <p className={cn("adm-body mt-2 text-danger")}>{error}</p> : null}
      {value || videoValue ? (
        <div className="mt-2 flex flex-wrap gap-3">
          {value ? (
            <button type="button" onClick={() => onChange("")} className="adm-body text-forest hover:underline">
              사진 비우기
            </button>
          ) : null}
          {videoValue ? (
            <button type="button" onClick={() => onVideoChange?.("")} className="adm-body text-forest hover:underline">
              영상 비우기
            </button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
