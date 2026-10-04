"use client";

import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";
import { detectDirection, formatDate } from "@/lib/format";
import type { ReviewRow } from "@/lib/db";

export function ReviewManager({
  locale,
  initialReviews,
  onDeleted,
}: {
  locale: Locale;
  initialReviews: ReviewRow[];
  onDeleted: (id: number) => void;
}) {
  const [pendingId, setPendingId] = useState<number | null>(null);
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  function close() {
    setPendingId(null);
    setPassword("");
    setError(null);
  }

  async function confirmDelete() {
    if (pendingId === null) return;
    setBusy(true);
    setError(null);

    try {
      const response = await fetch(`/api/reviews/${pendingId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = await response.json();

      if (!response.ok) {
        setError(
          data.reason === "rateLimited"
            ? tx(locale, t.tracking.rateLimited)
            : data.reason === "notFound"
              ? tx(locale, t.manage.reviewNotFound)
              : tx(locale, t.manage.invalidPassword),
        );
        return;
      }

      onDeleted(pendingId);
      close();
    } catch {
      setError(tx(locale, t.manage.invalidPassword));
    } finally {
      setBusy(false);
    }
  }

  if (initialReviews.length === 0) {
    return <p className="text-base text-muted">{tx(locale, t.manage.noReviews)}</p>;
  }

  return (
    <>
      <ul className="grid gap-3">
        {initialReviews.map((review) => (
          <li
            key={review.id}
            className="group flex items-start justify-between gap-4 rounded-[var(--radius-card)] border border-charcoal/12 bg-white p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-gold-strong/50 hover:shadow-[0_18px_34px_-28px_rgba(74,21,37,0.45)]"
          >
            <div className="min-w-0">
              <p
                className="text-base leading-[1.9] text-charcoal/80"
                dir={detectDirection(review.text)}
              >
                {review.text}
              </p>
              <p
                className="mt-4 text-base font-semibold text-charcoal/80"
                dir={detectDirection(review.doctorName)}
              >
                {review.doctorName}
                {review.clinicName ? ` · ${review.clinicName}` : ""}
              </p>
              <p className="mt-1.5 text-sm text-muted" dir="ltr">
                {formatDate(review.createdAt, locale)}
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                setPendingId(review.id);
                setPassword("");
                setError(null);
              }}
              title={tx(locale, t.manage.deleteReview)}
              aria-label={tx(locale, t.manage.deleteReview)}
              className="shrink-0 p-2 text-charcoal/25 opacity-60 transition-all hover:text-charcoal/70 focus-visible:opacity-100 group-hover:opacity-100"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M4 7h16M9 7V5h6v2m-8 0 1 13h8l1-13"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </li>
        ))}
      </ul>

      {pendingId !== null ? (
        <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label={tx(locale, t.manage.cancel)}
            onClick={close}
            className="scrim absolute inset-0 rounded-[var(--radius-panel)] bg-charcoal/45"
          />

          <div
            role="dialog"
            aria-modal="true"
            className="relative w-full max-w-sm rounded-[var(--radius-card)] border border-charcoal/12 bg-ivory p-7 shadow-2xl"
          >
            <h3 className="text-lg font-bold text-charcoal">
              {tx(locale, t.manage.deleteReviewTitle)}
            </h3>
            <p className="mt-3 text-base leading-relaxed text-muted">
              {tx(locale, t.manage.deleteReviewBody)}
            </p>

            <label
              htmlFor="delete-password"
              className="mt-6 field-label"
            >
              {tx(locale, t.manage.passwordLabel)}
            </label>
            <input
              id="delete-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
              className="field"
            />

            {error ? (
              <p role="alert" className="mt-3 text-sm font-medium text-burgundy-accent">
                {error}
              </p>
            ) : null}

            <div className="mt-6 flex items-center gap-3">
              <button
                type="button"
                onClick={confirmDelete}
                disabled={busy}
                className="btn btn-primary disabled:opacity-60"
              >
                {tx(locale, t.manage.confirmDelete)}
              </button>
              <button
                type="button"
                onClick={close}
                className="px-2 py-3 text-base font-semibold text-muted transition-colors hover:text-charcoal"
              >
                {tx(locale, t.manage.cancel)}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}