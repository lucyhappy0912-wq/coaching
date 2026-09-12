import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { listChecksForAdmin } from "@/lib/check/store";
import { formatPhoneDisplay } from "@/lib/check/mask";
import { cmsEnabled } from "@/lib/cms/client";
import { listMembers } from "@/lib/cms/store";

import { createMember, deleteMember } from "./actions";

export const dynamic = "force-dynamic";

const field = "adm-input mt-1 h-10 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest";

export default async function AdminMembersPage() {
  await requireAdmin();
  const [manual, checks] = await Promise.all([listMembers(), listChecksForAdmin()]);

  return (
    <AdminShell title="회원">
      <p className="adm-body text-ink-70">
        문답표 제출자와 직접 등록한 연락처를 함께 봅니다. 문항 답은 문답표 메뉴에서 엽니다.
      </p>

      <section className="mt-8 rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">직접 등록</h2>
        {!cmsEnabled() ? <p className="adm-body mt-2 text-danger">저장소가 없어 직접 등록은 저장되지 않습니다.</p> : null}
        <form action={createMember} className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="adm-label text-forest-70">이름<input className={field} name="name" required /></label>
          <label className="adm-label text-forest-70">전화<input className={field} name="phone" /></label>
          <label className="adm-label text-forest-70">이메일<input className={field} name="email" type="email" /></label>
          <label className="adm-label text-forest-70">메모<input className={field} name="note" /></label>
          <button type="submit" className="adm-body h-10 rounded-[4px] bg-forest px-4 font-medium text-white sm:col-span-2">
            회원 추가
          </button>
        </form>
        <ul className="mt-6 space-y-2">
          {manual.map((row) => (
            <li key={row.id} className="flex items-center justify-between border-t border-ink-10 py-3">
              <div>
                <p className="adm-body text-ink-90">{row.name}</p>
                <p className="adm-meta text-ink-70">
                  {formatPhoneDisplay(row.phone)} · {row.email} {row.note ? `· ${row.note}` : ""}
                </p>
              </div>
              <form action={deleteMember}>
                <input type="hidden" name="id" value={row.id} />
                <button type="submit" className="adm-body text-danger">
                  삭제
                </button>
              </form>
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8 rounded-[6px] border border-ink-15 bg-white p-5">
        <h2 className="adm-h text-forest">문답표 제출</h2>
        {checks.length === 0 ? (
          <p className="adm-body mt-3 text-ink-70">아직 제출이 없습니다.</p>
        ) : (
          <ul className="mt-3 space-y-2">
            {checks.map((row) => (
              <li key={row.id} className="flex items-center justify-between border-t border-ink-10 py-3">
                <div>
                  <Link href={`/admin/checks/${row.id}`} className="adm-body text-forest underline-offset-2 hover:underline">
                    {row.name}
                  </Link>
                  <p className="adm-meta text-ink-70">
                    {formatPhoneDisplay(row.phone)} · {row.email} · {row.total}점
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </AdminShell>
  );
}
