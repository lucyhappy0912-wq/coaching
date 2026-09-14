"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CmsSite } from "@/lib/cms/types";
import { DEFAULT_MENU_OFF, isMenuHrefOn, visibleMenuGroups } from "@/lib/menu";
import { SITE } from "@/lib/site";

export function Footer({
  site = SITE,
  menuOff = DEFAULT_MENU_OFF,
  menuOn = [],
}: {
  site?: CmsSite;
  menuOff?: readonly string[];
  menuOn?: readonly string[];
}) {
  const pathname = usePathname();
  if (pathname === "/story") return null;

  return (
    <footer className="bg-white text-forest">
      <div className="grid gap-10 px-(--gutter) pt-24 pb-10 lg:grid-cols-3 lg:gap-16 lg:pt-32 lg:pb-14">
        {visibleMenuGroups(menuOff, menuOn)
          .filter((group) => group.title !== "Transition Coach 대표코치")
          .map((group) => (
          <nav key={group.title}>
            {group.title === "The Moment" && isMenuHrefOn("/coach", menuOff, menuOn) ? (
              <Link
                href="/coach"
                className="c1 mb-8 block tracking-[0.2em] text-stem uppercase transition-opacity hover:opacity-60"
              >
                Transition Coach 대표코치
              </Link>
            ) : null}
            <p className="c1 mb-4 tracking-[0.2em] text-stem uppercase">
              {group.title === "The Moment" ? "Brand" : group.title}
            </p>
            <ul className="space-y-1.5">
              {group.items.map((item) => {
                const href = item.href === "/consult" ? "/lift" : item.href;
                const label = item.href === "/consult" ? "LIFT – Life Architecture" : item.label;
                return (
                <li key={item.href}>
                  {href.startsWith("tel:") || href.startsWith("mailto:") ? (
                    <a href={href} className="serif text-[13px] transition-opacity hover:opacity-60 lg:text-[15px]">
                      {label}
                    </a>
                  ) : (
                    <Link href={href} className="serif text-[13px] transition-opacity hover:opacity-60 lg:text-[15px]">
                      {label}
                    </Link>
                  )}
                </li>
                );
              })}
            </ul>
          </nav>
        ))}
      </div>

      <div className="serif space-y-1 border-t border-ink-10 px-(--gutter) py-8 text-[13px] leading-relaxed text-forest-70 lg:text-[15px]">
        <p>{site.company}</p>
        <p>
          Owner. {site.owner} Business Reg N. {site.bizNo}
        </p>
        <p>
          Tel. {site.phone} Email. {site.email}
        </p>
        <p>Address. {site.addressLine}</p>
        <p className="pt-4">
          <Link href="/privacy" className="transition-opacity hover:opacity-60">
            개인정보처리방침
          </Link>
        </p>
        <p className="pt-4">Made with Respect</p>
      </div>
    </footer>
  );
}
