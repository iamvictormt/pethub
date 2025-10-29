import ContribuirContent from '@/components/contributions/contribuir-content';
import { createClient } from '@/lib/supabase/server';

export default async function ContribuirPage() {
  const supabase = await createClient();

  const [totalAmountResult, contributorsResult] = await Promise.all([
    supabase.from('contributions').select('amount_in_cents').eq('status', 'completed'),
    supabase.from('contributions').select('id, user_id, contributor_email').eq('status', 'completed'),
  ]);

  const totalAmountCents = totalAmountResult.data?.reduce((sum, c) => sum + (c.amount_in_cents || 0), 0) || 0;
  const totalAmount = totalAmountCents / 100; // Convert cents to reais

  const uniqueContributorsSet = new Set<string>();
  contributorsResult.data?.forEach((c) => {
    if (c.user_id) {
      uniqueContributorsSet.add(c.user_id);
    } else if (c.contributor_email) {
      uniqueContributorsSet.add(c.contributor_email);
    } else {
      // Anonymous contribution without email
      uniqueContributorsSet.add(c.id);
    }
  });
  const uniqueContributors = uniqueContributorsSet.size;

  return <ContribuirContent totalAmount={totalAmount} uniqueContributors={uniqueContributors} />;
}
