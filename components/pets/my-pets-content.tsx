'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Trash2, CheckCircle2, Eye, Pencil } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { createBrowserClient } from '@supabase/ssr';
import type { Pet } from '@/lib/types/database';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

interface MyPetsContentProps {
  pets: Pet[];
}

const statusConfig = {
  LOST: { label: 'Perdido', color: 'bg-orange-500', emoji: '🔍' },
  FOUND: { label: 'Encontrado', color: 'bg-blue-500', emoji: '👀' },
  ADOPTION: { label: 'Adoção', color: 'bg-green-500', emoji: '🏠' },
  REUNITED: { label: 'Devolvido', color: 'bg-purple-500', emoji: '❤️' },
};

const petTypeEmoji = {
  DOG: '🐕',
  CAT: '🐈',
  BIRD: '🐦',
  OTHER: '🐾',
};

export function MyPetsContent({ pets: initialPets }: MyPetsContentProps) {
  const [pets, setPets] = useState(initialPets);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reunitingId, setReunitingId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const lostPets = pets.filter((pet) => pet.status === 'LOST').length;
  const foundPets = pets.filter((pet) => pet.status === 'FOUND').length;
  const adoptionPets = pets.filter((pet) => pet.status === 'ADOPTION').length;
  const reunitedPets = pets.filter((pet) => pet.status === 'REUNITED').length;

  const markAsReunited = async (petId: string) => {
    setReunitingId(petId);
    const { error } = await supabase.from('pets').update({ status: 'REUNITED' }).eq('id', petId);

    if (!error) {
      setPets(pets.map((pet) => (pet.id === petId ? { ...pet, status: 'REUNITED' as const } : pet)));
    }
    setReunitingId(null);
  };

  const deletePet = async () => {
    if (!deleteId) return;

    setIsDeleting(true);
    const { error } = await supabase.from('pets').delete().eq('id', deleteId);

    if (!error) {
      setPets(pets.filter((pet) => pet.id !== deleteId));
    }
    setIsDeleting(false);
    setDeleteId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-bold">Meus Pets</h1>
          <p className="text-muted-foreground mt-1">Gerencie os pets que você reportou</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Perdidos</p>
              <p className="text-3xl font-bold mt-1 text-orange-500">{lostPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.LOST.emoji}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Encontrados</p>
              <p className="text-3xl font-bold mt-1 text-blue-500">{foundPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.FOUND.emoji}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Adoção</p>
              <p className="text-3xl font-bold mt-1 text-green-500">{adoptionPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.ADOPTION.emoji}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Devolvidos</p>
              <p className="text-3xl font-bold mt-1 text-purple-500">{reunitedPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.REUNITED.emoji}</div>
          </div>
        </Card>
      </div>

      {/* Pets Grid */}
      {pets.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="h-16 w-16 rounded-full bg-muted mx-auto mb-4 flex items-center justify-center">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Nenhum pet reportado</h3>
            <p className="text-muted-foreground mb-6">Comece reportando um pet perdido, encontrado ou para adoção</p>
            <Button asChild className="bg-orange-500 hover:bg-orange-600">
              <Link href="/reportar">
                <Plus className="mr-2 h-4 w-4" />
                Reportar Primeiro Pet
              </Link>
            </Button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {pets.map((pet) => (
            <Card key={pet.id} className="overflow-hidden group hover:shadow-lg transition-shadow">
              <div className="relative aspect-square bg-muted">
                <Image
                  src={pet.photo_url || '/placeholder.svg?height=400&width=400'}
                  alt={pet.name}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={`${statusConfig[pet.status].color} text-white border-0`}>
                    {statusConfig[pet.status].emoji} {statusConfig[pet.status].label}
                  </Badge>
                </div>
                <div className="absolute top-2 left-2">
                  <Badge variant="secondary" className="bg-white/90 backdrop-blur text-foreground border-0">
                    {petTypeEmoji[pet.type]}{' '}
                    {pet.type === 'DOG'
                      ? 'Cachorro'
                      : pet.type === 'CAT'
                      ? 'Gato'
                      : pet.type === 'BIRD'
                      ? 'Pássaro'
                      : 'Outro'}
                  </Badge>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2">{pet.name}</h3>
                {pet.breed && <p className="text-sm text-muted-foreground mb-2">Raça: {pet.breed}</p>}
                {pet.description && (
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{pet.description}</p>
                )}

                {pet.location_description && (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                    <span className="line-clamp-1">{pet.location_description}</span>
                  </div>
                )}

                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/pet/${pet.id}`}>
                      <Eye className="mr-2 h-4 w-4" />
                      Ver Detalhes
                    </Link>
                  </Button>

                  {pet.status !== 'REUNITED' && (
                    <Button size="sm" variant="outline" asChild>
                      <Link href={`/editar-pet/${pet.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>
                  )}

                  {(pet.status === 'LOST' || pet.status === 'FOUND') && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-purple-600 hover:text-purple-700 bg-transparent"
                      onClick={() => markAsReunited(pet.id)}
                      disabled={reunitingId === pet.id}
                    >
                      {reunitingId === pet.id ? (
                        <div className="flex items-center gap-2">
                          <div className="scale-50">
                            <LoadingSpinner size="sm" />
                          </div>
                        </div>
                      ) : (
                        <>
                          <CheckCircle2 className="mr-2 h-4 w-4" />
                          Marcar como Devolvido
                        </>
                      )}
                    </Button>
                  )}

                  {pet.status !== 'REUNITED' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-destructive hover:text-destructive bg-transparent"
                      onClick={() => setDeleteId(pet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="mt-3 pt-3 text-xs text-muted-foreground">
                  Reportado em {new Date(pet.created_at).toLocaleDateString('pt-BR')}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir pet?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta ação não pode ser desfeita. O pet será permanentemente removido do sistema.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={deletePet}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <div className="flex items-center gap-2">
                  <div className="scale-75">
                    <LoadingSpinner size="sm" />
                  </div>
                  <span>Excluindo...</span>
                </div>
              ) : (
                'Excluir'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
