import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import { direction, t, tx, type Locale } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";
import "./globals.css";

/**
 * Cairo carries both Arabic and Latin, so the site reads as one family in
 * either language. Weights start at 400: nothing here should look thin.
 */
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return {
    title: tx(locale, t.meta.title),
    description: tx(locale, t.meta.description),
    openGraph: {
      title: tx(locale, t.meta.title),
      description: tx(locale, t.meta.description),
      locale: locale === "ar" ? "ar_SA" : "en_US",
      type: "website",
    },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const locale: Locale = await getLocale();

  return (
    <html lang={locale} dir={direction[locale]} className={cairo.variable}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:start-3 focus:z-[80] focus:rounded-full focus:bg-burgundy focus:px-4 focus:py-2 focus:text-base focus:text-ivory"
        >
          {tx(locale, t.nav.skipToContent)}
        </a>
        {children}
      </body>
    </html>
  );
}
