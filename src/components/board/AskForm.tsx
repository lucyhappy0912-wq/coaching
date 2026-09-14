"use client";

import { useActionState, useState } from "react";
import Link from "next/link";

import { submitQuestion, type BoardAskState } from "@/app/(site)/board-actions";
import { HoneypotField } from "@/components/ui/HoneypotField";
import { cn } from "@/lib/utils";

const inputClass =
  "b2 w-full rounded-none border-0 border-b border-ink-50 bg-transparent pb-2 text-forest outline-none transition-colors placeholder:text-ink-70 focus:border-forest";

export function AskForm() {
  const [state, action, pending] = useActionState(submitQuestion, { status: "idle" } satisfies BoardAskState);
  const [isPrivate, setPrivate] = useState(false);

  if (state.status === "done") {
    return (
      <div className="b2 rounded-[6px] border border-forest-20 bg-white px-5 py-6 text-forest">
        <p>글을 올렸습니다.</p>
        {state.id ? (
          <Link href={`/board/${state.id}`} className="mt-3 inline-block underline-offset-2 hover:underline">
            내 글 보기
          </Link>
        ) : null}
      </div>
    );
  }

  return (
    <form id="write" action={action} className="border border-ink-10 bg-white p-6 lg:p-8">
      <HoneypotField />
      <p className="serif text-[20px] text-forest">글쓰기</p>
      <div className="mt-6 space-y-6">
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">이름</span>
          <input name="name" required autoComplete="name" className={inputClass} />
        </label>
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">제목</span>
          <input name="title" required className={inputClass} />
        </label>
        <label className="block">
          <span className="c1 mb-2 block text-forest-70">내용</span>
          <textarea name="body" required rows={5} className={cn(inputClass, "resize-none")} />
        </label>
        <fieldset className="space-y-3">
          <legend className="c1 text-forest-70">공개</legend>
          <label className="b3 flex items-center gap-2 text-ink-90">
            <input
              type="radio"
              name="visibility"
              value="public"
              checked={!isPrivate}
              onChange={() => setPrivate(false)}
            />
            공개글 · 누구나 읽을 수 있습니다
          </label>
          <label className="b3 flex items-center gap-2 text-ink-90">
            <input
              type="radio"
              name="visibility"
              value="private"
              checked={isPrivate}
              onChange={() => setPrivate(true)}
            />
            비밀글 · 비밀번호를 아는 사람만 본문을 봅니다
          </label>
        </fieldset>
        {isPrivate ? (
          <label className="block">
            <span className="c1 mb-2 block text-forest-70">비밀번호</span>
            <input name="password" type="password" required minLength={4} maxLength={20} className={inputClass} />
          </label>
        ) : null}
      </div>
      {state.status === "error" ? <p className="b3 mt-4 text-[#c0392b]">{state.message}</p> : null}
      <button
        type="submit"
        disabled={pending}
        className="serif mt-8 h-11 rounded-sm bg-forest px-6 text-white disabled:opacity-60"
      >
        {pending ? "올리는 중…" : "글 올리기"}
      </button>
    </form>
  );
}
