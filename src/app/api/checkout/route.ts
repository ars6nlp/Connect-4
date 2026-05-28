import { NextResponse } from 'next/server';
import { Polar } from '@polar-sh/sdk';

const polar = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN || '',
});

export async function POST(req: Request) {
  try {
    const { userId, email } = await req.json();

    const result = await polar.checkouts.custom.create({
      productId: process.env.POLAR_PRODUCT_ID || '',
      successUrl: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/dashboard?success=true`,
      customerEmail: email || undefined,
      metadata: {
        userId: userId || 'guest',
      },
    });

    return NextResponse.json({ url: result.url });
  } catch (error: any) {
    console.error('Polar Checkout Error:', error);
    return NextResponse.json({ error: error.message || 'Error creating checkout' }, { status: 500 });
  }
}
