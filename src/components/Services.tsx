import servicesJson from "@/data/services.json";
import additionalJson from "@/data/additional-services.json";
import { t, tx, type Locale } from "@/lib/i18n";
import { SectionHeading } from "./SectionHeading";
import { Reveal } from "./Reveal";

/**
 * Six primary services as numbered cards, then the supporting services as a
 * compact list. Each card gets a large ghosted index so the grid reads as a
 * sequence rather than a wall of equal boxes.
 */
export function Services({ locale }: { locale: Locale }) {
  return (
    <section id="services" className="py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-10">
        <Reveal>
          <SectionHeading
            locale={locale}
            eyebrow={t.services.eyebrow}
            title={t.services.title}
            intro={t.services.intro}
          />
        </Reveal>

        <div className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {servicesJson.services.map((service, index) => (
            <Reveal key={service.id} delay={index * 70} className="h-full">
              <article className="card group relative h-full overflow-hidden">
                {/* Ghosted index: decorative, hidden from assistive tech. */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute -top-3 end-3 hidden select-none text-[4.5rem] font-extrabold leading-none text-charcoal/[0.05] transition-all duration-500 ease-out group-hover:-translate-y-1 group-hover:text-gold/20 sm:block"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <div className="relative">
                  <span
                    aria-hidden="true"
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-burgundy/[0.08] text-sm font-bold text-burgundy-accent transition-colors duration-500 group-hover:bg-burgundy group-hover:text-ivory"
                  >
                    {index + 1}
                  </span>

                  <h3 className="mt-5 text-xl font-bold tracking-tight text-charcoal">
                    {tx(locale, service.title)}
                  </h3>

                  <p className="mt-4 text-base leading-[1.85] text-muted">
                    {tx(locale, service.description)}
                  </p>

                  <p className="mt-6 rounded-[var(--radius-field)] bg-ivory/70 px-4 py-3 text-sm font-medium leading-relaxed text-gold-deep">
                    {tx(locale, service.bestFor)}
                  </p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="panel mt-16 p-7 sm:p-9">
            <h3 className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.2em] text-gold-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" aria-hidden="true" />
              {tx(locale, t.services.additionalTitle)}
            </h3>

            <dl className="mt-7 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {additionalJson.additionalServices.map((service) => (
                <div
                  key={service.id}
                  className="border-t border-charcoal/12 pt-5 transition-colors duration-300 hover:border-gold-strong/60"
                >
                  <dt className="text-lg font-bold tracking-tight text-charcoal">
                    {tx(locale, service.title)}
                  </dt>
                  <dd className="mt-2.5 text-base leading-[1.85] text-muted">
                    {tx(locale, service.description)}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </div>
    </section>
  );
}