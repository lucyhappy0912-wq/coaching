import Link from "next/link";

import { AskForm } from "@/components/board/AskForm";
import { SectionPage } from "@/components/layout/PageFrame";
import { assertPublicHref } from "@/lib/cms/assert-public";

export const dynamic = "force-dynamic";

export default async function BoardWritePage() {
  await assertPublicHref("/board");
  return (
    <SectionPage>
      <section className="px-(--gutter) py-16 lg:py-20">
        <Link href="/board" className="b3 text-forest underline-offset-2 hover:underline">
          목록으로
        </Link>
        <p className="c1 mt-8 tracking-[0.2em] text-stem uppercase">Board</p>
        <h1 className="t2 mt-3">글쓰기</h1>
        <div className="mt-10 max-w-2xl">
          <AskForm />
        </div>
      </section>
    </SectionPage>
  );
}
