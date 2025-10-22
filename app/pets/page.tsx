import { createClient } from '@/lib/supabase/server';
import { PetMapInterface } from '@/components/pet-map/pet-map-interface';

export default async function PetsPage() {
  const supabase = await createClient();

  const { data: pets } = await supabase
    .from('pets')
    .select('*')
    .in('status', ['LOST', 'FOUND'])
    .order('created_at', { ascending: false });

  const { data: ads } = await supabase
    .from('advertisements')
    .select('*')
    .eq('is_active', true)
    .order('created_at', { ascending: false });

  return <PetMapInterface pets={pets || []} ads={ads || []} />;
}
