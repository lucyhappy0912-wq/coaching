import Link from "next/link";

import { Photo, type PhotoTone } from "@/components/ui/Photo";
import { Container } from "@/components/ui/Container";
import { cn } from "@/lib/utils";

export function Breadcrumb({
  items,
}: {
  items: { href?: string; label: string }[];
}) {
  return (
    <nav aria-label="현재 위치">
      <ol className="b3 flex flex-wrap items-center gap-x-2 gap-y-1 text-ink-70">
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} className="flex items-center gap-x-2">
            {index > 0 ? (
              <span aria-hidden className="text-ink-30">
                /
              </span>
            ) : null}
            {item.href ? (
              <Link href={item.href} className="transition-colors hover:text-forest">
                {item.label}
              </Link>
            ) : (
              <span className="text-forest" aria-current="page">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function PageHeader({
  eyebrow,
  title,
  lead,
  crumbs,
  photo,
}: {
  eyebrow: string;
  title: string;
  lead: string;
  crumbs: { href?: string; label: string }[];
  photo?: { tone: PhotoTone; alt: string };
}) {
  return (
    <section className="bg-white pt-[calc(var(--header-h)+24px)] pb-10 lg:pt-[calc(var(--header-h)+40px)] lg:pb-16">
      <Container>
        <Breadcrumb items={crumbs} />
        <div
          className={cn(
            "mt-7 lg:mt-10",
            photo && "lg:flex lg:items-end lg:gap-12"
          )}
        >
          <div className={photo ? "lg:flex-1" : "max-w-(--measure)"}>
            <p className="c1 tracking-[0.2em] text-stem uppercase">{eyebrow}</p>
            <h1 className="t1 mt-3 text-balance">{title}</h1>
            <p className="b1 mt-5 max-w-(--measure-narrow) text-ink-90">{lead}</p>
          </div>
          {photo ? (
            <div className="relative mt-8 aspect-16/9 w-full overflow-hidden lg:mt-0 lg:aspect-3/2 lg:w-[38%]">
              <Photo tone={photo.tone} alt={photo.alt} sizes="(min-width: 1025px) 38vw, 100vw" priority />
            </div>
          ) : null}
        </div>
      </Container>
    </section>
  );
}

export function PageBody({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-white py-14 lg:py-20">
      <Container>
        <div className="space-y-14 lg:space-y-20">{children}</div>
      </Container>
    </div>
  );
}

export function SectionRow({
  kicker,
  title,
  children,
}: {
  kicker?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="lg:grid lg:grid-cols-[minmax(0,16rem)_minmax(0,var(--measure))] lg:gap-x-16">
      <div>
        {kicker ? <p className="c1 tracking-[0.18em] text-stem uppercase">{kicker}</p> : null}
        <h2 className={cn("t2 text-balance", kicker && "mt-3 lg:mt-0")}>{title}</h2>
      </div>
      <div className="reading b2 mt-6 text-ink-90 lg:mt-0">{children}</div>
    </section>
  );
}
