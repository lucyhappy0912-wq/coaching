import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { maskName, maskPhone } from "@/lib/check/mask";
import { dataStoreMode } from "@/lib/check/store-mode";
import { isLiftLead, LIFT_MESSAGE } from "@/lib/leads/kind";
import { listLeadsForAdmin, setLeadStatus } from "@/lib/leads/store";

export const dynamic = "force-dynamic";

const STATUS: Record<string, string> = {
  new: "신규",
  contacted: "연락함",
  closed: "종료",
};

export default async function AdminLiftPage() {
  await requireAdmin();
  const all = await listLeadsForAdmin();
  const rows = all.filter(isLiftLead);
  await Promise.all(
    rows.filter((row) => row.status === "new").map((row) => setLeadStatus(row.id, "contacted")),
  );

  return (
    <AdminShell title="LIFT 신청">
      <p className="adm-body text-ink-70">
        분석지에서 {LIFT_MESSAGE} 신청하기를 누른 응답자입니다. 목록에서는 연락처를 가립니다.
      </p>
      {rows.length === 0 ? (
        <p className="adm-body mt-6 rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
          {dataStoreMode() === "jsonl"
            ? "이 컴퓨터에 저장된 LIFT 신청만 보입니다. 공개 사이트에서 넣은 신청은 여기에 없습니다."
            : dataStoreMode() === "readonly"
              ? "배포 저장소 키가 없어 신청을 받을 수 없습니다."
              : "아직 LIFT 신청이 없습니다."}
        </p>
      ) : (
        <ul className="mt-6 divide-y divide-ink-10 overflow-hidden rounded-[6px] border border-ink-15 bg-white">
          {rows.map((row) => (
            <li key={row.id}>
              <Link href={`/admin/inquiries/${row.id}`} className="flex items-center justify-between gap-4 px-4 py-4 hover:bg-ink-05">
                <div>
                  <p className="adm-body text-forest">{maskName(row.name)}</p>
                  <p className="adm-meta mt-1 text-ink-70">
                    {maskPhone(row.phone)} · {row.receivedAt.slice(0, 10)}
                  </p>
                </div>
                <span className="adm-meta text-ink-70">{STATUS[row.status] ?? row.status}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
