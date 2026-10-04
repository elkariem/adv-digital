import type { Metadata } from "next";
import { isAuthenticated } from "@/lib/auth";
import Link from "next/link";
import { listCases, listReviews } from "@/lib/db";
import { getLocale } from "@/lib/locale";
import { t, tx } from "@/lib/i18n";
import { BrandLogo } from "@/components/BrandLogo";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { ManageLogin } from "@/components/manage/ManageLogin";
import { ManagePanel } from "@/components/manage/ManagePanel";
import { SignOutButton } from "@/components/manage/SignOutButton";

export const metadata: Metadata = {
  title: "Manage",
  robots: { index: false, follow: false },
};

export default async function ManagePage() {
  const locale = await getLocale();
  const authenticated = await isAuthenticated();

  const cases = authenticated ? await listCases() : [];
  const reviews = authenticated ? await listReviews() : [];

  return (
    <div className="flex min-h-dvh flex-col bg-ivory">
      <header className="sticky top-0 z-50 border-b border-ivory/12 bg-burgundy text-ivory">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between gap-4 px-5 sm:px-6 lg:h-24 lg:px-10">
          <Link href="/" className="shrink-0" aria-label={tx(locale, t.nav.homeLabel)}>
            <BrandLogo locale={locale} tone="dark" />
          </Link>

          <div className="flex items-center gap-2.5 sm:gap-3">
            <LanguageSwitcher locale={locale} tone="dark" />
            {authenticated ? <SignOutButton locale={locale} /> : null}
          </div>
        </div>
      </header>

      <main id="main" className="flex-1">
        <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 sm:py-16 lg:px-10 lg:py-20">
          <div className="max-w-2xl">
            <span className="inline-flex items-center gap-2.5 rounded-full border border-gold/45 bg-gold/10 px-4 py-1.5 text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
              <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" aria-hidden="true" />
              {tx(locale, t.manage.title)}
            </span>

            <h1 className="mt-5 text-[2.1rem] font-extrabold leading-[1.15] tracking-tight text-charcoal sm:text-[2.75rem]">
              {tx(locale, t.manage.dashboardTitle)}
            </h1>

            <p className="mt-5 text-lg leading-[1.9] text-muted">
              {authenticated
                ? tx(locale, t.manage.dashboardIntro)
                : tx(locale, t.manage.loginIntro)}
            </p>
          </div>

          <div className="mt-10 sm:mt-14">
            {authenticated ? (
              <ManagePanel locale={locale} initialCases={cases} initialReviews={reviews} />
            ) : (
              <div className="panel overflow-hidden">
                <div className="grid lg:grid-cols-[1fr_1.1fr]">
                  <div className="relative overflow-hidden bg-burgundy p-8 text-ivory sm:p-10">
                    {/* Soft tonal field, echoing the homepage organic layers. */}
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -end-16 -top-20 h-56 w-56 rounded-full bg-burgundy-accent/40 blur-3xl"
                    />
                    <span
                      aria-hidden="true"
                      className="pointer-events-none absolute -bottom-24 -start-16 h-56 w-56 rounded-full bg-gold/15 blur-3xl"
                    />

                    <div className="relative">
                      <h2 className="text-2xl font-bold leading-snug tracking-tight sm:text-[1.75rem]">
                        {tx(locale, t.manage.signInTitle)}
                      </h2>
                      <p className="mt-4 text-base leading-[1.9] text-ivory/75">
                        {tx(locale, t.manage.signInBody)}
                      </p>
                    </div>
                  </div>

                  <div className="p-8 sm:p-10">
                    <ManageLogin locale={locale} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <footer className="border-t border-charcoal/10 bg-ivory">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-10">
          <Link
            href="/"
            className="w-fit transition-colors hover:text-charcoal"
          >
            {tx(locale, t.footer.manageLink)}
          </Link>
          <span dir="ltr">© {new Date().getFullYear()}</span>
        </div>
      </footer>
    </div>
  );
}