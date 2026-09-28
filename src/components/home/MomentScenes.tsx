import { HomeSplit } from "@/components/home/HomeSplit";
import { LinedLink } from "@/components/ui/Buttons";
import type { CmsHomeProgram } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";
import { cn } from "@/lib/utils";

const POS: Record<string, string> = {
  [HOME_VISUAL.pause]: VISUAL_POS.pause,
  [HOME_VISUAL.transition]: VISUAL_POS.transition,
  [HOME_VISUAL.stairs]: VISUAL_POS.stairs,
};

export function MomentScenes({ scenes }: { scenes: CmsHomeProgram[] }) {
  return (
    <div>
      {scenes.map((item, index) => {
        const dark = index === 1;
        const imageRight = index % 2 === 1;

        return (
          <HomeSplit
            key={item.id}
            image={item.image}
            imageRight={imageRight}
            dark={dark}
            objectPosition={POS[item.image] ?? "center"}
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
          </HomeSplit>
        );
      })}
    </div>
  );
}
