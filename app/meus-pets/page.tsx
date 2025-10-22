import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { MyPetsContent } from '@/components/pets/my-pets-content';
import type { Pet } from '@/lib/types/database';

export default async function MeusPetsPage() {
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
    redirect('/auth/login');
  }

  // Fetch pets for this user
  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-background">
      <MyPetsContent pets={(pets as Pet[]) || []} />
    </div>
  );
}
