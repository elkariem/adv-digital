import { deleteReview } from "@/lib/db";
import { verifyPassword } from "@/lib/auth";
import { limitFor } from "@/lib/rate-limit";
import { passwordSchema } from "@/lib/validation";

/** Deleting a review is the one destructive action, so it re-checks the password. */
export async function DELETE(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const reviewId = Number(id);
  if (!Number.isInteger(reviewId) || reviewId <= 0) {
    return Response.json({ ok: false, reason: "notFound" }, { status: 404 });
  }

  const limit = await limitFor("login");
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
    return Response.json({ ok: false, reason: "invalidPassword" }, { status: 400 });
  }

  const parsed = passwordSchema.safeParse(body);
  if (!parsed.success || !verifyPassword(parsed.data.password)) {
    return Response.json({ ok: false, reason: "invalidPassword" }, { status: 401 });
  }

  if (!(await deleteReview(reviewId))) {
    return Response.json({ ok: false, reason: "notFound" }, { status: 404 });
  }

  return Response.json({ ok: true });
}
