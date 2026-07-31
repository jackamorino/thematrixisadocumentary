import { createHmac, timingSafeEqual } from 'node:crypto';

/**
 * Per-subscriber download tokens — no database required.
 *
 * token = base64url(email) + "." + base64url(HMAC-SHA256(secret, email))
 *
 * Each email yields a unique, unguessable token. The download route recomputes the
 * HMAC to verify it and recovers the email (so we know who downloaded). Because it's
 * derived from the email, a subscriber's link is stable — they can re-download from
 * an old email — while nobody can forge a link without the secret.
 *
 * Rotating DOWNLOAD_LINK_SECRET invalidates every previously issued link at once.
 */
const SECRET = process.env.DOWNLOAD_LINK_SECRET || '';

function sigFor(email: string): Buffer {
  return createHmac('sha256', SECRET).update(email).digest();
}

export function createDownloadToken(email: string): string {
  const e = email.trim().toLowerCase();
  const emailPart = Buffer.from(e, 'utf8').toString('base64url');
  const sigPart = sigFor(e).toString('base64url');
  return `${emailPart}.${sigPart}`;
}

/** Returns the verified email if the token is valid, else null. */
export function verifyDownloadToken(token: string | null): string | null {
  if (!SECRET || !token || !token.includes('.')) return null;
  const [emailPart, sigPart] = token.split('.');
  if (!emailPart || !sigPart) return null;

  let email: string;
  try {
    email = Buffer.from(emailPart, 'base64url').toString('utf8');
  } catch {
    return null;
  }
  if (!email) return null;

  const expected = sigFor(email.trim().toLowerCase()).toString('base64url');
  const a = Buffer.from(sigPart);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return null;
  return timingSafeEqual(a, b) ? email : null;
}
