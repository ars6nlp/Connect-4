import { NextRequest, NextResponse } from 'next/server';

/**
 * POST /api/polar/checkout
 * Generates a Polar.sh checkout URL for the Connect PRO subscription.
 * Body: { email?: string, userId: string }
 *
 * Setup:
 *  1. Create a product in your Polar.sh dashboard.
 *  2. Add POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID to your .env.local
 */
export async function POST(req: NextRequest) {
  const { email, userId } = await req.json();

  const accessToken = process.env.POLAR_ACCESS_TOKEN;
  const productId   = process.env.POLAR_PRODUCT_ID;

  if (!accessToken || !productId) {
    return NextResponse.json(
      { error: 'Polar.sh is not configured. Set POLAR_ACCESS_TOKEN and POLAR_PRODUCT_ID in your environment.' },
      { status: 500 }
    );
  }

  try {
    const res = await fetch('https://api.polar.sh/v1/checkouts/custom/', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        product_id: productId,
        customer_email: email ?? undefined,
        metadata: { user_id: userId },
        success_url: `${process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000'}/dashboard?upgrade=success`,
      }),
    });

    if (!res.ok) {
      const errorBody = await res.text();
      console.error('Polar API error:', errorBody);
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 502 });
    }

    const data = await res.json();
    return NextResponse.json({ url: data.url });
  } catch (err) {
    console.error('Polar checkout error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
