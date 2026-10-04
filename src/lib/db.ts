import { isUniqueViolation, supabase } from "./supabase";
import { normalizeCaseCode } from "./case-code";
import type { StageId } from "./stages";

export type CaseRow = {
  id: number;
  code: string;
  doctorName: string;
  expectedDelivery: string;
  currentStage: StageId;
  createdAt: string;
  updatedAt: string;
};

export type StageHistoryEntry = {
  stage: StageId;
  changedAt: string;
};

export type ReviewRow = {
  id: number;
  doctorName: string;
  clinicName: string | null;
  text: string;
  createdAt: string;
};

export type TrackedCase = CaseRow & { history: StageHistoryEntry[] };

export class DuplicateCaseCodeError extends Error {}

const now = () => new Date().toISOString();

/** Columns held in snake_case by PostgreSQL, mapped to the app's camelCase rows. */
type CasesDbRow = {
  id: number;
  code: string;
  doctor_name: string;
  expected_delivery: string;
  current_stage: string;
  created_at: string;
  updated_at: string;
};

type CaseStagesDbRow = {
  stage: string;
  changed_at: string;
};

type ReviewsDbRow = {
  id: number;
  doctor_name: string;
  clinic_name: string | null;
  text: string;
  created_at: string;
};

/**
 * Timestamps arrive as timestamptz in UTC with an offset suffix. Normalize them
 * back to the same `...Z` string the UI has always received.
 *
 * `expected_delivery` is deliberately NOT normalized: it is a real `date`
 * column and must stay a bare `YYYY-MM-DD` to satisfy <input type="date">.
 */
const toIso = (value: string) => new Date(value).toISOString();

function toCase(row: CasesDbRow): CaseRow {
  return {
    id: Number(row.id),
    code: row.code,
    doctorName: row.doctor_name,
    expectedDelivery: row.expected_delivery,
    currentStage: row.current_stage as StageId,
    createdAt: toIso(row.created_at),
    updatedAt: toIso(row.updated_at),
  };
}

/** Re-throws unique violations as the app-level error the routes already handle. */
function rethrow(error: { code?: string } | null, code: string): never {
  if (isUniqueViolation(error)) throw new DuplicateCaseCodeError(code);
  throw error;
}

export async function getTrackedCase(code: string): Promise<TrackedCase | null> {
  const { data, error } = await supabase
    .from("cases")
    .select("id, code, doctor_name, expected_delivery, current_stage, created_at, updated_at")
    .eq("code", normalizeCaseCode(code))
    .maybeSingle();

  if (error) throw error;
  if (!data) return null;

  const tracked = toCase(data as CasesDbRow);

  const { data: history, error: historyError } = await supabase
    .from("case_stages")
    .select("stage, changed_at")
    .eq("case_id", tracked.id)
    .order("id", { ascending: true });

  if (historyError) throw historyError;

  return {
    ...tracked,
    history: (history as CaseStagesDbRow[]).map((row) => ({
      stage: row.stage as StageId,
      changedAt: toIso(row.changed_at),
    })),
  };
}

export async function listCases(): Promise<CaseRow[]> {
  const { data, error } = await supabase
    .from("cases")
    .select("id, code, doctor_name, expected_delivery, current_stage, created_at, updated_at")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data as CasesDbRow[]).map(toCase);
}

/**
 * Stage history is written by the sync_case_stage_history trigger, so this is a
 * single insert. created_at and updated_at share one timestamp, which keeps the
 * opening history entry and created_at equal, as before.
 */
export async function createCase(input: {
  code: string;
  doctorName: string;
  expectedDelivery: string;
  currentStage: StageId;
}): Promise<CaseRow> {
  const code = normalizeCaseCode(input.code);
  const timestamp = now();

  const { data, error } = await supabase
    .from("cases")
    .insert({
      code,
      doctor_name: input.doctorName,
      expected_delivery: input.expectedDelivery,
      current_stage: input.currentStage,
      created_at: timestamp,
      updated_at: timestamp,
    })
    .select("id, code, doctor_name, expected_delivery, current_stage, created_at, updated_at")
    .single();

  if (error) rethrow(error, code);
  return toCase(data as CasesDbRow);
}

/**
 * The trigger appends history only when current_stage actually changed, so a
 * date-only edit leaves the timeline untouched while skips, backward moves, and
 * repeats all record normally.
 */
export async function updateCase(
  id: number,
  input: { code: string; doctorName: string; expectedDelivery: string; currentStage: StageId },
): Promise<CaseRow> {
  const code = normalizeCaseCode(input.code);

  const { data, error } = await supabase
    .from("cases")
    .update({
      code,
      doctor_name: input.doctorName,
      expected_delivery: input.expectedDelivery,
      current_stage: input.currentStage,
      updated_at: now(),
    })
    .eq("id", id)
    .select("id, code, doctor_name, expected_delivery, current_stage, created_at, updated_at");

  if (error) rethrow(error, code);
  // No rows matched means the case does not exist. The route maps this to 404.
  if (!data || data.length === 0) throw new Error("Case not found");

  return toCase(data[0] as CasesDbRow);
}

export async function listReviews(): Promise<ReviewRow[]> {
  const { data, error } = await supabase
    .from("reviews")
    .select("id, doctor_name, clinic_name, text, created_at")
    .order("id", { ascending: false });

  if (error) throw error;
  return (data as ReviewsDbRow[]).map((row) => ({
    id: Number(row.id),
    doctorName: row.doctor_name,
    clinicName: row.clinic_name ?? null,
    text: row.text,
    createdAt: toIso(row.created_at),
  }));
}

export async function createReview(input: {
  doctorName: string;
  clinicName: string | null;
  text: string;
}): Promise<ReviewRow> {
  const { data, error } = await supabase
    .from("reviews")
    .insert({
      doctor_name: input.doctorName,
      clinic_name: input.clinicName,
      text: input.text,
      created_at: now(),
    })
    .select("id, doctor_name, clinic_name, text, created_at")
    .single();

  if (error) throw error;
  const row = data as ReviewsDbRow;
  return {
    id: Number(row.id),
    doctorName: row.doctor_name,
    clinicName: row.clinic_name ?? null,
    text: row.text,
    createdAt: toIso(row.created_at),
  };
}

export async function deleteReview(id: number): Promise<boolean> {
  const { data, error } = await supabase.from("reviews").delete().eq("id", id).select("id");
  if (error) throw error;
  return Boolean(data && data.length > 0);
}