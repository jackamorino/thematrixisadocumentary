import { NextResponse } from 'next/server';

import { createDownloadToken } from '@/lib/download-token';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// MailerLite custom-field key that carries each subscriber's unique download token.
// Create a text field with this key in MailerLite (Subscribers → Fields).
const TOKEN_FIELD = process.env.MAILERLITE_TOKEN_FIELD || 'download_token';

/**
 * Lead-magnet subscribe endpoint.
 *
 * Flow: capture email -> add to the MailerLite list/group. MailerLite's welcome
 * automation ("on join group -> send email with the download link") delivers the
 * free sample, and can drip follow-ups / newsletters over time. No email is sent
 * from here; the platform owns delivery, double opt-in, and unsubscribe handling.
 *
 * If MailerLite isn't configured yet, we still accept the address (logged) so the
 * form works locally and never fails a real signup on a config gap.
 */
export async function POST(req: Request) {
  let email = '';
  try {
    const body = await req.json();
    email = String(body?.email ?? '').trim().toLowerCase();
  } catch {
    return NextResponse.json({ error: 'Invalid request.' }, { status: 400 });
  }

  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: 'Please enter a valid email.' }, { status: 400 });
  }

  const provider = (process.env.EMAIL_PROVIDER || 'mailerlite').toLowerCase();

  try {
    switch (provider) {
      case 'mailerlite':
        await subscribeMailerLite(email);
        break;
      case 'resend':
        await subscribeResend(email);
        break;
      case 'convertkit':
        await subscribeConvertKit(email);
        break;
      case 'none':
      default:
        console.info(`[subscribe] (no ESP configured) captured: ${email}`);
        break;
    }
    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[subscribe] provider error:', err);
    return NextResponse.json(
      { error: 'Could not subscribe right now.' },
      { status: 502 }
    );
  }
}

async function subscribeMailerLite(email: string) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey) {
    // Not wired up yet — capture without failing the signup.
    console.warn(`[subscribe] MailerLite not configured; captured: ${email}`);
    return;
  }
  // Mint this subscriber's unique download token and store it in a custom field.
  // The MailerLite welcome email links to /api/download?t={$download_token}.
  const downloadToken = createDownloadToken(email);

  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      email,
      fields: { [TOKEN_FIELD]: downloadToken },
      ...(groupId ? { groups: [groupId] } : {}),
    }),
  });
  // 200/201 = created/updated; 422 with "already exists" is also fine.
  if (!res.ok && res.status !== 422) {
    throw new Error(`MailerLite ${res.status}`);
  }
}

async function subscribeResend(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) throw new Error('Resend not configured');
  const res = await fetch(
    `https://api.resend.com/audiences/${audienceId}/contacts`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: false }),
    }
  );
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

async function subscribeConvertKit(email: string) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) throw new Error('ConvertKit not configured');
  const res = await fetch(
    `https://api.convertkit.com/v3/forms/${formId}/subscribe`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ api_key: apiKey, email }),
    }
  );
  if (!res.ok) throw new Error(`ConvertKit ${res.status}`);
}
