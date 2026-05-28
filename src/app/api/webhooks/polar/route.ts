import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

/**
 * POST /api/webhooks/polar
 * Receives Polar.sh webhook events and updates user subscription status in Supabase.
 *
 * Setup in Polar.sh dashboard:
 *  1. Go to Settings > Webhooks and add your URL: https://yourapp.com/api/webhooks/polar
 *  2. Set POLAR_WEBHOOK_SECRET in your .env.local / Vercel env vars
 *  3. Subscribe to the `subscription.created` and `subscription.active` events.
 *
 * Supabase setup:
 *  - Ensure your `profiles` table has a boolean column `is_pro`.
 *  - Add SUPABASE_SERVICE_ROLE_KEY to your Vercel environment variables.
 */

export async function POST(req: NextRequest) {
  // Lazy-initialize admin client inside the handler so it only runs at request time,
  // not during build — prevents "supabaseKey is required" build error.
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[Polar Webhook] Supabase env vars not set');
    return NextResponse.json(
      { error: 'Server misconfigured: missing Supabase credentials' },
      { status: 500 }
    );
  }

  // Service role client — bypasses RLS to update user records
  const adminSupabase = createClient(supabaseUrl, serviceRoleKey);

  const body = await req.text();
  const signature = req.headers.get('webhook-signature');

  // Verify signature
  const secret = process.env.POLAR_WEBHOOK_SECRET;
  if (secret && signature !== secret) {
    return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
  }

  let event: Record<string, unknown>;
  try {
    event = JSON.parse(body);
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const type = event.type as string;
  console.log('[Polar Webhook] Event received:', type);

  if (type === 'subscription.created' || type === 'subscription.active') {
    const data = event.data as Record<string, unknown>;
    const metadata = (data?.metadata ?? {}) as Record<string, string>;
    const userId = metadata.user_id;

    if (!userId) {
      console.error('[Polar Webhook] No user_id in metadata');
      return NextResponse.json({ error: 'No user_id in metadata' }, { status: 400 });
    }

    const { error } = await adminSupabase
      .from('profiles')
      .update({ is_pro: true })
      .eq('id', userId);

    if (error) {
      console.error('[Polar Webhook] Failed to update profile:', error.message);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    console.log(`[Polar Webhook] User ${userId} upgraded to PRO ✅`);
  }

  if (type === 'subscription.canceled' || type === 'subscription.revoked') {
    const data = event.data as Record<string, unknown>;
    const metadata = (data?.metadata ?? {}) as Record<string, string>;
    const userId = metadata.user_id;

    if (userId) {
      await adminSupabase.from('profiles').update({ is_pro: false }).eq('id', userId);
      console.log(`[Polar Webhook] User ${userId} downgraded from PRO`);
    }
  }

  return NextResponse.json({ received: true });
}
