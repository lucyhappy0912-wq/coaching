"use client";

import { useState } from "react";

export function MediaUpload() {
  const [message, setMessage] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  return (
    <form
      className="rounded-[6px] border border-ink-15 bg-white p-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        const data = new FormData(form);
        setPending(true);
        setMessage(null);
        const res = await fetch("/api/admin/upload", { method: "POST", body: data });
        const json = (await res.json()) as { url?: string; error?: string };
        setPending(false);
        if (!res.ok) {
          setMessage(json.error ?? "업로드에 실패했습니다.");
          return;
        }
        form.reset();
        setMessage(json.url ? `올렸습니다. URL을 콘텐츠 이미지 칸에 붙여 넣으세요.` : "올렸습니다.");
        window.location.reload();
      }}
    >
      <h2 className="adm-h text-forest">이미지 올리기</h2>
      <p className="adm-body mt-2 text-ink-70">JPG, PNG, WebP · 5MB 이하</p>
      <input
        type="file"
        name="file"
        accept="image/jpeg,image/png,image/webp"
        required
        className="adm-body mt-4 block w-full"
      />
      <button
        type="submit"
        disabled={pending}
        className="adm-body mt-4 h-10 rounded-[4px] bg-forest px-4 font-medium text-white disabled:opacity-45"
      >
        {pending ? "올리는 중…" : "업로드"}
      </button>
      {message ? <p className="adm-body mt-3 text-ink-70">{message}</p> : null}
    </form>
  );
}
