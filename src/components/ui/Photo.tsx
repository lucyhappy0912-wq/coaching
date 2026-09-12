import Image from "next/image";

import { cn } from "@/lib/utils";

export type PhotoTone = "sage" | "paper" | "mist" | "dusk" | "forest";

/** 사진이 준비되기 전까지 브랜드 팔레트 그라데이션으로 자리를 채운다. */
const TONE_CLASS: Record<PhotoTone, string> = {
  sage: "bg-[radial-gradient(120%_100%_at_20%_10%,#f5f7f7_0%,#e2e9e6_45%,#9db4ab_100%)]",
  paper: "bg-[radial-gradient(120%_100%_at_80%_0%,#fdfcfa_0%,#f0efe9_50%,#d9d6cc_100%)]",
  mist: "bg-[radial-gradient(120%_100%_at_10%_90%,#f5fafd_0%,#dfe9ee_50%,#9bb4c2_100%)]",
  dusk: "bg-[radial-gradient(120%_120%_at_25%_15%,#8ba5a3_0%,#5b7d7e_45%,#2b4a4a_100%)]",
  forest: "bg-[radial-gradient(120%_120%_at_70%_20%,#4d7579_0%,#1a4e53_45%,#00252a_100%)]",
};

export function Photo({
  src,
  video,
  alt = "",
  tone = "sage",
  className,
  sizes = "100vw",
  priority,
}: {
  src?: string;
  video?: string;
  alt?: string;
  tone?: PhotoTone;
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  if (video) {
    return (
      <video
        className={cn("size-full object-cover", className)}
        src={video}
        poster={src || undefined}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden={!alt}
      />
    );
  }

  if (!src) {
    return <div aria-hidden className={cn("size-full", TONE_CLASS[tone], className)} />;
  }

  if (src.startsWith("https://") || src.startsWith("http://")) {
    return (
      // 관리자가 올린 원격 주소. next/image 호스트 허용 목록에 묶지 않는다.
      // eslint-disable-next-line @next/next/no-img-element
      <img src={src} alt={alt} className={cn("size-full object-cover", className)} />
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={cn("size-full object-cover", className)}
    />
  );
}

export const isDarkTone = (tone: PhotoTone) => tone === "forest";
