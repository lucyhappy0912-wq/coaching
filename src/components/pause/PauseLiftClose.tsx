import poster from "@/media/lift-architecture.png";

import { LiftApplyBlock, type LiftApplicant } from "@/components/check/LiftNextSheet";
import { LinedLink } from "@/components/ui/Buttons";

const posterSrc = typeof poster === "string" ? poster : poster.src;
const posterW = typeof poster === "string" ? 682 : poster.width;
const posterH = typeof poster === "string" ? 1024 : poster.height;

function LiftPoster() {
  return (
    <figure className="mx-auto w-full max-w-[min(100%,21.375rem)] overflow-hidden bg-white">
      {/* 원본이 682px이라 그 이상으로 키우면 깨진다. 레티나에서도 선명하게 반폭으로 둔다. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={posterSrc}
        alt="LIFT – Life Architecture"
        width={posterW}
        height={posterH}
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
      <LiftPoster />
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
      {showCta ? (
        <LinedLink href="/" replace className="text-forest">
          홈으로
        </LinedLink>
      ) : null}
    </div>
  );
}
