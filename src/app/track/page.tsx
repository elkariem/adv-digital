import type { Metadata } from "next";
import { getLocale } from "@/lib/locale";
import { t, tx } from "@/lib/i18n";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Reveal } from "@/components/Reveal";
import { CaseTracker } from "@/components/CaseTracker";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: tx(locale, t.tracking.title),
    description: tx(locale, t.tracking.intro),
  };
}

/**
 * Public case tracking. No authentication: anyone with a case code can open it.
 * Results are served through /api/track, which applies the tracking rate limit.
 */
export default async function TrackPage() {
  const locale = await getLocale();

  return (
    <>
      {/* The navbar is burgundy, so the page opens on burgundy too and the two
          read as one continuous surface rather than a bar sitting on a page. */}
      <SiteHeader locale={locale} currentPath="/track" />

      <div className="relative overflow-hidden bg-burgundy pt-28 pb-20 sm:pt-32 lg:pt-40 lg:pb-28">
        {/* Tonal fields that echo the homepage, kept low-contrast so the
            heading stays the focus. */}
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -top-40 start-[-10rem] h-[30rem] w-[30rem] rounded-full bg-burgundy-accent/30 blur-3xl"
        />
        <span
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-52 end-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold/12 blur-3xl"
        />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/10 px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-gold">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" aria-hidden="true" />
              {tx(locale, t.tracking.eyebrow)}
            </span>

            <h1 className="mt-6 text-[2.1rem] font-extrabold leading-[1.15] tracking-tight text-ivory sm:text-[3rem] lg:text-[3.4rem]">
              {tx(locale, t.tracking.title)}
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-[1.95] text-ivory/75">
              {tx(locale, t.tracking.intro)}
            </p>
          </div>
        </div>
      </div>

      <main id="main" className="bg-ivory py-14 lg:py-20">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
          <Reveal>
            <div className="panel p-6 sm:p-9 lg:p-11">
              <CaseTracker locale={locale} />
            </div>
          </Reveal>
        </div>
      </main>

      <SiteFooter locale={locale} />
      <WhatsAppFab locale={locale} />
    </>
  );
}