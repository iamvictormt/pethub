"use server"

import { createClient as createSupabaseClient } from "@/lib/supabase/server"
import { getMercadoPagoClient } from "@/lib/mercadopago"

const MINIMUM_AMOUNT = 500 // R$ 5.00 in cents
const EXPIRATION_TIME_MS = 30 * 60 * 1000 // 30 minutes

export async function createPixContribution(
  amountInCents: number,
  contributorName?: string,
  contributorEmail?: string,
) {
  console.log("[v0] Creating PIX contribution for amount:", amountInCents)

  // Validate minimum amount
  if (amountInCents < MINIMUM_AMOUNT) {
    throw new Error(`Valor mínimo de contribuição é R$ ${(MINIMUM_AMOUNT / 100).toFixed(2)}`)
  }

  const supabase = await createSupabaseClient()

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  console.log("[v0] Auth check - User:", user?.id || "anonymous")
  console.log("[v0] Auth check - Email:", user?.email || "none")
  console.log("[v0] Auth check - Error:", authError?.message || "none")

  try {
    const mpClient = getMercadoPagoClient()
    const payment = await mpClient.createPixPayment(
      amountInCents / 100, // Convert cents to BRL
      "Contribuição Farejei - Ajude a reunir pets com suas famílias",
      contributorEmail || user?.email || "anonimo@farejei.app",
      contributorName || user?.user_metadata?.name || "Anônimo",
    )

    console.log("[v0] Mercado Pago payment created:", payment.id)

    const contributionData = {
      user_id: user?.id || null,
      amount_in_cents: amountInCents,
      currency: "BRL",
      payment_method: "pix",
      status: "pending",
      payment_id: payment.id.toString(),
      payment_provider: "mercadopago",
      payment_data: payment,
      pix_qr_code: payment.point_of_interaction.transaction_data.qr_code,
      contributor_name: contributorName || user?.user_metadata?.name || user?.email?.split("@")[0] || "Anônimo",
      contributor_email: contributorEmail || user?.email || null,
    }

    console.log("[v0] Contribution data prepared:", {
      user_id: contributionData.user_id,
      amount: contributionData.amount_in_cents,
      payment_id: contributionData.payment_id,
    })

    console.log("[v0] Attempting insert with Supabase client...")
    const { data: contribution, error } = await supabase
      .from("contributions")
      .insert(contributionData)
      .select()
      .single()

    if (error) {
      console.error("[v0] Supabase client insert failed:", {
        code: error.code,
        message: error.message,
        details: error.details,
        hint: error.hint,
      })

      console.log("[v0] Trying fallback with direct REST API call...")

      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

      console.log("[v0] Service Role Key Check:")
      console.log("  - URL set:", !!supabaseUrl)
      console.log("  - Service Role Key set:", !!serviceRoleKey)
      console.log("  - Service Role Key length:", serviceRoleKey?.length || 0)
      console.log("  - Service Role Key prefix:", serviceRoleKey?.substring(0, 20) || "NOT SET")
      console.log("  - Supabase URL:", supabaseUrl)

      if (!supabaseUrl || !serviceRoleKey) {
        console.error("[v0] Missing Supabase credentials")
        throw new Error("Configuração do servidor incompleta")
      }

      const headers = {
        "Content-Type": "application/json",
        apikey: serviceRoleKey,
        Authorization: `Bearer ${serviceRoleKey}`,
        Prefer: "return=representation",
      }

      console.log("[v0] Request headers (keys only):", Object.keys(headers))
      console.log("[v0] Making request to:", `${supabaseUrl}/rest/v1/contributions`)

      const response = await fetch(`${supabaseUrl}/rest/v1/contributions`, {
        method: "POST",
        headers,
        body: JSON.stringify(contributionData),
      })

      console.log("[v0] Response status:", response.status)
      console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

      if (!response.ok) {
        const errorText = await response.text()
        console.error("[v0] REST API insert failed:", {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        })
        throw new Error("Falha ao criar registro de contribuição")
      }

      const [restContribution] = await response.json()
      console.log("[v0] Created contribution via REST API:", restContribution.id)

      return {
        contributionId: restContribution.id,
        paymentId: payment.id.toString(),
        pixPayload: payment.point_of_interaction.transaction_data.qr_code,
        qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
        amount: amountInCents,
      }
    }

    console.log("[v0] Created pending contribution:", contribution.id)

    return {
      contributionId: contribution.id,
      paymentId: payment.id.toString(),
      pixPayload: payment.point_of_interaction.transaction_data.qr_code,
      qrCodeBase64: payment.point_of_interaction.transaction_data.qr_code_base64,
      amount: amountInCents,
    }
  } catch (error) {
    console.error("[v0] Error in createPixContribution:", error)
    throw error
  }
}

