'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Heart, Coffee, Users, Shield, TrendingUp, Zap, CheckCircle2, ArrowRight, Award } from 'lucide-react';
import Link from 'next/link';
import ContributionDialog from '@/components/contributions/contribution-dialog';

interface ContribuirContentProps {
  totalAmount: number;
  uniqueContributors: number;
}

export default function ContribuirContent({ totalAmount, uniqueContributors }: ContribuirContentProps) {
  const [showContributionDialog, setShowContributionDialog] = useState(false);

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-alert/20 bg-orange-alert/10 px-4 py-2 text-sm font-medium text-orange-alert backdrop-blur">
              <Heart className="h-4 w-4" fill="currentColor" />
              Apoie nossa missão
            </div>
          </div>

          {/* Hero Content */}
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Juntos, salvamos{' '}
              <span className="bg-gradient-to-r from-orange-alert via-orange-500 to-blue-pethub bg-clip-text text-transparent">
                mais vidas
              </span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              O PetHub é 100% gratuito para quem procura pets perdidos. Sua contribuição mantém nossa plataforma viva e
              ajuda milhares de famílias a se reunirem com seus melhores amigos.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
              <Button
                size="lg"
                onClick={() => setShowContributionDialog(true)}
                className="group bg-orange-alert hover:bg-orange-alert/90"
              >
                Fazer uma Doação
                <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button asChild size="lg" variant="outline" className="border-2 bg-transparent">
                <Link href="/contribuintes">
                  <Award className="mr-2 h-5 w-5" />
                  Ver Contribuintes
                </Link>
              </Button>
            </div>

            {/* Stats - Using real data from props */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8">
              <div>
                <div className="text-3xl font-bold text-orange-alert">
                  R$ {totalAmount >= 1000 ? `${(totalAmount / 1000).toFixed(1)}k` : totalAmount.toFixed(0)}+
                </div>
                <div className="text-sm text-muted-foreground">Arrecadado</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-blue-pethub">{uniqueContributors}</div>
                <div className="text-sm text-muted-foreground">Contribuintes</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-500">100%</div>
                <div className="text-sm text-muted-foreground">Transparente</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contribute */}
      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Por que sua ajuda importa</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Manter uma plataforma gratuita e confiável requer recursos. Veja onde seu apoio faz diferença.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-pethub/10">
                <Zap className="h-6 w-6 text-blue-pethub" />
              </div>
              <h3 className="mb-2 font-semibold">Infraestrutura</h3>
              <p className="text-sm text-muted-foreground">
                Servidores, banco de dados e armazenamento para milhares de fotos de pets
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-alert/10">
                <TrendingUp className="h-6 w-6 text-orange-alert" />
              </div>
              <h3 className="mb-2 font-semibold">Desenvolvimento</h3>
              <p className="text-sm text-muted-foreground">
                Novos recursos, melhorias e correções para uma experiência cada vez melhor
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-green-500/10">
                <Shield className="h-6 w-6 text-green-500" />
              </div>
              <h3 className="mb-2 font-semibold">Segurança</h3>
              <p className="text-sm text-muted-foreground">
                Proteção de dados, moderação de conteúdo e prevenção de fraudes
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 font-semibold">Comunidade</h3>
              <p className="text-sm text-muted-foreground">
                Suporte aos usuários, campanhas de conscientização e parcerias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Como você pode ajudar</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Existem várias formas de apoiar o PetHub. Escolha a que faz mais sentido para você.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Petshop Partner */}
            <div className="rounded-2xl border bg-background p-8 shadow-sm">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-pethub/10">
                <Shield className="h-8 w-8 text-blue-pethub" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Seja um Parceiro Petshop</h3>
              <p className="mb-6 text-muted-foreground">
                Anuncie seus produtos e serviços para milhares de tutores de pets. Sua presença na plataforma ajuda a
                manter o PetHub gratuito para todos.
              </p>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-pethub" />
                  <span className="text-sm">Alcance milhares de tutores na sua região</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-pethub" />
                  <span className="text-sm">Gerencie seus anúncios facilmente</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-blue-pethub" />
                  <span className="text-sm">Apoie uma causa importante</span>
                </li>
              </ul>
              <Button asChild size="lg" className="w-full bg-blue-pethub hover:bg-blue-pethub/90">
                <Link href="/auth/sign-up">
                  Criar Conta Petshop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Direct Support */}
            <div className="rounded-2xl border bg-background p-8 shadow-sm">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-alert/10">
                <Heart className="h-8 w-8 text-orange-alert" fill="currentColor" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Apoio Direto</h3>
              <p className="mb-6 text-muted-foreground">
                Contribua com qualquer valor a partir de R$ 5,00. Sua doação única ajuda a manter a infraestrutura ativa
                e impulsionar o desenvolvimento de novos recursos.
              </p>
              <ul className="mb-6 space-y-3">
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-alert" />
                  <span className="text-sm">100% transparente no uso dos recursos</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-alert" />
                  <span className="text-sm">Qualquer valor faz diferença</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-orange-alert" />
                  <span className="text-sm">Seu nome na lista de contribuintes</span>
                </li>
              </ul>
              <Button
                size="lg"
                onClick={() => setShowContributionDialog(true)}
                className="w-full bg-orange-alert hover:bg-orange-alert/90"
              >
                <Coffee className="mr-2 h-5 w-5" />
                Fazer uma Doação
              </Button>
            </div>
          </div>
        </div>
      </section>
 

      {/* Testimonial */}
      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-2xl border bg-background p-6 shadow-sm">
            <div className="mb-4 flex gap-1">
              {[...Array(5)].map((_, i) => (
                <Heart key={i} className="h-5 w-5 fill-orange-alert text-orange-alert" />
              ))}
            </div>
            <p className="mb-4 text-lg text-muted-foreground">
              "Anunciar no PetHub trouxe novos clientes para minha pet shop e ainda ajuda famílias a encontrarem seus
              pets. É gratificante fazer parte dessa comunidade."
            </p>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-orange-alert/10" />
              <div>
                <div className="font-semibold">Maria Silva</div>
                <div className="text-sm text-muted-foreground">Pet Shop Amigo Fiel - São Paulo</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-br from-orange-alert via-orange-alert/90 to-orange-alert/80 px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <Shield className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Pronto para fazer a diferença?</h2>
          <p className="mb-8 text-lg text-orange-50 md:text-xl">
            Cada contribuição, grande ou pequena, nos ajuda a reunir mais pets com suas famílias. Junte-se a nós nessa
            missão.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button
              size="lg"
              onClick={() => setShowContributionDialog(true)}
              variant="secondary"
              className="bg-white text-orange-alert hover:bg-white/90"
            >
              <Heart className="mr-2 h-5 w-5" fill="currentColor" />
              Contribuir Agora
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/contribuintes">
                <Award className="mr-2 h-5 w-5" />
                Ver Contribuintes
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <ContributionDialog open={showContributionDialog} onOpenChange={setShowContributionDialog} />
    </div>
  );
}
