export const CASE_CODE_PREFIX = "GD-";

/** Upper bound on the numeric part, to keep codes short and committable over WhatsApp. */
export const MAX_CASE_CODE_DIGITS = 8;

const DIGITS = new RegExp(`^\\d{1,${MAX_CASE_CODE_DIGITS}}$`);

/**
 * Canonical form of a case code: trimmed, uppercased, and prefixed with "GD-"
 * when the owner supplied only the number. The stored value is always the
 * result of this function, so uniqueness is enforced on a single spelling.
 */
export function normalizeCaseCode(input: string): string {
  const collapsed = input.trim().toUpperCase().replace(/\s+/g, "");
  const digits = collapsed.startsWith(CASE_CODE_PREFIX)
    ? collapsed.slice(CASE_CODE_PREFIX.length)
    : collapsed;
  return `${CASE_CODE_PREFIX}${digits}`;
}

/** True when the input normalizes into a usable case code. */
export function isValidCaseCode(input: string): boolean {
  return DIGITS.test(normalizeCaseCode(input).slice(CASE_CODE_PREFIX.length));
}
