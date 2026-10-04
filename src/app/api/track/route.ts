import { getTrackedCase } from "@/lib/db";
import type { PublicCase } from "@/lib/public-case";
import { limitFor } from "@/lib/rate-limit";
import { trackSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = await limitFor("tracking");
  if (!limit.allowed) {
    return Response.json(
      { ok: false, reason: "rateLimited" },
      { status: 429, headers: { "Retry-After": String(limit.retryAfterSeconds) } },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalidCode" }, { status: 400 });
  }

  const parsed = trackSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, reason: "invalidCode" }, { status: 400 });
  }

  const found = await getTrackedCase(parsed.data.code);
  if (!found) {
    // Deliberately identical for "no such case" and every other miss.
    return Response.json({ ok: false, reason: "notFound" }, { status: 404 });
  }

  const payload: PublicCase = {
    code: found.code,
    doctorName: found.doctorName,
    expectedDelivery: found.expectedDelivery,
    currentStage: found.currentStage,
    history: found.history.map((entry) => ({ stage: entry.stage, changedAt: entry.changedAt })),
  };

  return Response.json({ ok: true, case: payload });
}
