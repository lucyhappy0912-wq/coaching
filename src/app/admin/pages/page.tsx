import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { PAGE_META } from "@/lib/cms/page-keys";

export const dynamic = "force-dynamic";

export default async function AdminPagesIndex() {
  await requireAdmin();
  return (
    <AdminShell title="페이지">
      <p className="adm-body text-ink-70">공개 페이지의 사진·영상·글을 페이지마다 고칩니다.</p>
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {PAGE_META.map((item) => (
          <li key={item.slug}>
            <Link
              href={`/admin/pages/${item.slug}`}
              className="block rounded-[6px] border border-ink-15 bg-white px-4 py-4 text-forest hover:bg-ink-05"
            >
              <p className="adm-h">{item.title}</p>
              <p className="adm-meta mt-1 text-ink-70">{item.preview}</p>
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
