import { t, tx, type Locale } from "@/lib/i18n";
import { contact } from "@/lib/site";

/**
 * Fixed bottom-end button. `end` keeps it on the right in LTR and the left in
 * RTL, and the elevated bottom offset keeps it clear of the footer text on mobile.
 */
export function WhatsAppFab({ locale }: { locale: Locale }) {
  return (
    <a
      href={contact.whatsappHref}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={tx(locale, t.whatsappFab.label)}
      className="group fixed bottom-5 end-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-burgundy text-ivory shadow-lg shadow-burgundy/30 transition-transform duration-300 hover:scale-105 focus-visible:scale-105 sm:bottom-7 sm:end-7 sm:h-16 sm:w-16"
      style={{ animation: "whatsapp-float 4.5s ease-in-out infinite" }}
    >
      <span
        aria-hidden="true"
        className="absolute inset-0 rounded-full border border-gold/50"
        style={{ animation: "soft-pulse 2.8s ease-out infinite" }}
      />
      <svg width="28" height="28" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
        <path d="M17.47 14.38c-.3-.15-1.76-.87-2.03-.97-.27-.1-.47-.15-.67.15-.2.3-.77.96-.94 1.16-.17.2-.35.22-.65.08-.3-.15-1.26-.47-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.14-.13.3-.35.45-.52.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.08-.15-.67-1.61-.92-2.21-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.48s1.06 2.88 1.21 3.08c.15.2 2.09 3.2 5.07 4.48.71.31 1.26.49 1.69.63.71.23 1.36.19 1.87.12.57-.09 1.76-.72 2-1.41.25-.7.25-1.29.18-1.42-.07-.13-.27-.2-.57-.35z" />
        <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.46 1.32 4.96L2 22l5.25-1.38a9.87 9.87 0 004.79 1.22h.01c5.46 0 9.91-4.45 9.91-9.91C21.96 6.45 17.5 2 12.04 2zm0 18.13h-.01a8.2 8.2 0 01-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.31a8.17 8.17 0 01-1.26-4.36c0-4.54 3.7-8.24 8.25-8.24 2.2 0 4.27.86 5.83 2.42a8.19 8.19 0 012.41 5.83c0 4.54-3.7 8.24-8.24 8.24z" />
      </svg>
    </a>
  );
}