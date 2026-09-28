import { HashRedirect } from "@/components/content/HashRedirect";
import { PageHero } from "@/components/content/PageHero";
import type { CmsProgramPage } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export function FounderLedger({ page }: { page: CmsProgramPage }) {
  const { after } = page;

  return (
    <div className="bg-white text-ink">
      <HashRedirect from="next" to="/coaching/leadership" />
      <PageHero
        eyebrow={page.eyebrow}
        title={page.line}
        lead={page.lead}
        image={HOME_VISUAL.founder}
        objectPosition={VISUAL_POS.founder}
      />

      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <div className="mx-auto max-w-md">
          {page.intro.map((paragraph, index) => (
            <p
              key={paragraph}
              className={index === 0 ? "serif text-[26px] leading-snug text-ink lg:text-[32px]" : "b2 mt-6 text-ink-70"}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </section>

      {after.title ? (
        <section className="px-(--gutter) py-20 lg:py-28">
          <p className="serif text-[32px] text-ink lg:text-[48px]">{after.title}</p>
          <p className="b2 mt-5 max-w-(--measure-narrow) text-ink-70">{after.lead}</p>
          <ul className="mt-16">
            {after.pairs.map((pair) => (
              <li
                key={pair.before}
                className="grid gap-4 border-t border-ink-10 py-8 last:border-b lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
              >
                <p className="b2 text-ink-50">{pair.before}</p>
                <span aria-hidden className="hidden text-ink-30 lg:block">
                  →
                </span>
                <p className="serif text-[18px] leading-snug text-ink lg:text-[22px]">{pair.after}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bg-[#f7f6f3] px-(--gutter) py-16">
        <ol className="flex flex-wrap gap-x-10 gap-y-4">
          {page.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-ink lg:text-[28px]">
              <span className="mr-2 text-ink-30">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white px-(--gutter) py-20 lg:py-28">
        <div className="mx-auto max-w-(--measure)">
          <div className="reading b2 text-ink-70">
            {page.weeksIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="mt-16">
            {page.weeks.map((item) => (
              <li key={item.week} className="grid gap-5 border-t border-ink-10 py-10 lg:grid-cols-[88px_minmax(0,1fr)]">
                <p className="serif text-[36px] leading-none text-ink-10">{item.week}</p>
                <div>
                  <p className="c1 tracking-[0.2em] text-ink-50 uppercase">{item.stage}</p>
                  <h2 className="t4 mt-2">{item.title}</h2>
                  <div className="b2 mt-4 space-y-4 text-ink-70">
                    {item.body.map((paragraph) => (
                      <p key={paragraph}>{paragraph}</p>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </div>
  );
}
