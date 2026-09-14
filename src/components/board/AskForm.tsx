"use client";

import { useActionState, useState } from "react";

import { submitQuestion, type BoardAskState } from "@/app/(site)/board-actions";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { cn } from "@/lib/utils";

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

export function AskForm() {
  const [state, action, pending] = useActionState(submitQuestion, { status: "idle" } satisfies BoardAskState);
  const [isPrivate, setPrivate] = useState(false);

  return (
    <form action={action} className="border border-ink-10 bg-white p-6 lg:p-8">
      <HoneypotField />
      <div className="space-y-6">
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">제목</span>
          <input name="title" required className={inputClass} />
        </label>
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">이름</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="b3 flex items-center gap-2 text-ink-90">
          <input
            type="checkbox"
            name="secret"
            value="on"
            checked={isPrivate}
            onChange={(event) => setPrivate(event.target.checked)}
          />
          비밀글
        </label>
        {isPrivate ? (
          <label className="block">
            <span className="c1 mb-2 block text-forest-70">비밀번호</span>
            <input name="password" type="password" required minLength={4} maxLength={20} className={inputClass} />
          </label>
        ) : null}
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">내용</span>
          <textarea name="body" required rows={8} className={cn(inputClass, "resize-none")} />
        </label>
      </div>
      {state.status === "error" ? <p className="b3 mt-4 text-[#c0392b]">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="serif mt-8 h-11 rounded-sm bg-forest px-6 text-white disabled:opacity-60"
      >
        {pending ? "올리는 중…" : "등록"}
      </button>
    </form>
  );
}
