import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteCheck } from "@/app/admin/checks/actions";
import { AdminCheckAreas } from "@/app/admin/checks/AdminCheckAreas";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { CheckReport } from "@/components/check/CheckReport";
import { requireAdmin } from "@/lib/auth/dal";
import { BAND_COPY } from "@/lib/check/copy";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { getCheckForAdmin } from "@/lib/check/store";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VIEWS = [
  { id: "answers", label: "영역 응답", href: "" },
  { id: "top", label: "상위 3개 분석지", href: "?view=top" },
  { id: "full", label: "전체 분석지", href: "?view=full" },
] as const;

type AdminCheckView = (typeof VIEWS)[number]["id"];

function parseView(value: string | undefined): AdminCheckView {
  if (value === "top" || value === "full") return value;
  return "answers";
}

export default async function AdminCheckDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ view?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  const { view: viewParam } = await searchParams;
  const view = parseView(viewParam);
  const found = await getCheckForAdmin(id);
  if (!found) notFound();

  const { record, scores } = found;
  const band = BAND_COPY[scores.band];

  return (
    <AdminShell title="문답 · 상세">
      <p className="adm-body mb-6">
        <Link href="/admin/checks" className="text-forest underline-offset-2 hover:underline">
          목록으로
        </Link>
      </p>

      <section className="rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">응답자</h2>
        <p className="adm-body mt-2 text-ink-70">
          {band.label} · 총점 {scores.total}점
        </p>
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
            <dt className="adm-label text-forest-70">Industry (업종)</dt>
            <dd className="adm-body mt-1 text-ink-90">{record.identity.industry || "—"}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">Founder Journey</dt>
            <dd className="adm-body mt-1 text-ink-90">{record.identity.founderJourney || "—"}</dd>
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

      <nav className="mt-6 flex flex-wrap gap-2" aria-label="문답 보기">
        {VIEWS.map((item) => {
          const active = item.id === view;
          return (
            <Link
              key={item.id}
              href={`/admin/checks/${id}${item.href}`}
              className={cn(
                "adm-body rounded-[4px] px-3 py-2",
                active ? "bg-forest text-white" : "border border-ink-15 bg-white text-forest hover:border-forest-30",
              )}
            >
              {item.label}
            </Link>
          );
        })}
        <Link
          href={`/admin/checks/${id}/edit`}
          className="adm-body rounded-[4px] border border-ink-15 bg-white px-3 py-2 text-forest hover:border-forest-30"
        >
          수정
        </Link>
        <a
          href="#purge"
          className="adm-body rounded-[4px] border border-danger/30 bg-white px-3 py-2 text-danger"
        >
          파기
        </a>
      </nav>

      {view === "answers" ? <AdminCheckAreas answers={record.answers} scores={scores} /> : null}

      {view === "top" ? (
        <div className="mt-6">
          <CheckReport scores={scores} showCta={false} variant="priority" />
        </div>
      ) : null}

      {view === "full" ? (
        <div className="mt-6">
          <CheckReport scores={scores} showCta={false} variant="full" />
        </div>
      ) : null}

      <form
        id="purge"
        action={deleteCheck}
        className="mt-16 scroll-mt-6 rounded-[6px] border border-danger/30 bg-white p-5"
      >
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
