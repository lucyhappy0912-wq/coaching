"use client";

import { useRef, useState, type ReactNode } from "react";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import { compressImageForUpload } from "@/lib/cms/compress-image";
import {
  IMAGE_ACCEPT,
  IMAGE_MAX_BYTES,
  IMAGE_UPLOAD_BYTES,
  VIDEO_ACCEPT,
  VIDEO_MAX_BYTES,
  classifyUpload,
  formatMegabytes,
} from "@/lib/cms/media-limits";
import { cn } from "@/lib/utils";

function readUploadResponse(xhr: XMLHttpRequest): { url?: string; error?: string } {
  const status = xhr.status;
  const text = xhr.responseText?.trim() ?? "";
  if (status === 401 || status === 403) {
    return { error: "로그인이 만료되었습니다. 다시 로그인해 주세요." };
  }
  if (status === 413) {
    return { error: "서버가 약 4MB를 넘는 파일을 받지 못합니다. 사진을 더 줄여 주세요." };
  }
  if (!text) {
    return { error: status ? `서버가 비어 있는 답을 보냈습니다. (${status})` : "서버에 연결하지 못했습니다." };
  }
  try {
    const json = JSON.parse(text) as { url?: string; error?: string };
    if (json.url) return { url: json.url };
    return { error: json.error ?? `올리지 못했습니다. (서버 ${status || "응답 오류"})` };
  } catch {
    if (text.startsWith("<") || text.includes("<!DOCTYPE")) {
      return { error: "서버가 파일을 받지 못했습니다. 다시 로그인한 뒤 올려 주세요." };
    }
    return { error: "서버 답을 읽지 못했습니다. 잠시 후 다시 올려 주세요." };
  }
}

function postFile(file: File, kind: "image" | "video", onProgress: (percent: number) => void) {
  return new Promise<{ url?: string; error?: string }>((resolve) => {
    const data = new FormData();
    data.append("file", file);
    data.append("kind", kind);
    const xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.timeout = 15 * 60 * 1000;
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(Math.round((event.loaded / event.total) * 100));
    };
    xhr.onload = () => resolve(readUploadResponse(xhr));
    xhr.onerror = () => resolve({ error: "연결이 끊어졌습니다. 네트워크를 확인하고 다시 올려 주세요." });
    xhr.ontimeout = () => resolve({ error: "시간이 초과되었습니다. 다시 올려 주세요." });
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
      setError(`${kind === "image" ? "사진" : "영상"}은 ${formatMegabytes(limit)}까지 고를 수 있습니다.`);
      return;
    }
    setError(null);
    setPending(kind);
    setProgress(0);
    let payload = file;
    if (kind === "image") {
      try {
        payload = await compressImageForUpload(file, IMAGE_UPLOAD_BYTES);
      } catch (error) {
        setPending(null);
        const code = error instanceof Error ? error.message : "";
        setError(
          code === "CMS_MEDIA_HEIC"
            ? "아이폰 HEIC는 올릴 수 없습니다. 사진 앱에서 JPG로 저장한 뒤 올려 주세요."
            : code === "CMS_MEDIA_STILL_LARGE"
              ? "사진을 4MB 아래로 줄이지 못했습니다. 더 작은 파일로 올려 주세요."
              : "이 사진은 줄일 수 없습니다. JPG 또는 PNG로 바꿔 주세요.",
        );
        return;
      }
    }
    const json = await postFile(payload, kind, setProgress);
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
            ? progress > 0
              ? `사진 올리는 중… ${progress}%`
              : "사진 줄이는 중…"
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
      <p className="adm-body mt-2 text-ink-70">
        사진: JPG, PNG, GIF, WebP, AVIF · 원본 {formatMegabytes(IMAGE_MAX_BYTES)}까지 · 올리면 자동으로 4MB 아래로
        줄입니다
      </p>
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
