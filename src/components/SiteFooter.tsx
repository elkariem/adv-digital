import Image from "next/image";
import { t, tx, type Locale } from "@/lib/i18n";
import { brand, contact } from "@/lib/site";
import { NAV_LINKS } from "@/lib/nav-links";

export function SiteFooter({ locale }: { locale: Locale }) {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden bg-burgundy-deep text-ivory/75">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 end-[-10rem] h-[24rem] w-[24rem] rounded-full bg-burgundy-accent/20 blur-3xl"
      />

      <div className="relative mx-auto max-w-7xl px-5 py-14 sm:px-6 lg:px-10 lg:py-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_0.7fr_0.7fr]">
          <div className="max-w-sm">
            <div className="flex items-center gap-3.5">
              <Image
                src="/logo-mark.png"
                alt=""
                aria-hidden="true"
                width={321}
                height={306}
                className="h-14 w-auto shrink-0 object-contain"
              />
              <p className="text-xl font-bold text-ivory">{brand[locale]}</p>
            </div>
            <p className="mt-5 text-base leading-[1.85]">{tx(locale, t.footer.tagline)}</p>
          </div>

          <nav aria-label={tx(locale, t.nav.primaryLabel)}>
            <h2 className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-gold">
              {tx(locale, t.nav.primaryLabel)}
            </h2>
            <ul className="mt-5 grid gap-3 text-base">
              {NAV_LINKS.map((link) => (
                <li key={link.key}>
                  <a
                    href={link.href}
                    className="inline-block transition-all duration-300 hover:text-gold hover:translate-x-0.5 rtl:hover:-translate-x-0.5"
                  >
                    {tx(locale, t.nav[link.key])}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="text-[0.8125rem] font-bold uppercase tracking-[0.2em] text-gold">
              {tx(locale, t.footer.contactTitle)}
            </h2>
            <ul className="mt-5 grid gap-3 text-base">
              <li>
                <a
                  href={contact.phoneHref}
                  className="inline-block transition-colors duration-300 hover:text-gold"
                  dir="ltr"
                >
                  {contact.phoneDisplay}
                </a>
              </li>
              <li>
                <a
                  href={contact.whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block transition-colors duration-300 hover:text-gold"
                  dir="ltr"
                >
                  WhatsApp · {contact.whatsappDisplay}
                </a>
              </li>
              <li>
                <a
                  href={contact.emailHref}
                  className="inline-block break-all transition-colors duration-300 hover:text-gold"
                  dir="ltr"
                >
                  {contact.emailDisplay}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col gap-3 border-t border-ivory/15 pt-6 text-sm sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {year} {brand[locale]}. {tx(locale, t.footer.rights)}
          </p>
          <a href="/manage" className="text-ivory/55 transition-colors hover:text-gold">
            {tx(locale, t.footer.manageLink)}
          </a>
        </div>
      </div>
    </footer>
  );
}