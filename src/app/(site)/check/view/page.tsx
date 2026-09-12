import type { Metadata } from "next";
import Link from "next/link";

import { CheckViewForm } from "@/components/check/CheckViewForm";
import { Container } from "@/components/ui/Container";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "분석지 다시 보기",
  robots: { index: false, follow: false, nocache: true },
};

export default function CheckViewPage() {
  return (
    <div className="bg-grass-10 pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-8 sm:py-16 lg:py-24">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Founder Transition Check</p>
        <h1 className="serif t1 mt-4">분석지 다시 보기</h1>
        <p className="b3 mt-4 text-ink-70">
          제출 직후 받은 주소가 없어도, 그때 넣은 이름·전화·이메일로 분석지를 다시 열 수 있습니다.
          의학적·심리학적 진단이 아닙니다.
        </p>
        <p className="b3 mt-3">
          <Link href="/check" className="lined text-forest">
            문답 다시 하기
          </Link>
        </p>
        <CheckViewForm />
      </Container>
    </div>
  );
}
