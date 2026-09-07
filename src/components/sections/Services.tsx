import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { Reveal } from "@/components/ui/Reveal";
import { SERVICES, SITE } from "@/lib/site";

export function Services() {
  return (
    <section id="service" className="bg-grass-10 px-(--gutter) py-16 lg:py-20">
      <p className="b1 mb-5 font-semibold text-forest">{SITE.nameKo}의 특별한 서비스를 만나보세요</p>

      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:gap-6 lg:overflow-visible">
        {SERVICES.map((service, i) => (
          <Reveal key={service.title} delay={i * 0.06} className="w-[72%] shrink-0 snap-start lg:w-auto">
            <li className="list-none">
              <div className="relative aspect-4/3 overflow-hidden rounded-xl">
                <Photo
                  src={service.image}
                  tone={service.tone}
                  alt={service.title}
                  sizes="(min-width: 1025px) 24vw, 72vw"
                />
              </div>
              <h3 className="serif mt-5 text-[19px] lg:text-[22px]">{service.title}</h3>
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
