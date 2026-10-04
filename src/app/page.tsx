import { getLocale } from "@/lib/locale";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { Hero } from "@/components/Hero";
import { About } from "@/components/About";
import { Services } from "@/components/Services";
import { Process } from "@/components/Process";
import { ReviewsSection } from "@/components/ReviewsSection";
import { Contact } from "@/components/Contact";

export default async function HomePage() {
  const locale = await getLocale();

  return (
    <>
      <SiteHeader locale={locale} currentPath="/" />
      <main id="main">
        <Hero locale={locale} />
        <About locale={locale} />
        <Services locale={locale} />
        <Process locale={locale} />
        <ReviewsSection locale={locale} />
        <Contact locale={locale} />
      </main>
      <SiteFooter locale={locale} />
      <WhatsAppFab locale={locale} />
    </>
  );
}