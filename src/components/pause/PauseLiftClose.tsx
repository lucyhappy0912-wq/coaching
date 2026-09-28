import poster from "@/media/lift-architecture.png";

import { LiftApplyBlock, type LiftApplicant } from "@/components/check/LiftNextSheet";
import { LinedLink } from "@/components/ui/Buttons";

const posterSrc = typeof poster === "string" ? poster : poster.src;

function LiftPoster() {
  return (
    <figure className="overflow-hidden bg-white">
      {/* 정적 import. public 경로·이미지 최적화에 가리지 않게 한다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt="LIFT – Life Architecture"
        width={typeof poster === "string" ? 1080 : poster.width}
        height={typeof poster === "string" ? 1920 : poster.height}
        className="block h-auto w-full"
      />
    </figure>
  );
}

export function PauseLiftClose({
  showCta,
  applicant,
}: {
  showCta: boolean;
  applicant?: LiftApplicant;
}) {
  return (
    <div className="flex flex-col gap-8">
      {showCta ? (
        <LiftApplyBlock
          applicant={applicant}
          done={
            <div className="border border-forest-20 bg-white px-5 py-6 text-center">
              <p className="serif t3">신청이 완료되었습니다.</p>
              <p className="b3 mt-3 text-ink-70">남겨 주신 연락처로 안내드리겠습니다.</p>
            </div>
          }
        />
      ) : null}
      <LiftPoster />
      {showCta ? (
        <LinedLink href="/" replace className="text-forest">
          홈으로
        </LinedLink>
      ) : null}
    </div>
  );
}
