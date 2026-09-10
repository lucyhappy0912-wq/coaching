import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteCheck } from "@/app/admin/checks/actions";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { CheckReport } from "@/components/check/CheckReport";
import { requireAdmin } from "@/lib/auth/dal";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { AREAS, LIKERT_LABELS, QUESTIONS } from "@/lib/check/questions";
import { getCheckForAdmin } from "@/lib/check/store";

export const dynamic = "force-dynamic";

export default async function AdminCheckDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const found = await getCheckForAdmin(id);
  if (!found) notFound();

  const { record, scores } = found;

  return (
    <AdminShell title="분석지 · 응답">
      <p className="adm-body mb-6">
        <Link href="/admin/checks" className="text-forest underline-offset-2 hover:underline">
          목록으로
        </Link>
      </p>

      <section className="rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">응답자</h2>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="adm-label text-forest-70">이름</dt>
            <dd className="adm-body mt-1 text-ink-90">{record.identity.name}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">전화</dt>
            <dd className="adm-body mt-1 text-ink-90">{formatPhoneDisplay(record.identity.phone)}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">이메일</dt>
            <dd className="adm-body mt-1 break-all text-ink-90">{record.identity.email}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">프로그램 연락</dt>
            <dd className="adm-body mt-1 text-ink-90">
              {record.identity.contactConsent ? "동의" : "거부"}
            </dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">출처</dt>
            <dd className="adm-body mt-1 text-ink-90">{record.source}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">파기 예정</dt>
            <dd className="adm-body mt-1 text-ink-90">{record.purgeAt.slice(0, 10)}</dd>
          </div>
        </dl>
      </section>

      <section className="mt-6 rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">문항별 답</h2>
        <ol className="mt-4 space-y-5">
          {QUESTIONS.map((q) => {
            const score = record.answers[q.key];
            const choice = LIKERT_LABELS.find((item) => item.value === score)?.label ?? "";
            return (
              <li key={q.key} className="border-b border-ink-10 pb-4 last:border-0 last:pb-0">
                <p className="adm-label text-forest-70">
                  {String(q.no).padStart(2, "0")} · {AREAS[q.area].title} · {q.label}
                </p>
                <p className="adm-body mt-2 text-ink-90">{q.prompt}</p>
                <p className="adm-body mt-2 font-medium text-forest">
                  {score}점 · {choice}
                </p>
              </li>
            );
          })}
        </ol>
      </section>

      <div className="mt-10">
        <CheckReport scores={scores} showCta={false} />
      </div>

      <form action={deleteCheck} className="mt-16 rounded-[6px] border border-danger/30 bg-white p-5">
        <input type="hidden" name="id" value={record.id} />
        <h2 className="adm-h text-danger">이 제출 파기</h2>
        <p className="adm-body mt-2 text-ink-70">
          복구할 수 없습니다. 확인하려면 아래 칸에 삭제 라고 입력하세요.
        </p>
        <input
          name="confirm"
          className="adm-input mt-4 h-10 w-full max-w-xs rounded-[4px] border border-ink-50 bg-white px-3 text-forest"
          autoComplete="off"
        />
        <button
          type="submit"
          className="adm-body mt-4 h-9 rounded-[4px] bg-danger px-4 font-medium text-white"
        >
          파기
        </button>
      </form>
    </AdminShell>
  );
}
