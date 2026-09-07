import { Quote } from "lucide-react";

import { Container } from "@/components/ui/Container";
import { COACH } from "@/lib/site";

export function Coach() {
  return (
    <section id="coach" className="bg-brand-900 py-20 text-white sm:py-28">
      <Container>
        <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr]">
          <div className="relative">
            {/* 코치 사진 자리 — 실제 이미지 준비 후 next/image 로 교체 */}
            <div className="flex aspect-4/5 items-center justify-center rounded-4xl border border-brand-700 bg-brand-800 text-sm text-brand-200">
              코치 사진
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold tracking-widest text-accent-400 uppercase">Coach</p>
            <h2 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">{COACH.name}</h2>
            <p className="mt-2 text-brand-200">{COACH.role}</p>

            <Quote className="mt-8 size-8 text-accent-400" />
            <p className="mt-4 max-w-xl text-lg leading-relaxed text-balance">{COACH.intro}</p>

            <ul className="mt-9 grid gap-3 sm:grid-cols-3">
              {COACH.credentials.map((item) => (
                <li
                  key={item}
                  className="rounded-2xl border border-brand-700 bg-brand-800/60 p-4 text-sm leading-relaxed text-brand-100"
                >
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Container>
    </section>
  );
}
