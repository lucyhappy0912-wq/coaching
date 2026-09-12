import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import type { CmsCoach } from "@/lib/cms/types";
import { COACH } from "@/lib/site";

export function CoachBand({ coach = { ...COACH, credentials: [...COACH.credentials] } }: { coach?: CmsCoach }) {
  return (
    <section id="coach" className="px-(--gutter) py-16 lg:py-20">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:gap-12">
        <div className="relative aspect-4/5 w-full overflow-hidden lg:h-[560px] lg:w-[38%]">
          <Photo
            src={coach.image}
            tone={coach.tone}
            alt={coach.name}
            sizes="(min-width: 1025px) 38vw, 100vw"
          />
        </div>

        <div className="lg:flex-1 lg:pb-6">
          <p className="c1 tracking-[0.2em] text-stem uppercase">Coach</p>
          <h2 className="t2 mt-3">{coach.name}</h2>
          <p className="b3 mt-2 text-ink-70">{coach.role}</p>
          <p className="b2 mt-8 max-w-xl text-ink-90">{coach.intro}</p>

          <ul className="mt-8 space-y-2 border-t border-ink-10 pt-6">
            {coach.credentials.map((item) => (
              <li key={item} className="b3 text-ink-70">
                {item}
              </li>
            ))}
          </ul>

          <LinedLink href="/consult" className="mt-8">
            코치와 상담하기
          </LinedLink>
        </div>
      </div>
    </section>
  );
}
