import { type NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@/lib/supabase/server';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'No signature' }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('[v0] Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    // Update contribution status
    const supabase = await createClient();
    await supabase
      .from('contributions')
      .update({
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent as string,
        payment_method: session.payment_method_types?.[0] || 'card',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id);

    console.log('[v0] Contribution completed:', session.id);
  }

  return NextResponse.json({ received: true });
}
