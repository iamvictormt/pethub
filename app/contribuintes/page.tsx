import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/contribution-tiers';
import { Heart, Trophy, Star, Crown, Sparkles, Users, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default async function ContributorsPage() {
  const supabase = await createClient();

  // Get all completed contributions from the last 30 days
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { data: contributions } = await supabase
    .from('contributions')
    .select('*')
    .eq('status', 'completed')
    .gte('created_at', thirtyDaysAgo.toISOString())
    .order('amount_in_cents', { ascending: false });

  // Get total stats
  const { data: allContributions } = await supabase
    .from('contributions')
    .select('amount_in_cents')
    .eq('status', 'completed');

  const totalRaised = allContributions?.reduce((sum, c) => sum + c.amount_in_cents, 0) || 0;
  const totalContributors = new Set(contributions?.map((c) => c.contributor_email)).size;
  const monthlyTotal = contributions?.reduce((sum, c) => sum + c.amount_in_cents, 0) || 0;

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-orange-50 via-white to-blue-50">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="absolute -right-32 top-64 h-96 w-96 rounded-full bg-blue-200/30 blur-3xl" />
        <div className="absolute bottom-32 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-pink-200/20 blur-3xl" />
      </div>

      <div className="relative py-24">
        <div className="container relative z-10 mx-auto px-4">
          <div className="mx-auto max-w-7xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-orange-100 px-6 py-2 text-sm font-medium text-orange-700">
              Comunidade PetHub
            </div>
            <h1 className="mb-6 bg-gradient-to-r from-orange-600 via-orange-500 to-pink-500 bg-clip-text text-6xl font-bold text-transparent md:text-7xl">
              Nossos Heróis
            </h1>
            <p className="mb-12 text-xl leading-relaxed text-gray-600">
              Pessoas incríveis que tornam possível reunir pets com suas famílias.
              <br />
              Cada contribuição faz a diferença.
            </p>

            <div className="mx-auto grid max-w-5xl gap-6 md:grid-cols-3">
              <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                <div className="relative">
                  <div className="mb-2 text-5xl font-bold text-orange-600">{formatCurrency(totalRaised)}</div>
                  <div className="text-sm font-medium uppercase tracking-wide text-gray-500">Total Arrecadado</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                <div className="relative">
                  <div className="mb-2 text-5xl font-bold text-blue-600">{totalContributors}</div>
                  <div className="text-sm font-medium uppercase tracking-wide text-gray-500">Contribuintes</div>
                </div>
              </div>

              <div className="group relative overflow-hidden rounded-3xl bg-white/80 p-8 shadow-xl backdrop-blur-sm transition-all hover:scale-105 hover:shadow-2xl">
                <div className="relative">
                  <div className="mb-2 text-5xl font-bold text-pink-600">{formatCurrency(monthlyTotal)}</div>
                  <div className="text-sm font-medium uppercase tracking-wide text-gray-500">Este Mês</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-4 py-16">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-4xl font-bold text-gray-900">Hall da Fama</h2>
            <p className="text-lg text-gray-600">Contribuintes que fizeram a diferença este mês</p>
          </div>

          {contributions && contributions.length > 0 ? (
            <div className="space-y-4">
              {contributions.map((contribution, index) => {
                const isTop3 = index < 3;
                const icons = [
                  { icon: Crown, color: 'text-yellow-500', bg: 'bg-yellow-50', ring: 'ring-yellow-200' },
                  { icon: Trophy, color: 'text-gray-500', bg: 'bg-gray-50', ring: 'ring-gray-200' },
                  { icon: Star, color: 'text-orange-500', bg: 'bg-orange-50', ring: 'ring-orange-200' },
                ];
                const iconConfig = isTop3 ? icons[index] : null;
                const Icon = iconConfig?.icon || Heart;

                return (
                  <div
                    key={contribution.id}
                    className={`group relative overflow-hidden rounded-2xl bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:scale-[1.02] hover:shadow-xl ${
                      isTop3 ? `ring-2 ${iconConfig?.ring}` : ''
                    }`}
                  >
                    {isTop3 && (
                      <div className="absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-gradient-to-br from-orange-200/20 to-pink-200/20 blur-2xl" />
                    )}

                    <div className="relative flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-16 w-16 items-center justify-center rounded-2xl ${
                            iconConfig?.bg || 'bg-pink-50'
                          } ring-4 ring-white transition-transform group-hover:scale-110`}
                        >
                          <Icon className={`h-8 w-8 ${iconConfig?.color || 'text-pink-500'}`} />
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <span className="text-lg font-bold text-gray-900">
                              {contribution.contributor_name || 'Contribuinte Anônimo'}
                            </span>
                            {isTop3}
                          </div>
                          <div className="text-sm text-gray-500">
                            {new Date(contribution.created_at).toLocaleDateString('pt-BR', {
                              day: '2-digit',
                              month: 'long',
                              year: 'numeric',
                            })}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="mb-1 text-2xl font-bold text-orange-600">
                          {formatCurrency(contribution.amount_in_cents)}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-3xl bg-white/80 p-16 text-center shadow-xl backdrop-blur-sm">
              <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
                <Heart className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="mb-2 text-xl font-bold text-gray-900">Ainda não há contribuintes este mês</h3>
              <p className="text-gray-600">Seja o primeiro a fazer a diferença!</p>
            </div>
          )}
        </div>
      </div>

      <div className="relative py-24">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500 via-orange-600 to-pink-500" />
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=400&width=1200')] opacity-10" />

        <div className="container relative z-10 mx-auto px-4 text-center">
          <div className="mx-auto max-w-3xl">
            <h2 className="mb-4 text-5xl font-bold text-white">Faça Parte Desta História</h2>
            <p className="mb-10 text-xl leading-relaxed text-orange-100">
              Sua contribuição ajuda a manter o PetHub gratuito para todos e a reunir mais pets com suas famílias.
              Juntos, fazemos a diferença!
            </p>

            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Button
                asChild
                size="lg"
                className="h-14 bg-white px-8 text-base font-semibold text-orange-alert shadow-lg transition-all hover:scale-105 hover:bg-white/90 hover:shadow-xl"
              >
                <Link href="/contribuir">
                  <Heart className="mr-2 h-5 w-5" fill="currentColor" />
                  Contribuir Agora
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
