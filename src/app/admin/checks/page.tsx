import { cookies } from "next/headers";
import Link from "next/link";

import { clearCheckSearch, searchChecks } from "@/app/admin/checks/actions";
import { CHECK_NAME_SEARCH_COOKIE } from "@/app/admin/checks/search";
import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { BAND_COPY } from "@/lib/check/copy";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { listChecksForAdmin } from "@/lib/check/store";

export const dynamic = "force-dynamic";

function formatWhen(iso: string) {
  const date = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

export default async function AdminChecksPage() {
  await requireAdmin();
  const q = ((await cookies()).get(CHECK_NAME_SEARCH_COOKIE)?.value ?? "").trim();
  const rows = await listChecksForAdmin(q);

  return (
    <AdminShell title="문답">
      <p className="adm-body text-ink-70">
        이름·전화·이메일·업종·창업 기간은 관리자만 봅니다. 이름은 서버에서만 찾습니다. 파기는 상세에서
        `삭제`를 입력한 뒤에만 됩니다.
      </p>

      <form action={searchChecks} className="mt-6 flex flex-wrap items-end gap-2">
        <label className="block min-w-[220px] flex-1">
          <span className="adm-label mb-1.5 block text-forest-70">이름 검색</span>
          <input
            name="q"
            type="search"
            defaultValue={q}
            maxLength={80}
            autoComplete="off"
            placeholder="이름"
            className="adm-input h-10 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest"
          />
        </label>
        <button
          type="submit"
          className="adm-body h-10 rounded-[4px] bg-forest px-4 font-medium text-white"
        >
          찾기
        </button>
        {q ? (
          <button
            formAction={clearCheckSearch}
            className="adm-body h-10 rounded-[4px] border border-ink-15 bg-white px-4 text-forest"
          >
            검색 해제
          </button>
        ) : null}
      </form>
      {q ? <p className="adm-meta mt-2 text-ink-70">이름에 “{q}”가 포함된 제출</p> : null}

      {rows.length === 0 ? (
        <p className="adm-body mt-8 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          {q
            ? "이름에 맞는 제출이 없습니다."
            : "아직 제출이 없습니다. 공개 문답표에서 제출이 끝나면 여기에 고객과 문항 답이 나타납니다."}
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[6px] border border-ink-15 bg-white">
          <table className="w-full min-w-[860px] text-left">
            <thead>
              <tr className="border-b border-ink-10">
                <th className="adm-label px-4 py-3 text-forest-70">제출</th>
                <th className="adm-label px-4 py-3 text-forest-70">이름</th>
                <th className="adm-label px-4 py-3 text-forest-70">전화</th>
                <th className="adm-label px-4 py-3 text-forest-70">이메일</th>
                <th className="adm-label px-4 py-3 text-forest-70">업종</th>
                <th className="adm-label px-4 py-3 text-forest-70">창업 기간</th>
                <th className="adm-label px-4 py-3 text-forest-70">구간</th>
                <th className="adm-label px-4 py-3 text-forest-70">총점</th>
                <th className="adm-label px-4 py-3 text-forest-70">연락</th>
                <th className="adm-label px-4 py-3 text-forest-70">작업</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-ink-10 last:border-0">
                  <td className="adm-meta px-4 py-3 text-ink-70">{formatWhen(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link
                      href={`/admin/checks/${row.id}`}
                      className="adm-body text-forest underline-offset-2 hover:underline"
                    >
                      {row.name}
                    </Link>
                  </td>
                  <td className="adm-body px-4 py-3 text-ink-90">{formatPhoneDisplay(row.phone)}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.email}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.industry || "—"}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.founderJourney || "—"}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{BAND_COPY[row.band].label}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.total}</td>
                  <td className="adm-meta px-4 py-3 text-ink-70">
                    {row.contactConsent ? "동의" : "거부"}
                  </td>
                  <td className="adm-body px-4 py-3">
                    <Link
                      href={`/admin/checks/${row.id}/edit`}
                      className="text-forest underline-offset-2 hover:underline"
                    >
                      수정
                    </Link>
                    <span className="mx-2 text-ink-30">·</span>
                    <Link
                      href={`/admin/checks/${row.id}#purge`}
                      className="text-danger underline-offset-2 hover:underline"
                    >
                      파기
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
