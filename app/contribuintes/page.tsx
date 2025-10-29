import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/contribution-tiers"
import { Heart, Cat, Wrench, TrendingUp, Users, Instagram } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function ContributorsPage() {
  const supabase = await createClient()

  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: contributions } = await supabase
    .from("contributions")
    .select("*")
    .eq("status", "completed")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .order("amount_in_cents", { ascending: false })

  // Get total stats
  const { data: allContributions } = await supabase
    .from("contributions")
    .select("amount_in_cents")
    .eq("status", "completed")

  const totalRaised = allContributions?.reduce((sum, c) => sum + c.amount_in_cents, 0) || 0
  const totalContributors = new Set(contributions?.map((c) => c.contributor_email)).size
  const monthlyTotal = contributions?.reduce((sum, c) => sum + c.amount_in_cents, 0) || 0

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24 lg:py-32">
        <div className="container mx-auto max-w-7xl px-4">
          {/* Announcement Badge */}
          <div className="mb-8 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-alert/20 bg-orange-alert/10 px-4 py-2 text-sm font-medium text-orange-alert backdrop-blur">
              <Cat className="h-4 w-4 text-orange-alert" />
              Comunidade Farejei
            </div>
          </div>

          {/* Hero Content */}
          <div className="text-center">
            <h1 className="mb-6 text-balance text-4xl font-bold leading-tight tracking-tight md:text-5xl lg:text-6xl">
              Nossos{" "}
              <span className="bg-gradient-to-r from-orange-alert via-orange-500 to-blue-farejei bg-clip-text text-transparent">
                Heróis
              </span>
            </h1>

            <p className="mb-8 text-pretty text-lg text-muted-foreground md:text-xl">
              Pessoas incríveis que tornam possível reunir pets com suas famílias.
              <br />
              Cada contribuição faz a diferença na vida de um pet e sua família.
            </p>

            {/* Stats */}
            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-6 sm:grid-cols-3">
              <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-orange-alert md:text-4xl">
                  {formatCurrency(totalRaised)}
                </div>
                <div className="text-sm font-medium text-muted-foreground">Total Arrecadado</div>
              </div>

              <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-blue-farejei md:text-4xl">{totalContributors}</div>
                <div className="text-sm font-medium text-muted-foreground">Contribuintes</div>
              </div>

              <div className="rounded-2xl border bg-background p-6 shadow-sm">
                <div className="mb-2 text-3xl font-bold text-foreground md:text-4xl">
                  {formatCurrency(monthlyTotal)}
                </div>
                <div className="text-sm font-medium text-muted-foreground">Este Mês</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-background px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Como usamos as contribuições</h2>
            <p className="mx-auto max-w-2xl text-lg text-muted-foreground">
              100% transparente. Cada real é investido para ajudar mais pets e suas famílias.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-blue-farejei/10">
                <Wrench className="h-6 w-6 text-blue-farejei" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Manutenção da Plataforma</h3>
              <p className="text-sm text-muted-foreground">
                Servidores, hospedagem, armazenamento de fotos e infraestrutura para manter o Farejei sempre disponível
                e rápido.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-orange-alert/10">
                <TrendingUp className="h-6 w-6 text-orange-alert" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Melhorias e Novos Recursos</h3>
              <p className="text-sm text-muted-foreground">
                Desenvolvimento de novas funcionalidades, melhorias na experiência do usuário e correções para tornar a
                plataforma cada vez melhor.
              </p>
            </div>

            <div className="rounded-2xl border bg-background p-6 shadow-sm">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-xl bg-purple-500/10">
                <Users className="h-6 w-6 text-purple-500" />
              </div>
              <h3 className="mb-2 text-xl font-semibold">Apoio a Organizações</h3>
              <p className="text-sm text-muted-foreground">
                Parte das contribuições será distribuída para organizações que cuidam de pets abandonados e promovem a
                adoção responsável.
              </p>
            </div>
          </div>

          <div className="mt-12 rounded-2xl border bg-gradient-to-br from-purple-50 to-pink-50 p-8 text-center">
            <h3 className="mb-2 text-xl font-bold">Transparência Total</h3>
            <p className="mb-4 text-muted-foreground">
              Vamos mostrar regularmente como cada contribuição é utilizada e quais organizações estão sendo apoiadas.
              <br />
              Acompanhe tudo pelo nosso Instagram!
            </p>
            <Button
              asChild
              variant="outline"
              className="border-purple-500 text-purple-500 hover:bg-purple-50 bg-transparent hover:text-purple-500"
            >
              <a href="https://instagram.com/farejeiapp" target="_blank" rel="noopener noreferrer">
                <Instagram className="h-5 w-5" />
                @farejeiapp
              </a>
            </Button>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/30 px-4 py-16 md:py-24">
        <div className="container mx-auto max-w-7xl">
          <div className="mb-16 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Comunidade de Apoiadores</h2>
            <p className="text-lg text-muted-foreground">
              Pessoas incríveis que acreditam na nossa missão de reunir pets com suas famílias
            </p>
          </div>

          {contributions && contributions.length > 0 ? (
            <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {contributions.map((contribution) => {
                const name = contribution.contributor_name || "Apoiador Anônimo"
                const initials = name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .toUpperCase()
                  .slice(0, 2)

                const colors = [
                  "bg-orange-alert/10 text-orange-alert",
                  "bg-blue-farejei/10 text-blue-farejei",
                  "bg-purple-500/10 text-purple-500",
                  "bg-pink-500/10 text-pink-500",
                  "bg-green-500/10 text-green-500",
                  "bg-yellow-500/10 text-yellow-500",
                ]
                const colorClass = colors[Math.floor(Math.random() * colors.length)]

                return (
                  <div
                    key={contribution.id}
                    className={`group rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md`}
                  >
                    <div className="flex flex-col items-center text-center">
                      <div className={`mb-4 flex h-16 w-16 items-center justify-center rounded-full ${colorClass}`}>
                        <span className="text-xl font-bold">{initials}</span>
                      </div>
                      <div className="mb-2 font-semibold">{name}</div>
                      <div className="mb-3 text-2xl font-bold text-orange-alert">
                        {formatCurrency(contribution.amount_in_cents)}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Heart className="h-4 w-4 fill-pink-500 text-pink-500" />
                        {new Date(contribution.created_at).toLocaleDateString("pt-BR", {
                          day: "2-digit",
                          month: "short",
                        })}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="mx-auto max-w-2xl rounded-2xl border bg-background p-12 text-center shadow-sm">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-muted">
                <Heart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-xl font-bold">Ainda não há contribuintes este mês</h3>
              <p className="text-muted-foreground">Seja o primeiro a fazer a diferença!</p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t bg-gradient-to-br from-orange-alert via-orange-600 to-orange-700 px-4 py-16 text-white md:py-24">
        <div className="container mx-auto max-w-4xl text-center">
          <Heart className="mx-auto mb-6 h-16 w-16" />
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Faça Parte Desta História</h2>
          <p className="mb-8 text-lg text-orange-50 md:text-xl">
            Sua contribuição ajuda a manter o Farejei gratuito para todos e a reunir mais pets com suas famílias.
            Juntos, fazemos a diferença!
          </p>
          <div className="flex flex-col gap-4 sm:flex-row sm:justify-center">
            <Button asChild size="lg" className="bg-white text-orange-alert hover:bg-white/90">
              <Link href="/contribuir">
                <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                Contribuir Agora
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
