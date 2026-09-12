"use client";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

const TONES: { value: PhotoTone; label: string }[] = [
  { value: "sage", label: "연한 초록" },
  { value: "paper", label: "따뜻한 회색" },
  { value: "mist", label: "연한 하늘" },
  { value: "dusk", label: "어두운 청록" },
  { value: "forest", label: "진한 초록" },
];

export function ToneSelect({
  name,
  value,
  onChange,
}: {
  name: string;
  value: PhotoTone;
  onChange: (tone: PhotoTone) => void;
}) {
  return (
    <div>
      <p className="adm-label mb-1.5 text-forest-70">사진 없을 때 색</p>
      <input type="hidden" name={name} value={value} />
      <div role="radiogroup" aria-label="사진 없을 때 표시할 색" className="flex flex-wrap gap-2">
        {TONES.map((tone) => (
          <button
            key={tone.value}
            type="button"
            role="radio"
            aria-checked={value === tone.value}
            onClick={() => onChange(tone.value)}
            className={cn(
              "relative size-12 overflow-hidden rounded-[4px]",
              "focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-forest",
              value === tone.value ? "ring-2 ring-forest ring-offset-2" : "ring-1 ring-ink-30 hover:ring-ink-50",
            )}
          >
            <Photo tone={tone.value} />
            <span className="sr-only">{tone.label}</span>
          </button>
        ))}
      </div>
      <p className="adm-body mt-1.5 text-ink-70">사진을 넣지 않았을 때 그 자리에 표시되는 색입니다.</p>
    </div>
  );
}
