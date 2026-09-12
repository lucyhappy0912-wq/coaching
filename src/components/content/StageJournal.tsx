import { ConsultCta } from "@/components/content/Journey";
import { Photo } from "@/components/ui/Photo";
import type { CmsProgramPage } from "@/lib/cms/types";

export function StageJournal({ page }: { page: CmsProgramPage }) {
  return (
    <div className="bg-grass-10">
      <header className="relative h-svh min-h-[640px] overflow-hidden">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-t from-grass-10 via-transparent to-black/10" />
        <div className="relative z-10 flex h-full flex-col justify-end px-(--gutter) pb-16 lg:pb-24">
          <p className="c1 tracking-[0.22em] text-forest-70 uppercase">{page.eyebrow}</p>
          <h1 className="serif mt-4 max-w-4xl text-[40px] leading-[1.1] text-forest lg:text-[64px]">{page.line}</h1>
          <p className="b1 mt-6 max-w-(--measure-narrow) text-forest">{page.lead}</p>
        </div>
      </header>

      <section className="grid lg:min-h-[80vh] lg:grid-cols-2">
        <div className="relative min-h-[50vh] overflow-hidden lg:min-h-[80vh]">
          <Photo src={page.split.image} video={page.split.video} tone={page.split.tone} alt={page.intro[0]} className="absolute inset-0" />
        </div>
        <div className="flex items-center bg-white px-(--gutter) py-16 lg:px-16">
          <div className="max-w-md">
            <p className="serif text-[26px] leading-snug text-forest lg:text-[32px]">{page.intro[0]}</p>
            {page.intro.slice(1).map((paragraph) => (
              <p key={paragraph} className="reading b2 mt-8 text-ink-90">
                {paragraph}
              </p>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-forest/10 px-(--gutter) py-12 lg:py-16">
        <p className="c1 tracking-[0.2em] text-stem uppercase">Process</p>
        <ol className="mt-6 flex flex-wrap gap-x-8 gap-y-3">
          {page.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-forest lg:text-[28px]">
              <span className="mr-2 text-forest-30">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {page.weeks.map((item) => (
        <article key={item.week} className="grid border-b border-forest/10 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div className="relative min-h-[280px] overflow-hidden lg:min-h-[420px]">
            <Photo src={item.image} video={item.video} tone={item.tone} alt={item.stage} className="absolute inset-0" />
          </div>
          <div className="flex items-center px-(--gutter) py-12 lg:px-16 lg:py-16">
            <div className="max-w-lg">
              <p className="serif text-[48px] leading-none text-forest/20 lg:text-[64px]">{item.week}</p>
              <p className="c1 mt-2 tracking-[0.2em] text-stem uppercase">{item.stage}</p>
              <h2 className="t3 mt-3 text-forest">{item.title}</h2>
              <div className="reading b2 mt-5 text-ink-90">
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
          </div>
        </article>
      ))}

      <ConsultCta showCheck={false} />
    </div>
  );
}
