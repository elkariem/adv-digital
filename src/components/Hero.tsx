import Link from "next/link";
import { t, tx, type Locale } from "@/lib/i18n";
import { contact } from "@/lib/site";
import { HeroPortrait } from "./HeroPortrait";

export function Hero({ locale }: { locale: Locale }) {
  return (
    <section
      id="home"
      className="relative overflow-hidden bg-burgundy pt-32 pb-24 text-ivory sm:pt-36 lg:pt-48 lg:pb-40"
    >
      {/* Soft tonal depth so the burgundy field is never flat. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-[-10rem] h-[34rem] w-[34rem] rounded-full bg-burgundy-accent/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 end-[-12rem] h-[30rem] w-[30rem] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto grid max-w-7xl items-center gap-16 px-5 sm:px-6 lg:grid-cols-[1.08fr_0.92fr] lg:gap-20 xl:gap-24 2xl:gap-28 lg:px-10">
        <div>
          <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/10 px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-gold">
            <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" aria-hidden="true" />
            {tx(locale, t.hero.badge)}
          </span>

          <h1 className="mt-7 text-[2.35rem] leading-[1.2] font-extrabold tracking-tight text-ivory sm:text-[3.5rem] lg:text-[4.4rem] lg:leading-[1.14]">
            {tx(locale, t.hero.statement)}
          </h1>

          <p className="mt-7 max-w-2xl text-lg leading-[1.9] text-ivory/80 sm:text-xl">
            {tx(locale, t.hero.subtitle)}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link href="/track" className="btn btn-gold">
              {tx(locale, t.hero.primaryCta)}
            </Link>
            <a
              href={contact.whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-outline"
            >
              {tx(locale, t.hero.secondaryCta)}
            </a>
            <a
              href="#services"
              className="group inline-flex items-center gap-2 px-1 py-3 text-base font-semibold text-ivory/85 underline-offset-8 transition-colors hover:text-gold"
            >
              {tx(locale, t.hero.tertiaryCta)}
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
                className="transition-transform duration-300 group-hover:translate-y-0.5"
              >
                <path
                  d="M12 5v14m0 0-6-6m6 6 6-6"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>
          </div>
        </div>

        <HeroPortrait locale={locale} />
      </div>
    </section>
  );
}