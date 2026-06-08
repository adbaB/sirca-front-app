/* ──────────────────────────────────────────────────────
   SIRCA Dashboard — Auth Helpers (zero dependencies)
   Uses Web Crypto API (HMAC SHA-256) for token signing.
   ────────────────────────────────────────────────────── */

const ALGORITHM = { name: 'HMAC', hash: 'SHA-256' } as const;
const ENCODER = new TextEncoder();

/** Get the secret key from env, cached per process */
function getSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error('AUTH_SECRET is not defined in environment');
  return secret;
}

/** Import the secret as a CryptoKey for HMAC operations */
async function getCryptoKey(): Promise<CryptoKey> {
  return crypto.subtle.importKey('raw', ENCODER.encode(getSecret()), ALGORITHM, false, [
    'sign',
    'verify',
  ]);
}

/** Base64url encode a buffer */
function base64url(buffer: ArrayBuffer | Uint8Array): string {
  const bytes = buffer instanceof Uint8Array ? buffer : new Uint8Array(buffer);
  let binary = '';
  for (const b of bytes) binary += String.fromCharCode(b);
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

/** Base64url decode to ArrayBuffer */
function base64urlDecode(str: string): ArrayBuffer {
  const padded = str.replace(/-/g, '+').replace(/_/g, '/');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
  return bytes.buffer;
}

/**
 * Sign a payload and return a compact token: base64url(payload).base64url(signature)
 * Token expires after `expiresInMs` (default 24h).
 */
export async function signToken(
  payload: Record<string, unknown>,
  expiresInMs = 24 * 60 * 60 * 1000,
): Promise<string> {
  const key = await getCryptoKey();
  const data = {
    ...payload,
    exp: Date.now() + expiresInMs,
  };
  const payloadB64 = base64url(ENCODER.encode(JSON.stringify(data)));
  const signature = await crypto.subtle.sign('HMAC', key, ENCODER.encode(payloadB64));
  return `${payloadB64}.${base64url(signature)}`;
}

/**
 * Verify a token and return the payload, or null if invalid/expired.
 */
export async function verifyToken(token: string): Promise<Record<string, unknown> | null> {
  try {
    const [payloadB64, signatureB64] = token.split('.');
    if (!payloadB64 || !signatureB64) return null;

    const key = await getCryptoKey();
    const valid = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(signatureB64),
      ENCODER.encode(payloadB64),
    );
    if (!valid) return null;

    const decoded = JSON.parse(new TextDecoder().decode(base64urlDecode(payloadB64)));

    // Check expiration
    if (typeof decoded.exp === 'number' && decoded.exp < Date.now()) return null;

    return decoded;
  } catch {
    return null;
  }
}
