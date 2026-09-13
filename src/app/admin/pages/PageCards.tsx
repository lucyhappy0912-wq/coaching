"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useEffect, useState, useTransition } from "react";

import { PAGE_META } from "@/lib/cms/page-keys";
import { canToggleHref, isMenuHrefOn, nextMenuVisibility } from "@/lib/menu";

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
  const [off, setOff] = useState(menuOff);
  const [onList, setOnList] = useState(menuOn);
  const [pendingHref, setPendingHref] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();

  useEffect(() => {
    setOff(menuOff);
    setOnList(menuOn);
  }, [menuOff, menuOn]);

  function toggle(href: string) {
    if (pending) return;
    if (!canSave) {
      setError("지금은 공개 여부를 저장할 수 없습니다. 저장소 연결을 확인하세요.");
      return;
    }
    const prev = { off, onList };
    const next = nextMenuVisibility(href, off, onList);
    setError(null);
    setOff(next.menuOff);
    setOnList(next.menuOn);
    setPendingHref(href);
    start(async () => {
      const result = await togglePagePublic(href);
      setPendingHref(null);
      if (!result.ok) {
        setOff(prev.off);
        setOnList(prev.onList);
        setError(result.error ?? "바꾸지 못했습니다.");
        return;
      }
      if (result.menuOff && result.menuOn) {
        setOff(result.menuOff);
        setOnList(result.menuOn);
      }
    });
  }

  const groups = [...new Set(PAGE_META.map((item) => item.group))];

  return (
    <>
      {!canSave ? (
        <p className="adm-body mb-4 text-danger">저장소가 없어 눈을 눌러도 공개 여부가 저장되지 않습니다.</p>
      ) : null}
      {error ? <p className="adm-body mb-4 text-danger">{error}</p> : null}
      <div className="mt-8 space-y-8">
        {groups.map((group) => (
          <section key={group}>
            <p className="adm-meta mb-3 tracking-[0.16em] text-ink-70">{group}</p>
            <ul className="grid gap-3 sm:grid-cols-2">
              {PAGE_META.filter((item) => item.group === group).map((item) => {
                const toggleable = canToggleHref(item.href);
                const on = toggleable ? isMenuHrefOn(item.href, off, onList) : true;
                const busy = pending && pendingHref === item.href;
                return (
                  <li key={item.slug} className="flex items-stretch overflow-hidden rounded-[6px] border border-ink-15 bg-white">
                    <Link
                      href={`/admin/pages/${item.slug}`}
                      className="min-w-0 flex-1 px-4 py-4 text-forest hover:bg-ink-05"
                    >
                      <p className="adm-h">{item.title}</p>
                      <p className="adm-body mt-1 text-ink-70">{item.subtitle}</p>
                      {toggleable ? (
                        <p className="adm-meta mt-2 text-ink-70">
                          {on ? "사이트에 공개됨 · 글 수정" : "사이트에서 숨김 · 글 수정"}
                        </p>
                      ) : (
                        <p className="adm-meta mt-2 text-ink-70">항상 공개 · 글 수정</p>
                      )}
                    </Link>
                    {toggleable ? (
                      <button
                        type="button"
                        onClick={(event) => {
                          event.preventDefault();
                          event.stopPropagation();
                          toggle(item.href);
                        }}
                        disabled={busy}
                        aria-pressed={on}
                        aria-label={on ? `${item.title} 숨기기` : `${item.title} 공개하기`}
                        title={on ? "숨기기" : "공개하기"}
                        className="flex w-[4.5rem] shrink-0 flex-col items-center justify-center gap-1 border-l border-ink-15 text-forest hover:bg-ink-05 disabled:opacity-45"
                      >
                        {on ? <Eye className="size-6" strokeWidth={1.6} /> : <EyeOff className="size-6" strokeWidth={1.6} />}
                        <span className="adm-meta">{on ? "공개" : "숨김"}</span>
                      </button>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
      </div>
    </>
  );
}
