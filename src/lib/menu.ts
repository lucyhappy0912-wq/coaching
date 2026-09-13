import { MENU_GROUPS } from "@/lib/site";

/** 메뉴에서 기본으로 내려 두는 코칭 페이지. 관리자가 직접 켜기 전에는 공개하지 않는다. */
export const DEFAULT_MENU_OFF = [
  "/coaching/next-chapter",
  "/coaching/founder",
  "/coaching/leadership",
] as const;

export type MenuItem = { label: string; href: string };
export type MenuGroup = { title: string; items: MenuItem[] };

export function menuToggleItems() {
  return MENU_GROUPS.flatMap((group) =>
    group.items
      .filter((item) => !item.href.startsWith("tel:") && !item.href.startsWith("mailto:"))
      .map((item) => ({ group: group.title, label: item.label, href: item.href })),
  );
}

const TOGGLE_HREFS: ReadonlySet<string> = new Set(menuToggleItems().map((item) => item.href));
const DEFAULT_HIDDEN: ReadonlySet<string> = new Set(DEFAULT_MENU_OFF);

export function canToggleHref(href: string) {
  return TOGGLE_HREFS.has(href);
}

export function sanitizeMenuOff(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [...DEFAULT_MENU_OFF];
  return [
    ...new Set(
      raw.filter((href): href is string => typeof href === "string" && TOGGLE_HREFS.has(href)),
    ),
  ];
}

export function sanitizeMenuOn(raw: unknown): string[] {
  if (!Array.isArray(raw)) return [];
  return [
    ...new Set(
      raw.filter((href): href is string => typeof href === "string" && DEFAULT_HIDDEN.has(href)),
    ),
  ];
}

export function isMenuHrefOn(href: string, menuOff: readonly string[], menuOn: readonly string[] = []) {
  if (DEFAULT_HIDDEN.has(href)) return menuOn.includes(href);
  return !menuOff.includes(href);
}

export function nextMenuVisibility(
  href: string,
  menuOff: readonly string[],
  menuOn: readonly string[],
): { menuOff: string[]; menuOn: string[] } {
  if (!TOGGLE_HREFS.has(href)) return { menuOff: [...menuOff], menuOn: [...menuOn] };
  const on = isMenuHrefOn(href, menuOff, menuOn);
  if (DEFAULT_HIDDEN.has(href)) {
    return {
      menuOff: [...menuOff],
      menuOn: on ? menuOn.filter((item) => item !== href) : [...menuOn, href],
    };
  }
  return {
    menuOn: [...menuOn],
    menuOff: on ? [...menuOff, href] : menuOff.filter((item) => item !== href),
  };
}

export function visibleMenuGroups(menuOff: readonly string[], menuOn: readonly string[] = []): MenuGroup[] {
  return MENU_GROUPS.map((group) => ({
    title: group.title,
    items: group.items.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn)),
  })).filter((group) => group.items.length > 0);
}

export function visibleByHref<T extends { href: string }>(
  items: readonly T[],
  menuOff: readonly string[],
  menuOn: readonly string[] = [],
) {
  return items.filter((item) => isMenuHrefOn(item.href, menuOff, menuOn));
}
