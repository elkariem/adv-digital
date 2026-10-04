import Image from "next/image";
import { brand } from "@/lib/site";
import type { Locale } from "@/lib/i18n";

/**
 * Logo lockup: the brand mark beside the wordmark.
 *
 * /public/logo-mark.png is the supplied 391x637 file trimmed to its 321x306
 * artwork, so the mark renders at a real, visible size instead of shrinking
 * inside its own transparent padding. The artwork pixels are unchanged.
 *
 * The wordmark is live text so it stays legible and translatable, and the
 * transparent background is preserved so the mark sits straight on the surface.
 */
export function BrandLogo({
  locale,
  tone = "dark",
  className = "",
}: {
  locale: Locale;
  /** `dark` = for burgundy backgrounds (cream text). `light` = for cream backgrounds. */
  tone?: "dark" | "light";
  className?: string;
}) {
  return (
    <span className={`flex items-center gap-3 sm:gap-3.5 ${className}`}>
      <Image
        src="/logo-mark.png"
        alt=""
        aria-hidden="true"
        width={321}
        height={306}
        priority
        className="h-10 w-auto shrink-0 object-contain drop-shadow-[0_2px_10px_rgba(0,0,0,0.28)] transition-transform duration-500 ease-out hover:scale-105 sm:h-11 lg:h-12"
      />
      <span
        className={`text-[17px] leading-tight font-bold tracking-tight lg:text-xl ${
          tone === "dark" ? "text-ivory" : "text-charcoal"
        }`}
      >
        {brand[locale]}
      </span>
    </span>
  );
}