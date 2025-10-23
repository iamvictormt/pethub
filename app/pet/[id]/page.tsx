import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { PetDetails } from '@/components/pet-profile/pet-details';
import { PetComments } from '@/components/pet-profile/pet-comments';
import { PetActions } from '@/components/pet-profile/pet-actions';
import { incrementPetView } from '@/lib/actions/pet-views';

export default async function PetProfilePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch pet details with owner profile
  const { data: pet, error } = await supabase
    .from('pets')
    .select(
      `
      *,
      profiles:user_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq('id', id)
    .single();

  if (error || !pet) {
    notFound();
  }

  await incrementPetView(id);

  const { data: comments } = await supabase
    .from('comments')
    .select(
      `
      *,
      profiles:user_id (
        id,
        name,
        avatar_url
      )
    `
    )
    .eq('pet_id', id)
    .order('created_at', { ascending: false });

  const isOwner = user?.id === pet.user_id;

  return (
    <div className="container mx-auto max-w-7xl px-4 py-8">
      <div className="grid gap-8 lg:grid-cols-3">
        {/* Main Content */}
        <div className="space-y-6 lg:col-span-2">
          <PetDetails pet={pet} />
          <PetComments petId={id} comments={comments || []} userId={user?.id} />
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <PetActions pet={pet} isOwner={isOwner} userId={user?.id} />
        </div>
      </div>
    </div>
  );
}
