import Image from "next/image";
import { t, tx, type Locale } from "@/lib/i18n";

/**
 * Owner portrait set into an organic, biomorphic frame.
 *
 * The photo is the supplied /public/owner.jfif, untouched: no retouching, no
 * filters, no colour grading. It is cropped with object-top inside a
 * near-square frame so the face is never cut off, and masked by a static
 * organic radius so the person itself never deforms.
 *
 * Only the layered shapes *behind* the portrait animate (see globals.css).
 * That keeps the owner's face completely stable while the composition still
 * feels alive.
 */
export function HeroPortrait({ locale }: { locale: Locale }) {
  return (
    <div
      role="img"
      aria-label={tx(locale, t.hero.portraitAlt)}
      className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[23rem] lg:max-w-none"
    >
      {/* Back layer: deep burgundy mass, gives tonal separation from the page. */}
      <div
        aria-hidden="true"
        className="organic-a absolute -inset-8 bg-burgundy-deep opacity-90 lg:-inset-12"
      />

      {/* Mid layer: secondary burgundy, offset for asymmetry. */}
      <div
        aria-hidden="true"
        className="organic-b absolute -inset-3 translate-x-3 translate-y-2 bg-burgundy-accent opacity-55 lg:-inset-5"
      />

      {/* Accent layer: restrained beige/gold, never a full gold field. */}
      <div
        aria-hidden="true"
        className="organic-c absolute inset-4 -translate-x-2 -translate-y-1 bg-beige opacity-25 lg:inset-6"
      />

      {/* The portrait. Static mask + gentle entrance only. */}
      <div className="portrait-mask portrait-enter absolute inset-0 overflow-hidden bg-burgundy-deep">
        <Image
          src="/owner.jfif"
          alt=""
          fill
          priority
          sizes="(max-width: 640px) 20rem, (max-width: 1024px) 23rem, 34rem"
          className="object-cover object-top"
        />
        {/* Tonal grounding only: lifts the dark suit off the burgundy without a
            halo, outline or glow. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-gradient-to-t from-burgundy-deep/45 via-transparent to-burgundy-deep/10"
        />
      </div>
    </div>
  );
}