import { Photo } from "@/components/ui/Photo";
import { cn } from "@/lib/utils";

export function PageHero({
  eyebrow,
  title,
  lead,
  image,
  objectPosition = "center",
  compact = false,
  rail,
}: {
  eyebrow: string;
  title: string;
  lead?: React.ReactNode;
  image: string;
  objectPosition?: string;
  compact?: boolean;
  rail?: React.ReactNode;
}) {
  return (
    <section className="bg-[#f7f6f3] pt-(--header-h)">
      <div
        className={cn(
          "grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]",
          compact ? "min-h-[56svh]" : "min-h-[calc(100svh-var(--header-h))]",
        )}
      >
        <div className="relative flex flex-col justify-end px-(--gutter) py-16 lg:py-24">
          {rail ? <div className="absolute top-8 left-(--gutter) hidden lg:block">{rail}</div> : null}
          <p className="c1 tracking-[0.22em] text-ink-50 uppercase">{eyebrow}</p>
          <h1 className="serif mt-6 whitespace-pre-line text-[32px] leading-[1.1] tracking-[-0.02em] text-ink lg:text-[52px]">
            {title}
          </h1>
          {lead ? <div className="b2 mt-6 max-w-md text-ink-70">{lead}</div> : null}
        </div>
        <div
          className={cn(
            "relative overflow-hidden",
            compact ? "min-h-[32svh]" : "min-h-[42svh] lg:min-h-full",
          )}
        >
          <Photo
            src={image}
            tone="paper"
            alt=""
            priority
            objectPosition={objectPosition}
            className="absolute inset-0"
            sizes="(min-width: 1025px) 46vw, 100vw"
          />
        </div>
      </div>
    </section>
  );
}
