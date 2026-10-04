"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { t, tx, type Locale } from "@/lib/i18n";

export function SignOutButton({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  return (
    <button
      type="button"
      disabled={busy}
      onClick={async () => {
        setBusy(true);
        await fetch("/api/manage/logout", { method: "POST" });
        router.refresh();
      }}
      className="rounded-full border border-ivory/30 px-3.5 py-2 text-[0.95rem] font-semibold text-ivory/90 transition-colors hover:border-gold hover:text-gold disabled:opacity-60"
    >
      {tx(locale, t.manage.signOut)}
    </button>
  );
}