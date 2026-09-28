import { ConsultForm } from "@/components/sections/ConsultForm";
import { Reveal } from "@/components/ui/Reveal";
import type { CmsSite } from "@/lib/cms/types";
import { SITE } from "@/lib/site";

export function ConsultSection({ site = SITE }: { site?: CmsSite }) {
  return (
    <section id="consult" className="bg-white px-(--gutter) py-16 lg:py-24">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <Reveal className="lg:w-[38%]">
          <p className="c1 tracking-[0.2em] text-ink-50 uppercase">Contact</p>
          <p className="serif mt-3 text-[28px] leading-snug text-ink lg:text-[36px]">연락처</p>

          <dl className="serif mt-10 space-y-4 text-[15px] text-forest">
            <div>
              <dt className="text-ink-70">Tel.</dt>
              <dd>
                <a href={`tel:${site.phone.replace(/-/g, "")}`} className="lined">
                  {site.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-70">Email.</dt>
              <dd>
                <a href={`mailto:${site.email}`} className="lined">
                  {site.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-70">Hours.</dt>
              <dd>
                {site.hours} / {site.lunch}
              </dd>
            </div>
          </dl>
        </Reveal>

        <Reveal delay={0.08} className="lg:flex-1">
          <ConsultForm />
        </Reveal>
      </div>
    </section>
  );
}
