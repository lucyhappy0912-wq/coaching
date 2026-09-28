import { LiftApplyBlock, type LiftApplicant } from "@/components/check/LiftNextSheet";
import { LiftArchitectureBoard } from "@/components/pause/LiftArchitectureBoard";
import { LinedLink } from "@/components/ui/Buttons";

export function PauseLiftClose({
  showCta,
  applicant,
}: {
  showCta: boolean;
  applicant?: LiftApplicant;
}) {
  return (
    <div className="flex flex-col gap-8">
      <LiftArchitectureBoard />
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
