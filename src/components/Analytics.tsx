'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';

import { canUseAnalytics, subscribeToConsentChanges } from '@/lib/consent';

/**
 * Consent-aware Google Analytics 4 loader.
 *
 * gtag is not loaded and no page-view fires until the visitor has granted
 * analytics consent (`canUseAnalytics()`). Responds to consent changes from
 * the same tab and other tabs so grants and revocations mid-session take
 * effect without a reload.
 *
 * Next injects the `<Script>` elements outside the React tree, so the gtag
 * loader stays in the DOM after unmount. To guarantee no further page-views
 * on revocation we also toggle Google's official kill switch —
 * `window['ga-disable-<measurementId>']` — on every consent change.
 */
export function Analytics({ measurementId }: { measurementId: string }) {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    const disableKey = `ga-disable-${measurementId}`;
    const sync = () => {
      const next = canUseAnalytics();
      setAllowed(next);
      (window as unknown as Record<string, boolean>)[disableKey] = !next;
    };
    sync();
    const unsubscribe = subscribeToConsentChanges(() => sync());
    return unsubscribe;
  }, [measurementId]);

  if (!allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        strategy="afterInteractive"
      />
      <Script id="gtag-init" strategy="afterInteractive">
        {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${measurementId}');`}
      </Script>
    </>
  );
}
