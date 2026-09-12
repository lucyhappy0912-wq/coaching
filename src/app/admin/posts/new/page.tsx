import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";

import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function AdminNewPostPage() {
  await requireAdmin();
  return (
    <AdminShell title="새 글">
      <PostForm />
    </AdminShell>
  );
}
