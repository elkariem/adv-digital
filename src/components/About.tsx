import { t, tx, type Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * About is a text-first section: the narrative owns the full width so nothing
 * competes with it, and the tracking callout closes the block as the single
 * next action. The owner portrait stays exclusive to the hero.
 */
export function About({ locale }: { locale: Locale }) {
  return (
    <section id="about" className="relative overflow-hidden bg-white py-20 lg:py-28">
      {/* Tonal field so the white band keeps depth without an image. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold/[0.07] blur-3xl"
      />

      <div className="relative mx-auto max-w-4xl px-5 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            locale={locale}
            eyebrow={t.about.eyebrow}
            title={t.about.title}
            align="center"
          />
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-10 space-y-6 text-center">
            <p className="text-lg leading-[1.95] text-charcoal/85 sm:text-xl">
              {tx(locale, t.about.body1)}
            </p>
            <p className="text-lg leading-[1.95] text-charcoal/70">{tx(locale, t.about.body2)}</p>
          </div>
        </Reveal>

        {/* Tracking callout: this is the public entry point to /track. */}
        <Reveal delay={200}>
          <a
            href="/track"
            className="group mt-12 flex items-center justify-between gap-5 rounded-[var(--radius-panel)] border border-gold/40 bg-gold/[0.07] px-6 py-6 transition-all duration-300 hover:border-gold-strong hover:bg-gold/15 sm:px-8 sm:py-7"
          >
            <span className="flex items-center gap-4 sm:gap-5">
              <span
                aria-hidden="true"
                className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-burgundy text-ivory transition-transform duration-300 group-hover:scale-105"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  aria-hidden="true"
                >
                  <circle cx="11" cy="11" r="7" />
                  <path d="m20 20-3.5-3.5" strokeLinecap="round" />
                </svg>
              </span>
              <span>
                <span className="block text-base font-bold tracking-tight text-charcoal sm:text-lg">
                  {tx(locale, t.about.trackTitle)}
                </span>
                <span className="mt-1 block text-sm leading-relaxed text-muted sm:text-base">
                  {tx(locale, t.about.body3)}
                </span>
              </span>
            </span>

            <span
              aria-hidden="true"
              className="shrink-0 text-gold-deep transition-transform duration-300 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}