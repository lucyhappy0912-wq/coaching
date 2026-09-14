import Link from "next/link";
import { notFound } from "next/navigation";

import { UnlockForm } from "@/components/board/UnlockForm";
import { SectionPage } from "@/components/layout/PageFrame";
import { getAdminSession } from "@/lib/auth/dal";
import { bumpBoardViews, getPublishedQuestion } from "@/lib/board/store";
import { isBoardUnlocked } from "@/lib/board/unlock";
import { getPost } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const question = await getPublishedQuestion(id);
  if (question) {
    const admin = await getAdminSession();
    const unlocked = question.published || Boolean(admin) || (await isBoardUnlocked(id));
    if (unlocked) await bumpBoardViews(id);
    return (
      <SectionPage>
        <article className="px-(--gutter) py-16 lg:py-20">
          <Link href="/board" className="b3 text-forest underline-offset-2 hover:underline">
            목록으로
          </Link>
          <p className="c1 mt-8 tracking-[0.16em] text-stem uppercase">
            {question.published ? "공개글" : "비밀글"}
          </p>
          <h1 className="t2 mt-3">{question.title}</h1>
          <p className="b3 mt-3 text-ink-70">
            {question.name} · {question.createdAt.slice(0, 10)} · 조회 {question.views + (unlocked ? 1 : 0)}
          </p>
          {unlocked ? (
            <>
              <p className="b2 mt-10 max-w-3xl whitespace-pre-wrap text-ink-90">{question.body}</p>
              {question.answer ? (
                <div className="mt-10 max-w-3xl border-t border-ink-10 pt-8">
                  <p className="c1 tracking-[0.16em] text-stem uppercase">답글</p>
                  <p className="b2 mt-4 whitespace-pre-wrap text-ink-90">{question.answer}</p>
                </div>
              ) : null}
            </>
          ) : question.passwordHash ? (
            <UnlockForm id={question.id} />
          ) : (
            <p className="b2 mt-10 text-ink-70">이 글은 관리자만 볼 수 있습니다.</p>
          )}
        </article>
      </SectionPage>
    );
  }

  const post = await getPost(id, true);
  if (!post) notFound();
  return (
    <SectionPage>
      <article className="px-(--gutter) py-16 lg:py-20">
        <Link href="/board" className="b3 text-forest underline-offset-2 hover:underline">
          목록으로
        </Link>
        <h1 className="t2 mt-6">{post.title}</h1>
        <p className="b3 mt-3 text-ink-70">{post.createdAt.slice(0, 10)}</p>
        <div className="b2 mt-10 max-w-3xl whitespace-pre-wrap text-ink-90">{post.body}</div>
      </article>
    </SectionPage>
  );
}
