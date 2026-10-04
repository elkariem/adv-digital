import { headers } from "next/headers";

type Bucket = { count: number; resetAt: number };

/**
 * In-memory fixed-window limiter. Fine for a single-instance deployment, which
 * is what this site targets. A multi-instance or serverless host would need a
 * shared store (Redis/Upstash) instead.
 */
const buckets = new Map<string, Bucket>();

export const LIMITS = {
  tracking: { max: 20, windowMs: 60_000 },
  review: { max: 5, windowMs: 10 * 60_000 },
  login: { max: 10, windowMs: 10 * 60_000 },
} as const;

function prune(now: number) {
  if (buckets.size < 5000) return;
  for (const [key, bucket] of buckets) {
    if (bucket.resetAt <= now) buckets.delete(key);
  }
}

export function rateLimit(
  key: string,
  { max, windowMs }: { max: number; windowMs: number },
): { allowed: boolean; retryAfterSeconds: number } {
  const now = Date.now();
  prune(now);

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, retryAfterSeconds: 0 };
  }

  existing.count += 1;
  if (existing.count <= max) return { allowed: true, retryAfterSeconds: 0 };

  return { allowed: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
}

export async function clientAddress(): Promise<string> {
  const h = await headers();
  const forwarded = h.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function limitFor(
  scope: keyof typeof LIMITS,
  subject = "",
): Promise<{ allowed: boolean; retryAfterSeconds: number }> {
  const address = await clientAddress();
  return rateLimit(`${scope}:${address}:${subject}`, LIMITS[scope]);
}
