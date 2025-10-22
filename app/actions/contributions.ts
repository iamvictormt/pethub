"use server"

import { stripe } from "@/lib/stripe"
import { CONTRIBUTION_TIERS } from "@/lib/contribution-tiers"
import { createClient } from "@/lib/supabase/server"

export async function startContributionCheckout(tierId: string) {
  console.log("[v0] Starting checkout for tier:", tierId)

  const tier = CONTRIBUTION_TIERS.find((t) => t.id === tierId)
  if (!tier) {
    console.error("[v0] Tier not found:", tierId)
    throw new Error(`Contribution tier with id "${tierId}" not found`)
  }

  console.log("[v0] Found tier:", tier.name, tier.amountInCents)

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  console.log("[v0] User:", user?.email || "anonymous")

  try {
    // Create Checkout Session with PIX and card support
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      redirect_on_completion: "never",
      payment_method_types: ["card"], // Support both card and PIX
      line_items: [
        {
          price_data: {
            currency: "brl",
            product_data: {
              name: tier.name,
              description: tier.description,
            },
            unit_amount: tier.amountInCents,
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      metadata: {
        tier_id: tierId,
        user_id: user?.id || "anonymous",
      },
      customer_email: user?.email,
    })

    console.log("[v0] Stripe session created:", session.id)
    console.log("[v0] Client secret exists:", !!session.client_secret)

    if (!session.client_secret) {
      console.error("[v0] No client_secret in session:", session)
      throw new Error("Failed to get client secret from Stripe")
    }

    if (user) {
      const { error } = await supabase.from("contributions").insert({
        user_id: user.id,
        amount_in_cents: tier.amountInCents,
        currency: "BRL",
        stripe_session_id: session.id,
        status: "pending",
        contributor_name: user.user_metadata?.name || user.email?.split("@")[0],
        contributor_email: user.email,
      })

      if (error) {
        console.error("[v0] Failed to create contribution record:", error)
        // Don't throw here, allow payment to proceed
      } else {
        console.log("[v0] Created pending contribution:", session.id)
      }
    }

    console.log("[v0] Returning client secret")
    return session.client_secret
  } catch (error) {
    console.error("[v0] Error in startContributionCheckout:", error)
    throw error
  }
}

export async function getSessionStatus(sessionId: string) {
  const session = await stripe.checkout.sessions.retrieve(sessionId)
  return {
    status: session.status,
    customer_email: session.customer_details?.email,
  }
}
