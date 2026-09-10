import type { Metadata } from "next";

import { SITE } from "@/lib/site";
import { Container } from "@/components/ui/Container";

export const metadata: Metadata = {
  title: "개인정보처리방침",
};

export default function PrivacyPage() {
  return (
    <div className="bg-white pt-(--header-h)">
      <Container className="mx-auto max-w-3xl py-16 lg:py-24">
        <p className="c1 tracking-[0.2em] text-forest-70 uppercase">Privacy</p>
        <h1 className="serif t1 mt-4">개인정보처리방침</h1>
        <p className="b3 mt-6 text-ink-70">
          사업자 정보와 보호책임자 성명은 아직 확정되지 않았습니다. 아래는 현재 실제로 수집하는
          항목만 적습니다. 확정 값이 들어오면 이 페이지를 교체합니다.
        </p>

        <h2 className="serif t3 mt-12">1. Founder Transition Check</h2>
        <ul className="b3 mt-4 list-disc space-y-2 pl-5 text-ink-70">
          <li>수집: 이름, 전화번호, 이메일, 21문항 각 1~5점 응답, 선택적 연락 동의 여부</li>
          <li>목적: 분석지 제공, 누가 제출했는지 확인. 연락 동의 시에만 프로그램 안내</li>
          <li>열람: 운영자만 확인합니다. 검색에 노출되지 않습니다</li>
          <li>보유: 제출일로부터 90일 이내 파기</li>
          <li>의학적·심리학적 진단에 쓰지 않습니다</li>
        </ul>

        <h2 className="serif t3 mt-12">2. 무료 상담 신청</h2>
        <ul className="b3 mt-4 list-disc space-y-2 pl-5 text-ink-70">
          <li>수집 예정: 이름, 연락처, 희망 시간, 고민되는 점</li>
          <li>전송·저장은 아직 연결되지 않았습니다</li>
        </ul>

        <h2 className="serif t3 mt-12">3. 문의</h2>
        <p className="b3 mt-4 text-ink-70">
          {SITE.email} · {SITE.phone}
        </p>
      </Container>
    </div>
  );
}
