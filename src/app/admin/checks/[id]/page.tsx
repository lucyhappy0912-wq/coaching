import Link from "next/link";
import { notFound } from "next/navigation";

import { deleteCheck } from "@/app/admin/checks/actions";
import { AdminCheckAreas } from "@/app/admin/checks/AdminCheckAreas";
import { AdminPauseAnswers } from "@/app/admin/checks/AdminPauseAnswers";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { CheckResultView } from "@/components/check/CheckResultView";
import { PauseResultView } from "@/components/pause/PauseResultView";
import { Container } from "@/components/ui/Container";
import { requireAdmin } from "@/lib/auth/dal";
import { BAND_COPY } from "@/lib/check/copy";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { getCheckForAdmin, getPauseCheckForAdmin } from "@/lib/check/store";
import { PAUSE_BAND_COPY } from "@/lib/pause/copy";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";

const VIEWS = [
  { id: "answers", label: "영역 응답", href: "" },
  { id: "report", label: "분석지", href: "?view=report" },
] as const;

type AdminCheckView = (typeof VIEWS)[number]["id"];

function parseView(value: string | undefined): AdminCheckView {
  if (value === "report") return value;
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
  const [founder, pause] = await Promise.all([getCheckForAdmin(id), getPauseCheckForAdmin(id)]);
  if (!founder && !pause) notFound();

  const isPause = Boolean(pause);
  const name = founder?.record.identity.name ?? pause!.record.identity.name;
  const phone = founder?.record.identity.phone ?? pause!.record.identity.phone;
  const email = founder?.record.identity.email ?? pause!.record.identity.email;
  const contactConsent =
    founder?.record.identity.contactConsent ?? pause!.record.identity.contactConsent;
  const source = founder?.record.source ?? pause!.record.source;
  const purgeAt = founder?.record.purgeAt ?? pause!.record.purgeAt;
  const total = founder?.scores.total ?? pause!.scores.total;
  const bandLabel = founder
    ? (BAND_COPY[founder.scores.band]?.label ?? founder.scores.band)
    : (PAUSE_BAND_COPY[pause!.scores.band]?.label ?? pause!.scores.band);
  const recordId = founder?.record.id ?? pause!.record.id;

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
          {isPause ? "PAUSE CHECK" : "Founder Transition"} · {bandLabel} · 총점 {total}점
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2">
          <div>
            <dt className="adm-label text-forest-70">이름</dt>
            <dd className="adm-body mt-1 text-ink-90">{name}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">전화</dt>
            <dd className="adm-body mt-1 text-ink-90">{formatPhoneDisplay(phone)}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">이메일</dt>
            <dd className="adm-body mt-1 break-all text-ink-90">{email}</dd>
          </div>
          {founder?.record.identity.industry ? (
            <div>
              <dt className="adm-label text-forest-70">Industry (업종)</dt>
              <dd className="adm-body mt-1 whitespace-nowrap text-ink-90">
                {founder.record.identity.industry}
              </dd>
            </div>
          ) : null}
          {founder?.record.identity.founderJourney ? (
            <div>
              <dt className="adm-label text-forest-70">Founder Journey</dt>
              <dd className="adm-body mt-1 whitespace-nowrap text-ink-90">
                {founder.record.identity.founderJourney}
              </dd>
            </div>
          ) : null}
          <div>
            <dt className="adm-label text-forest-70">프로그램 연락</dt>
            <dd className="adm-body mt-1 text-ink-90">{contactConsent ? "동의" : "거부"}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">출처</dt>
            <dd className="adm-body mt-1 text-ink-90">{source}</dd>
          </div>
          <div>
            <dt className="adm-label text-forest-70">파기 예정</dt>
            <dd className="adm-body mt-1 text-ink-90">{purgeAt.slice(0, 10)}</dd>
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
              {isPause && item.id === "answers" ? "문항 응답" : item.label}
            </Link>
          );
        })}
        {founder ? (
          <Link
            href={`/admin/checks/${id}/edit`}
            className="adm-body rounded-[4px] border border-ink-15 bg-white px-3 py-2 text-forest hover:border-forest-30"
          >
            수정
          </Link>
        ) : null}
        <a
          href="#purge"
          className="adm-body rounded-[4px] border border-danger/30 bg-white px-3 py-2 text-danger"
        >
          파기
        </a>
      </nav>

      {view === "answers" && founder ? (
        <AdminCheckAreas answers={founder.record.answers} scores={founder.scores} />
      ) : null}
      {view === "answers" && pause ? (
        <AdminPauseAnswers answers={pause.record.answers} scores={pause.scores} />
      ) : null}

      {view === "report" && founder ? (
        <div className="mt-6 bg-grass-10 py-8 sm:py-16 lg:py-24">
          <Container className="mx-auto max-w-3xl">
            <CheckResultView
              name={founder.record.identity.name}
              scores={founder.scores}
              showCta
              applicant={founder.record.identity}
            />
          </Container>
        </div>
      ) : null}
      {view === "report" && pause ? (
        <div className="mt-6 bg-grass-10 py-8 sm:py-16 lg:py-24">
          <Container className="mx-auto max-w-3xl">
            <PauseResultView name={pause.record.identity.name} scores={pause.scores} />
          </Container>
        </div>
      ) : null}

      <form
        id="purge"
        action={deleteCheck}
        className="mt-16 scroll-mt-6 rounded-[6px] border border-danger/30 bg-white p-5"
      >
        <input type="hidden" name="id" value={recordId} />
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
