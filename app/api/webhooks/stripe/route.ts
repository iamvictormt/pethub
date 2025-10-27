import { type NextRequest, NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

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
    console.error('Webhook signature verification failed:', err);
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
  }

  // Handle the event
  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    console.log('Processing checkout.session.completed:', session.id);

    const { data, error } = await supabaseAdmin
      .from('contributions')
      .update({
        status: 'completed',
        stripe_payment_intent_id: session.payment_intent as string,
        payment_method: session.payment_method_types?.[0] || 'card',
        updated_at: new Date().toISOString(),
      })
      .eq('stripe_session_id', session.id)
      .select();

    if (error) {
      console.error('Failed to update contribution:', error);
      return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
    }

    if (!data || data.length === 0) {
      console.error('No contribution found for session:', session.id);
      return NextResponse.json({ error: 'Contribution not found' }, { status: 404 });
    }

    console.log('Contribution completed successfully:', data[0]);
  }

  return NextResponse.json({ received: true });
}
