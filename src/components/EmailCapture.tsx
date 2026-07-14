'use client';

import Image from 'next/image';
import { useState } from 'react';

interface EmailCaptureProps {
  headline: string;
  blurb: string;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

/**
 * Lead-magnet signup (free Prologue + Chapter One). Posts to /api/subscribe, which
 * wires to the configured ESP. Success swaps the note text per the design spec.
 */
export function EmailCapture({ headline, blurb }: EmailCaptureProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<Status>('idle');

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || status === 'loading') return;
    setStatus('loading');
    try {
      const res = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? 'success' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const note =
    status === 'success'
      ? 'The Key is on its way. Check your inbox.'
      : status === 'error'
        ? 'Something went wrong. Please try again.'
        : 'No spam. Unsubscribe anytime.';

  return (
    <section className="signup" id="signup" aria-labelledby="signup-title">
      <div className="signup__inner">
        <Image
          src="/assets/key-of-love.png"
          alt="The Key of Love"
          width={220}
          height={330}
          className="signup__art"
          sizes="220px"
        />
        <div className="signup__copy">
          <h2 className="signup__title" id="signup-title">
            {headline}
          </h2>
          <p
            className="signup__blurb"
            dangerouslySetInnerHTML={{ __html: renderBlurb(blurb) }}
          />
          {status === 'success' ? (
            <p className="signup__note" role="status">
              {note}
            </p>
          ) : (
            <form className="signup__form" onSubmit={onSubmit}>
              <label htmlFor="signup-email" className="visually-hidden">
                Email address
              </label>
              <input
                id="signup-email"
                type="email"
                required
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="signup__input"
                autoComplete="email"
              />
              <button
                type="submit"
                className="btn btn-primary signup__submit"
                disabled={status === 'loading'}
                data-analytics="signup"
              >
                {status === 'loading' ? 'SENDING…' : 'SEND THE KEY'}
              </button>
            </form>
          )}
          {status !== 'success' && (
            <p className="signup__note" role="status">
              {note}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

/** Allow a single <em> emphasis in the blurb (e.g. the book/chapter title). */
function renderBlurb(blurb: string): string {
  const escaped = blurb
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
  // Restore emphasis around "Love's Whisper" if present.
  return escaped.replace(
    /(Love['’]s Whisper)/,
    '<em>$1</em>'
  );
}
