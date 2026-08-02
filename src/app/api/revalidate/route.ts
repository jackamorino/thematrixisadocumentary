import { revalidatePath } from 'next/cache';
import { NextResponse, type NextRequest } from 'next/server';
import { parseBody } from 'next-sanity/webhook';

export const runtime = 'nodejs';

/**
 * On-demand revalidation. A Sanity webhook posts here whenever content is published,
 * so changes (including the showVideos toggle) appear on the site immediately instead
 * of waiting for the 60s ISR window.
 *
 * Setup:
 *  1. Set SANITY_REVALIDATE_SECRET in the env (Vercel + local).
 *  2. In sanity.io/manage -> API -> Webhooks, add a webhook:
 *       URL: https://thematrixisadocumentary.com/api/revalidate
 *       Trigger on: create, update, delete
 *       Secret: same value as SANITY_REVALIDATE_SECRET
 */
export async function POST(req: NextRequest) {
  try {
    const { isValidSignature, body } = await parseBody<{ _type?: string; slug?: string }>(
      req,
      process.env.SANITY_REVALIDATE_SECRET
    );

    if (!isValidSignature) {
      return new NextResponse('Invalid signature', { status: 401 });
    }
    if (!body?._type) {
      return new NextResponse('Bad request', { status: 400 });
    }

    // Revalidate every route (site settings and the author affect the whole shell).
    revalidatePath('/', 'layout');

    return NextResponse.json({ revalidated: true, type: body._type });
  } catch (err) {
    console.error('[revalidate] error:', err);
    return new NextResponse('Error revalidating', { status: 500 });
  }
}
