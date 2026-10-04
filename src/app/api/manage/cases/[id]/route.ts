import { DuplicateCaseCodeError, updateCase } from "@/lib/db";
import { isAuthenticated } from "@/lib/auth";
import { caseSchema } from "@/lib/validation";

export async function PATCH(request: Request, context: { params: Promise<{ id: string }> }) {
  if (!(await isAuthenticated())) {
    return Response.json({ ok: false, reason: "unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;
  const caseId = Number(id);
  if (!Number.isInteger(caseId) || caseId <= 0) {
    return Response.json({ ok: false, reason: "notFound" }, { status: 404 });
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
    const updated = await updateCase(caseId, parsed.data);
    return Response.json({ ok: true, case: updated });
  } catch (error) {
    if (error instanceof DuplicateCaseCodeError) {
      return Response.json({ ok: false, reason: "codeExists" }, { status: 409 });
    }
    if (error instanceof Error && error.message === "Case not found") {
      return Response.json({ ok: false, reason: "notFound" }, { status: 404 });
    }
    throw error;
  }
}
