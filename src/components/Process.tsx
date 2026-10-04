import { t, tx, type Locale } from "@/lib/i18n";
import { manufacturingStages } from "@/lib/stages";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * Seven manufacturing stages rendered as one connected vertical timeline, so the
 * sequence Case Received -> ... -> Delivered is unmistakable.
 *
 * Each step sits on a raised panel so the section matches the dashboard's
 * card language instead of floating text on a flat field. The rail and node
 * offsets use logical properties, so everything mirrors for Arabic with no
 * second layout.
 */
export function Process({ locale }: { locale: Locale }) {
  return (
    <section id="process" className="relative overflow-hidden bg-burgundy py-20 text-ivory lg:py-28">
      {/* Tonal fields, same language as the hero and track page. */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-[-10rem] h-[30rem] w-[30rem] rounded-full bg-burgundy-accent/25 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-52 end-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <Reveal>
              <SectionHeading
                locale={locale}
                eyebrow={t.process.eyebrow}
                title={t.process.title}
                intro={t.process.intro}
                tone="dark"
              />
            </Reveal>

            <Reveal delay={120}>
              <p className="mt-10 rounded-[var(--radius-card)] border border-ivory/15 bg-ivory/[0.06] px-6 py-5 text-base leading-[1.9] text-ivory/80">
                {tx(locale, t.process.flexibilityNote)}
              </p>
            </Reveal>
          </div>

          <ol className="relative ps-14 sm:ps-16">
            {/* Continuous rail behind the numbered nodes. */}
            <span
              aria-hidden="true"
              className="absolute inset-y-2 start-[1.4375rem] w-px bg-gradient-to-b from-gold/70 via-gold/35 to-transparent sm:start-[1.9375rem]"
            />

            {manufacturingStages.map((stage, index) => (
              <li key={stage.id} className="relative pb-5 last:pb-0">
                <Reveal delay={index * 80}>
                  {/* Step node */}
                  <span
                    aria-hidden="true"
                    className="absolute -start-14 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full border border-gold/60 bg-burgundy font-bold text-gold shadow-[0_10px_24px_-12px_rgba(0,0,0,0.6)] sm:-start-16 sm:h-14 sm:w-14"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <div className="rounded-[var(--radius-panel)] border border-ivory/12 bg-ivory/[0.05] p-6 transition-all duration-400 hover:border-gold/45 hover:bg-ivory/[0.09] sm:p-7">
                    <h3 className="text-xl font-bold leading-snug text-ivory sm:text-[1.4rem]">
                      {tx(locale, stage.title)}
                    </h3>
                    <p className="mt-3 max-w-xl text-base leading-[1.9] text-ivory/70">
                      {tx(locale, stage.description)}
                    </p>
                  </div>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}