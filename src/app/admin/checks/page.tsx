import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { BAND_COPY } from "@/lib/check/copy";
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
    <AdminShell title="Founder Transition Check">
      <p className="adm-body text-ink-70">
        목록은 가린 이름·연락처만 보여 줍니다. 분석지와 원문은 행을 열어 확인합니다.
      </p>
      {rows.length === 0 ? (
        <p className="adm-body mt-8 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          아직 제출이 없습니다.
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
                      {row.nameMasked}
                    </Link>
                  </td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.phoneMasked}</td>
                  <td className="adm-body px-4 py-3 text-ink-90">{row.emailMasked}</td>
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
