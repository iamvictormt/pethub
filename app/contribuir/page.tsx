import { Button } from '@/components/ui/button';
import { Heart, Coffee, Users, Shield, Sparkles, TrendingUp, Zap, CheckCircle2, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function ContribuirPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-20 md:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border bg-background/80 px-4 py-2 text-sm font-medium shadow-sm backdrop-blur">
              <Heart className="h-4 w-4 text-orange-alert" fill="currentColor" />
              <span>Apoie nossa missão</span>
            </div>

            <h1 className="mb-6 text-balance text-5xl font-bold leading-tight tracking-tight md:text-6xl lg:text-7xl">
              Juntos, salvamos{' '}
              <span className="bg-gradient-to-r from-orange-alert via-orange-500 to-blue-pethub bg-clip-text text-transparent">
                mais vidas
              </span>
            </h1>

            <p className="mb-8 text-pretty text-xl leading-relaxed text-muted-foreground md:text-2xl">
              O PetHub é 100% gratuito para quem procura pets perdidos. Sua contribuição mantém nossa plataforma viva e
              ajuda milhares de famílias a se reunirem com seus melhores amigos.
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-12 bg-orange-alert px-8 text-base font-semibold text-orange-alert-foreground hover:bg-orange-alert/90"
              >
                <Link href="#contribuir">
                  Quero Contribuir
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="h-12 px-8 text-base font-semibold bg-transparent">
                <Link href="/pets">Ver Pets Perdidos</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Why Contribute */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Por que sua ajuda importa</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Manter uma plataforma gratuita e confiável requer recursos. Veja onde seu apoio faz diferença.
            </p>
          </div>

          <div className="container mx-auto max-w-7xl px-4 py-4 mb-12">
            <div className="grid gap-8 md:grid-cols-3">
              <div className="text-center">
                <div className="mb-3 text-5xl font-bold text-orange-alert">1.247</div>
                <div className="text-lg font-medium text-foreground">Pets Devolvidos</div>
                <div className="mt-1 text-sm text-muted-foreground">Nos últimos 6 meses</div>
              </div>
              <div className="text-center">
                <div className="mb-3 text-5xl font-bold text-blue-pethub">5.832</div>
                <div className="text-lg font-medium text-foreground">Usuários Ativos</div>
                <div className="mt-1 text-sm text-muted-foreground">Crescendo 20% ao mês</div>
              </div>
              <div className="text-center">
                <div className="mb-3 text-5xl font-bold text-green-600">R$ 0</div>
                <div className="text-lg font-medium text-foreground">Custo para Usuários</div>
                <div className="mt-1 text-sm text-muted-foreground">Sempre gratuito</div>
              </div>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                <Zap className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Infraestrutura</h3>
              <p className="text-sm text-muted-foreground">
                Servidores, banco de dados e armazenamento para milhares de fotos de pets
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-orange-100">
                <TrendingUp className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Desenvolvimento</h3>
              <p className="text-sm text-muted-foreground">
                Novos recursos, melhorias e correções para uma experiência cada vez melhor
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Segurança</h3>
              <p className="text-sm text-muted-foreground">
                Proteção de dados, moderação de conteúdo e prevenção de fraudes
              </p>
            </div>

            <div className="rounded-2xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">Comunidade</h3>
              <p className="text-sm text-muted-foreground">
                Suporte aos usuários, campanhas de conscientização e parcerias
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ways to Contribute */}
      <section id="contribuir" className="border-y bg-muted/30 px-4 py-20">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold tracking-tight md:text-5xl">Como você pode ajudar</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Existem várias formas de apoiar o PetHub. Escolha a que faz mais sentido para você.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Petshop Partner */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-blue-pethub/20 bg-gradient-to-br from-blue-50 to-background p-8 shadow-lg transition-all hover:border-blue-pethub/40 hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-pethub text-blue-pethub-foreground shadow-lg">
                <Shield className="h-8 w-8" />
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
              <Button
                asChild
                size="lg"
                className="w-full bg-blue-pethub text-blue-pethub-foreground hover:bg-blue-pethub/90"
              >
                <Link href="/auth/sign-up">
                  Criar Conta Petshop
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </div>

            {/* Direct Support */}
            <div className="group relative overflow-hidden rounded-3xl border-2 border-orange-alert/20 bg-gradient-to-br from-orange-50 to-background p-8 shadow-lg transition-all hover:border-orange-alert/40 hover:shadow-xl">
              <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-alert text-orange-alert-foreground shadow-lg">
                <Heart className="h-8 w-8" fill="currentColor" />
              </div>
              <h3 className="mb-3 text-2xl font-bold">Apoio Direto</h3>
              <p className="mb-6 text-muted-foreground">
                Faça uma contribuição única ou recorrente para ajudar a cobrir custos de infraestrutura e
                desenvolvimento.
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
                  <span className="text-sm">Recibo para declaração de imposto</span>
                </li>
              </ul>
              <Button
                size="lg"
                variant="outline"
                className="w-full border-2 border-orange-alert/20 hover:border-orange-alert/40 hover:bg-orange-alert/5 bg-transparent"
              >
                <Coffee className="h-5 w-5" />
                Fazer uma Doação
              </Button>
            </div>

            {/* Community Support */}
            <div className="rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-purple-100">
                <Users className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Compartilhe nas Redes</h3>
              <p className="mb-6 text-muted-foreground">
                Divulgue o PetHub para amigos e familiares. Quanto mais pessoas conhecerem, mais pets podemos ajudar a
                reunir.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Compartilhar PetHub
              </Button>
            </div>

            {/* Volunteer */}
            <div className="rounded-3xl border bg-card p-8 shadow-sm transition-shadow hover:shadow-md">
              <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-green-100">
                <Sparkles className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="mb-3 text-xl font-bold">Seja Voluntário</h3>
              <p className="mb-6 text-muted-foreground">
                Ajude a moderar reportes, verificar informações e apoiar outros usuários da comunidade.
              </p>
              <Button variant="outline" className="w-full bg-transparent">
                Quero Ser Voluntário
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonial */}
      <section className="px-4 py-20">
        <div className="container mx-auto max-w-4xl">
          <div className="rounded-3xl border bg-gradient-to-br from-blue-50 via-background to-orange-50 p-8 text-center shadow-lg md:p-12">
            <div className="mb-6 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-orange-alert text-orange-alert-foreground shadow-lg">
                <Heart className="h-8 w-8" fill="currentColor" />
              </div>
            </div>
            <blockquote className="mb-6 text-xl font-medium leading-relaxed text-foreground md:text-2xl">
              "Anunciar no PetHub trouxe novos clientes para minha pet shop e ainda ajudo famílias a encontrarem seus
              pets. É gratificante fazer parte dessa comunidade."
            </blockquote>
            <div className="text-sm font-medium text-muted-foreground">
              <div className="font-semibold text-foreground">Maria Silva</div>
              <div>Pet Shop Amigo Fiel - São Paulo</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="border-t bg-gradient-to-br from-orange-alert to-orange-600 px-4 py-20 text-orange-alert-foreground">
        <div className="container mx-auto max-w-7xl px-4 text-center">
          <h2 className="mb-6 text-4xl font-bold tracking-tight md:text-5xl">Pronto para fazer a diferença?</h2>
          <p className="mb-8 text-xl leading-relaxed opacity-90">
            Cada contribuição, grande ou pequena, nos ajuda a reunir mais pets com suas famílias. Junte-se a nós nessa
            missão.
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="h-12 bg-white px-8 text-base font-semibold text-orange-alert hover:bg-white/90"
            >
              <Link href="/auth/sign-up">
                Criar Conta Petshop
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 border-2 border-white/30 bg-transparent px-8 text-base font-semibold text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/pets">Ver Pets Perdidos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
