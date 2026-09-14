import type { Metadata } from "next";

import { LiftNextSheet } from "@/components/check/LiftNextSheet";
import { Container } from "@/components/ui/Container";
import { assertPublicHref } from "@/lib/cms/assert-public";
import { LIFT_NEXT } from "@/lib/check/lift-copy";

export const metadata: Metadata = {
  title: LIFT_NEXT.cta.replace(" 신청하기", ""),
  description: LIFT_NEXT.title,
};

export default async function LiftPage() {
  await assertPublicHref("/lift");
  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <LiftNextSheet showCta showHomeLink={false} />
      </Container>
    </div>
  );
}
