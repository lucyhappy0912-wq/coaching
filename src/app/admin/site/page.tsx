import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { authWritable } from "@/lib/auth/material";
import { cmsWritable } from "@/lib/cms/client";
import { getContent } from "@/lib/cms/store";

import { SiteForms } from "./SiteForms";

export const dynamic = "force-dynamic";

export default async function AdminSitePage() {
  await requireAdmin();
  const content = await getContent();

  return (
    <AdminShell title="사이트">
      <p className="adm-body mb-6 text-ink-70">
        자주 묻는 질문은{" "}
        <Link href="/admin/faq" className="text-forest underline-offset-2 hover:underline">
          자주 묻는 질문
        </Link>
        에서 고칩니다.
      </p>
      <SiteForms
        site={content.site}
        coach={content.coach}
        canSave={cmsWritable()}
        canChangePassword={authWritable()}
      />
    </AdminShell>
  );
}
