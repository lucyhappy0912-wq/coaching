import type { CmsSite } from "@/lib/cms/types";
import { FOOTER_LINKS, SITE } from "@/lib/site";

export function Footer({ site = SITE }: { site?: CmsSite }) {
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

        {FOOTER_LINKS.map((group) => (
          <nav key={group.title} className="text-[13px] lg:text-[15px]">
            <p className="lined mb-4 inline-block">{group.title}</p>
            <ul className="space-y-1.5">
              {group.items.map((item) => (
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
