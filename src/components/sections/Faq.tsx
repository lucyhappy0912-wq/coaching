import type { CmsFaq } from "@/lib/cms/types";
import { FAQS } from "@/lib/site";

export function Faq({ faqs = FAQS }: { faqs?: readonly CmsFaq[] }) {
  return (
    <section id="faq" className="bg-grass-10 px-(--gutter) py-16 lg:py-20">
      <h2 className="t2 mb-8 lg:mb-10">FAQ</h2>

      <div className="border-t border-forest-20">
        {faqs.map((faq) => (
          <details
            key={faq.q}
            className="group border-b border-forest-20 py-5 [&_summary::-webkit-details-marker]:hidden"
          >
            <summary className="serif flex cursor-pointer items-center justify-between gap-6 text-[17px] lg:text-[20px]">
              {faq.q}
              <span className="relative size-4 shrink-0">
                <span className="absolute top-1/2 left-0 h-px w-4 bg-forest" />
                <span className="absolute top-0 left-1/2 h-4 w-px bg-forest transition-transform duration-200 group-open:rotate-90" />
              </span>
            </summary>
            <p className="b3 mt-4 max-w-3xl text-ink-70">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
