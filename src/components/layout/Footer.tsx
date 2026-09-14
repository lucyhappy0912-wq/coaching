"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import type { CmsSite } from "@/lib/cms/types";
import { DEFAULT_MENU_OFF, visibleMenuGroups } from "@/lib/menu";
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
        {visibleMenuGroups(menuOff, menuOn).map((group) => (
          <nav key={group.title}>
            <p className="c1 mb-5 tracking-[0.2em] text-stem uppercase">{group.title}</p>
            <ul className="space-y-3.5">
              {group.items.map((item) => (
                <li key={item.href}>
                  {item.href.startsWith("tel:") || item.href.startsWith("mailto:") ? (
                    <a
                      href={item.href}
                      className="serif text-[22px] leading-none transition-opacity hover:opacity-50 lg:text-[26px]"
                    >
                      {item.label}
                    </a>
                  ) : (
                    <Link
                      href={item.href}
                      className="serif text-[22px] leading-none transition-opacity hover:opacity-50 lg:text-[26px]"
                    >
                      {item.label}
                    </Link>
                  )}
                </li>
              ))}
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
