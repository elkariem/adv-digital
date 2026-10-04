"use client";

import { useEffect } from "react";
import { t, tx, localeFromCookie } from "@/lib/i18n";

/**
 * Last-resort boundary for errors thrown by the root layout itself. When the
 * layout fails there is no document to inherit from, so this component renders
 * its own <html> and <body>.
 *
 * Styles are inline on purpose: the stylesheet is imported by the root layout,
 * so it cannot be trusted to exist in the very situation this file handles.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = localeFromCookie();

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang={locale} dir={locale === "ar" ? "rtl" : "ltr"}>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#4A1525",
          color: "#FAF0D7",
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, "Segoe UI", sans-serif',
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "36rem", textAlign: "center" }}>
          <h1
            style={{
              margin: 0,
              fontSize: "1.75rem",
              lineHeight: 1.25,
              fontWeight: 800,
            }}
          >
            {tx(locale, t.system.errorTitle)}
          </h1>

          <p
            style={{
              marginTop: "1rem",
              fontSize: "1.0625rem",
              lineHeight: 1.8,
              color: "rgba(250, 240, 215, 0.75)",
            }}
          >
            {tx(locale, t.system.errorBody)}
          </p>

          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "2rem",
              cursor: "pointer",
              border: 0,
              borderRadius: "999px",
              backgroundColor: "#E2C372",
              color: "#2B1119",
              fontSize: "1rem",
              fontWeight: 700,
              padding: "0.85rem 1.75rem",
            }}
          >
            {tx(locale, t.system.errorRetry)}
          </button>

          {error.digest ? (
            <p
              style={{ marginTop: "1.75rem", fontSize: "0.8125rem", color: "rgba(250, 240, 215, 0.5)" }}
              dir="ltr"
            >
              {tx(locale, t.system.errorReference)}: {error.digest}
            </p>
          ) : null}
        </div>
      </body>
    </html>
  );
}