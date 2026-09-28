import { PageHero } from "@/components/content/PageHero";
import { ProcessPin } from "@/components/content/ProcessPin";
import { Reveal } from "@/components/ui/Reveal";
import type { CmsProgramPage } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";
import { cn } from "@/lib/utils";

export function ChapterHorizon({ page }: { page: CmsProgramPage }) {
  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={page.line}
        title={page.lead}
        image={HOME_VISUAL.next}
        objectPosition={VISUAL_POS.next}
      />

      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <Reveal className="reading b2 mx-auto max-w-(--measure) text-ink-70">
          {page.intro.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Reveal>
      </section>

      <ProcessPin steps={page.process} />

      {page.weeks.map((item, index) => (
        <article
          key={item.week}
          className={cn("px-(--gutter) py-14 lg:px-16", index % 2 === 1 ? "bg-[#f7f6f3]" : "bg-white")}
        >
          <Reveal className="mx-auto max-w-lg">
            <p className="c1 tracking-[0.2em] text-ink-50 uppercase">
              Chapter {item.week} · {item.stage}
            </p>
            <p className="serif mt-5 text-[28px] leading-snug text-ink lg:text-[40px]">{item.to}</p>
            <h2 className="b1 mt-6 text-ink">{item.title}</h2>
            <div className="reading b2 mt-5 text-ink-70">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
          </Reveal>
        </article>
      ))}
    </div>
  );
}
