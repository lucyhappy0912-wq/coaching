import Link from "next/link";

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
  const rows = await listChecksForAdmin();

  return (
    <AdminShell title="문답">
      <p className="adm-body text-ink-70">
        이름·전화·이메일·업종·창업 기간은 관리자만 봅니다. 이름을 누르면 문항 답과 분석지가 열립니다.
      </p>
      {rows.length === 0 ? (
        <p className="adm-body mt-8 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          아직 제출이 없습니다. 공개 문답표에서 제출이 끝나면 여기에 고객과 문항 답이 나타납니다.
        </p>
      ) : (
        <div className="mt-6 overflow-x-auto rounded-[6px] border border-ink-15 bg-white">
          <table className="w-full min-w-[720px] text-left">
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
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.id} className="border-b border-ink-10 last:border-0">
                  <td className="adm-meta px-4 py-3 text-ink-70">{formatWhen(row.createdAt)}</td>
                  <td className="px-4 py-3">
                    <Link href={`/admin/checks/${row.id}`} className="adm-body text-forest underline-offset-2 hover:underline">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AdminShell>
  );
}
