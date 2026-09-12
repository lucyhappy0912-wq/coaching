import Link from "next/link";
import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { ADM_AREA } from "@/app/admin/_components/fields";
import { requireAdmin } from "@/lib/auth/dal";
import { getQuestionForAdmin } from "@/lib/board/store";

import { deleteQuestion, saveAnswer } from "../actions";

export const dynamic = "force-dynamic";

export default async function AdminBoardDetail({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const row = await getQuestionForAdmin(id);
  if (!row) notFound();

  return (
    <AdminShell title="질문 답변">
      <Link href="/admin/board" className="adm-body text-forest hover:underline">
        목록으로
      </Link>
      <section className="mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
        <p className="adm-meta text-ink-70">
          {row.name} · {row.createdAt.slice(0, 10)}
        </p>
        <h2 className="adm-h mt-2 text-forest">{row.title}</h2>
        <p className="adm-body mt-4 whitespace-pre-wrap text-ink-90">{row.body}</p>
        <form action={saveAnswer} className="mt-6 space-y-4">
          <input type="hidden" name="id" value={row.id} />
          <label className="block">
            <span className="adm-label mb-1.5 block text-forest-70">답변</span>
            <textarea name="answer" defaultValue={row.answer} className={ADM_AREA} />
          </label>
          <label className="adm-body flex items-center gap-2 text-ink-90">
            <input type="checkbox" name="published" defaultChecked={row.published} />
            사이트에 공개
          </label>
          <button type="submit" className="adm-body h-10 rounded-[4px] bg-forest px-5 text-white">
            저장
          </button>
        </form>
        <form action={deleteQuestion} className="mt-4">
          <input type="hidden" name="id" value={row.id} />
          <button type="submit" className="adm-body text-danger hover:underline">
            질문 삭제
          </button>
        </form>
      </section>
    </AdminShell>
  );
}
