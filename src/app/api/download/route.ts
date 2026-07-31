import { readFile } from 'node:fs/promises';
import { join } from 'node:path';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

/**
 * Serves the free sample (Prologue + Chapter One) from private storage — the file
 * is NOT in /public, so the only way to reach it is this route. The MailerLite
 * welcome automation emails a stable link:  /api/download?k=<DOWNLOAD_ACCESS_KEY>
 *
 * The key is a light gate so the PDF isn't discoverable without it. If
 * DOWNLOAD_ACCESS_KEY is unset, the route serves openly (still fine — it's a
 * giveaway), so local/dev works with zero config.
 */
export async function GET(req: Request) {
  const required = process.env.DOWNLOAD_ACCESS_KEY;
  if (required) {
    const key = new URL(req.url).searchParams.get('k');
    if (key !== required) {
      return new Response('Not found', { status: 404 });
    }
  }

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
