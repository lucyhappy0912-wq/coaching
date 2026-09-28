import { LinedLink } from "@/components/ui/Buttons";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, SITE } from "@/lib/site";

export function Services() {
  return (
    <section id="service" className="bg-[#f7f6f3] px-(--gutter) py-16 lg:py-20">
      <p className="b1 mb-5 font-semibold text-forest">{SITE.nameKo}의 특별한 서비스를 만나보세요</p>

      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.06} className="w-[72%] shrink-0 snap-start lg:w-auto">
            <li className="list-none border-t border-ink-10 pt-5">
              <h3 className="serif text-[19px] lg:text-[22px]">{service.title}</h3>
              <p className="b3 mt-2 text-ink-70">{service.body}</p>
              <LinedLink href={service.link.href} className="mt-4">
                {service.link.label}
              </LinedLink>
            </li>
          </Reveal>
        ))}
      </ul>
    </section>
  );
}
