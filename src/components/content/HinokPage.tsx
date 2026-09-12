import Link from "next/link";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

const STEP_TONES: PhotoTone[] = ["sage", "paper", "mist", "dusk", "forest"];

export function AboutRail({
  title,
  links,
  current,
  variant = "light",
}: {
  title: string;
  links: { href: string; label: string }[];
  current: string;
  variant?: "light" | "dark";
}) {
  const dark = variant === "dark";
  return (
    <aside className="hidden pt-4 lg:sticky lg:top-[calc(var(--header-h)+32px)] lg:block lg:self-start">
      <p className={cn("serif text-[44px] leading-none", dark ? "text-white" : "text-forest")}>
        {title}
      </p>
      <nav className="mt-6 space-y-2">
        {links.map((item) => {
          const active =
            current === item.href || current === item.href.split("#")[0];
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "b3 block transition-opacity hover:opacity-50",
                dark
                  ? active
                    ? "text-white"
                    : "text-white/55"
                  : active
                    ? "text-forest"
                    : "text-ink-70"
              )}
              aria-current={current === item.href ? "page" : undefined}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}

export function VisualIntro({
  tone,
  title,
  paragraphs,
  caption,
}: {
  tone: PhotoTone;
  title: string;
  paragraphs: readonly string[];
  caption?: string;
}) {
  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative aspect-16/7 w-full max-w-[900px] overflow-hidden rounded-[8px]">
        <Photo tone={tone} alt={title} sizes="(min-width: 1025px) 900px, 100vw" priority />
      </div>
      {caption ? (
        <p className="c1 mt-10 tracking-[0.18em] text-stem uppercase">{caption}</p>
      ) : null}
      <h1 className="mt-3 text-[18px] leading-snug text-forest">{title}</h1>
      <div className="b3 mt-8 max-w-[451px] space-y-5 text-ink-90">
        {paragraphs.map((paragraph) => (
          <p key={paragraph}>{paragraph}</p>
        ))}
      </div>
    </div>
  );
}

export function VisualStep({
  index,
  title,
  body,
  tone,
  aside,
}: {
  index: string;
  title: string;
  body: readonly string[];
  tone?: PhotoTone;
  aside?: string;
}) {
  const n = Number.parseInt(index, 10);
  const photoTone = tone ?? STEP_TONES[Number.isNaN(n) ? 0 : (n - 1) % STEP_TONES.length];
  const flip = !Number.isNaN(n) && n % 2 === 0;

  return (
    <article className="flex min-h-[520px] flex-col items-center gap-10 py-16 lg:min-h-[684px] lg:flex-row lg:items-center lg:justify-center lg:gap-20 lg:py-24">
      <div
        className={cn(
          "relative aspect-10/11 w-full max-w-[400px] overflow-hidden rounded-[8px]",
          flip && "lg:order-2"
        )}
      >
        <Photo tone={photoTone} alt={title} sizes="400px" />
      </div>
      <div className="w-full max-w-[560px]">
        <p className="serif text-[28px] leading-none text-forest">{index}</p>
        <h2 className="mt-3 text-[18px] leading-snug text-forest">{title}</h2>
        <div className="b3 mt-5 space-y-4 text-ink-90">
          {body.slice(0, 2).map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
        {aside ? <p className="b3 mt-6 text-forest">{aside}</p> : null}
      </div>
    </article>
  );
}

export function HinokShell({
  railTitle,
  railLinks,
  current,
  children,
}: {
  railTitle: string;
  railLinks: { href: string; label: string }[];
  current: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white pt-[calc(var(--header-h)+28px)] pb-24 lg:pt-[calc(var(--header-h)+48px)]">
      <div className="mx-auto grid max-w-[1400px] px-(--gutter) lg:grid-cols-[160px_minmax(0,1fr)] lg:gap-10">
        <AboutRail title={railTitle} links={railLinks} current={current} />
        <div>{children}</div>
      </div>
    </div>
  );
}

export const MOMENT_LINKS = [
  { href: "/story", label: "왜멈춘자인가" },
  { href: "/way", label: "멈춘자가 만든 전환" },
  { href: "/belief", label: "Our Belief" },
];

export const COACHING_LINKS = [
  { href: "/coaching/stage", label: "Stage Transition" },
  { href: "/coaching/next-chapter", label: "Next Chapter Transition" },
  { href: "/coaching/founder", label: "From founder to leader" },
  { href: "/check", label: "founder transition 진단" },
  { href: "/coaching/leadership", label: "your next leadership" },
];
