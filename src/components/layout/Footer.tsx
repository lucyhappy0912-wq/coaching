"use client";

import { usePathname } from "next/navigation";

import type { CmsSite } from "@/lib/cms/types";
import { DEFAULT_MENU_OFF, isMenuHrefOn } from "@/lib/menu";
import { FOOTER_LINKS, SITE } from "@/lib/site";

function footerNav(site: CmsSite) {
  const brand = FOOTER_LINKS.find((group) => group.title === "Brand");
  return [
    ...(brand ? [brand] : []),
    {
      title: "Help",
      items: [
        { label: "Founder Transition", href: "/coaching/founder-transition" },
        { label: "Founder Transition Check", href: "/check" },
        { label: "개인정보처리방침", href: "/privacy" },
        { label: site.email, href: `mailto:${site.email}` },
        { label: site.phone, href: `tel:${site.phone.replace(/-/g, "")}` },
      ],
    },
  ];
}

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
    <footer className="bg-linear-to-b from-white to-grass-20 pt-24 pb-10 lg:pt-32">
      <div className="serif grid gap-10 px-(--gutter) text-forest lg:grid-cols-[1.6fr_1fr_1fr]">
        <div className="space-y-1 text-[13px] leading-relaxed lg:text-[15px]">
          <p>{site.company}</p>
          <p>
            Owner. {site.owner} Business Reg N. {site.bizNo}
          </p>
          <p>
            Tel. {site.phone} Email. {site.email}
          </p>
          <p>Address. {site.addressLine}</p>
        </div>

        {footerNav(site).map((group) => (
          <nav key={group.title} className="text-[13px] lg:text-[15px]">
            <p className="lined mb-4 inline-block">{group.title}</p>
            <ul className="space-y-1.5">
              {group.items.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)).map((item) => (
                <li key={item.label}>
                  <a href={item.href} className="transition-opacity hover:opacity-60">
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="serif mt-16 px-(--gutter) text-[13px] text-forest-70">
        <p>Made with Respect</p>
      </div>
    </footer>
  );
}
