import jenga from "@/media/lift-jenga.png";

import { LIFT_POSTER as copy } from "@/lib/pause/lift-poster";

const jengaSrc = typeof jenga === "string" ? jenga : jenga.src;

function IconCompass() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M14.8 9.2 11 11l-1.8 3.8L13 13z" />
    </svg>
  );
}

function IconBlocks() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <rect x="3" y="13" width="8" height="8" />
      <rect x="13" y="13" width="8" height="8" />
      <rect x="8" y="3" width="8" height="8" />
    </svg>
  );
}

function IconTarget() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <circle cx="12" cy="12" r="5" />
      <circle cx="12" cy="12" r="1.4" fill="currentColor" stroke="none" />
    </svg>
  );
}

function IconChart() {
  return (
    <svg viewBox="0 0 24 24" className="size-5" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
      <path d="M4 19h16" />
      <path d="M7 16V10" />
      <path d="M12 16V6" />
      <path d="M17 16v-8" />
    </svg>
  );
}

const ICONS = [IconCompass, IconBlocks, IconTarget, IconChart];

export function LiftArchitectureBoard() {
  return (
    <article className="overflow-hidden bg-white text-[#1a1a1a]">
      <header className="relative min-h-[420px] overflow-hidden text-white lg:min-h-[520px]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={jengaSrc}
          alt=""
          width={typeof jenga === "string" ? 250 : jenga.width}
          height={typeof jenga === "string" ? 500 : jenga.height}
          className="absolute inset-0 size-full object-cover"
          style={{ objectPosition: "78% 32%" }}
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-linear-to-r from-[#141210]/88 via-[#141210]/45 to-[#141210]/10"
        />
        <div className="relative z-10 flex min-h-[420px] flex-col justify-end px-6 py-10 sm:px-8 sm:py-12 lg:min-h-[520px] lg:px-10">
          <p className="c1 tracking-[0.22em] text-white/55 uppercase">{copy.brand}</p>
          <p className="c1 mt-1 tracking-[0.18em] text-white/40 uppercase">{copy.brandEn}</p>
          <h2 className="serif mt-8 text-[52px] leading-none tracking-[0.18em] sm:text-[72px]">{copy.title}</h2>
          <p className="c1 mt-3 tracking-[0.28em] text-white/70">{copy.subtitle}</p>
          <div className="mt-6 h-px w-16 bg-white/35" />
          <p className="serif mt-8 max-w-md whitespace-pre-line text-[22px] leading-snug sm:text-[28px]">{copy.line}</p>
          <p className="b3 mt-5 max-w-sm whitespace-pre-line text-white/70">{copy.body}</p>
          <p className="c1 mt-8 tracking-[0.16em] text-white/40 uppercase">{copy.close}</p>
        </div>
        <p className="c1 absolute top-1/2 right-6 z-10 hidden -translate-y-1/2 text-right tracking-[0.2em] text-white/40 uppercase lg:block">
          {copy.axis.map((item) => (
            <span key={item} className="block">
              {item}
            </span>
          ))}
        </p>
      </header>

      <section className="px-6 py-10 sm:px-8 lg:px-10">
        <p className="serif whitespace-pre-line text-[22px] leading-snug sm:text-[26px]">{copy.benefitsTitle}</p>
        <p className="c1 mt-2 tracking-[0.16em] text-ink-50 uppercase">{copy.benefitsEyebrow}</p>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {copy.benefits.map((item, index) => {
            const Icon = ICONS[index] ?? IconCompass;
            return (
              <li key={item} className="flex gap-3">
                <span className="mt-0.5 text-ink-50">
                  <Icon />
                </span>
                <p className="b2 text-ink-90">{item}</p>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="border-t border-ink-10 px-6 py-10 sm:px-8 lg:px-10">
        <p className="serif whitespace-pre-line text-[22px] leading-snug sm:text-[26px]">{copy.forTitle}</p>
        <p className="c1 mt-2 tracking-[0.16em] text-ink-50 uppercase">{copy.forEyebrow}</p>
        <ul className="mt-6 space-y-3">
          {copy.forItems.map((item) => (
            <li key={item} className="b2 flex gap-3 text-ink-90">
              <span aria-hidden className="text-ink-30">
                ✓
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <footer className="grid gap-8 bg-[#111] px-6 py-8 text-white sm:px-8 lg:grid-cols-[1.1fr_0.9fr] lg:px-10">
        <div>
          <p className="c1 tracking-[0.16em] text-white/45 uppercase">{copy.footTitle}</p>
          <p className="serif mt-3 text-[24px] leading-snug">{copy.footCta}</p>
          <div className="mt-4 h-px w-10 bg-white/30" />
          <p className="b3 mt-4 whitespace-pre-line text-white/65">{copy.footLead}</p>
        </div>
        <ol className="space-y-3">
          {copy.steps.map((step, index) => (
            <li key={step} className="b2 flex gap-3 text-white/85">
              <span className="c1 text-white/40">{index + 1}</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </footer>
    </article>
  );
}
