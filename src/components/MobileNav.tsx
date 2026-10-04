"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { t, tx, type Locale } from "@/lib/i18n";
import { NAV_LINKS, isActive } from "@/lib/nav-links";
import { brand } from "@/lib/site";
import { BrandLogo } from "./BrandLogo";

export function MobileNav({
  locale,
  currentPath,
}: {
  locale: Locale;
  /** Mirrors SiteHeader so both navs highlight the same item. */
  currentPath: string;
}) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        className="-me-2 flex h-11 w-11 items-center justify-center rounded-full text-ivory transition-colors duration-300 hover:bg-ivory/10 active:scale-95"
      >
        <span className="sr-only">{tx(locale, t.nav.menu)}</span>
        <svg width="24" height="24" viewBox="0 0 24 24" aria-hidden="true" fill="none">
          <path
            d="M3 6h18M3 12h18M3 18h18"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>
      </button>

      {open ? (
        <div id="mobile-nav" className="fixed inset-0 z-[60]">
          <button
            type="button"
            aria-label={tx(locale, t.nav.close)}
            onClick={() => setOpen(false)}
            className="scrim absolute inset-0 bg-charcoal/55"
          />

          <div className="drawer absolute inset-y-0 end-0 flex w-[min(21rem,88vw)] flex-col overflow-y-auto bg-burgundy text-ivory shadow-2xl">
            <div className="flex items-center justify-between border-b border-ivory/15 px-5 py-4">
              <BrandLogo locale={locale} tone="dark" />
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="-me-2 flex h-11 w-11 items-center justify-center rounded-full text-ivory/80 transition-colors duration-300 hover:bg-ivory/10 active:scale-95"
              >
                <span className="sr-only">{tx(locale, t.nav.close)}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true" fill="none">
                  <path
                    d="M6 6l12 12M18 6L6 18"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>

            <nav className="flex flex-col px-3 py-4">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href, link.isPage, currentPath);
                const label = tx(locale, t.nav[link.key]);

                const inner = (
                  <>
                    {link.featured ? (
                      <span
                        aria-hidden="true"
                        className="h-1.5 w-1.5 shrink-0 rounded-full bg-gold"
                      />
                    ) : null}
                    {label}
                  </>
                );

                const className = link.featured
                  ? [
                      // active:min-h-[3.25rem] keeps the tap target at least
                      // 44px tall even after the active scale-down.
                      "flex min-h-[3.25rem] items-center gap-3 rounded-full px-4 py-3.5 text-base font-semibold transition-all duration-300 active:scale-[0.98]",
                      active
                        ? "bg-gold text-burgundy-deep"
                        : "border border-gold/50 text-gold",
                    ].join(" ")
                  : [
                      "flex min-h-[3.25rem] items-center rounded-full px-4 py-3.5 text-base font-medium transition-colors duration-300 active:bg-ivory/10 active:scale-[0.98]",
                      active ? "text-gold" : "text-ivory/85",
                    ].join(" ");

                const shared = {
                  onClick: () => setOpen(false),
                  className,
                  "aria-current": active ? ("page" as const) : undefined,
                };

                return link.isPage ? (
                  <Link key={link.href} href={link.href} {...shared}>
                    {inner}
                  </Link>
                ) : (
                  <a key={link.href} href={link.href} {...shared}>
                    {inner}
                  </a>
                );
              })}
            </nav>

            <p className="mt-auto border-t border-ivory/15 px-6 py-5 text-sm text-ivory/60">
              {brand[locale]}
            </p>
          </div>
        </div>
      ) : null}
    </div>
  );
}