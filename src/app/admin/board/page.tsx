import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { listQuestionsForAdmin } from "@/lib/board/store";
import { dataStoreMode } from "@/lib/check/store-mode";

export const dynamic = "force-dynamic";

function excerpt(text: string) {
  const line = text.replace(/\s+/g, " ").trim();
  return line.length > 80 ? `${line.slice(0, 80)}…` : line;
}

export default async function AdminBoardPage() {
  await requireAdmin();
  const rows = await listQuestionsForAdmin();

  return (
    <AdminShell title="게시판">
      <p className="adm-body text-ink-70">방문자가 올린 글입니다. 비밀글 본문도 여기서 보고 답변합니다.</p>
      {rows.length === 0 ? (
        <p className="adm-body mt-6 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          {dataStoreMode() === "jsonl"
            ? "이 컴퓨터에 저장된 글만 보입니다. 공개 사이트에서 넣은 글은 여기에 없습니다."
            : dataStoreMode() === "readonly"
              ? "배포 저장소 키가 없어 글을 받을 수 없습니다."
              : "아직 글이 없습니다. 표가 없다면 Supabase SQL Editor에서 board_questions 마이그레이션을 실행해 주세요."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-ink-10 overflow-hidden rounded-[6px] border border-ink-15 bg-white">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/board/${row.id}`} className="block px-4 py-4 hover:bg-ink-05">
                <div className="flex items-center justify-between gap-4">
                  <p className="adm-body text-forest">{row.title}</p>
                  <span className="adm-meta shrink-0 text-ink-70">
                    {row.published ? "공개" : "비밀"}
                    {row.answer ? " · 답변" : " · 미답변"}
                  </span>
                </div>
                <p className="adm-meta mt-1 text-ink-70">
                  {row.name} · {row.createdAt.slice(0, 10)}
                </p>
                <p className="adm-body mt-2 text-ink-90">{excerpt(row.body)}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
