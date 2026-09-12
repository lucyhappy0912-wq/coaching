import { ConsultCta } from "@/components/content/Journey";
import { Photo } from "@/components/ui/Photo";
import type { CmsProgramPage } from "@/lib/cms/types";
import { cn } from "@/lib/utils";

export function ChapterHorizon({ page }: { page: CmsProgramPage }) {
  return (
    <div className="bg-[#f7f4ee]">
      <header className="relative h-svh min-h-[640px] overflow-hidden">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-linear-to-t from-[#f7f4ee] via-[#f7f4ee]/30 to-transparent" />
        <div className="relative z-10 flex h-full flex-col justify-end px-(--gutter) pb-16 lg:pb-24">
          <p className="c1 tracking-[0.22em] text-stem uppercase">{page.line}</p>
          <h1 className="serif mt-5 max-w-5xl text-[36px] leading-[1.15] text-forest lg:text-[58px]">{page.lead}</h1>
        </div>
      </header>

      <section className="px-(--gutter) py-16 lg:py-24">
        <div className="mx-auto grid max-w-[1200px] gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="reading b2 max-w-(--measure) text-ink-90">
            {page.intro.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="relative aspect-4/5 overflow-hidden">
            <Photo src={page.split.image} video={page.split.video} tone={page.split.tone} alt={page.lead} className="absolute inset-0" />
          </div>
        </div>
      </section>

      <section className="overflow-x-auto px-(--gutter) pb-8">
        <ol className="flex min-w-max gap-10 border-t border-[#e4dfd4] pt-8">
          {page.process.map((step, index) => (
            <li key={step} className="serif text-[22px] text-forest lg:text-[28px]">
              <span className="block c1 tracking-[0.16em] text-stem uppercase">{String(index + 1).padStart(2, "0")}</span>
              {step}
            </li>
          ))}
        </ol>
      </section>

      {page.weeks.map((item, index) => (
        <article key={item.week} className={cn("grid min-h-[70vh] lg:grid-cols-2", index % 2 === 1 && "bg-[#f3efe6]")}>
          <div className={cn("relative min-h-[320px] overflow-hidden lg:min-h-[70vh]", index % 2 === 1 && "lg:order-2")}>
            <Photo src={item.image} video={item.video} tone={item.tone} alt={item.to} className="absolute inset-0" />
          </div>
          <div className="flex items-center px-(--gutter) py-14 lg:px-16">
            <div className="max-w-lg">
              <p className="c1 tracking-[0.2em] text-stem uppercase">
                Chapter {item.week} · {item.stage}
              </p>
              <p className="serif mt-5 text-[28px] leading-snug text-forest lg:text-[40px]">{item.to}</p>
              <h2 className="b1 mt-6 text-forest">{item.title}</h2>
              <div className="reading b2 mt-5 text-ink-90">
                {item.body.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>
          </div>
        </article>
      ))}

      <ConsultCta showCheck={false} />
    </div>
  );
}
