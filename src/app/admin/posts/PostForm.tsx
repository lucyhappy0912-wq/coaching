import { deletePost, upsertPost } from "./actions";

const field = "adm-input mt-1 h-10 w-full rounded-[4px] border border-ink-50 bg-white px-3 text-forest";
const area = "adm-input mt-1 min-h-48 w-full rounded-[4px] border border-ink-50 bg-white px-3 py-2 text-forest";

export function PostForm({
  id,
  title = "",
  body = "",
  published = false,
}: {
  id?: string;
  title?: string;
  body?: string;
  published?: boolean;
}) {
  return (
    <div className="space-y-6">
      <form action={upsertPost} className="space-y-4 rounded-[6px] border border-ink-15 bg-white p-5">
        {id ? <input type="hidden" name="id" value={id} /> : null}
        <label className="adm-label block text-forest-70">
          제목
          <input className={field} name="title" defaultValue={title} required />
        </label>
        <label className="adm-label block text-forest-70">
          본문
          <textarea className={area} name="body" defaultValue={body} required />
        </label>
        <label className="adm-body flex items-center gap-2 text-forest">
          <input type="checkbox" name="published" defaultChecked={published} />
          사이트에 발행
        </label>
        <button type="submit" className="adm-body h-10 rounded-[4px] bg-forest px-4 font-medium text-white">
          저장
        </button>
      </form>
      {id ? (
        <form action={deletePost}>
          <input type="hidden" name="id" value={id} />
          <button type="submit" className="adm-body text-danger">
            이 글 삭제
          </button>
        </form>
      ) : null}
    </div>
  );
}
