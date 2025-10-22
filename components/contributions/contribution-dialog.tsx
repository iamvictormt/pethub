"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Heart, Sparkles, Shield, Crown } from "lucide-react"
import ContributionCheckout from "./contribution-checkout"
import { CONTRIBUTION_TIERS, formatCurrency } from "@/lib/contribution-tiers"

const TIER_STYLES = {
  supporter: {
    icon: Heart,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
  },
  friend: {
    icon: Sparkles,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
  },
  hero: {
    icon: Shield,
    color: "text-green-600",
    bgColor: "bg-green-100",
  },
  champion: {
    icon: Crown,
    color: "text-orange-600",
    bgColor: "bg-orange-100",
  },
}

interface ContributionDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export default function ContributionDialog({ open, onOpenChange }: ContributionDialogProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  const handleClose = () => {
    setSelectedTier(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        {!selectedTier ? (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Escolha o valor da sua contribuição</DialogTitle>
              <DialogDescription>
                Selecione um dos valores abaixo. Você poderá pagar com cartão de crédito ou PIX.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4 sm:grid-cols-2">
              {CONTRIBUTION_TIERS.map((tier) => {
                const style = TIER_STYLES[tier.id as keyof typeof TIER_STYLES]
                const Icon = style.icon
                return (
                  <button
                    key={tier.id}
                    onClick={() => {
                      console.log("[v0] Selected tier:", tier.id)
                      setSelectedTier(tier.id)
                    }}
                    className="group relative overflow-hidden rounded-2xl border-2 border-border bg-card p-6 text-left transition-all hover:border-orange-alert hover:shadow-lg"
                  >
                    <div className={`mb-4 flex h-12 w-12 items-center justify-center rounded-xl ${style.bgColor}`}>
                      <Icon className={`h-6 w-6 ${style.color}`} />
                    </div>
                    <div className="mb-2 text-3xl font-bold">{formatCurrency(tier.amountInCents)}</div>
                    <div className="mb-1 text-lg font-semibold">{tier.name}</div>
                    <div className="text-sm text-muted-foreground">{tier.description}</div>
                    {tier.popular && (
                      <div className="absolute top-4 right-4 rounded-full bg-orange-alert px-3 py-1 text-xs font-semibold text-white">
                        Popular
                      </div>
                    )}
                    <div className="mt-4 text-sm font-medium text-orange-alert opacity-0 transition-opacity group-hover:opacity-100">
                      Selecionar →
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="rounded-lg bg-muted p-4 text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">💳 Formas de pagamento</p>
              <p>Cartão de crédito (processamento instantâneo) ou PIX (QR Code gerado na próxima etapa)</p>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">Finalize sua contribuição</DialogTitle>
              <DialogDescription>
                Complete o pagamento de forma segura através do Stripe. Seu nome aparecerá na lista de contribuintes.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <ContributionCheckout tierId={selectedTier} />
            </div>

            <Button
              variant="outline"
              onClick={() => {
                console.log("[v0] Going back to tier selection")
                setSelectedTier(null)
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
