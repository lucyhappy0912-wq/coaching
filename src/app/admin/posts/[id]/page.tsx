import { notFound } from "next/navigation";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { getPost } from "@/lib/cms/store";

import { PostForm } from "../PostForm";

export const dynamic = "force-dynamic";

export default async function AdminEditPostPage({ params }: { params: Promise<{ id: string }> }) {
  await requireAdmin();
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();
  return (
    <AdminShell title="글 수정">
      <PostForm id={post.id} title={post.title} body={post.body} published={post.published} />
    </AdminShell>
  );
}
