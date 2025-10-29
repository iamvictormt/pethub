import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { getMercadoPagoClient } from "@/lib/mercadopago"
import crypto from "crypto"

function verifyWebhookSignature(
  xSignature: string | null,
  xRequestId: string | null,
  dataId: string,
  secret: string,
): boolean {
  if (!xSignature || !xRequestId) {
    return false
  }

  // Mercado Pago signature format: ts=timestamp,v1=hash
  const parts = xSignature.split(",")
  let ts = ""
  let hash = ""

  for (const part of parts) {
    const [key, value] = part.split("=")
    if (key === "ts") ts = value
    if (key === "v1") hash = value
  }

  if (!ts || !hash) {
    return false
  }

  // Create the manifest: id + request-id + ts
  const manifest = `id:${dataId};request-id:${xRequestId};ts:${ts};`

  // Generate HMAC SHA256
  const hmac = crypto.createHmac("sha256", secret)
  hmac.update(manifest)
  const calculatedHash = hmac.digest("hex")

  return calculatedHash === hash
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    console.log("[v0] Mercado Pago webhook received:", body)

    const xSignature = request.headers.get("x-signature")
    const xRequestId = request.headers.get("x-request-id")

    // Mercado Pago sends notifications with this structure
    const { type, data } = body

    // We only care about payment notifications
    if (type !== "payment") {
      return NextResponse.json({ received: true })
    }

    const paymentId = data.id

    if (!paymentId) {
      console.error("[v0] No payment ID in webhook")
      return NextResponse.json({ error: "No payment ID" }, { status: 400 })
    }

    const webhookSecret = process.env.MERCADOPAGO_WEBHOOK_SECRET
    if (webhookSecret) {
      const isValid = verifyWebhookSignature(xSignature, xRequestId, paymentId.toString(), webhookSecret)

      if (!isValid) {
        console.error("[v0] Invalid webhook signature")
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }

      console.log("[v0] Webhook signature verified successfully")
    } else {
      console.warn("[v0] No webhook secret configured - skipping signature verification")
    }

    // Get payment details from Mercado Pago
    const mpClient = getMercadoPagoClient()
    const payment = await mpClient.getPayment(paymentId.toString())

    console.log("[v0] Payment status:", payment.status)

    // Only process approved payments
    if (payment.status !== "approved") {
      return NextResponse.json({ received: true })
    }

    // Update contribution in database
    const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data: contribution, error: findError } = await supabase
      .from("contributions")
      .select("*")
      .eq("payment_id", paymentId.toString())
      .single()

    if (findError || !contribution) {
      console.error("[v0] Contribution not found for payment:", paymentId)
      return NextResponse.json({ error: "Contribution not found" }, { status: 404 })
    }

    // Update contribution status
    const { error: updateError } = await supabase
      .from("contributions")
      .update({
        status: "completed",
        payment_data: payment,
        updated_at: new Date().toISOString(),
      })
      .eq("id", contribution.id)

    if (updateError) {
      console.error("[v0] Failed to update contribution:", updateError)
      return NextResponse.json({ error: "Failed to update contribution" }, { status: 500 })
    }

    console.log("[v0] Contribution marked as completed:", contribution.id)

    return NextResponse.json({ received: true, updated: true })
  } catch (error) {
    console.error("[v0] Webhook error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
