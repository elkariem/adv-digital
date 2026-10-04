import { t, tx, type Locale } from "@/lib/i18n";
import { setLocale } from "@/app/actions";

/**
 * A form posting to a server action: works without client JS and avoids a
 * client component just to flip a cookie.
 */
export function LanguageSwitcher({
  locale,
  tone = "light",
}: {
  locale: Locale;
  /** `dark` = sits on burgundy. `light` = sits on cream. */
  tone?: "dark" | "light";
}) {
  const other: Locale = locale === "ar" ? "en" : "ar";

  return (
    <form action={setLocale}>
      <input type="hidden" name="locale" value={other} />
      <button
        type="submit"
        className={`rounded-full border px-3.5 py-2 text-[0.95rem] font-semibold transition-colors ${
          tone === "dark"
            ? "border-ivory/30 text-ivory/90 hover:border-gold hover:text-gold"
            : "border-charcoal/20 text-charcoal/80 hover:border-gold-strong hover:text-charcoal"
        }`}
      >
        {tx(locale, other === "ar" ? t.nav.switchToArabic : t.nav.switchToEnglish)}
      </button>
    </form>
  );
}