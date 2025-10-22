import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MyAdsContent } from '@/components/ads/my-ads-content';
import type { Advertisement } from '@/lib/types/database';

export default async function MeusAnunciosPage() {
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => cookieStore.set(name, value, options));
        },
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // Fetch user profile to check role
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();

  if (!profile || profile.role !== 'PETSHOP') {
    redirect('/');
  }

  // Fetch advertisements for this petshop
  const { data: ads } = await supabase
    .from('advertisements')
    .select('*')
    .eq('petshop_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <MyAdsContent profile={profile} ads={(ads as Advertisement[]) || []} />
    </div>
  );
}
