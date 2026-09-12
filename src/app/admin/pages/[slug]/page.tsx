import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsWritable } from "@/lib/cms/client";
import { PAGE_META, pageSlice } from "@/lib/cms/page-keys";
import { getContent } from "@/lib/cms/store";
import { PAGE_KEYS, type PageKey } from "@/lib/cms/types";

import { PagesEditor } from "../PagesEditor";

export const dynamic = "force-dynamic";

export default async function AdminPageEditor({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  if (!PAGE_KEYS.includes(slug as PageKey)) notFound();
  const key = slug as PageKey;
  const meta = PAGE_META.find((item) => item.slug === key);
  const content = await getContent();

  return (
    <AdminShell title={meta?.title ?? "페이지"} wide>
      <PagesEditor slug={key} initial={pageSlice(content.pages, key)} canSave={cmsWritable()} />
    </AdminShell>
  );
}
