"use client"

import { useCallback, useState } from "react"
import { EmbeddedCheckout, EmbeddedCheckoutProvider } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"
import { startContributionCheckout } from "@/app/actions/contributions"

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)

export default function ContributionCheckout({ amountInCents }: { amountInCents: number }) {
  const [error, setError] = useState<string | null>(null)

  const fetchClientSecret = useCallback(async () => {
    try {
      console.log("[v0] Fetching client secret for amount:", amountInCents)
      const clientSecret = await startContributionCheckout(amountInCents)
      console.log("[v0] Received client secret:", !!clientSecret)

      if (!clientSecret) {
        throw new Error("No client secret received")
      }

      return clientSecret
    } catch (err) {
      console.error("[v0] Error fetching client secret:", err)
      setError(err instanceof Error ? err.message : "Failed to start checkout")
      throw err
    }
  }, [amountInCents])

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">Erro ao iniciar checkout: {error}</p>
        <button
          onClick={() => {
            setError(null)
            window.location.reload()
          }}
          className="rounded-lg bg-orange-alert px-4 py-2 text-white hover:bg-orange-alert/90"
        >
          Tentar Novamente
        </button>
      </div>
    )
  }

  return (
    <div id="checkout" className="w-full">
      <EmbeddedCheckoutProvider
        stripe={stripePromise}
        options={{
          fetchClientSecret,
          onComplete: () => {
            console.log("Checkout completed")
          },
        }}
      >
        <EmbeddedCheckout />
      </EmbeddedCheckoutProvider>
    </div>
  )
}
