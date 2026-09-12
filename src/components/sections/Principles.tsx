import { Photo } from "@/components/ui/Photo";
import { PRINCIPLES } from "@/lib/site";

export function Principles() {
  return (
    <section id="belief" className="scroll-mt-(--header-h) px-(--gutter) py-16 lg:py-20">
      <ul className="no-scrollbar flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-3 lg:gap-6 lg:overflow-visible">
        {PRINCIPLES.map((item) => (
          <li
            key={item.title}
            className="relative aspect-3/4 w-[72%] shrink-0 snap-start overflow-hidden lg:aspect-4/3 lg:w-auto"
          >
            <Photo
              src={item.image}
              tone={item.tone}
              alt={item.title}
              sizes="(min-width: 1025px) 32vw, 72vw"
            />
            <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/25 to-black/10" />
            <div className="absolute top-6 left-6 text-white">
              <h3 className="serif text-[22px] lg:text-[26px]">{item.title}</h3>
              <p className="b3 mt-1.5 opacity-90">{item.body}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
