// Uses the Web Crypto API (crypto.subtle), not Node's `crypto` module —
// this file is imported by middleware.ts, which runs on Vercel's Edge
// runtime and does not support Node's crypto module, only Web Crypto.

const SESSION_TTL_MS = 12 * 60 * 60 * 1000; // 12 hours

function getSecret(): string {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret) throw new Error("ADMIN_SESSION_SECRET environment variable is not set");
  return secret;
}

async function getKey(secret: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  return crypto.subtle.importKey("raw", encoder.encode(secret), { name: "HMAC", hash: "SHA-256" }, false, ["sign", "verify"]);
}

function toHex(buffer: ArrayBuffer): string {
  return Array.from(new Uint8Array(buffer))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(): Promise<string> {
  const expires = Date.now() + SESSION_TTL_MS;
  const payload = `${expires}`;
  const key = await getKey(getSecret());
  const signatureBuf = await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload));
  return `${payload}.${toHex(signatureBuf)}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const [payload, signature] = token.split(".");
  if (!payload || !signature) return false;

  const expires = Number(payload);
  if (Number.isNaN(expires) || Date.now() > expires) return false;

  try {
    const key = await getKey(getSecret());
    const signatureBytes = new Uint8Array(signature.match(/.{1,2}/g)?.map((b) => parseInt(b, 16)) ?? []);
    return await crypto.subtle.verify("HMAC", key, signatureBytes, new TextEncoder().encode(payload));
  } catch {
    return false;
  }
}
