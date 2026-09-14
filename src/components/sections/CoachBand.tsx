import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { sanitizeImageFocus } from "@/lib/cms/image-focus";
import type { CmsCoach } from "@/lib/cms/types";
import { COACH } from "@/lib/site";

const PHOTO_H = "lg:min-h-[min(960px,calc(100svh-var(--header-h)))]";

export function CoachBand({ coach = { ...COACH, credentials: [...COACH.credentials] } }: { coach?: CmsCoach }) {
  const lines = coach.credentials.map((item) => item.trim()).filter(Boolean);
  const role = !coach.role.trim() || /^대표\s*코치$/.test(coach.role.trim()) ? "인생 전환 코치" : coach.role.trim();
  const paragraphs = coach.intro
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-[#111] text-white">
      <section id="coach" className="grid pt-(--header-h) lg:grid-cols-2 lg:items-start">
        <div className={`relative aspect-4/5 overflow-hidden lg:aspect-auto ${PHOTO_H}`}>
          <Photo
            src={coach.image}
            tone={coach.tone}
            alt={coach.name}
            sizes="(min-width: 1025px) 50vw, 100vw"
            priority
            objectPosition={sanitizeImageFocus(coach.imageFocus)}
            className="absolute inset-0 object-cover"
          />
        </div>

        <div className={`flex items-start px-(--gutter) py-16 lg:px-16 lg:py-24 ${PHOTO_H}`}>
          <div className="max-w-(--measure-narrow)">
            <p className="c1 tracking-[0.2em] text-white/55 uppercase">Transition Coach 대표코치</p>
            <h1 className="t2 mt-3 text-white">{coach.name}</h1>
            <p className="c1 mt-3 text-white/55">{role}</p>
            {paragraphs.length > 0 ? (
              <div className="reading mt-8">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="b2 text-white/75">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {lines.length > 0 ? (
              <div className="mt-12">
                <p className="c1 tracking-[0.2em] text-white/55">프로필</p>
                <ul className="mt-4">
                  {lines.map((item) => (
                    <li key={item} className="b3 border-t border-white/12 py-4 text-white/70 last:border-b">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <LinedLink href="/lift" className="mt-10 inline-block text-white">
              LIFT – Life Architecture
            </LinedLink>
          </div>
        </div>
      </section>
    </div>
  );
}
