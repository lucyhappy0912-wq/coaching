"use client";

import { useRef, useState, type ReactNode } from "react";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

export function ImageSlot({
  name,
  value,
  tone = "forest",
  onChange,
  label = "사진을 올려 주세요",
  children,
}: {
  name: string;
  value: string;
  tone?: PhotoTone;
  onChange: (url: string) => void;
  label?: string;
  children?: ReactNode;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function upload(file: File) {
    setError(null);
    setPending(true);
    const data = new FormData();
    data.append("file", file);
    const res = await fetch("/api/admin/upload", { method: "POST", body: data });
    const json = (await res.json()) as { url?: string; error?: string };
    setPending(false);
    if (!res.ok || !json.url) {
      setError(json.error ?? "올리지 못했습니다.");
      return;
    }
    onChange(json.url);
  }

  return (
    <div>
      <input type="hidden" name={name} value={value} />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(event) => event.preventDefault()}
        onDrop={(event) => {
          event.preventDefault();
          const file = event.dataTransfer.files[0];
          if (file) void upload(file);
        }}
        className="relative block aspect-video w-full overflow-hidden rounded-[4px] border border-ink-50 bg-white text-left focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest"
      >
        <Photo src={value} tone={tone} className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-t from-black/60 via-black/20 to-black/40" />
        {children}
        <span className="absolute inset-x-3 top-3 z-10 adm-body text-white/90">
          {pending ? "올리는 중…" : value ? "클릭해서 사진 바꾸기" : label}
        </span>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) void upload(file);
        }}
      />
      {error ? <p className={cn("adm-body mt-2 text-danger")}>{error}</p> : null}
    </div>
  );
}
