"use client";

import { useActionState } from "react";

import { unlockPost, type BoardUnlockState } from "@/app/(site)/board-actions";

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none focus:border-forest";

export function UnlockForm({ id }: { id: string }) {
  const [state, action, pending] = useActionState(unlockPost, { status: "idle" } satisfies BoardUnlockState);

  return (
    <form action={action} className="mt-10 max-w-md">
      <input type="hidden" name="id" value={id} />
      <p className="b2 text-ink-90">비밀글입니다. 글을 쓸 때 정한 비밀번호를 입력하세요.</p>
      <label className="mt-6 block">
        <span className="c1 mb-2 block text-forest-70">비밀번호</span>
        <input name="password" type="password" required className={inputClass} />
      </label>
      {state.status === "error" ? <p className="b3 mt-4 text-[#c0392b]">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="serif mt-8 h-11 rounded-sm bg-forest px-6 text-white disabled:opacity-60"
      >
        {pending ? "확인 중…" : "글 보기"}
      </button>
    </form>
  );
}
