"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Heart, Sparkles, ArrowRight, Users, Home, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import confetti from "canvas-confetti"

function SuccessContent() {
  const searchParams = useSearchParams()
  const [isAnimating, setIsAnimating] = useState(true)
  const [showContent, setShowContent] = useState(false)

  const amount = searchParams.get("amount")
  const name = searchParams.get("name")
  const formattedAmount = amount ? `R$ ${(Number.parseInt(amount) / 100).toFixed(2).replace(".", ",")}` : "R$ 0,00"

  useEffect(() => {
    const duration = 4000
    const animationEnd = Date.now() + duration
    const defaults = { startVelocity: 30, spread: 360, ticks: 80, zIndex: 0 }

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now()

      if (timeLeft <= 0) {
        setIsAnimating(false)
        return clearInterval(interval)
      }

      const particleCount = 60 * (timeLeft / duration)

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ["#F97316", "#fb923c", "#fdba74"],
      })
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ["#10B981", "#34d399", "#6ee7b7"],
      })
    }, 200)

    setTimeout(() => setShowContent(true), 100)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-green-50">
      <div className="container mx-auto max-w-3xl px-4 py-12 md:py-20">
        <div
          className={`space-y-8 transition-all duration-1000 ${showContent ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Card className="relative overflow-hidden border bg-card shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-alert/5 via-transparent to-green-found/5 pointer-events-none" />

            <div className="relative p-8 md:p-12 space-y-8">
              <div className="flex justify-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-green-found/20 rounded-full animate-ping" />
                  <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-green-found shadow-xl">
                    <CheckCircle2 className="h-12 w-12 text-green-found-foreground" strokeWidth={2.5} />
                  </div>
                </div>
              </div>

              <div className="space-y-3 text-center">
                <h1 className="text-balance text-4xl md:text-5xl lg:text-6xl font-bold text-green-found leading-tight">
                  Contribuição Confirmada!
                </h1>
                <p className="text-pretty text-xl md:text-2xl text-muted-foreground font-medium">
                  {name && name !== "Anônimo"
                    ? `Muito obrigado, ${name}! 💚`
                    : "Muito obrigado pela sua generosidade! 💚"}
                </p>
              </div>

              <div className="flex justify-center">
                <div className="rounded-3xl bg-gradient-to-br from-orange-alert/10 to-green-found/10 border-2 border-orange-alert/20 px-8 py-6 shadow-sm">
                  <div className="flex items-center gap-3 justify-center">
                    <div>
                      <p className="text-5xl md:text-6xl font-bold text-green-found">
                        {formattedAmount}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl bg-muted/30 border p-6 md:p-8">
                <div className="grid gap-4">
                  {[
                    "Mantém a plataforma 100% gratuita para todos",
                    "Ajuda a reunir mais pets com suas famílias",
                    "Permite desenvolver novos recursos incríveis",
                    "Fortalece nossa comunidade de amantes de pets",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3 group">
                      <div className="flex h-6 w-6 items-center justify-center rounded-full bg-green-found text-green-found-foreground text-sm font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                        ✓
                      </div>
                      <p className="text-base text-foreground leading-relaxed">{text}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button
                  asChild
                  className="flex-1 bg-orange-alert hover:bg-orange-alert/90 text-orange-alert-foreground shadow-lg hover:shadow-xl transition-all h-12 text-base font-semibold"
                >
                  <Link href="/contribuintes" className="flex items-center justify-center gap-2">
                    <Users className="h-5 w-5" />
                    Ver Todos os Contribuintes
                   </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-2 hover:bg-muted h-12 text-base font-semibold bg-transparent"
                >
                  <Link href="/" className="flex items-center justify-center gap-2">
                    <Home className="h-5 w-5" />
                    Voltar para Home
                  </Link>
                </Button>
              </div>
            </div>
          </Card>

          <div className="text-center space-y-2">
            <p className="text-base text-muted-foreground">
              Sua contribuição já está registrada e aparece na lista de contribuintes
            </p>
            <p className="text-lg font-medium text-foreground">Juntos, fazemos a diferença!</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ContributionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-orange-50 via-background to-green-50">
          <div className="space-y-4 text-center">
            <div className="h-12 w-12 mx-auto animate-spin rounded-full border-4 border-orange-500 border-t-transparent" />
            <p className="text-muted-foreground">Carregando...</p>
          </div>
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  )
}
