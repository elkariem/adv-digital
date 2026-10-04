import Link from "next/link";
import { t, tx } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";

/**
 * Shown for any URL that does not match a route. Rendered inside the root
 * layout, so it keeps the normal chrome (header, footer) and the visitor is
 * never stranded without a way back.
 */
export default async function NotFound() {
  const locale = await getLocale();

  return (
    <>
      <SiteHeader locale={locale} currentPath="" />

      <main id="main" className="relative overflow-hidden bg-ivory pt-32 pb-20 lg:pt-44 lg:pb-28">
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 start-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold/[0.09] blur-3xl"
        />

        <div className="relative mx-auto max-w-2xl px-5 text-center sm:px-6 lg:px-10">
          <p className="font-mono text-6xl font-extrabold tracking-tight text-burgundy/15 sm:text-7xl">
            {tx(locale, t.system.notFoundCode)}
          </p>

          <h1 className="mt-6 text-[1.95rem] leading-[1.2] font-extrabold tracking-tight text-charcoal sm:text-[2.4rem]">
            {tx(locale, t.system.notFoundTitle)}
          </h1>

          <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.9] text-muted">
            {tx(locale, t.system.notFoundBody)}
          </p>

          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/" className="btn btn-primary">
              {tx(locale, t.system.notFoundHomeCta)}
            </Link>
            <Link href="/track" className="btn btn-gold">
              {tx(locale, t.system.notFoundTrackCta)}
            </Link>
          </div>
        </div>
      </main>

      <SiteFooter locale={locale} />
    </>
  );
}