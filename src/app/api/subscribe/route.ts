import { NextResponse } from 'next/server';

export const runtime = 'nodejs';

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Lead-magnet subscribe endpoint. Delivers the free Prologue + Chapter One offer
 * by adding the subscriber to the configured ESP. Provider is chosen via
 * EMAIL_PROVIDER; 'none' (default) validates and accepts without an external call
 * so the flow works locally before an ESP is wired up.
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

  const provider = (process.env.EMAIL_PROVIDER || 'none').toLowerCase();

  try {
    switch (provider) {
      case 'resend':
        await subscribeResend(email);
        break;
      case 'convertkit':
        await subscribeConvertKit(email);
        break;
      case 'mailerlite':
        await subscribeMailerLite(email);
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

async function subscribeResend(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const audienceId = process.env.RESEND_AUDIENCE_ID;
  if (!apiKey || !audienceId) throw new Error('Resend not configured');
  const res = await fetch(`https://api.resend.com/audiences/${audienceId}/contacts`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
  });
  if (!res.ok) throw new Error(`Resend ${res.status}`);
}

async function subscribeConvertKit(email: string) {
  const apiKey = process.env.CONVERTKIT_API_KEY;
  const formId = process.env.CONVERTKIT_FORM_ID;
  if (!apiKey || !formId) throw new Error('ConvertKit not configured');
  const res = await fetch(`https://api.convertkit.com/v3/forms/${formId}/subscribe`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ api_key: apiKey, email }),
  });
  if (!res.ok) throw new Error(`ConvertKit ${res.status}`);
}

async function subscribeMailerLite(email: string) {
  const apiKey = process.env.MAILERLITE_API_KEY;
  const groupId = process.env.MAILERLITE_GROUP_ID;
  if (!apiKey) throw new Error('MailerLite not configured');
  const res = await fetch('https://connect.mailerlite.com/api/subscribers', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, ...(groupId ? { groups: [groupId] } : {}) }),
  });
  if (!res.ok) throw new Error(`MailerLite ${res.status}`);
}
