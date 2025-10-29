"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { createPixContribution, checkPaymentStatus } from "@/app/actions/contributions"
import { Button } from "@/components/ui/button"
import { CheckCircle2, Copy, Loader2, QrCode } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import { useRouter } from "next/navigation"

interface PixCheckoutProps {
  amountInCents: number
  contributorName?: string
  contributorEmail?: string
}

export default function PixCheckout({ amountInCents, contributorName, contributorEmail }: PixCheckoutProps) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [pixData, setPixData] = useState<{
    contributionId: string
    paymentId: string
    pixPayload: string
    qrCodeBase64: string
    amount: number
  } | null>(null)
  const [copied, setCopied] = useState(false)
  const [checking, setChecking] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<string>("pending")
  const { toast } = useToast()
  const router = useRouter()

  useEffect(() => {
    async function generatePix() {
      try {
        console.log("[v0] Generating PIX for amount:", amountInCents)
        const data = await createPixContribution(amountInCents, contributorName, contributorEmail)
        console.log("[v0] PIX generated successfully")
        setPixData(data)
      } catch (err) {
        console.error("[v0] Error generating PIX:", err)
        setError(err instanceof Error ? err.message : "Falha ao gerar PIX")
      } finally {
        setLoading(false)
      }
    }

    generatePix()
  }, [amountInCents, contributorName, contributorEmail])

  useEffect(() => {
    if (!pixData || paymentStatus === "completed") return

    const interval = setInterval(async () => {
      try {
        console.log("[v0] Checking payment status...")
        const result = await checkPaymentStatus(pixData.contributionId)

        if (result.status === "completed") {
          setPaymentStatus("completed")
          clearInterval(interval)

          toast({
            title: "Pagamento confirmado! 🎉",
            description: "Obrigado pela sua contribuição!",
          })

          setTimeout(() => {
            router.push(
              `/contribuir/sucesso?amount=${pixData.amount}&name=${encodeURIComponent(contributorName || "Anônimo")}`,
            )
          }, 1500)
        }
      } catch (err) {
        console.error("[v0] Error checking payment status:", err)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [pixData, paymentStatus, contributorName, router, toast])

  const handleCopyPixCode = async () => {
    if (!pixData) return

    try {
      await navigator.clipboard.writeText(pixData.pixPayload)
      setCopied(true)
      toast({
        title: "Código PIX copiado!",
        description: "Cole no app do seu banco para fazer o pagamento",
      })
      setTimeout(() => setCopied(false), 3000)
    } catch (err) {
      toast({
        title: "Erro ao copiar",
        description: "Tente copiar manualmente o código abaixo",
        variant: "destructive",
      })
    }
  }

  const handleCheckPayment = async () => {
    if (!pixData) return

    setChecking(true)
    try {
      const result = await checkPaymentStatus(pixData.contributionId)

      if (result.status === "completed") {
        setPaymentStatus("completed")
        toast({
          title: "Pagamento confirmado! 🎉",
          description: "Obrigado pela sua contribuição!",
        })

        setTimeout(() => {
          router.push(
            `/contribuir/sucesso?amount=${pixData.amount}&name=${encodeURIComponent(contributorName || "Anônimo")}`,
          )
        }, 1500)
      } else {
        toast({
          title: "Pagamento ainda não confirmado",
          description: "Aguarde alguns segundos após fazer o pagamento e tente novamente",
        })
      }
    } catch (err) {
      console.error("[v0] Error checking payment:", err)
      toast({
        title: "Erro ao verificar pagamento",
        description: "Tente novamente em alguns instantes",
        variant: "destructive",
      })
    } finally {
      setChecking(false)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <Loader2 className="h-8 w-8 animate-spin text-orange-alert" />
        <p className="text-sm text-muted-foreground">Gerando QR Code PIX...</p>
      </div>
    )
  }

  if (error || !pixData) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <p className="text-destructive">Erro: {error || "Falha ao gerar PIX"}</p>
        <Button onClick={() => window.location.reload()} className="bg-orange-alert hover:bg-orange-alert/90">
          Tentar Novamente
        </Button>
      </div>
    )
  }

  if (paymentStatus === "completed") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 p-8">
        <CheckCircle2 className="h-16 w-16 text-green-600" />
        <p className="text-lg font-semibold">Pagamento confirmado!</p>
        <p className="text-sm text-muted-foreground">Redirecionando...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* QR Code */}
      <div className="flex flex-col items-center gap-4">
        <div className="rounded-lg border-2 border-dashed border-muted-foreground/20 bg-white p-4">
          <Image
            src={`data:image/png;base64,${pixData.qrCodeBase64}`}
            alt="QR Code PIX"
            width={300}
            height={300}
            className="h-auto w-full max-w-[300px]"
          />
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <QrCode className="h-4 w-4" />
          <span>Escaneie com o app do seu banco</span>
        </div>
      </div>

      {/* Instructions */}
      <div className="space-y-3">
        <h3 className="font-semibold">Como pagar:</h3>
        <ol className="space-y-2 text-sm text-muted-foreground">
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">1.</span>
            <span>Abra o app do seu banco e escolha pagar com PIX</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">2.</span>
            <span>Escaneie o QR Code acima ou copie o código PIX abaixo</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">3.</span>
            <span>Confirme o pagamento no seu banco</span>
          </li>
          <li className="flex gap-2">
            <span className="font-semibold text-foreground">4.</span>
            <span>Aguarde - verificaremos automaticamente o pagamento!</span>
          </li>
        </ol>
      </div>

      {/* PIX Code */}
      <div className="space-y-2">
        <Label className="text-sm font-medium">Ou copie o código PIX:</Label>
        <div className="flex gap-2">
          <div className="flex-1 overflow-hidden rounded-lg border bg-muted p-3">
            <code className="break-all text-xs">{pixData.pixPayload}</code>
          </div>
          <Button onClick={handleCopyPixCode} variant="outline" size="icon" className="shrink-0 bg-transparent">
            {copied ? <CheckCircle2 className="h-4 w-4 text-green-600" /> : <Copy className="h-4 w-4" />}
          </Button>
        </div>
      </div>

      <Button
        onClick={handleCheckPayment}
        disabled={checking}
        className="w-full bg-green-600 hover:bg-green-700"
        size="lg"
      >
        {checking ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Verificando pagamento...
          </>
        ) : (
          <>
            <CheckCircle2 className="mr-2 h-4 w-4" />
            Verificar se o pagamento foi confirmado
          </>
        )}
      </Button>

      {/* Success message */}
      <div className="rounded-lg bg-blue-50 p-4 text-sm">
        <p className="font-medium text-blue-900">💙 Verificação Automática</p>
        <p className="mt-1 text-blue-700">
          Após fazer o pagamento no app do seu banco, aguarde alguns segundos. Verificaremos automaticamente o pagamento
          e você será redirecionado quando confirmado!
        </p>
      </div>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <label className={className}>{children}</label>
}
