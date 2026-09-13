"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

import { PAGE_META } from "@/lib/cms/page-keys";
import { canToggleHref, isMenuHrefOn } from "@/lib/menu";

import { togglePagePublic } from "../pages-actions";

export function PageCards({
  menuOff,
  menuOn,
  canSave,
}: {
  menuOff: string[];
  menuOn: string[];
  canSave: boolean;
}) {
  const router = useRouter();
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  function toggle(href: string) {
    if (!canSave || pending) return;
    setError(null);
    setPendingHref(href);
    start(async () => {
      const result = await togglePagePublic(href);
      setPendingHref(null);
      if (!result.ok) {
        setError(result.error ?? "바꾸지 못했습니다.");
        return;
      }
      router.refresh();
    });
  }

  return (
    <>
      {error ? <p className="adm-body mb-4 text-danger">{error}</p> : null}
      <ul className="mt-6 grid gap-3 sm:grid-cols-2">
        {PAGE_META.map((item) => {
          const toggleable = canToggleHref(item.href);
          const on = toggleable ? isMenuHrefOn(item.href, menuOff, menuOn) : true;
          const busy = pending && pendingHref === item.href;
          return (
            <li key={item.slug} className="flex items-stretch overflow-hidden rounded-[6px] border border-ink-15 bg-white">
              <Link
                href={`/admin/pages/${item.slug}`}
                className="min-w-0 flex-1 px-4 py-4 text-forest hover:bg-ink-05"
              >
                <p className="adm-h">{item.title}</p>
                <p className="adm-meta mt-1 text-ink-70">{item.preview}</p>
                {toggleable ? (
                  <p className="adm-meta mt-2 text-ink-70">{on ? "메뉴 공개" : "메뉴 비공개"}</p>
                ) : (
                  <p className="adm-meta mt-2 text-ink-70">항상 공개</p>
                )}
              </Link>
              {toggleable ? (
                <button
                  type="button"
                  onClick={() => toggle(item.href)}
                  disabled={!canSave || busy}
                  aria-pressed={on}
                  aria-label={on ? `${item.title} 비공개` : `${item.title} 공개`}
                  title={on ? "비공개로 바꾸기" : "공개로 바꾸기"}
                  className="flex w-14 shrink-0 items-center justify-center border-l border-ink-15 text-forest hover:bg-ink-05 disabled:opacity-45"
                >
                  {on ? <Eye className="size-5" strokeWidth={1.6} /> : <EyeOff className="size-5" strokeWidth={1.6} />}
                </button>
              ) : null}
            </li>
          );
        })}
      </ul>
    </>
  );
}
