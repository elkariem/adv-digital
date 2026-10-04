"use client";

import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";
import { getStage, isStageId } from "@/lib/stages";
import { formatDate, formatDateTime } from "@/lib/format";
import type { CaseRow, ReviewRow } from "@/lib/db";
import { CaseForm } from "./CaseForm";
import { ReviewManager } from "./ReviewManager";

type Tab = "cases" | "reviews";

export function ManagePanel({
  locale,
  initialCases,
  initialReviews,
}: {
  locale: Locale;
  initialCases: CaseRow[];
  initialReviews: ReviewRow[];
}) {
  const [tab, setTab] = useState<Tab>("cases");
  const [cases, setCases] = useState<CaseRow[]>(initialCases);
  const [reviews, setReviews] = useState<ReviewRow[]>(initialReviews);
  const [editing, setEditing] = useState<CaseRow | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  function handleSaved(record: CaseRow) {
    setCases((previous) => {
      const exists = previous.some((item) => item.id === record.id);
      return exists ? previous.map((item) => (item.id === record.id ? record : item)) : [record, ...previous];
    });
    setNotice(tx(locale, editing ? t.manage.updated : t.manage.created));
    setEditing(null);
  }

  function handleReviewDeleted(id: number) {
    setReviews((previous) => previous.filter((review) => review.id !== id));
    setNotice(tx(locale, t.manage.reviewDeleted));
  }

  const tabs: { key: Tab; label: string; count: number }[] = [
    { key: "cases", label: tx(locale, t.manage.casesTab), count: cases.length },
    { key: "reviews", label: tx(locale, t.manage.reviewsTab), count: reviews.length },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="segmented" role="tablist" aria-label={tx(locale, t.manage.title)}>
          {tabs.map((item) => (
            <button
              key={item.key}
              type="button"
              role="tab"
              id={`tab-${item.key}`}
              aria-selected={tab === item.key}
              aria-controls={`panel-${item.key}`}
              onClick={() => setTab(item.key)}
              className="segmented-item"
            >
              {item.label}
              <span className="segmented-count">{item.count}</span>
            </button>
          ))}
        </div>

        {notice ? (
          <p
            role="status"
            className="inline-flex w-fit items-center gap-2 rounded-full bg-gold/15 px-4 py-2 text-base font-semibold text-gold-deep"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gold-strong" aria-hidden="true" />
            {notice}
          </p>
        ) : null}
      </div>

      {tab === "cases" ? (
        <div
          id="panel-cases"
          role="tabpanel"
          aria-labelledby="tab-cases"
          className="panel mt-7 grid gap-0 lg:grid-cols-[0.95fr_1.05fr]"
        >
          <div className="border-b border-charcoal/10 bg-ivory/45 p-6 sm:p-8 lg:border-b-0 lg:border-e">
            <CaseForm
              locale={locale}
              editing={editing}
              onSaved={handleSaved}
              onCancel={() => setEditing(null)}
            />
          </div>

          <div className="p-6 sm:p-8">
            <h2 className="text-lg font-bold tracking-tight text-charcoal">
              {tx(locale, t.manage.casesTab)}
            </h2>

            {cases.length === 0 ? (
              <div className="panel-inset mt-5 px-6 py-14 text-center">
                <span
                  aria-hidden="true"
                  className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-burgundy/10"
                >
                  <svg
                    width="22"
                    height="22"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    className="text-burgundy-accent"
                    aria-hidden="true"
                  >
                    <path d="M4 7h16M4 12h16M4 17h10" strokeLinecap="round" />
                  </svg>
                </span>
                <p className="mt-4 text-base font-semibold text-charcoal/85">
                  {tx(locale, t.manage.noCases)}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {tx(locale, t.manage.noCasesHint)}
                </p>
              </div>
            ) : (
              <ul className="mt-5 grid gap-3">
                {cases.map((record) => {
                  const stage = isStageId(record.currentStage) ? getStage(record.currentStage) : null;
                  const isActive = editing?.id === record.id;
                  return (
                    <li key={record.id}>
                      <button
                        type="button"
                        onClick={() => {
                          setEditing(record);
                          setNotice(null);
                        }}
                        aria-pressed={isActive}
                        className={`group w-full rounded-[var(--radius-card)] border p-5 text-start transition-all duration-300 ${
                          isActive
                            ? "border-gold-strong bg-gold/[0.07] shadow-[0_14px_30px_-24px_rgba(74,21,37,0.55)]"
                            : "border-charcoal/12 bg-white hover:-translate-y-0.5 hover:border-gold-strong/60 hover:shadow-[0_18px_34px_-28px_rgba(74,21,37,0.45)]"
                        }`}
                      >
                        <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                          <span
                            className="rounded-full bg-burgundy/10 px-3 py-1 font-mono text-[0.95rem] font-bold tracking-wider text-burgundy-accent"
                            dir="ltr"
                          >
                            {record.code}
                          </span>
                          <span className="text-sm text-muted">
                            {tx(locale, t.manage.updatedAtLabel)}{" "}
                            {formatDateTime(record.updatedAt, locale)}
                          </span>
                        </div>

                        <p className="mt-3 text-lg font-bold tracking-tight text-charcoal">
                          {record.doctorName}
                        </p>

                        <div className="mt-2.5 flex flex-wrap items-center gap-2 text-sm">
                          <span className="rounded-full bg-ivory px-3 py-1 text-muted">
                            {tx(locale, t.tracking.resultDelivery)}:{" "}
                            {formatDate(record.expectedDelivery, locale)}
                          </span>
                          <span className="rounded-full bg-gold/20 px-3 py-1 font-semibold text-gold-deep">
                            {stage ? tx(locale, stage.title) : record.currentStage}
                          </span>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      ) : (
        <div id="panel-reviews" role="tabpanel" aria-labelledby="tab-reviews" className="panel mt-7 p-6 sm:p-8">
          <ReviewManager
            locale={locale}
            initialReviews={reviews}
            onDeleted={handleReviewDeleted}
          />
        </div>
      )}
    </div>
  );
}