import { ConsultCta } from "@/components/content/Journey";
import { HashRedirect } from "@/components/content/HashRedirect";
import { Photo } from "@/components/ui/Photo";
import type { CmsProgramPage } from "@/lib/cms/types";

export function FounderLedger({ page }: { page: CmsProgramPage }) {
  const { after } = page;

  return (
    <div className="bg-[#111] text-white">
      <HashRedirect from="next" to="/coaching/leadership" />
      <header className="relative h-svh min-h-[640px] overflow-hidden">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/45" />
        <div className="relative z-10 flex h-full flex-col justify-end px-(--gutter) pb-16 lg:pb-24">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{page.eyebrow}</p>
          <h1 className="serif mt-4 text-[44px] leading-none lg:text-[72px]">{page.line}</h1>
          <p className="b1 mt-6 max-w-(--measure-narrow) text-white/88">{page.lead}</p>
        </div>
      </header>

      <section className="grid lg:min-h-[70vh] lg:grid-cols-2">
        <div className="relative min-h-[46vh] overflow-hidden">
          <Photo src={page.split.image} video={page.split.video} tone={page.split.tone} alt={page.intro[0]} className="absolute inset-0" />
        </div>
        <div className="flex items-center px-(--gutter) py-16 lg:px-16">
          <div className="max-w-md">
            {page.intro.map((paragraph, index) => (
              <p key={paragraph} className={index === 0 ? "serif text-[26px] leading-snug lg:text-[32px]" : "b2 mt-6 text-white/75"}>
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      {after.title ? (
        <section className="px-(--gutter) py-20 lg:py-28">
          <p className="serif text-[32px] lg:text-[48px]">{after.title}</p>
          <p className="b2 mt-5 max-w-(--measure-narrow) text-white/70">{after.lead}</p>
          <ul className="mt-16">
            {after.pairs.map((pair) => (
              <li
                key={pair.before}
                className="grid gap-4 border-t border-white/12 py-8 last:border-b lg:grid-cols-[1fr_auto_1fr] lg:items-center lg:gap-10"
              >
                <p className="b2 text-white/40">{pair.before}</p>
                <span aria-hidden className="hidden text-white/25 lg:block">
                  →
                </span>
                <p className="serif text-[18px] leading-snug lg:text-[22px]">{pair.after}</p>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="bg-forest px-(--gutter) py-16">
        <ol className="flex flex-wrap gap-x-10 gap-y-4">
          {page.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-white lg:text-[28px]">
              <span className="mr-2 text-white/35">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      <section className="bg-white px-(--gutter) py-20 text-forest lg:py-28">
        <div className="mx-auto max-w-(--measure)">
          <div className="reading b2 text-ink-90">
            {page.weeksIntro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <ol className="mt-16">
            {page.weeks.map((item) => (
              <li key={item.week} className="grid gap-5 border-t border-ink-10 py-10 lg:grid-cols-[88px_minmax(0,1fr)]">
                <p className="serif text-[36px] leading-none text-forest/25">{item.week}</p>
                <div>
                  <p className="c1 tracking-[0.2em] text-stem uppercase">{item.stage}</p>
                  <h2 className="t4 mt-2">{item.title}</h2>
                  <div className="b2 mt-4 space-y-4 text-ink-90">
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

      <ConsultCta />
    </div>
  );
}
