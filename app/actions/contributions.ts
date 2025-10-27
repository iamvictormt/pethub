'use server';

import { stripe } from '@/lib/stripe';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { createClient } from '@supabase/supabase-js';

const MINIMUM_AMOUNT = 500; // R$ 5.00 in cents

export async function startContributionCheckout(amountInCents: number) {
  console.log('Starting checkout for amount:', amountInCents);

  // Validate minimum amount
  if (amountInCents < MINIMUM_AMOUNT) {
    throw new Error(`Minimum contribution amount is R$ ${(MINIMUM_AMOUNT / 100).toFixed(2)}`);
  }

  const supabase = await createSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('User:', user?.email || 'anonymous');

  try {
    // Create Checkout Session with PIX and card support
    const session = await stripe.checkout.sessions.create({
      ui_mode: 'embedded',
      redirect_on_completion: 'never',
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: {
              name: 'Contribuição Farejei',
              description: 'Apoio para manter a plataforma gratuita e ajudar mais pets',
            },
            unit_amount: amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      metadata: {
        amount_in_cents: amountInCents.toString(),
        user_id: user?.id || 'anonymous',
      },
      customer_email: user?.email,
    });

    console.log('Stripe session created:', session.id);
    console.log('Client secret exists:', !!session.client_secret);

    if (!session.client_secret) {
      console.error('No client_secret in session:', session);
      throw new Error('Failed to get client secret from Stripe');
    }

    if (user) {
      const supabaseAdmin = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        {
          auth: {
            autoRefreshToken: false,
            persistSession: false,
          },
        }
      );

      const { error } = await supabaseAdmin.from('contributions').insert({
        user_id: user.id,
        amount_in_cents: amountInCents,
        currency: 'BRL',
        stripe_session_id: session.id,
        status: 'pending',
        contributor_name: user.user_metadata?.name || user.email?.split('@')[0],
        contributor_email: user.email,
      });

      if (error) {
        console.error('Failed to create contribution record:', error);
        throw new Error('Failed to create contribution record');
      } else {
        console.log('Created pending contribution:', session.id);
      }
    }

    console.log('Returning client secret');
    return session.client_secret;
  } catch (error) {
    console.error('Error in startContributionCheckout:', error);
    throw error;
  }
}

export async function getSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId);
  return {
    status: session.status,
    customer_email: session.customer_details?.email,
  };
}
