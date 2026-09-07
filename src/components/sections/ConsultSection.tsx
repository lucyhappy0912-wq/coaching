import { ConsultForm } from "@/components/sections/ConsultForm";
import { SITE } from "@/lib/site";

export function ConsultSection() {
  return (
    <section id="consult" className="bg-grass-20 px-(--gutter) py-16 lg:py-24">
      <div className="flex flex-col gap-10 lg:flex-row lg:gap-16">
        <div className="lg:w-[38%]">
          <p className="c1 tracking-[0.2em] text-stem uppercase">Consulting</p>
          <h2 className="t2 mt-3">먼저 이야기부터 들려주세요</h2>
          <p className="b3 mt-5 max-w-sm text-ink-70">
            첫 상담은 무료입니다. 지금 어떤 상황인지 듣고, 코칭이 필요한지부터 솔직하게
            말씀드립니다.
          </p>

          <dl className="serif mt-10 space-y-4 text-[15px] text-forest">
            <div>
              <dt className="text-ink-60">Tel.</dt>
              <dd>
                <a href={`tel:${SITE.phone.replace(/-/g, "")}`} className="lined">
                  {SITE.phone}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-60">Email.</dt>
              <dd>
                <a href={`mailto:${SITE.email}`} className="lined">
                  {SITE.email}
                </a>
              </dd>
            </div>
            <div>
              <dt className="text-ink-60">Hours.</dt>
              <dd>
                {SITE.hours} / {SITE.lunch}
              </dd>
            </div>
          </dl>
        </div>

        <div className="lg:flex-1">
          <ConsultForm />
        </div>
      </div>
    </section>
  );
}
