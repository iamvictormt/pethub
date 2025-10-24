import { createClient } from "@/lib/supabase/server"
import { formatCurrency } from "@/lib/contribution-tiers"
import { Heart, Trophy, Star, Crown, Cat } from "lucide-react"
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
      <section className="relative overflow-hidden bg-gradient-to-br from-orange-50 via-background to-blue-50 px-4 py-16 md:py-24">
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
              Nossos Heróis
            </h1>

            <p className="mb-12 text-pretty text-lg text-muted-foreground md:text-xl">
              Pessoas incríveis que tornam possível reunir pets com suas famílias.
              <br />
              Cada contribuição faz a diferença.
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
        <div className="container mx-auto max-w-7xl px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">Hall da Fama</h2>
            <p className="text-lg text-muted-foreground">Contribuintes que fizeram a diferença este mês</p>
          </div>

          {contributions && contributions.length > 0 ? (
            <div className="mx-auto max-w-4xl space-y-4">
              {contributions.map((contribution, index) => {
                const isTop3 = index < 3
                const icons = [
                  { icon: Crown, color: "text-yellow-500", bg: "bg-yellow-500/10" },
                  { icon: Trophy, color: "text-gray-500", bg: "bg-gray-500/10" },
                  { icon: Star, color: "text-orange-alert", bg: "bg-orange-alert/10" },
                ]
                const iconConfig = isTop3 ? icons[index] : null
                const Icon = iconConfig?.icon || Heart

                return (
                  <div
                    key={contribution.id}
                    className="group rounded-2xl border bg-background p-6 shadow-sm transition-all hover:shadow-md"
                  >
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                            iconConfig?.bg || "bg-pink-500/10"
                          }`}
                        >
                          <Icon className={`h-6 w-6 ${iconConfig?.color || "text-pink-500"}`} />
                        </div>
                        <div>
                          <div className="mb-1 font-semibold">
                            {contribution.contributor_name || "Contribuinte Anônimo"}
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {new Date(contribution.created_at).toLocaleDateString("pt-BR", {
                              day: "2-digit",
                              month: "long",
                              year: "numeric",
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-left sm:text-right">
                        <div className="text-2xl font-bold text-orange-alert">
                          {formatCurrency(contribution.amount_in_cents)}
                        </div>
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
            Sua contribuição ajuda a manter o Farejei gratuito para todos e a reunir mais pets com suas famílias. Juntos,
            fazemos a diferença!
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
