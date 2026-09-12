import Link from "next/link";

import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsEnabled } from "@/lib/cms/client";
import { listPosts } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  await requireAdmin();
  const posts = await listPosts();

  return (
    <AdminShell title="소식">
      <div className="mb-6 flex items-center justify-between">
        <p className="adm-body text-ink-70">공개 사이트 소식 게시판에 발행된 글만 보입니다.</p>
        <Link href="/admin/posts/new" className="adm-body rounded-[4px] bg-forest px-4 py-2 text-white">
          새 글
        </Link>
      </div>
      {!cmsEnabled() ? <p className="adm-body mb-4 text-danger">저장소가 연결되지 않았습니다.</p> : null}
      {posts.length === 0 ? (
        <p className="adm-body rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">아직 글이 없습니다.</p>
      ) : (
        <ul className="space-y-2">
          {posts.map((post) => (
            <li key={post.id} className="flex items-center justify-between rounded-[6px] border border-ink-15 bg-white px-4 py-3">
              <Link href={`/admin/posts/${post.id}`} className="adm-body text-forest underline-offset-2 hover:underline">
                {post.title || "(제목 없음)"}
              </Link>
              <span className="adm-meta text-ink-70">{post.published ? "발행" : "초안"}</span>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
