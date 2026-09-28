import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsHomeProgram } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function MomentScenes({ scenes }: { scenes: CmsHomeProgram[] }) {
  return (
    <div>
      {scenes.map((item, index) => {
        const dark = index === 1;
        const imageRight = index % 2 === 0;

        return (
          <section
            key={item.id}
            className={cn(
              "grid lg:min-h-[78svh] lg:grid-cols-[1.1fr_0.9fr]",
              dark ? "bg-[#111] text-white" : "bg-[#f7f6f3] text-ink",
            )}
          >
            <div
              className={cn(
                "flex flex-col justify-center px-(--gutter) py-16 lg:px-16 lg:py-24",
                imageRight && "lg:order-1",
              )}
            >
              <p className={cn("c1 tracking-[0.18em] uppercase", dark ? "text-white/45" : "text-ink-50")}>
                {item.eyebrow || "Brand"}
              </p>
              <h2 className="serif mt-5 text-[32px] leading-[1.1] tracking-[-0.02em] lg:text-[48px]">
                {item.line}
              </h2>
              <p className={cn("b2 mt-8 max-w-md break-keep", dark ? "text-white/78" : "text-ink-70")}>
                {item.lead[0]}
              </p>
              <LinedLink href={item.href} className={cn("mt-8", dark ? "text-white" : "text-forest")}>
                {item.cta}
              </LinedLink>
            </div>
            <div
              className={cn(
                "relative min-h-[46svh] overflow-hidden lg:min-h-full",
                imageRight && "lg:order-2",
              )}
            >
              <Photo
                src={item.image}
                video={item.video}
                tone={item.tone}
                alt={item.line}
                className="absolute inset-0"
                sizes="(min-width: 1025px) 42vw, 100vw"
              />
            </div>
          </section>
        );
      })}
    </div>
  );
}
