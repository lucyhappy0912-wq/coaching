import { AdminShell } from "@/app/admin/_components/AdminShell";
import { requireAdmin } from "@/lib/auth/dal";
import { cmsEnabled } from "@/lib/cms/client";
import { listMedia } from "@/lib/cms/media";

import { MediaUpload } from "./MediaUpload";
import { deleteMedia } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  await requireAdmin();
  const items = await listMedia();

  return (
    <AdminShell title="이미지">
      {!cmsEnabled() ? (
        <p className="adm-body mb-4 text-danger">저장소가 연결되지 않았습니다.</p>
      ) : null}
      <MediaUpload />
      <ul className="mt-8 space-y-3">
        {items.length === 0 ? (
          <li className="adm-body rounded-[6px] border border-ink-15 bg-white p-5 text-ink-70">
            아직 올린 이미지가 없습니다.
          </li>
        ) : (
          items.map((item) => (
            <li key={item.name} className="flex items-center gap-4 rounded-[6px] border border-ink-15 bg-white p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.url} alt="" className="size-16 rounded-[4px] object-cover" />
              <div className="min-w-0 flex-1">
                <p className="adm-body break-all text-ink-90">{item.name}</p>
                <p className="adm-meta mt-1 break-all text-ink-70">{item.url}</p>
              </div>
              <form action={deleteMedia}>
                <input type="hidden" name="name" value={item.name} />
                <button type="submit" className="adm-body text-danger">
                  삭제
                </button>
              </form>
            </li>
          ))
        )}
      </ul>
    </AdminShell>
  );
}
