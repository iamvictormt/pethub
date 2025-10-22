import { createClient } from '@/lib/supabase/server';
import { formatCurrency } from '@/lib/contribution-tiers';
import { Heart, Trophy, Star, Crown } from 'lucide-react';

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

  return (
    <div className="min-h-screen bg-gradient-to-b from-orange-50 to-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-orange-500 to-orange-600 py-20 text-white">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="mx-auto mb-6 h-16 w-16" />
            <h1 className="mb-4 text-5xl font-bold">Nossos Contribuintes</h1>
            <p className="text-xl text-orange-100">Pessoas incríveis que ajudam a manter o PetHub funcionando</p>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container mx-auto -mt-12 px-4">
        <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">{formatCurrency(totalRaised)}</div>
              <div className="text-gray-600">Total Arrecadado</div>
            </div>
          </div>
          <div className="rounded-2xl bg-white p-8 shadow-lg">
            <div className="text-center">
              <div className="mb-2 text-4xl font-bold text-orange-600">{totalContributors}</div>
              <div className="text-gray-600">Contribuintes Este Mês</div>
            </div>
          </div>
        </div>
      </div>

      {/* Contributors List */}
      <div className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <h2 className="mb-8 text-center text-3xl font-bold text-gray-900">Contribuintes do Mês</h2>

          {contributions && contributions.length > 0 ? (
            <div className="space-y-4">
              {contributions.map((contribution, index) => {
                const icon =
                  index === 0 ? (
                    <Crown className="h-6 w-6 text-yellow-500" />
                  ) : index === 1 ? (
                    <Trophy className="h-6 w-6 text-gray-400" />
                  ) : index === 2 ? (
                    <Star className="h-6 w-6 text-orange-500" />
                  ) : (
                    <Heart className="h-6 w-6 text-pink-500" />
                  );

                return (
                  <div
                    key={contribution.id}
                    className="flex items-center justify-between rounded-xl bg-white p-6 shadow-md transition-shadow hover:shadow-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-orange-100">
                        {icon}
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">
                          {contribution.contributor_name || 'Contribuinte Anônimo'}
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
                      <div className="text-xl font-bold text-orange-600">
                        {formatCurrency(contribution.amount_in_cents)}
                      </div>
                      <div className="text-xs text-gray-500">
                        {contribution.payment_method === 'pix' ? '💳 PIX' : '💳 Cartão'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl bg-white p-12 text-center shadow-md">
              <Heart className="mx-auto mb-4 h-16 w-16 text-gray-300" />
              <p className="text-gray-600">Ainda não há contribuintes este mês. Seja o primeiro!</p>
            </div>
          )}
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 py-16 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-4 text-3xl font-bold">Quer Contribuir?</h2>
          <p className="mb-8 text-xl text-orange-100">
            Ajude a manter o PetHub funcionando e reunindo pets com suas famílias
          </p>
          <a
            href="/contribuir"
            className="inline-block rounded-full bg-white px-8 py-4 font-semibold text-orange-600 transition-transform hover:scale-105"
          >
            Fazer uma Contribuição
          </a>
        </div>
      </div>
    </div>
  );
}
