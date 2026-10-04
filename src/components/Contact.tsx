import { t, tx, type Locale } from "@/lib/i18n";
import { brand, contact } from "@/lib/site";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

function Row({
  label,
  href,
  children,
  external,
}: {
  label: string;
  href: string;
  children: React.ReactNode;
  external?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      className="group flex items-center justify-between gap-4 border-b border-charcoal/12 py-5 transition-colors duration-300 last:border-b-0 hover:border-gold-strong"
    >
      <span className="text-sm font-bold uppercase tracking-[0.18em] text-muted transition-colors duration-300 group-hover:text-gold-deep">
        {label}
      </span>
      <span className="flex items-center gap-3 text-base font-semibold text-charcoal transition-colors duration-300 group-hover:text-burgundy-accent">
        <span dir="ltr">{children}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
          className="transition-transform duration-300 group-hover:translate-x-0.5 rtl:-scale-x-100 rtl:group-hover:-translate-x-0.5"
        >
          <path
            d="M5 12h14m0 0-6-6m6 6-6 6"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </span>
    </a>
  );
}

export function Contact({ locale }: { locale: Locale }) {
  return (
    <section id="contact" className="bg-white py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <div className="grid gap-14 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div>
            <Reveal>
              <SectionHeading
                locale={locale}
                eyebrow={t.contact.eyebrow}
                title={t.contact.title}
                intro={t.contact.intro}
              />
            </Reveal>

            <Reveal delay={160}>
              <a
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary mt-10 w-full sm:w-auto"
              >
                {tx(locale, t.contact.whatsappCta)}
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M5 12h14m0 0-6-6m6 6-6 6"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </Reveal>
          </div>

          <Reveal delay={120}>
            <div className="panel p-7 sm:p-9">
              <p className="text-2xl font-bold tracking-tight text-charcoal">{brand[locale]}</p>

              <div className="mt-7">
                <Row label={tx(locale, t.contact.phoneLabel)} href={contact.phoneHref}>
                  {contact.phoneDisplay}
                </Row>
                <Row
                  label={tx(locale, t.contact.whatsappLabel)}
                  href={contact.whatsappHref}
                  external
                >
                  {contact.whatsappDisplay}
                </Row>
                <Row label={tx(locale, t.contact.emailLabel)} href={contact.emailHref}>
                  {contact.emailDisplay}
                </Row>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}