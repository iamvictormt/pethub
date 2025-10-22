"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Heart, DollarSign, AlertCircle } from "lucide-react"
import ContributionCheckout from "./contribution-checkout"

const MINIMUM_AMOUNT = 500 // R$ 5.00 in cents
const SUGGESTED_AMOUNTS = [1000, 2500, 5000, 10000] // R$ 10, 25, 50, 100

interface ContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ContributionDialog({ open, onOpenChange }: ContributionDialogProps) {
  const [customAmount, setCustomAmount] = useState<string>("")
  const [amountInCents, setAmountInCents] = useState<number | null>(null)
  const [error, setError] = useState<string>("")

  const handleClose = () => {
    setCustomAmount("")
    setAmountInCents(null)
    setError("")
    onOpenChange(false)
  }

  const handleAmountChange = (value: string) => {
    // Remove tudo que não for número
    const numericValue = value.replace(/\D/g, "");

    // Converte para número e divide por 100 para inserir vírgula
    const floatValue = parseFloat(numericValue) / 100;

    // Se não tiver valor, reseta
    if (!numericValue) {
      setCustomAmount("");
      return;
    }

    // Formata em formato brasileiro de moeda
    const formatted = floatValue.toLocaleString("pt-BR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

    setCustomAmount(formatted);

    // Validação simples (exemplo)
    if (floatValue < 5) {
      setError("O valor mínimo é R$ 5,00");
    } else {
      setError("");
    }
  };

  const handleSuggestedAmount = (cents: number) => {
    const reais = (cents / 100).toFixed(2).replace(".", ",")
    setCustomAmount(reais)
    setError("")
  }

  const handleContinue = () => {
    // Convert to cents
    const valueStr = customAmount.replace(",", ".")
    const valueInReais = Number.parseFloat(valueStr)

    if (isNaN(valueInReais) || valueInReais <= 0) {
      setError("Por favor, insira um valor válido")
      return
    }

    const cents = Math.round(valueInReais * 100)

    if (cents < MINIMUM_AMOUNT) {
      setError(`O valor mínimo é R$ ${(MINIMUM_AMOUNT / 100).toFixed(2).replace(".", ",")}`)
      return
    }

    console.log("[v0] Amount in cents:", cents)
    setAmountInCents(cents)
  }

  const formatCurrency = (cents: number) => {
    return `R$ ${(cents / 100).toFixed(2).replace(".", ",")}`
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl">
        {!amountInCents ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Quanto você gostaria de contribuir?</DialogTitle>
              <DialogDescription>
                Escolha um valor sugerido ou insira o valor que desejar. Mínimo: {formatCurrency(MINIMUM_AMOUNT)}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-6 py-4">
              {/* Suggested Amounts */}
              <div>
                <Label className="mb-3 block text-sm font-medium">Valores sugeridos</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {SUGGESTED_AMOUNTS.map((cents) => (
                    <Button
                      key={cents}
                      variant="outline"
                      onClick={() => handleSuggestedAmount(cents)}
                      className="h-16 text-lg font-semibold hover:border-orange-alert hover:bg-orange-alert/5"
                    >
                      {formatCurrency(cents)}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Custom Amount Input */}
  <div>
      <Label htmlFor="custom-amount" className="mb-2 block text-sm font-medium">
        Ou insira um valor personalizado
      </Label>
      <div className="relative">
        <DollarSign className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
        <Input
          id="custom-amount"
          type="text"
          inputMode="numeric"
          placeholder="0,00"
          value={customAmount}
          onChange={(e) => handleAmountChange(e.target.value)}
          className="h-14 pl-10 text-lg font-semibold"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
          BRL
        </span>
      </div>
      {error && (
        <div className="mt-2 flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span>{error}</span>
        </div>
      )}
    </div>

              {/* Info Box */}
              <div className="rounded-lg border bg-muted/50 p-4">
                <div className="mb-2 flex items-center gap-2">
                  <Heart className="h-5 w-5 text-orange-alert" fill="currentColor" />
                  <span className="font-semibold">Sua contribuição ajuda a:</span>
                </div>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  <li>• Manter a plataforma gratuita para todos</li>
                  <li>• Reunir mais pets com suas famílias</li>
                  <li>• Desenvolver novos recursos</li>
                </ul>
              </div>

              {/* Payment Methods */}
              <div className="rounded-lg bg-blue-50 p-4 text-sm">
                <p className="mb-1 font-medium text-blue-900">💳 Formas de pagamento</p>
                <p className="text-blue-700">
                  Pagamento via cartão de crédito com processamento instantâneo. Sua compra é protegida e processada com segurança pelo Stripe.
                </p>
              </div>
            </div>

            <Button
              onClick={handleContinue}
              disabled={!customAmount}
              size="lg"
              className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
            >
              Continuar para Pagamento
            </Button>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Finalize sua contribuição</DialogTitle>
              <DialogDescription>
                Valor: <span className="font-semibold text-orange-alert">{formatCurrency(amountInCents)}</span> -
                Complete o pagamento de forma segura através do Stripe.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <ContributionCheckout amountInCents={amountInCents} />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                console.log("[v0] Going back to amount selection")
                setAmountInCents(null)
              }}
              className="w-full"
            >
              ← Voltar para seleção de valor
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
