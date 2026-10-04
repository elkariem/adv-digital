"use client";

import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";
import { detectDirection, formatDate } from "@/lib/format";

export type Review = {
  id: number;
  doctorName: string;
  clinicName: string | null;
  text: string;
  createdAt: string;
};

/**
 * Professional testimonial card: attribution leads, then the review text, then
 * the date. Reads like a written endorsement rather than a social comment.
 */
function ReviewCard({
  review,
  locale,
  index,
}: {
  review: Review;
  locale: Locale;
  index: number;
}) {
  return (
    <li
      className="card reveal-item h-full"
      style={{ animationDelay: `${index * 70}ms` }}
    >
      <div
        className="flex flex-wrap items-baseline gap-x-3 gap-y-1"
        dir={detectDirection(review.doctorName)}
      >
        <span className="text-lg font-bold text-charcoal">{review.doctorName}</span>
        {review.clinicName ? (
          <span className="text-base text-muted">{review.clinicName}</span>
        ) : null}
      </div>

      <span aria-hidden="true" className="mt-4 block h-px w-12 bg-gold-strong" />

      <p
        className="mt-5 text-base leading-[1.95] text-charcoal/80"
        dir={detectDirection(review.text)}
      >
        {review.text}
      </p>

      <p className="mt-6 border-t border-charcoal/10 pt-4 text-sm text-muted" dir="ltr">
        {formatDate(review.createdAt, locale)}
      </p>
    </li>
  );
}

export function Reviews({ locale, initialReviews }: { locale: Locale; initialReviews: Review[] }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [doctorName, setDoctorName] = useState("");
  const [clinicName, setClinicName] = useState("");
  const [text, setText] = useState("");
  const [errors, setErrors] = useState<{ name?: string; text?: string; form?: string }>({});
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setErrors({});
    setDone(false);

    const nextErrors: typeof errors = {};
    if (doctorName.trim().length < 2) nextErrors.name = tx(locale, t.reviews.errorName);
    if (text.trim().length < 10) {
      nextErrors.text =
        text.trim().length === 0
          ? tx(locale, t.reviews.errorText)
          : tx(locale, t.reviews.errorTextShort);
    }
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ doctorName, clinicName, text }),
      });
      const data = await response.json();

      if (!response.ok) {
        if (response.status === 429) setErrors({ form: tx(locale, t.reviews.errorRateLimited) });
        else if (response.status === 400) setErrors({ text: tx(locale, t.reviews.errorText) });
        else setErrors({ form: tx(locale, t.reviews.errorGeneric) });
        return;
      }

      // Reviews publish immediately, so the new one joins the list at the top.
      setReviews((previous) => [data.review as Review, ...previous]);
      setDoctorName("");
      setClinicName("");
      setText("");
      setDone(true);
    } catch {
      setErrors({ form: tx(locale, t.reviews.errorGeneric) });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8">
      <div>
        {reviews.length === 0 ? (
          <div className="panel-inset px-6 py-16 text-center">
            <span
              aria-hidden="true"
              className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10 text-burgundy-accent"
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M7 7h10v7a5 5 0 0 1-10 0V7Z" strokeLinejoin="round" />
                <path d="M7 9H4.5v2.5A3.5 3.5 0 0 0 8 15M17 9h2.5v2.5A3.5 3.5 0 0 1 16 15" strokeLinecap="round" />
              </svg>
            </span>
            <p className="mt-4 text-base font-semibold text-charcoal/85">{tx(locale, t.reviews.empty)}</p>
          </div>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2">
            {reviews.map((review, index) => (
              <ReviewCard key={review.id} review={review} locale={locale} index={index} />
            ))}
          </ul>
        )}
      </div>

      <form onSubmit={onSubmit} className="panel h-fit p-7 lg:sticky lg:top-28 sm:p-8">
        <h3 className="text-xl font-bold tracking-tight text-charcoal">
          {tx(locale, t.reviews.formTitle)}
        </h3>
        <p className="mt-3 text-base leading-relaxed text-muted">
          {tx(locale, t.reviews.formIntro)}
        </p>

        <div className="mt-7 space-y-5">
          <div>
            <label htmlFor="review-name" className="field-label">
              {tx(locale, t.reviews.doctorName)}
            </label>
            <input
              id="review-name"
              value={doctorName}
              onChange={(event) => setDoctorName(event.target.value)}
              placeholder={tx(locale, t.reviews.doctorNamePlaceholder)}
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              className="field"
            />
            {errors.name ? (
              <p role="alert" className="mt-2 text-sm font-medium text-burgundy-accent">
                {errors.name}
              </p>
            ) : null}
          </div>

          <div>
            <label htmlFor="review-clinic" className="field-label">
              {tx(locale, t.reviews.clinicName)}
            </label>
            <input
              id="review-clinic"
              value={clinicName}
              onChange={(event) => setClinicName(event.target.value)}
              placeholder={tx(locale, t.reviews.clinicNamePlaceholder)}
              className="field"
            />
          </div>

          <div>
            <label htmlFor="review-text" className="field-label">
              {tx(locale, t.reviews.text)}
            </label>
            <textarea
              id="review-text"
              rows={5}
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={tx(locale, t.reviews.textPlaceholder)}
              aria-invalid={Boolean(errors.text)}
              className="field resize-y leading-relaxed"
            />
            {errors.text ? (
              <p role="alert" className="mt-2 text-sm font-medium text-burgundy-accent">
                {errors.text}
              </p>
            ) : null}
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-primary mt-7 w-full">
          {submitting ? tx(locale, t.reviews.submitting) : tx(locale, t.reviews.submit)}
        </button>

        {errors.form ? (
          <p role="alert" className="mt-4 text-sm font-medium leading-relaxed text-burgundy-accent">
            {errors.form}
          </p>
        ) : null}
        {done ? (
          <p role="status" className="mt-4 text-sm font-semibold leading-relaxed text-gold-deep">
            {tx(locale, t.reviews.success)}
          </p>
        ) : null}
      </form>
    </div>
  );
}