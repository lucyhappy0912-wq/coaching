import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { listQuestionsForAdmin } from "@/lib/board/store";
import { dataStoreMode } from "@/lib/check/store-mode";

export const dynamic = "force-dynamic";

export default async function AdminBoardPage() {
  await requireAdmin();
  const rows = await listQuestionsForAdmin();

  return (
    <AdminShell title="질문 게시판">
      <p className="adm-body text-ink-70">방문자가 남긴 질문입니다. 답을 쓰고 공개하면 사이트 게시판에 나갑니다.</p>
      {rows.length === 0 ? (
        <p className="adm-body mt-6 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          {dataStoreMode() === "jsonl"
            ? "이 컴퓨터에 저장된 질문만 보입니다. 공개 사이트에서 넣은 질문은 여기에 없습니다."
            : dataStoreMode() === "readonly"
              ? "배포 저장소 키가 없어 질문을 받을 수 없습니다."
              : "아직 질문이 없습니다. 표가 없다면 Supabase SQL Editor에서 board_questions 마이그레이션을 실행해 주세요."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-ink-10 overflow-hidden rounded-[6px] border border-ink-15 bg-white">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/board/${row.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-ink-05">
                <div>
                  <p className="adm-body text-forest">{row.title}</p>
                  <p className="adm-meta mt-1 text-ink-70">
                    {row.name} · {row.createdAt.slice(0, 10)}
                  </p>
                </div>
                <span className="adm-meta text-ink-70">
                  {row.published ? "공개" : row.answer ? "답변 있음" : "대기"}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
