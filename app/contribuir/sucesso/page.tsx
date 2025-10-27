'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Heart, Sparkles, ArrowRight, Users } from 'lucide-react';
import Link from 'next/link';
import confetti from 'canvas-confetti';

function SuccessContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [isAnimating, setIsAnimating] = useState(true);

  const amount = searchParams.get('amount');
  const formattedAmount = amount ? `R$ ${(Number.parseInt(amount) / 100).toFixed(2).replace('.', ',')}` : 'R$ 0,00';

  useEffect(() => {
    // Trigger confetti animation
    const duration = 3000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    function randomInRange(min: number, max: number) {
      return Math.random() * (max - min) + min;
    }

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        setIsAnimating(false);
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f97316', '#fb923c', '#fdba74'],
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#3b82f6', '#60a5fa', '#93c5fd'],
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="space-y-8">
          {/* Success Card */}
          <Card className="border-2 border-orange-alert/20 shadow-xl">
            <CardContent className="p-8 md:p-12">
              <div className="space-y-6 text-center">
                {/* Icon */}
                <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-alert to-orange-600 shadow-lg">
                  <Heart className="h-10 w-10 text-white" fill="currentColor" />
                </div>

                {/* Title */}
                <div className="space-y-2">
                  <h1 className="text-3xl font-bold text-foreground md:text-4xl lg:text-5xl">
                    Obrigado pela sua generosidade!
                  </h1>
                  <p className="text-lg text-muted-foreground md:text-xl">Sua contribuição faz toda a diferença</p>
                </div>

                {/* Amount */}
                <div className="rounded-2xl bg-gradient-to-br from-orange-50 to-blue-50 p-6">
                  <p className="mb-2 text-sm font-medium text-muted-foreground">Valor da contribuição</p>
                  <p className="text-4xl font-bold text-orange-alert md:text-5xl">{formattedAmount}</p>
                </div>

                {/* Impact Message */}
                <div className="space-y-4 rounded-2xl border bg-muted/30 p-6 text-left">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold">Seu impacto:</h3>
                  </div>
                  <ul className="space-y-2 text-sm text-muted-foreground md:text-base">
                    <li className="flex items-start gap-2">
                      <span className="text-orange-alert">•</span>
                      <span>Ajuda a manter a plataforma gratuita para todos os usuários</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-alert">•</span>
                      <span>Contribui para reunir mais pets com suas famílias</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-alert">•</span>
                      <span>Permite o desenvolvimento de novos recursos</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-orange-alert">•</span>
                      <span>Fortalece nossa comunidade de amantes de animais</span>
                    </li>
                  </ul>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col gap-3 pt-4 sm:flex-row sm:justify-center">
                  <Button
                    asChild
                    size="lg"
                    className="bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
                  >
                    <Link href="/contribuintes" className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Ver Contribuintes
                      <ArrowRight className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button asChild size="lg" variant="outline">
                    <Link href="/">Voltar para Home</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Additional Info */}
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              Um recibo foi enviado para o seu email. Obrigado por fazer parte da nossa missão! 🐾
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ContributionSuccessPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-orange-alert border-t-transparent" />
        </div>
      }
    >
      <SuccessContent />
    </Suspense>
  );
}
