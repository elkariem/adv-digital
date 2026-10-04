import { t, tx } from "@/lib/i18n";
import { getLocale } from "@/lib/locale";

/**
 * Fallback shown while a route's server component is still resolving — mainly
 * the database-backed pages. `role="status"` announces it to screen readers.
 *
 * The shimmer is disabled under reduced motion via `.skeleton` in globals.css.
 */
export default async function Loading() {
  const locale = await getLocale();

  return (
    <div
      role="status"
      aria-live="polite"
      className="flex min-h-[70vh] items-center bg-ivory pt-32 pb-20"
    >
      <div className="mx-auto w-full max-w-2xl px-5 sm:px-6 lg:px-10">
        <p className="sr-only">{tx(locale, t.system.loading)}</p>

        <div aria-hidden="true" className="text-center">
          <span className="mx-auto block h-2.5 w-40 rounded-full skeleton" />
          <span className="mx-auto mt-6 block h-11 w-full max-w-md rounded-[var(--radius-field)] skeleton" />
          <span className="mx-auto mt-4 block h-5 w-full max-w-lg rounded-full skeleton" />
          <span className="mx-auto mt-3 block h-5 w-3/5 max-w-sm rounded-full skeleton" />

          <div className="mx-auto mt-12 grid gap-4 sm:grid-cols-2">
            <span className="block h-28 rounded-[var(--radius-card)] skeleton" />
            <span className="block h-28 rounded-[var(--radius-card)] skeleton" />
          </div>

          <div className="mx-auto mt-10 flex justify-center gap-4">
            <span className="block h-12 w-36 rounded-[var(--radius-btn)] skeleton" />
            <span className="block h-12 w-36 rounded-[var(--radius-btn)] skeleton" />
          </div>
        </div>
      </div>
    </div>
  );
}