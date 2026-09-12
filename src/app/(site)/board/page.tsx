import Link from "next/link";

import { SectionPage } from "@/components/layout/PageFrame";
import { listPosts } from "@/lib/cms/store";

export const dynamic = "force-dynamic";

export default async function BoardPage() {
  const posts = await listPosts(true);
  return (
    <SectionPage>
      <section className="px-(--gutter) py-16 lg:py-20">
        <p className="c1 tracking-[0.2em] text-stem uppercase">Board</p>
        <h1 className="t2 mt-3">소식</h1>
        {posts.length === 0 ? (
          <p className="b3 mt-8 text-ink-70">아직 발행된 글이 없습니다.</p>
        ) : (
          <ul className="mt-10 divide-y divide-ink-10 border-t border-ink-10">
            {posts.map((post) => (
              <li key={post.id} className="py-5">
                <Link href={`/board/${post.id}`} className="serif text-[20px] text-forest hover:opacity-60">
                  {post.title}
                </Link>
                <p className="b3 mt-2 text-ink-70">{post.createdAt.slice(0, 10)}</p>
              </li>
            ))}
          </ul>
        )}
      </section>
    </SectionPage>
  );
}
