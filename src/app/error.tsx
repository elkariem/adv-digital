"use client";

import Link from "next/link";
import { useEffect } from "react";
import { t, tx, localeFromCookie } from "@/lib/i18n";

/**
 * Route-level error boundary. Catches any unhandled server or render error in a
 * page below the root layout and replaces it with a recoverable screen.
 *
 * A client boundary cannot call `cookies()`, so the active language is read
 * from the locale cookie on the client instead.
 *
 * `error.message` is scrubbed by Next in production builds, so the `digest` is
 * shown instead: it is the handle support needs to find the real stack trace in
 * the server logs.
 */
export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFromCookie();

  useEffect(() => {
    // Replace with your monitoring reporter when one is wired up.
    console.error(error);
  }, [error]);

  return (
    <main
      id="main"
      className="relative flex min-h-[70vh] items-center overflow-hidden bg-burgundy pt-32 pb-20 text-ivory"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 start-[-10rem] h-[30rem] w-[30rem] rounded-full bg-burgundy-accent/25 blur-3xl"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-56 end-[-12rem] h-[26rem] w-[26rem] rounded-full bg-gold/10 blur-3xl"
      />

      <div className="relative mx-auto w-full max-w-2xl px-5 text-center sm:px-6 lg:px-10">
        <span
          aria-hidden="true"
          className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/45 bg-gold/10 text-gold"
        >
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.6"
          >
            <path d="M12 8v5" strokeLinecap="round" />
            <circle cx="12" cy="16.5" r="1" fill="currentColor" stroke="none" />
            <path
              d="M10.3 3.9 2.6 17.4A2 2 0 0 0 4.3 20.4h15.4a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"
              strokeLinejoin="round"
            />
          </svg>
        </span>

        <h1 className="mt-8 text-[1.95rem] leading-[1.2] font-extrabold tracking-tight sm:text-[2.4rem]">
          {tx(locale, t.system.errorTitle)}
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-lg leading-[1.9] text-ivory/75">
          {tx(locale, t.system.errorBody)}
        </p>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
          <button type="button" onClick={reset} className="btn btn-gold">
            {tx(locale, t.system.errorRetry)}
          </button>
          <Link href="/" className="btn btn-outline">
            {tx(locale, t.system.errorHomeCta)}
          </Link>
        </div>

        {error.digest ? (
          <p className="mt-8 text-sm text-ivory/50" dir="ltr">
            {tx(locale, t.system.errorReference)}: {error.digest}
          </p>
        ) : null}
      </div>
    </main>
  );
}