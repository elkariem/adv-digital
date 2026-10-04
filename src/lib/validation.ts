import { z } from "zod";
import { isValidCaseCode } from "./case-code";
import { STAGE_IDS } from "./stages";

const DATE_ONLY = /^\d{4}-\d{2}-\d{2}$/;

/** Rejects well-shaped but impossible dates such as 2026-02-31. */
const realDate = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const trackSchema = z.object({
  code: z
    .string()
    .trim()
    .min(1)
    .refine(isValidCaseCode, { message: "invalidCaseCode" }),
});

export const reviewSchema = z.object({
  doctorName: z.string().trim().min(2).max(120),
  clinicName: z.string().trim().max(120).optional().or(z.literal("")),
  text: z.string().trim().min(10).max(1500),
});

export const passwordSchema = z.object({
  password: z.string().min(1).max(200),
});

export const caseSchema = z.object({
  code: z.string().trim().min(1).refine(isValidCaseCode, { message: "invalidCaseCode" }),
  doctorName: z.string().trim().min(2).max(120),
  expectedDelivery: z
    .string()
    .trim()
    .refine((value) => DATE_ONLY.test(value) && realDate(value), { message: "invalidDate" }),
  currentStage: z.enum(STAGE_IDS),
});

/** Shape accepted by the case create/update endpoints. Also reused by the
 *  management form for client-side validation before submitting. */
export type CaseInput = z.infer<typeof caseSchema>;
