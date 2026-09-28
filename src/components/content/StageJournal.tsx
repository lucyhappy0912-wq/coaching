import { PageHero } from "@/components/content/PageHero";
import type { CmsProgramPage } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export function StageJournal({ page }: { page: CmsProgramPage }) {
  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={page.eyebrow}
        title={page.line}
        lead={page.lead}
        image={HOME_VISUAL.stairs}
        objectPosition={VISUAL_POS.stairs}
      />

      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <div className="mx-auto max-w-md">
          <p className="serif text-[26px] leading-snug text-ink lg:text-[32px]">{page.intro[0]}</p>
          {page.intro.slice(1).map((paragraph) => (
            <p key={paragraph} className="reading b2 mt-8 text-ink-70">
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      <section className="border-y border-ink-10 px-(--gutter) py-12 lg:py-16">
        <p className="c1 tracking-[0.2em] text-ink-50 uppercase">Process</p>
        <ol className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {page.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-ink lg:text-[28px]">
              <span className="mr-2 text-ink-30">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {page.weeks.map((item) => (
        <article key={item.week} className="border-b border-ink-10 px-(--gutter) py-12 lg:px-16 lg:py-16">
          <div className="mx-auto max-w-lg">
            <p className="serif text-[48px] leading-none text-ink-10 lg:text-[64px]">{item.week}</p>
            <p className="c1 mt-2 tracking-[0.2em] text-ink-50 uppercase">{item.stage}</p>
            <h2 className="t3 mt-3 text-ink">{item.title}</h2>
            <div className="reading b2 mt-5 text-ink-70">
              {item.body.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
            </div>
            <p className="quote mt-8">
              {item.from}
              <span className="mx-2 text-ink-30">→</span>
              {item.to}
            </p>
          </div>
        </article>
      ))}
    </div>
  );
}
