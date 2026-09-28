import { PageHero } from "@/components/content/PageHero";
import type { CmsPages } from "@/lib/cms/types";
import { HOME_VISUAL, VISUAL_POS } from "@/lib/visual";

export function NextLeadership({ page }: { page: CmsPages["leadership"] }) {
  return (
    <div className="bg-white text-ink">
      <PageHero
        eyebrow={page.hero.eyebrow}
        title={page.hero.line}
        lead={page.hero.meta}
        image={HOME_VISUAL.next}
        objectPosition={VISUAL_POS.next}
      />

      <section className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-24">
        <ol className="mx-auto max-w-lg space-y-10">
          {page.body.map((paragraph, index) => (
            <li key={paragraph}>
              <p className="serif text-[13px] text-ink-50">{String(index + 1).padStart(2, "0")}</p>
              <p className="serif mt-2 text-[22px] leading-snug text-ink lg:text-[28px]">{paragraph}</p>
            </li>
          ))}
        </ol>
      </section>
    </div>
  );
}
