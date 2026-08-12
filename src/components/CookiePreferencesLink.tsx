'use client';

/**
 * Footer "Cookie preferences" trigger. A <button>, not a link — it dispatches
 * the `openCookiePreferences` event that `CookieConsentBanner` listens for.
 * Separate client component so `Footer` can stay a server component.
 */
export function CookiePreferencesLink() {
  return (
    <button
      type="button"
      className="cookie-prefs-link"
      onClick={() => {
        window.dispatchEvent(new CustomEvent('openCookiePreferences'));
      }}
    >
      Cookie preferences
    </button>
  );
}
