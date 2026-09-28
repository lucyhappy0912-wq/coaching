import { LinedLink } from "@/components/ui/Buttons";
import { Photo } from "@/components/ui/Photo";
import { sanitizeImageFocus } from "@/lib/cms/image-focus";
import type { CmsCoach } from "@/lib/cms/types";
import { COACH } from "@/lib/site";
import { HOME_VISUAL, portraitOrFounder } from "@/lib/visual";

const PHOTO_H = "lg:min-h-[min(960px,calc(100svh-var(--header-h)))]";

export function CoachBand({ coach = { ...COACH, credentials: [...COACH.credentials] } }: { coach?: CmsCoach }) {
  const lines = coach.credentials.map((item) => item.trim()).filter(Boolean);
  const role = !coach.role.trim() || /^대표\s*코치$/.test(coach.role.trim()) ? "인생 전환 코치" : coach.role.trim();
  const paragraphs = coach.intro
    .split(/\n+/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <div className="bg-[#f7f6f3] text-ink">
      <section id="coach" className="grid pt-(--header-h) lg:grid-cols-2 lg:items-start">
        <div className={`relative aspect-4/5 overflow-hidden lg:aspect-auto ${PHOTO_H}`}>
          <Photo
            src={portraitOrFounder(coach.image)}
            tone="paper"
            alt={coach.name}
            sizes="(min-width: 1025px) 50vw, 100vw"
            priority
            objectPosition={coach.image && portraitOrFounder(coach.image) !== HOME_VISUAL.founder ? sanitizeImageFocus(coach.imageFocus) : "center 40%"}
            className="absolute inset-0 object-cover"
          />
        </div>

        <div className={`flex items-start px-(--gutter) py-16 lg:px-16 lg:py-24 ${PHOTO_H}`}>
          <div className="max-w-(--measure-narrow)">
            <p className="c1 tracking-[0.2em] text-ink-50 uppercase">Transition Coach 대표코치</p>
            <h1 className="t2 mt-3 text-ink">{coach.name}</h1>
            <p className="c1 mt-3 text-ink-50">{role}</p>
            {paragraphs.length > 0 ? (
              <div className="reading mt-8">
                {paragraphs.map((paragraph) => (
                  <p key={paragraph} className="b2 text-ink-70">
                    {paragraph}
                  </p>
                ))}
              </div>
            ) : null}
            {lines.length > 0 ? (
              <div className="mt-12">
                <p className="c1 tracking-[0.2em] text-ink-50">프로필</p>
                <ul className="mt-4">
                  {lines.map((item) => (
                    <li key={item} className="b3 border-t border-ink-10 py-4 text-ink-70 last:border-b">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
            <LinedLink href="/lift" className="mt-10 inline-block text-forest">
              LIFT – Life Architecture
            </LinedLink>
          </div>
        </div>
      </section>
    </div>
  );
}
