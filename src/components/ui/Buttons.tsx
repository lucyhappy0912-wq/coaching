import Link from "next/link";

import { cn } from "@/lib/utils";

const BASE =
  "serif inline-flex items-center justify-center text-center font-normal transition-colors duration-200";

const VARIANT = {
  solid: "bg-forest text-white hover:bg-forest-90 shadow-[0_4px_4px_0_rgba(0,58,64,0.1)]",
  white: "bg-white text-forest hover:bg-grass-20 shadow-[0_4px_4px_0_rgba(0,58,64,0.1)]",
  outline: "border border-forest text-forest hover:bg-forest hover:text-white",
  outlineWhite: "border border-white/70 text-white hover:bg-white hover:text-forest",
} as const;

const SIZE = {
  medium: "h-11 px-7 text-[15px] lg:h-12 lg:px-8 lg:text-base",
  small: "h-9 px-5 text-sm",
} as const;

export function PillButton({
  href,
  children,
  variant = "solid",
  size = "medium",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: keyof typeof VARIANT;
  size?: keyof typeof SIZE;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(BASE, "rounded-sm", VARIANT[variant], SIZE[size], className)}>
      {children}
    </Link>
  );
}

/** 밑줄만 있는 텍스트 링크 — 히녹 전반에서 가장 많이 쓰는 CTA */
export function LinedLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn("lined b3 transition-opacity duration-200 hover:opacity-60", className)}
    >
      {children}
    </Link>
  );
}
