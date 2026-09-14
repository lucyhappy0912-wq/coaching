import Link from "next/link";

import { AskForm } from "@/components/board/AskForm";
import { SectionPage } from "@/components/layout/PageFrame";
import { listPublishedQuestions } from "@/lib/board/store";
import { assertPublicHref } from "@/lib/cms/assert-public";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  await assertPublicHref("/board");
  const posts = await listPublishedQuestions();
  return (
    <SectionPage>
      <section className="px-(--gutter) py-16 lg:py-20">
        <p className="c1 tracking-[0.2em] text-stem uppercase">Board</p>
        <h1 className="t2 mt-3">게시판</h1>
        <p className="b3 mt-4 max-w-xl text-ink-70">
          공개글은 누구나 읽을 수 있고, 비밀글은 비밀번호를 아는 분만 본문을 봅니다.
        </p>

        {posts.length === 0 ? (
          <p className="b3 mt-12 text-ink-70">아직 글이 없습니다.</p>
        ) : (
          <div className="mt-12 overflow-x-auto border-t border-ink-10">
            <table className="w-full min-w-[640px] text-left">
              <thead>
                <tr className="c1 border-b border-ink-10 text-ink-70">
                  <th className="w-16 py-3 font-normal">번호</th>
                  <th className="py-3 font-normal">제목</th>
                  <th className="w-28 py-3 font-normal">작성자</th>
                  <th className="w-28 py-3 font-normal">날짜</th>
                  <th className="w-16 py-3 font-normal">조회</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((row, index) => (
                  <tr key={row.id} className="border-b border-ink-10">
                    <td className="b3 py-4 text-ink-70">{posts.length - index}</td>
                    <td className="py-4 pr-4">
                      <Link href={`/board/${row.id}`} className="serif text-[17px] text-forest hover:opacity-60">
                        {row.title}
                      </Link>
                      {!row.published ? (
                        <span className="c1 ml-2 text-ink-70">비밀</span>
                      ) : null}
                      {row.answer ? <span className="c1 ml-2 text-forest-70">답글</span> : null}
                    </td>
                    <td className="b3 py-4 text-ink-70">{row.name}</td>
                    <td className="b3 py-4 text-ink-70">{row.createdAt.slice(0, 10)}</td>
                    <td className="b3 py-4 text-ink-70">{row.views}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-16 max-w-2xl">
          <AskForm />
        </div>
      </section>
    </SectionPage>
  );
}
