import { LinedLink, PillButton } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsPages } from "@/lib/cms/types";

export function NextLeadership({ page }: { page: CmsPages["leadership"] }) {
  return (
    <div className="bg-[#0b1c1e] text-white">
      <section className="relative h-svh min-h-[640px] overflow-hidden">
        <Photo src={page.hero.image} video={page.hero.video} tone={page.hero.tone} alt={page.hero.line} className="absolute inset-0" />
        <div className="absolute inset-0 bg-black/50" />
        <div className="relative z-10 flex h-full flex-col justify-end px-(--gutter) pb-16 lg:pb-24">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{page.hero.eyebrow}</p>
          <h1 className="serif mt-5 max-w-5xl text-[40px] leading-[1.1] lg:text-[68px]">{page.hero.line}</h1>
          <p className="c1 mt-6 tracking-[0.14em] text-white/55 uppercase">{page.hero.meta}</p>
        </div>
      </section>

      <section className="grid lg:grid-cols-2">
        <div className="relative min-h-[50vh] overflow-hidden lg:min-h-svh">
          <Photo src={page.split.image} video={page.split.video} tone={page.split.tone} alt="" className="absolute inset-0" />
        </div>
        <div className="flex items-center px-(--gutter) py-16 lg:px-16 lg:py-24">
          <ol className="max-w-lg space-y-10">
            {page.body.map((paragraph, index) => (
              <li key={paragraph}>
                <p className="serif text-[13px] text-white/35">{String(index + 1).padStart(2, "0")}</p>
                <p className="serif mt-2 text-[22px] leading-snug lg:text-[28px]">{paragraph}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="flex min-h-[40vh] items-center justify-between gap-8 px-(--gutter) py-16">
        <PillButton href="/consult" variant="white">
          1:1 코칭 상담
        </PillButton>
        <LinedLink href="/check" className="text-white">
          founder transition 진단
        </LinedLink>
      </section>
    </div>
  );
}
