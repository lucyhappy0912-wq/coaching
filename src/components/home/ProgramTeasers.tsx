import { LinedLink } from "@/components/ui/Buttons";
import { Container } from "@/components/ui/Container";
import { Photo } from "@/components/ui/Photo";
import { PROGRAM_TEASERS } from "@/lib/content";

export function ProgramTeasers() {
  return (
    <section className="bg-white py-20 lg:py-28">
      <Container>
        <ul>
          {PROGRAM_TEASERS.map((item, index) => (
            <li
              key={item.id}
              className="flex min-h-[520px] flex-col items-center gap-10 border-b border-ink-10 py-16 last:border-b-0 lg:min-h-[684px] lg:flex-row lg:justify-center lg:gap-20 lg:py-24"
            >
              <div
                className={`relative aspect-10/11 w-full max-w-[400px] overflow-hidden rounded-[8px] ${
                  index % 2 === 1 ? "lg:order-2" : ""
                }`}
              >
                <Photo tone={item.tone} alt={item.title} sizes="400px" />
              </div>
              <div className="w-full max-w-[560px]">
                <p className="serif text-[28px] leading-none text-forest">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <p className="c1 mt-3 tracking-[0.14em] text-stem uppercase">{item.line}</p>
                <h2 className="mt-2 text-[18px] leading-snug text-forest">{item.title}</h2>
                <p className="b3 mt-5 text-ink-90">{item.lead[0]}</p>
                <p className="b3 mt-4 text-ink-90">{item.close[0]}</p>
                <LinedLink href={item.href} className="mt-8">
                  {item.cta}
                </LinedLink>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </section>
  );
}
