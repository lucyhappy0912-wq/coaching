import type { Metadata } from "next";

import { LiftArchitectureBoard } from "@/components/pause/LiftArchitectureBoard";
import { LinedLink } from "@/components/ui/Buttons";
import { assertPublicHref } from "@/lib/cms/assert-public";

export const metadata: Metadata = {
  title: "Life Architecture",
  description: "지금, 내 삶의 구조를 다시 설계하는 시간. LIFT – Life Architecture.",
};

export default async function LifeArchitecturePage() {
  await assertPublicHref("/life-architecture");
  return (
    <div className="bg-[#f7f6f3] pt-(--header-h)">
      <div className="mx-auto max-w-3xl px-(--gutter) py-10 lg:py-16">
        <LiftArchitectureBoard />
        <div className="mt-10">
          <LinedLink href="/lift" className="text-forest">
            LIFT 신청하기
          </LinedLink>
        </div>
      </div>
    </div>
  );
}
