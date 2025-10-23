import Link from "next/link"
import { Button } from "@/components/ui/button"
import { MapPin, Heart, Search, Shield, Users, Clock, CheckCircle2, ArrowRight, Sparkles } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function HomePage() {
  const supabase = await createClient()

  // Fetch real statistics
  const [petsReunitedResult, activeUsersResult, recentReunitedResult] = await Promise.all([
    supabase.from("pets").select("id", { count: "exact", head: true }).eq("status", "REUNITED"),
    supabase.from("profiles").select("id", { count: "exact", head: true }),
    supabase
      .from("pets")
      .select("created_at, updated_at")
      .eq("status", "REUNITED")
      .not("updated_at", "is", null)
      .order("updated_at", { ascending: false })
      .limit(10),
  ])

  const petsReunited = petsReunitedResult.count || 0
  const activeUsers = activeUsersResult.count || 0

  // Calculate average time to reunite (in hours)
  let avgTimeHours = 24
  if (recentReunitedResult.data && recentReunitedResult.data.length > 0) {
    const times = recentReunitedResult.data
      .filter((pet) => pet.created_at && pet.updated_at)
      .map((pet) => {
        const created = new Date(pet.created_at!).getTime()
        const updated = new Date(pet.updated_at!).getTime()
        return (updated - created) / (1000 * 60 * 60) // Convert to hours
      })

    if (times.length > 0) {
      avgTimeHours = Math.round(times.reduce((a, b) => a + b, 0) / times.length)
    }
  }

  return (
    <div className="flex min-h-screen flex-col">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <div className="mb-8 flex justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-orange-alert/20 bg-orange-alert/10 px-4 py-2 text-sm font-medium text-orange-alert backdrop-blur">
                <Sparkles className="h-4 w-4 text-orange-alert" fill="currentColor" />
                Um sistema para todos
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            {/* Left Column - Text */}
            <div className="flex flex-col justify-center">
              <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
                Seu pet perdido está mais perto do que você imagina
              </h1>

              <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
                Conecte-se com milhares de pessoas que podem ter encontrado seu pet. Use nosso mapa em tempo real para
                buscar e reportar animais perdidos na sua região.
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col gap-4 sm:flex-row">
                <Button asChild size="lg" className="group bg-orange-alert hover:bg-orange-alert/90">
                  <Link href="/pets">
                    Buscar Pets Perdidos
                    <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </Button>
              </div>

              {/* Stats */}
              <div className="mt-12 grid grid-cols-3 gap-6 pt-2">
                <div>
                  <div className="text-3xl font-bold text-orange-alert">{petsReunited}+</div>
                  <div className="text-sm text-muted-foreground">Pets reunidos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-pethub">{activeUsers}+</div>
                  <div className="text-sm text-muted-foreground">Usuários ativos</div>
                </div>
                <div>
                  <div className="text-3xl font-bold text-foreground">{avgTimeHours}h</div>
                  <div className="text-sm text-muted-foreground">Tempo médio</div>
                </div>
              </div>
            </div>

            {/* Right Column - Visual */}
            <div className="relative flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-orange-alert/20 to-blue-pethub/20 shadow-2xl lg:h-[500px]">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Pet reunido ao dono"
                  className="h-full w-full object-cover"
                />
                {/* Floating Card */}
                <div className="absolute bottom-6 left-6 right-6 rounded-2xl border bg-background/95 p-4 shadow-lg backdrop-blur">
                  <div className="flex items-center gap-3">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-500/10">
                      <CheckCircle2 className="h-6 w-6 text-green-500" />
                    </div>
                    <div>
                      <div className="font-semibold">Max encontrado!</div>
                      <div className="text-sm text-muted-foreground">Reunido há 2 horas</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Como funciona</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              Três passos simples para reunir você com seu pet
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3 md:gap-12 text-center">
            {/* Step 1 */}
            <div className="relative">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-orange-alert/10 inline-flex">
                <MapPin className="h-10 w-10 text-orange-alert" />
              </div>
              <div className="absolute left-10 top-10 -z-10 text-8xl font-bold text-muted/10">1</div>
              <h3 className="mb-3 text-2xl font-bold">Reporte</h3>
              <p className="text-muted-foreground">
                Adicione fotos, localização e características do seu pet. Quanto mais detalhes, melhor.
              </p>
            </div>

            {/* Step 2 */}
            <div className="relative">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-pethub/10 inline-flex">
                <Search className="h-10 w-10 text-blue-pethub" />
              </div>
              <div className="absolute left-10 top-10 -z-10 text-8xl font-bold text-muted/10">2</div>
              <h3 className="mb-3 text-2xl font-bold">Busque</h3>
              <p className="text-muted-foreground">
                Visualize pets perdidos e encontrados no mapa interativo. Filtre por tipo, distância e data.
              </p>
            </div>

            {/* Step 3 */}
            <div className="relative">
              <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-green-500/10 inline-flex">
                <Heart className="h-10 w-10 text-green-500" />
              </div>
              <div className="absolute left-10 top-10 -z-10 text-8xl font-bold text-muted/10">3</div>
              <h3 className="mb-3 text-2xl font-bold">Reconecte</h3>
              <p className="text-muted-foreground">
                Entre em contato direto com quem encontrou seu pet e celebre o reencontro!
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl">Histórias que aquecem o coração</h2>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {/* Testimonial 1 */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 fill-orange-alert text-orange-alert" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Encontrei minha Luna em menos de 6 horas! A comunidade do PetHub é incrível. Obrigada a todos que
                ajudaram!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-orange-alert/10" />
                <div>
                  <div className="font-semibold">Maria Silva</div>
                  <div className="text-sm text-muted-foreground">São Paulo, SP</div>
                </div>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 fill-orange-alert text-orange-alert" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Achei um cachorro perdido e consegui localizar o dono pelo PetHub. Ver a felicidade deles foi
                emocionante!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-pethub/10" />
                <div>
                  <div className="font-semibold">João Santos</div>
                  <div className="text-sm text-muted-foreground">Rio de Janeiro, RJ</div>
                </div>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex gap-1">
                {[...Array(5)].map((_, i) => (
                  <Heart key={i} className="h-5 w-5 fill-orange-alert text-orange-alert" />
                ))}
              </div>
              <p className="mb-4 text-muted-foreground">
                "Plataforma essencial para quem ama animais. Já ajudei a reunir 3 pets com seus donos. Gratidão!"
              </p>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10" />
                <div>
                  <div className="font-semibold">Ana Costa</div>
                  <div className="text-sm text-muted-foreground">Belo Horizonte, MG</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl px-4">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <div className="flex flex-col justify-center">
              <h2 className="mb-6 text-3xl font-bold md:text-4xl lg:text-5xl">Tecnologia que salva vidas</h2>
              <p className="mb-8 text-lg text-muted-foreground">
                Nossa plataforma usa geolocalização em tempo real e uma comunidade engajada para maximizar as chances de
                reencontro.
              </p>

              <div className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-alert/10">
                    <MapPin className="h-6 w-6 text-orange-alert" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Mapa em Tempo Real</h3>
                    <p className="text-sm text-muted-foreground">
                      Visualize pets perdidos e encontrados próximos a você instantaneamente
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-pethub/10">
                    <Users className="h-6 w-6 text-blue-pethub" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Comunidade Ativa</h3>
                    <p className="text-sm text-muted-foreground">
                      Milhares de pessoas prontas para ajudar a encontrar seu pet
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
                    <Clock className="h-6 w-6 text-green-500" />
                  </div>
                  <div>
                    <h3 className="mb-1 font-semibold">Alertas Instantâneos</h3>
                    <p className="text-sm text-muted-foreground">
                      Receba notificações quando alguém reportar um pet parecido com o seu
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-center justify-center">
              <div className="relative h-[400px] w-full overflow-hidden rounded-3xl bg-gradient-to-br from-blue-pethub/20 to-orange-alert/20 shadow-2xl lg:h-[500px]">
                <img
                  src="/placeholder.svg?height=500&width=600"
                  alt="Interface do PetHub"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="border-t bg-gradient-to-br from-orange-alert via-orange-alert/90 to-orange-alert/80 px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <Shield className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Ajude a manter o PetHub gratuito</h2>
          <p className="mb-8 text-lg text-orange-50 md:text-xl">
            Nossa missão é reunir o máximo de pets com suas famílias. Sua contribuição mantém a plataforma funcionando e
            ajuda mais animais a voltarem para casa.
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary" className="bg-white text-orange-alert hover:bg-white/90">
              <Link href="/contribuir">
                Contribuir Agora
                <Heart className="h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-2 border-white bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/pets">Ver Pets Perdidos</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
