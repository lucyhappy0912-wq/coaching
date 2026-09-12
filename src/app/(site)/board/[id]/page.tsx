import Link from "next/link";
import { notFound } from "next/navigation";

import { SectionPage } from "@/components/layout/PageFrame";
import { getPost } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function BoardDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const post = await getPost(id, true);
  if (!post) notFound();
  return (
    <SectionPage>
      <article className="px-(--gutter) py-16 lg:py-20">
        <Link href="/board" className="b3 text-forest underline-offset-2 hover:underline">
          목록으로
        </Link>
        <h1 className="t2 mt-6">{post.title}</h1>
        <p className="b3 mt-3 text-ink-70">{post.createdAt.slice(0, 10)}</p>
        <div className="b2 mt-10 max-w-3xl whitespace-pre-wrap text-ink-90">{post.body}</div>
      </article>
    </SectionPage>
  );
}
