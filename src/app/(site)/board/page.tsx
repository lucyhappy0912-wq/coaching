import Link from "next/link";

import { AskForm } from "@/components/board/AskForm";
import { SectionPage } from "@/components/layout/PageFrame";
import { listPublishedQuestions } from "@/lib/board/store";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const questions = await listPublishedQuestions();
  return (
    <SectionPage>
      <section className="px-(--gutter) py-16 lg:py-20">
        <p className="c1 tracking-[0.2em] text-stem uppercase">Q&A</p>
        <h1 className="t2 mt-3">질문 게시판</h1>
        <p className="b3 mt-4 max-w-xl text-ink-70">
          궁금한 점을 남겨 주세요. 답이 달리면 이 페이지에 공개됩니다.
        </p>

        <div className="mt-10 max-w-2xl">
          <AskForm />
        </div>

        {questions.length === 0 ? (
          <p className="b3 mt-12 text-ink-70">아직 공개된 질문이 없습니다.</p>
        ) : (
          <ul className="mt-12 divide-y divide-ink-10 border-t border-ink-10">
            {questions.map((row) => (
              <li key={row.id} className="py-5">
                <Link href={`/board/${row.id}`} className="serif text-[20px] text-forest hover:opacity-60">
                  {row.title}
                </Link>
                <p className="b3 mt-2 text-ink-70">
                  {row.name} · {row.createdAt.slice(0, 10)}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SectionPage>
  );
}
