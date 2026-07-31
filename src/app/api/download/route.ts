import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

import { verifyDownloadToken } from '@/lib/download-token';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves the free sample (Prologue + Chapter One) from private storage — the file
 * is NOT in /public, so the only way to reach it is this route.
 *
 * Each subscriber gets a unique link. MailerLite's welcome automation inserts their
 * per-user token from a custom field:  /api/download?t={$download_token}
 * We verify the HMAC signature; an invalid/missing token 404s.
 */
export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get('t');
  const email = verifyDownloadToken(token);
  if (!email) {
    return new Response('Not found', { status: 404 });
  }
  // We know exactly who downloaded — useful for attribution/analytics.
  console.info(`[download] served sample to ${email}`);

  try {
    const filePath = join(process.cwd(), 'private', 'the-beginning.pdf');
    const pdf = await readFile(filePath);
    return new Response(pdf, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition':
          'attachment; filename="The Matrix is a Documentary - The Beginning.pdf"',
        'Cache-Control': 'private, max-age=0, no-store',
      },
    });
  } catch (err) {
    console.error('[download] could not read sample PDF:', err);
    return new Response('The sample is temporarily unavailable.', {
      status: 500,
    });
  }
}