export async function checkPaymentStatus(contributionId: string) {
  const supabase = await createSupabaseClient()

  const { data: contribution, error } = await supabase
    .from("contributions")
    .select("*")
    .eq("id", contributionId)
    .single()

  if (error || !contribution) {
    throw new Error("Contribuição não encontrada")
  }

  // If already completed, return success
  if (contribution.status === "completed") {
    return { status: "completed", contribution }
  }

  if (contribution.status === "expired") {
    return { status: "expired", contribution }
  }

  const createdAt = new Date(contribution.created_at).getTime()
  const now = Date.now()
  const isExpired = now - createdAt > EXPIRATION_TIME_MS

  if (isExpired && contribution.status === "pending") {
    // Check with Mercado Pago to confirm expiration
    if (contribution.payment_id) {
      try {
        const mpClient = getMercadoPagoClient()
        const payment = await mpClient.getPayment(contribution.payment_id)

        console.log("[v0] Payment status from Mercado Pago:", payment.status)

        // If payment was approved, update to completed
        if (payment.status === "approved") {
          const { error: updateError } = await supabase
            .from("contributions")
            .update({
              status: "completed",
              payment_data: payment,
              updated_at: new Date().toISOString(),
            })
            .eq("id", contributionId)

          if (updateError) {
            console.error("[v0] Failed to update contribution:", updateError)
          }

          return { status: "completed", contribution: { ...contribution, status: "completed" } }
        }

        // If payment is cancelled or expired in Mercado Pago, mark as expired
        if (payment.status === "cancelled" || payment.status === "expired") {
          const { error: updateError } = await supabase
            .from("contributions")
            .update({
              status: "expired",
              payment_data: payment,
              updated_at: new Date().toISOString(),
            })
            .eq("id", contributionId)

          if (updateError) {
            console.error("[v0] Failed to update contribution:", updateError)
          }

          return { status: "expired", contribution: { ...contribution, status: "expired" } }
        }
      } catch (error) {
        console.error("[v0] Error checking payment status:", error)
      }
    }

    // Mark as expired if 30 minutes have passed
    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        status: "expired",
        updated_at: new Date().toISOString(),
      })
      .eq("id", contributionId)

    if (updateError) {
      console.error("[v0] Failed to mark contribution as expired:", updateError)
    }

    return { status: "expired", contribution: { ...contribution, status: "expired" } }
  }

  // Check with Mercado Pago API
  if (contribution.payment_id) {
    try {
      const mpClient = getMercadoPagoClient()
      const payment = await mpClient.getPayment(contribution.payment_id)

      console.log("[v0] Payment status from Mercado Pago:", payment.status)

      // Update contribution if payment is approved
      if (payment.status === "approved") {
        const { error: updateError } = await supabase
          .from("contributions")
          .update({
            status: "completed",
            payment_data: payment,
            updated_at: new Date().toISOString(),
          })
          .eq("id", contributionId)

        if (updateError) {
          console.error("[v0] Failed to update contribution:", updateError)
        }

        return { status: "completed", contribution: { ...contribution, status: "completed" } }
      }

      return { status: payment.status, contribution }
    } catch (error) {
      console.error("[v0] Error checking payment status:", error)
      return { status: contribution.status, contribution }
    }
  }

  return { status: contribution.status, contribution }
}

export async function markContributionAsCompleted(contributionId: string, transactionId?: string) {
  const supabase = await createSupabaseClient()

  const { error } = await supabase
    .from("contributions")
    .update({
      status: "completed",
      pix_transaction_id: transactionId,
      updated_at: new Date().toISOString(),
    })
    .eq("id", contributionId)

  if (error) {
    console.error("[v0] Failed to mark contribution as completed:", error)
    throw new Error("Falha ao atualizar contribuição")
  }

  return { success: true }
}
