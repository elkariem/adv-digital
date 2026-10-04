"use client";

import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";
import { manufacturingStages } from "@/lib/stages";
import { toDateInputValue } from "@/lib/format";
import { caseSchema } from "@/lib/validation";
import type { CaseRow } from "@/lib/db";

export function CaseForm({
  locale,
  editing,
  onSaved,
  onCancel,
}: {
  locale: Locale;
  editing: CaseRow | null;
  onSaved: (record: CaseRow) => void;
  onCancel: () => void;
}) {
  const [code, setCode] = useState(editing?.code ?? "");
  const [doctorName, setDoctorName] = useState(editing?.doctorName ?? "");
  const [expectedDelivery, setExpectedDelivery] = useState(
    editing ? toDateInputValue(editing.expectedDelivery) : "",
  );
  const [currentStage, setCurrentStage] = useState(editing?.currentStage ?? manufacturingStages[0].id);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  // Re-seed the inputs whenever the owner selects a different case.
  const [seed, setSeed] = useState(editing?.id ?? null);
  if (seed !== (editing?.id ?? null)) {
    setSeed(editing?.id ?? null);
    setCode(editing?.code ?? "");
    setDoctorName(editing?.doctorName ?? "");
    setExpectedDelivery(editing ? toDateInputValue(editing.expectedDelivery) : "");
    setCurrentStage(editing?.currentStage ?? manufacturingStages[0].id);
    setError(null);
  }

async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    setBusy(true);
    setError(null);

    // Validate locally first so the owner gets a specific message instead of a
    // generic failure. The API still re-validates and remains authoritative.
    const parsed = caseSchema.safeParse({
      code,
      doctorName,
      expectedDelivery,
      currentStage,
    });
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message);
      setError(
        messages.includes("invalidDate")
          ? tx(locale, t.manage.errorInvalidDate)
          : tx(locale, t.manage.errorRequired),
      );
      setBusy(false);
      return;
    }

    try {
      const response = await fetch(
        editing ? `/api/manage/cases/${editing.id}` : "/api/manage/cases",
        {
          method: editing ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(parsed.data),
        },
      );
      const data = await response.json();

      if (!response.ok) {
        if (data.reason === "codeExists") setError(tx(locale, t.manage.errorCodeExists));
        else setError(tx(locale, t.manage.errorGeneric));
        return;
      }

      onSaved(data.case as CaseRow);

      if (!editing) {
        setCode("");
        setDoctorName("");
        setExpectedDelivery("");
        setCurrentStage(manufacturingStages[0].id);
      }
    } catch {
      setError(tx(locale, t.manage.errorGeneric));
    } finally {
      setBusy(false);
    }
  }

  const label = "field-label";
  const input =
    "field";

  return (
    <form onSubmit={onSubmit} className="rounded-[var(--radius-card)] border border-charcoal/12 bg-white p-6 shadow-[0_1px_2px_rgba(74,21,37,0.04),0_18px_40px_-32px_rgba(74,21,37,0.4)]">
      <h2 className="text-xl font-bold tracking-tight text-charcoal">
        {editing ? tx(locale, t.manage.editCaseHeading) : tx(locale, t.manage.newCaseHeading)}
      </h2>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="case-code" className={label}>
            {tx(locale, t.manage.caseCode)}
          </label>
          <input
            id="case-code"
            value={code}
            onChange={(event) => setCode(event.target.value)}
            placeholder="1024"
            dir="ltr"
            autoComplete="off"
            className={input}
          />
          <p className="mt-2 text-sm text-muted">{tx(locale, t.manage.caseCodeHint)}</p>
        </div>

        <div>
          <label htmlFor="case-doctor" className={label}>
            {tx(locale, t.manage.doctorName)}
          </label>
          <input
            id="case-doctor"
            value={doctorName}
            onChange={(event) => setDoctorName(event.target.value)}
            placeholder={tx(locale, t.manage.doctorNamePlaceholder)}
            autoComplete="off"
            className={input}
          />
        </div>

        <div>
          <label htmlFor="case-delivery" className={label}>
            {tx(locale, t.manage.expectedDelivery)}
          </label>
          <input
            id="case-delivery"
            type="date"
            value={expectedDelivery}
            onChange={(event) => setExpectedDelivery(event.target.value)}
            className={input}
          />
        </div>

        <div>
          <label htmlFor="case-stage" className={label}>
            {tx(locale, t.manage.currentStage)}
          </label>
          <select
            id="case-stage"
            value={currentStage}
            onChange={(event) => setCurrentStage(event.target.value)}
            className={input}
          >
            {manufacturingStages.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {tx(locale, stage.title)}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={busy}
          className="btn btn-primary disabled:opacity-60"
        >
          {busy ? tx(locale, t.manage.saving) : tx(locale, t.manage.save)}
        </button>

        {editing ? (
<button
            type="button"
            onClick={onCancel}
            className="btn border border-charcoal/20 text-charcoal hover:border-gold-strong hover:bg-gold/10"
          >
            {tx(locale, t.manage.cancel)}
          </button>
        ) : null}
      </div>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium leading-relaxed text-burgundy-accent">
          {error}
        </p>
      ) : null}
    </form>
  );
}