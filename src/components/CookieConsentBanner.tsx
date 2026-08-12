'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import {
  canUseAnalytics,
  hasConsent,
  isGpcEnabled,
  setConsent,
  subscribeToConsentChanges,
} from '@/lib/consent';
import { regionFromTimeZone, type Region } from '@/lib/regions';

const OPEN_MODAL_EVENT = 'openCookiePreferences';

export function CookieConsentBanner() {
  // Determined client-side (timezone heuristic) so the server tree stays
  // fully static. 'eu-like' until the mount effect resolves it.
  const [region, setRegion] = useState<Region>('eu-like');
  const [visible, setVisible] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  // Mount decision runs once so the banner never flashes for a returning
  // visitor (SSR renders nothing, first client tick decides).
  const decidedRef = useRef(false);
  // GPC always wins: captured on mount, enforced on modal open and save so a
  // GPC user can't re-enable analytics via the footer link.
  const [gpc, setGpc] = useState(false);
  useEffect(() => {
    setGpc(isGpcEnabled());
  }, []);

  const openModal = useCallback(() => {
    setAnalytics(gpc ? false : canUseAnalytics());
    setModalOpen(true);
  }, [gpc]);

  // Mount decision. Order matters:
  //   1. GPC always wins, regardless of region.
  //   2. Explicit stored consent: don't re-prompt.
  //   3. Non-EU with no consent: write opt-out default, show informational banner.
  //   4. EU with no consent: show blocking banner, no auto-write.
  useEffect(() => {
    if (decidedRef.current) return;
    decidedRef.current = true;

    const resolved = regionFromTimeZone();
    setRegion(resolved);

    if (isGpcEnabled()) {
      if (!hasConsent() || canUseAnalytics()) {
        setConsent({ analytics: false }, 'gpc');
      }
      return;
    }

    if (hasConsent()) return;

    if (resolved === 'other') {
      setConsent({ analytics: true }, 'auto-opt-out');
    }
    setVisible(true);
  }, []);

  // Footer "Cookie preferences" link opens the modal even after the banner is
  // gone. Only hide the banner on EXPLICIT choices — the auto-opt-out write on
  // mount also fires the event, and hiding on it would defeat the
  // informational variant for non-EU visitors.
  useEffect(() => {
    const onOpen = () => openModal();
    const unsubscribe = subscribeToConsentChanges(({ source }) => {
      if (source === 'auto-opt-out' || source === 'gpc') return;
      if (hasConsent()) setVisible(false);
    });
    window.addEventListener(OPEN_MODAL_EVENT, onOpen);
    return () => {
      window.removeEventListener(OPEN_MODAL_EVENT, onOpen);
      unsubscribe();
    };
  }, [openModal]);

  const acceptAll = () => {
    setConsent({ analytics: true }, 'banner-accept');
    setVisible(false);
  };
  const rejectAll = () => {
    setConsent({ analytics: false }, 'banner-reject');
    setVisible(false);
  };
  const savePreferences = () => {
    if (gpc) {
      setConsent({ analytics: false }, 'gpc');
    } else {
      setConsent({ analytics }, 'modal-save');
    }
    setModalOpen(false);
    setVisible(false);
  };

  const copy =
    region === 'eu-like'
      ? 'This site uses cookies to function. Analytics cookies stay off until you accept.'
      : 'This site uses cookies for functionality and analytics. You can reject or customize below.';

  return (
    <>
      {visible ? (
        <div role="region" aria-label="Cookie consent" className="cookie-banner">
          <div className="cookie-banner__inner">
            <p className="cookie-banner__text">{copy}</p>
            <div className="cookie-banner__actions">
              <button type="button" onClick={rejectAll} className="btn btn-outline btn-cookie">
                Reject all
              </button>
              <button type="button" onClick={openModal} className="cookie-banner__manage">
                Manage preferences
              </button>
              <button type="button" onClick={acceptAll} className="btn btn-primary btn-cookie">
                Accept all
              </button>
            </div>
          </div>
        </div>
      ) : null}
      <CookieConsentModal
        open={modalOpen}
        analytics={analytics}
        gpc={gpc}
        onAnalyticsChange={setAnalytics}
        onCancel={() => setModalOpen(false)}
        onSave={savePreferences}
      />
    </>
  );
}

type ModalProps = {
  open: boolean;
  analytics: boolean;
  gpc: boolean;
  onAnalyticsChange: (v: boolean) => void;
  onCancel: () => void;
  onSave: () => void;
};

function CookieConsentModal({
  open,
  analytics,
  gpc,
  onAnalyticsChange,
  onCancel,
  onSave,
}: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement | null>(null);

  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    if (open && !el.open) {
      try {
        el.showModal();
      } catch {
        // showModal throws if the element is disconnected or already open;
        // both are harmless here.
      }
    } else if (!open && el.open) {
      el.close();
    }
  }, [open]);

  // Native <dialog> fires 'close' on Escape. Treat as cancel.
  useEffect(() => {
    const el = dialogRef.current;
    if (!el) return;
    const onClose = () => onCancel();
    el.addEventListener('close', onClose);
    return () => el.removeEventListener('close', onClose);
  }, [onCancel]);

  return (
    <dialog ref={dialogRef} aria-labelledby="cookie-modal-title" className="cookie-modal">
      <div className="cookie-modal__body">
        <h2 id="cookie-modal-title" className="cookie-modal__title">
          Cookie preferences
        </h2>
        {gpc ? (
          <p className="cookie-modal__gpc">
            Your browser is sending a Global Privacy Control signal. Analytics
            cookies are locked off to honor this preference.
          </p>
        ) : null}
        <label className="cookie-modal__row">
          <span className="cookie-modal__row-text">
            <span className="cookie-modal__row-title">Strictly necessary</span>
            <span className="cookie-modal__row-desc">Required for the site to function.</span>
          </span>
          <input type="checkbox" checked disabled onChange={() => {}} />
        </label>
        <label className="cookie-modal__row">
          <span className="cookie-modal__row-text">
            <span className="cookie-modal__row-title">Analytics</span>
            <span className="cookie-modal__row-desc">
              Google Analytics page views and aggregate usage, to help us
              understand what readers find.
            </span>
          </span>
          <input
            type="checkbox"
            checked={gpc ? false : analytics}
            disabled={gpc}
            onChange={(e) => onAnalyticsChange(e.target.checked)}
          />
        </label>
        <div className="cookie-modal__actions">
          <button type="button" onClick={onCancel} className="btn btn-outline btn-cookie">
            Cancel
          </button>
          <button type="button" onClick={onSave} className="btn btn-primary btn-cookie">
            Save preferences
          </button>
        </div>
      </div>
    </dialog>
  );
}
