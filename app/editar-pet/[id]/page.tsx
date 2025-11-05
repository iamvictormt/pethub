import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { PetEditForm } from '@/components/pet-report/pet-edit-form';

export default async function EditPetPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth/login');
  }

  const { data: pet, error } = await supabase
    .from('pets')
    .select('*')
    .eq('id', params.id)
    .eq('user_id', user.id)
    .single();

  if (error || !pet) {
    redirect('/meus-pets');
  }

  console.log(pet);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-balance text-orange-alert">Editar Pet</h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Atualize as informações do pet reportado
          </p>
        </div>

        <PetEditForm pet={pet} />
      </div>
    </div>
  );
}
