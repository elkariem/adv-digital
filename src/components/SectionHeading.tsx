import { tx, type Locale } from "@/lib/i18n";

/**
 * Eyebrow + title pairing reused across the landing sections, styled to match
 * the dashboard: a gold pill badge instead of a bare rule, and a hairline
 * divider beneath the heading block.
 */
export function SectionHeading({
  locale,
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "start",
}: {
  locale: Locale;
  eyebrow: { ar: string; en: string };
  title: { ar: string; en: string };
  intro?: { ar: string; en: string };
  tone?: "light" | "dark";
  /** `center` is for single-column sections where the block is the whole band. */
  align?: "start" | "center";
}) {
  const dark = tone === "dark";
  const center = align === "center";

  return (
    <div className={`max-w-2xl ${center ? "mx-auto text-center" : ""}`}>
      <span
        className={`inline-flex items-center gap-2.5 rounded-full border px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.18em] ${
          dark
            ? "border-gold/45 bg-gold/10 text-gold"
            : "border-gold/45 bg-gold/10 text-gold-deep"
        }`}
      >
        <span
          className="h-1.5 w-1.5 rounded-full bg-gold-strong"
          aria-hidden="true"
        />
        {tx(locale, eyebrow)}
      </span>

      <h2
        className={`mt-6 text-[1.95rem] leading-[1.18] font-extrabold tracking-tight sm:text-[2.5rem] lg:text-[2.85rem] ${
          dark ? "text-ivory" : "text-charcoal"
        }`}
      >
        {tx(locale, title)}
      </h2>

      {intro ? (
        <p
          className={`mt-6 text-lg leading-[1.9] ${
            dark ? "text-ivory/75" : "text-muted"
          } ${center ? "mx-auto" : ""}`}
        >
          {tx(locale, intro)}
        </p>
      ) : null}
    </div>
  );
}