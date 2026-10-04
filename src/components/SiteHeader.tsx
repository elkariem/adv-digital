import Link from "next/link";
import { t, tx, type Locale } from "@/lib/i18n";
import { NAV_LINKS, isActive } from "@/lib/nav-links";
import { BrandLogo } from "./BrandLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { MobileNav } from "./MobileNav";

/**
 * Fixed navbar. It shares the hero's burgundy and carries no bottom border or
 * divider, so navbar and hero read as one continuous surface with no seam.
 */
export function SiteHeader({
  locale,
  currentPath,
}: {
  locale: Locale;
  /** Path of the page being rendered, e.g. "/track". Used to mark the active nav item. */
  currentPath: string;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-burgundy text-ivory">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-24 lg:px-10">
        <Link href="/" className="shrink-0">
          <BrandLogo locale={locale} tone="dark" />
        </Link>

        <nav
          aria-label={tx(locale, t.nav.primaryLabel)}
          className="hidden lg:flex lg:items-center lg:gap-6 xl:gap-8"
        >
          {NAV_LINKS.map((link, index) => {
            const active = isActive(link.href, link.isPage, currentPath);
            const label = tx(locale, t.nav[link.key]);

            // Refined separator before the tracking link, no heavy pill.
            const separator =
              link.featured && index > 0 ? (
                <span
                  key={`${link.href}-sep`}
                  aria-hidden="true"
                  className="h-5 w-px bg-ivory/25"
                />
              ) : null;

            const content = link.isPage ? (
              <Link
                key={link.href}
                href={link.href}
                aria-current={active ? "page" : undefined}
                className={linkClasses(link.featured, active)}
              >
                {label}
              </Link>
            ) : (
              <a key={link.href} href={link.href} className={linkClasses(link.featured, false)}>
                {label}
              </a>
            );

            return (
              <span key={link.href} className="flex items-center gap-6 xl:gap-8">
                {separator}
                {content}
              </span>
            );
          })}
        </nav>

        <div className="flex items-center gap-3">
          <LanguageSwitcher locale={locale} tone="dark" />
          <MobileNav locale={locale} currentPath={currentPath} />
        </div>
      </div>
    </header>
  );
}

/** Gold is the primary active indicator; the tracking link is gold by default. */
function linkClasses(featured: boolean, active: boolean) {
  if (featured) {
    return [
      "inline-flex items-center rounded-full px-3 py-2 text-[0.95rem] font-semibold transition-colors",
      active
        ? "bg-gold text-burgundy-deep"
        : "border border-gold/55 text-gold hover:border-gold hover:bg-gold hover:text-burgundy-deep",
    ].join(" ");
  }

  return [
    "inline-flex items-center py-2 text-[0.95rem] font-medium transition-colors",
    active
      ? "text-gold"
      : "text-ivory/80 hover:text-gold",
  ].join(" ");
}