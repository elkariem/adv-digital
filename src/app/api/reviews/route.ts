import { createReview } from "@/lib/db";
import { limitFor } from "@/lib/rate-limit";
import { reviewSchema } from "@/lib/validation";

export async function POST(request: Request) {
  const limit = await limitFor("review");
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
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const clinicName = parsed.data.clinicName?.trim();

  // Reviews publish immediately by business decision.
  const review = await createReview({
    doctorName: parsed.data.doctorName,
    clinicName: clinicName ? clinicName : null,
    text: parsed.data.text,
  });

  return Response.json({ ok: true, review }, { status: 201 });
}
