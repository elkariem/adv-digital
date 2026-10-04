"use client";

import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";
import { getStage, isStageId, STAGE_IDS } from "@/lib/stages";
import type { PublicCase } from "@/lib/public-case";
import { formatDate } from "@/lib/format";

type Status =
  | { kind: "idle" }
  | { kind: "loading" }
  | { kind: "error"; reason: string }
  | { kind: "found"; data: PublicCase };

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-[var(--radius-card)] border border-charcoal/10 bg-ivory/55 px-5 py-4">
      <dt className="text-[0.8125rem] font-bold uppercase tracking-[0.16em] text-gold-deep">
        {label}
      </dt>
      <dd className="mt-2 text-lg font-bold tracking-tight text-charcoal">{value}</dd>
    </div>
  );
}

/** The seven canonical markers. Advisory only — stages can be skipped or repeated. */
function StageTrack({ current }: { current: string }) {
  const currentIndex = STAGE_IDS.indexOf(current as (typeof STAGE_IDS)[number]);

  return (
    <ol className="flex items-center gap-2" aria-hidden="true">
      {STAGE_IDS.map((id, index) => {
        const passed = currentIndex > index;
        const active = currentIndex === index;
        return (
          <li key={id} className="flex-1">
            <span
              className={`block h-1.5 rounded-full transition-colors ${
                active ? "bg-gold-strong" : passed ? "bg-burgundy/55" : "bg-charcoal/12"
              }`}
            />
          </li>
        );
      })}
    </ol>
  );
}

export function CaseTracker({ locale }: { locale: Locale }) {
  const [code, setCode] = useState("");
  const [status, setStatus] = useState<Status>({ kind: "idle" });

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setStatus({ kind: "loading" });

    try {
      const response = await fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await response.json();

      if (!response.ok) {
        setStatus({ kind: "error", reason: data.reason ?? "generic" });
        return;
      }
      setStatus({ kind: "found", data: data.case as PublicCase });
    } catch {
      setStatus({ kind: "error", reason: "generic" });
    }
  }

  const errorMessage = (reason: string) => {
    if (reason === "notFound") return tx(locale, t.tracking.notFound);
    if (reason === "invalidCode") return tx(locale, t.tracking.invalidCode);
    if (reason === "rateLimited") return tx(locale, t.tracking.rateLimited);
    return tx(locale, t.tracking.genericError);
  };

  const found = status.kind === "found" ? status.data : null;
  const currentStage = found && isStageId(found.currentStage) ? getStage(found.currentStage) : null;

  return (
    <div>
      <form onSubmit={onSubmit} className="max-w-md">
        <label htmlFor="case-code" className="field-label">
          {tx(locale, t.tracking.inputLabel)}
        </label>
        <p className="mt-2 text-base leading-relaxed text-muted">
          {tx(locale, t.tracking.inputHint)}
        </p>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <input
            id="case-code"
            name="code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder={tx(locale, t.tracking.inputPlaceholder)}
            autoComplete="off"
            spellCheck={false}
            dir="ltr"
            className="field mt-0 min-w-0 flex-1"
          />
          <button
            type="submit"
            disabled={status.kind === "loading"}
            className="btn btn-primary shrink-0 disabled:opacity-60"
          >
            {status.kind === "loading"
              ? tx(locale, t.tracking.searching)
              : tx(locale, t.tracking.submit)}
          </button>
        </div>
      </form>

      <div aria-live="polite" className="mt-8">
        {status.kind === "error" ? (
          <p
            role="alert"
            className="rounded-[var(--radius-card)] border-s-2 border-burgundy-accent bg-burgundy-accent/[0.06] px-6 py-5 text-base leading-relaxed font-medium text-charcoal/85"
          >
            {errorMessage(status.reason)}
          </p>
        ) : null}

        {found && currentStage ? (
          <div className="mt-8 overflow-hidden rounded-[var(--radius-panel)] border border-charcoal/12 bg-white shadow-[0_1px_2px_rgba(74,21,37,0.05),0_28px_56px_-40px_rgba(74,21,37,0.5)]">
            <div className="border-b border-charcoal/10 bg-burgundy px-6 py-7 text-ivory sm:px-8">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-gold">
                    {tx(locale, t.tracking.resultStage)}
                  </p>
                  <p className="mt-2 text-2xl font-bold tracking-tight text-ivory sm:text-[1.75rem]">
                    {tx(locale, currentStage.title)}
                  </p>
                </div>
                <p
                  className="rounded-full border border-gold/45 bg-gold/12 px-4 py-1.5 font-mono text-lg font-bold tracking-wider text-gold"
                  dir="ltr"
                >
                  {found.code}
                </p>
              </div>
              <div className="mt-7">
                <StageTrack current={found.currentStage} />
              </div>
            </div>

            <dl className="grid gap-4 px-6 py-7 sm:grid-cols-2 sm:px-8">
              <Field label={tx(locale, t.tracking.resultDoctor)} value={found.doctorName} />
              <Field
                label={tx(locale, t.tracking.resultDelivery)}
                value={formatDate(found.expectedDelivery, locale)}
              />
            </dl>

            <div className="border-t border-charcoal/10 px-6 py-7 sm:px-8">
              <p className="text-[0.8125rem] font-bold uppercase tracking-[0.18em] text-gold-deep">
                {tx(locale, t.tracking.resultHistory)}
              </p>

              {found.history.length === 0 ? (
                <p className="mt-3 text-base text-muted">{tx(locale, t.tracking.historyEmpty)}</p>
              ) : (
                <ol className="mt-5 space-y-0">
                  {found.history.map((entry, index) => {
                    const isLast = index === found.history.length - 1;
                    const stage = isStageId(entry.stage) ? getStage(entry.stage) : null;
                    if (!stage) return null;

                    return (
                      <li
                          key={`${entry.stage}-${entry.changedAt}-${index}`}
                          className="flex gap-4"
                        >
                          <div className="flex flex-col items-center pt-2.5">
                            <span
                              className={`h-2.5 w-2.5 shrink-0 rounded-full ${
                                isLast ? "bg-gold-strong" : "bg-burgundy/30"
                              }`}
                            />
                            {index < found.history.length - 1 ? (
                              <span
                                className="mt-1 w-px flex-1 bg-charcoal/12"
                                aria-hidden="true"
                              />
                            ) : null}
                          </div>
                          <div
                            className={`mb-4 rounded-[var(--radius-field)] px-4 py-3 ${
                              isLast ? "bg-gold/12" : ""
                            }`}
                          >
                            <p
                              className={`text-base leading-snug ${
                                isLast ? "font-bold text-charcoal" : "font-semibold text-charcoal/80"
                              }`}
                            >
                              {tx(locale, stage.title)}
                            </p>
                            <p className="mt-1.5 text-sm text-muted">
                              {formatDate(entry.changedAt, locale)}
                            </p>
                          </div>
                        </li>
                    );
                  })}
                </ol>
              )}
            </div>

            <p className="border-t border-charcoal/10 bg-ivory/70 px-6 py-5 text-sm leading-relaxed text-muted sm:px-8">
              {tx(locale, t.tracking.resultHint)}
            </p>
          </div>
        ) : null}
      </div>
    </div>
  );
}