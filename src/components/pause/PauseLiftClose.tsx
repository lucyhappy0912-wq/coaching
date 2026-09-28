import Image from "next/image";

import { LiftApplyBlock, type LiftApplicant } from "@/components/check/LiftNextSheet";
import { LinedLink } from "@/components/ui/Buttons";

function LiftPoster() {
  return (
    <figure className="overflow-hidden border border-forest-20 bg-white">
      <Image
        src="/media/lift-architecture.png"
        alt="LIFT – Life Architecture"
        width={1080}
        height={1920}
        className="h-auto w-full"
        sizes="(min-width: 768px) 42rem, 100vw"
        priority
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
  if (!showCta) return <LiftPoster />;

  return (
    <div className="flex flex-col gap-10">
      <LiftApplyBlock
        applicant={applicant}
        done={
          <div className="flex flex-col gap-8">
            <LiftPoster />
            <LinedLink href="/" replace className="text-forest">
              홈으로
            </LinedLink>
          </div>
        }
      />
    </div>
  );
}
