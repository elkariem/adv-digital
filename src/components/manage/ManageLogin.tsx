"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { t, tx, type Locale } from "@/lib/i18n";

export function ManageLogin({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!password) {
      setError(tx(locale, t.manage.requiredPassword));
      return;
    }

    setBusy(true);
    setError(null);
    try {
      const response = await fetch("/api/manage/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!response.ok) {
        setError(tx(locale, t.manage.invalidPassword));
        return;
      }
      router.refresh();
    } catch {
      setError(tx(locale, t.manage.invalidPassword));
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm">
      <label
        htmlFor="manage-password"
        className="field-label"
      >
        {tx(locale, t.manage.passwordLabel)}
      </label>
      <input
        id="manage-password"
        type="password"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        placeholder={tx(locale, t.manage.passwordPlaceholder)}
        autoComplete="current-password"
        autoFocus
        className="field"
      />

      <button
        type="submit"
        disabled={busy}
        className="btn btn-primary mt-6 w-full disabled:opacity-60"
      >
        {busy ? tx(locale, t.manage.signingIn) : tx(locale, t.manage.signIn)}
      </button>

      {error ? (
        <p role="alert" className="mt-4 text-sm font-medium leading-relaxed text-burgundy-accent">
          {error}
        </p>
      ) : null}
    </form>
  );
}