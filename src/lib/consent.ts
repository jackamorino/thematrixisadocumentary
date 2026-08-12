/**
 * Cookie-consent utilities for thematrixisadocumentary.com.
 *
 * A JSON payload stored under `tmiad_consent`, origin-only (no `Domain=`
 * attribute). One non-essential category: analytics (GA4). All accessors are
 * SSR-safe (guarded on `typeof document`/`window`/`navigator`).
 */

export type ConsentPayload = {
  v: 1;
  essential: true;
  analytics: boolean;
  /** Unix ms when the user (or the auto-opt-out region default) set this. */
  ts: number;
};

export const COOKIE_NAME = 'tmiad_consent';
export const COOKIE_MAX_AGE_SECONDS = 365 * 24 * 60 * 60;

const CONSENT_EVENT = 'cookieConsentChanged';
const BROADCAST_CHANNEL_NAME = 'tmiad_consent';

let broadcastChannel: BroadcastChannel | null = null;
function getBroadcastChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (broadcastChannel) return broadcastChannel;
  try {
    broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
  } catch {
    broadcastChannel = null;
  }
  return broadcastChannel;
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const cookies = document.cookie ? document.cookie.split(';') : [];
  for (const raw of cookies) {
    const idx = raw.indexOf('=');
    if (idx === -1) continue;
    const k = raw.slice(0, idx).trim();
    if (k === name) return raw.slice(idx + 1).trim();
  }
  return null;
}

function writeCookie(name: string, value: string, maxAgeSeconds: number): void {
  if (typeof document === 'undefined') return;
  const secure =
    typeof window !== 'undefined' && window.location?.protocol === 'https:'
      ? '; Secure'
      : '';
  document.cookie = `${name}=${value}; path=/; max-age=${maxAgeSeconds}; SameSite=Lax${secure}`;
}

function deleteCookie(name: string): void {
  if (typeof document === 'undefined') return;
  document.cookie = `${name}=; path=/; max-age=0; SameSite=Lax`;
}

/** Read the stored consent payload, or `null` if none / malformed. */
export function getConsent(): ConsentPayload | null {
  const raw = readCookie(COOKIE_NAME);
  if (!raw) return null;
  try {
    const decoded = decodeURIComponent(raw);
    const parsed = JSON.parse(decoded) as Partial<ConsentPayload>;
    if (
      parsed &&
      parsed.v === 1 &&
      parsed.essential === true &&
      typeof parsed.analytics === 'boolean' &&
      typeof parsed.ts === 'number'
    ) {
      return parsed as ConsentPayload;
    }
    return null;
  } catch {
    return null;
  }
}

/** True when the visitor has an explicit stored choice. */
export function hasConsent(): boolean {
  return getConsent() !== null;
}

export function canUseAnalytics(): boolean {
  return getConsent()?.analytics === true;
}

/**
 * Subscribe to consent changes from EITHER the local CustomEvent (same tab)
 * OR the BroadcastChannel (other tabs). Returns an unsubscribe function.
 */
export function subscribeToConsentChanges(
  cb: (info: { source?: string; crossTab: boolean }) => void,
): () => void {
  if (typeof window === 'undefined') return () => {};
  const localHandler = (e: Event) => {
    const detail = (e as CustomEvent<{ source?: string }>).detail;
    cb({ source: detail?.source, crossTab: false });
  };
  window.addEventListener(CONSENT_EVENT, localHandler);
  const channel = getBroadcastChannel();
  const messageHandler = (e: MessageEvent<{ source?: string }>) => {
    cb({ source: e.data?.source, crossTab: true });
  };
  channel?.addEventListener('message', messageHandler);
  return () => {
    window.removeEventListener(CONSENT_EVENT, localHandler);
    channel?.removeEventListener('message', messageHandler);
  };
}

function dispatchChange(consent: ConsentPayload | null, source: string): void {
  if (typeof window === 'undefined') return;
  try {
    window.dispatchEvent(
      new CustomEvent(CONSENT_EVENT, { detail: { consent, source } }),
    );
  } catch {
    // Older engines without CustomEvent: no-op.
  }
  const channel = getBroadcastChannel();
  if (channel) {
    try {
      channel.postMessage({ source, at: Date.now() });
    } catch {
      // Cross-tab notification is best-effort; local listeners already fired.
    }
  }
}

/**
 * Persist a consent choice and notify listeners.
 * @param source label for the origin of the change (banner-accept /
 *   banner-reject / modal-save / gpc / auto-opt-out).
 */
export function setConsent(
  input: { analytics: boolean },
  source: string = 'programmatic',
): void {
  const payload: ConsentPayload = {
    v: 1,
    essential: true,
    analytics: input.analytics,
    ts: Date.now(),
  };
  writeCookie(
    COOKIE_NAME,
    encodeURIComponent(JSON.stringify(payload)),
    COOKIE_MAX_AGE_SECONDS,
  );
  dispatchChange(payload, source);
}

/** Remove the stored consent and notify listeners. */
export function clearConsent(source: string = 'programmatic'): void {
  deleteCookie(COOKIE_NAME);
  dispatchChange(null, source);
}

/**
 * True when the visitor's browser is sending the Global Privacy Control
 * signal. Treated as a universal opt-out for analytics regardless of region.
 */
export function isGpcEnabled(): boolean {
  if (typeof navigator === 'undefined') return false;
  return (
    (navigator as Navigator & { globalPrivacyControl?: boolean })
      .globalPrivacyControl === true
  );
}
