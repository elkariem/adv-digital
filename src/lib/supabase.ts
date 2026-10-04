import "server-only";

import { createClient } from "@supabase/supabase-js";

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Add it to .env.local. See .env.example for the expected values.`,
    );
  }
  return value;
}

/**
 * The client appends `/rest/v1` to the project URL itself, so a URL copied
 * straight from the dashboard's REST section (which ends in `/rest/v1/`) would
 * otherwise produce a doubled path and PostgREST error PGRST125.
 */
function projectUrl(raw: string): string {
  return raw.trim().replace(/\/+$/, "").replace(/\/rest\/v1$/i, "");
}

/**
 * Service-role client for all database access.
 *
 * `import "server-only"` at the top means the build fails immediately if any
 * client component ever imports this module, so the service-role key can never
 * reach the browser bundle.
 *
 * RLS is enabled with no policies on cases/case_stages/reviews, so this key is
 * the only way in — which is why every read and write must go through a Server
 * Component or Route Handler, never straight from the browser.
 */
export const supabase = createClient(
  projectUrl(requiredEnv("SUPABASE_URL")),
  requiredEnv("SUPABASE_SERVICE_ROLE_KEY"),
  {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  },
);

/** PostgreSQL unique_violation. */
export const UNIQUE_VIOLATION = "23505";

export function isUniqueViolation(error: unknown): boolean {
  return typeof error === "object" && error !== null && (error as { code?: string }).code === UNIQUE_VIOLATION;
}
