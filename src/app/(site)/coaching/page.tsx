import type { Metadata } from "next";

import { LinedLink } from "@/components/ui/Buttons";
import { PageFrame } from "@/components/layout/PageFrame";
import { Photo } from "@/components/ui/Photo";
import { AUDIENCES } from "@/lib/site";

export const metadata: Metadata = {
  title: "Coaching",
  description: "성인·시니어·리더십 1:1 코칭. 지금 서 있는 자리에 맞춰 다음 한 걸음을 정합니다.",
};

const SLUG: Record<(typeof AUDIENCES)[number]["id"], string> = {
  adult: "adult",
  senior: "senior",
  leader: "leadership",
};

export default function CoachingIndexPage() {
  return (
    <PageFrame wide>
      <p className="c1 tracking-[0.16em] text-forest-70 uppercase">Coaching</p>
      <h1 className="serif mt-3 text-[28px] leading-tight sm:text-[40px]">내게 맞는 코칭</h1>
      <p className="b2 mt-4 text-ink-70">
        세 가지 자리 중 지금 가까운 곳을 고르면 됩니다. 상담에서 다시 맞춰도 됩니다.
      </p>
      <ul className="mt-12 space-y-12">
        {AUDIENCES.map((item) => (
          <li key={item.id} className="grid gap-6 border-b border-ink-10 pb-12 lg:grid-cols-2 lg:items-center">
            <div className="relative aspect-4/3 overflow-hidden">
              <Photo src={item.image} tone={item.tone} alt={item.title} sizes="(min-width: 1025px) 40vw, 100vw" />
            </div>
            <div>
              <p className="c1 tracking-[0.16em] text-forest-70 uppercase">{item.label}</p>
              <h2 className="serif mt-2 text-[22px] leading-snug lg:text-[28px]">{item.title}</h2>
              <p className="b3 mt-4 text-ink-70">{item.body}</p>
              <LinedLink href={`/coaching/${SLUG[item.id]}`} className="mt-6">
                자세히 보기
              </LinedLink>
            </div>
          </li>
        ))}
      </ul>
    </PageFrame>
  );
}
