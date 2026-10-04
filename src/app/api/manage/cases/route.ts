import { DuplicateCaseCodeError, createCase, listCases } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { caseSchema } from "@/lib/validation";

export async function GET() {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }
  return Response.json({ ok: true, cases: await listCases() });
}

export async function POST(request: Request) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  const parsed = caseSchema.safeParse(body);
  if (!parsed.success) {
    return Response.json({ ok: false, reason: "invalid" }, { status: 400 });
  }

  try {
    const created = await createCase(parsed.data);
    return Response.json({ ok: true, case: created }, { status: 201 });
  } catch (error) {
    if (error instanceof DuplicateCaseCodeError) {
      return Response.json({ ok: false, reason: "codeExists" }, { status: 409 });
    }
    throw error;
  }
}
