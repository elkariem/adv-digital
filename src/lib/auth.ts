import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "lab_session";
const SESSION_TTL_SECONDS = 60 * 60 * 12;

function requiredEnv(name: string): string {
  const value = process.env[name];
  if (!value) {
    throw new Error(
      `Missing ${name}. Copy .env.example to .env.local and set it before starting the server.`,
    );
  }
  return value;
}

/** Constant-time compare that does not leak length through early exit. */
export function verifyPassword(candidate: string): boolean {
  const expected = requiredEnv("MANAGEMENT_PASSWORD");
  const a = createHmac("sha256", "compare").update(candidate).digest();
  const b = createHmac("sha256", "compare").update(expected).digest();
  return timingSafeEqual(a, b);
}

function sign(value: string): string {
  return createHmac("sha256", requiredEnv("SESSION_SECRET")).update(value).digest("hex");
}

function tokenFor(expiresAt: number): string {
  return `${expiresAt}.${sign(String(expiresAt))}`;
}

function readToken(token: string | undefined): number | null {
  if (!token) return null;
  const separator = token.indexOf(".");
  if (separator < 1) return null;

  const expiresAt = Number(token.slice(0, separator));
  const signature = token.slice(separator + 1);
  if (!Number.isFinite(expiresAt) || signature.length === 0) return null;

  const expected = sign(String(expiresAt));
  const a = Buffer.from(signature, "hex");
  const b = Buffer.from(expected, "hex");
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;

  return expiresAt > Date.now() ? expiresAt : null;
}

export async function isAuthenticated(): Promise<boolean> {
  const store = await cookies();
  return readToken(store.get(SESSION_COOKIE)?.value) !== null;
}

export async function startSession(): Promise<void> {
  const store = await cookies();
  store.set(SESSION_COOKIE, tokenFor(Date.now() + SESSION_TTL_SECONDS * 1000), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_TTL_SECONDS,
  });
}

export async function endSession(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}
