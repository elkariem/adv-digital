/**
 * Shared by SiteHeader and MobileNav so the two navs can never drift apart.
 *
 * `isPage: false` entries are fragments of the homepage and stay plain anchors
 * so they scroll without a router navigation. `isPage: true` entries are real
 * routes and use next/link, which also lets us mark the active page.
 *
 * `featured` marks the case-tracking link: it is a primary user journey, so it
 * gets its own refined treatment instead of looking like a generic SaaS button.
 */
export const NAV_LINKS = [
  { href: "/#about", key: "about", isPage: false, featured: false },
  { href: "/#services", key: "services", isPage: false, featured: false },
  { href: "/#process", key: "process", isPage: false, featured: false },
  { href: "/track", key: "tracking", isPage: true, featured: true },
  { href: "/#reviews", key: "reviews", isPage: false, featured: false },
  { href: "/#contact", key: "contact", isPage: false, featured: false },
] as const;

/** True when this nav entry points at the page currently being rendered. */
export function isActive(href: string, isPage: boolean, currentPath: string) {
  return isPage && href === currentPath;
}