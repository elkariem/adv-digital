import { startSession, verifyPassword } from "@/lib/auth";
import { limitFor } from "@/lib/rate-limit";
import { passwordSchema } from "@/lib/validation";

export async function POST(request: Request) {
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

  await startSession();
  return Response.json({ ok: true });
}
