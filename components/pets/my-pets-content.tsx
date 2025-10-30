'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, MapPin, Trash2, CheckCircle2, Eye, Pencil, Calendar } from 'lucide-react';
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
import { petTypeEmoji, statusConfig } from '@/utils/configPet';

interface MyPetsContentProps {
  pets: Pet[];
}

export function MyPetsContent({ pets: initialPets }: MyPetsContentProps) {
  const [pets, setPets] = useState(initialPets);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [reunitingId, setReunitingId] = useState<string | null>(null);
  const [reuniteConfirmId, setReuniteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const supabase = createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  const lostPets = pets.filter((pet) => pet.status === 'LOST').length;
  const sightedPets = pets.filter((pet) => pet.status === 'SIGHTED').length;
  const rescuedPets = pets.filter((pet) => pet.status === 'RESCUED').length;
  const adoptionPets = pets.filter((pet) => pet.status === 'ADOPTION').length;
  const reunitedPets = pets.filter((pet) => pet.status === 'REUNITED').length;

  const markAsReunited = async () => {
    if (!reuniteConfirmId) return;

    setReunitingId(reuniteConfirmId);
    const { error } = await supabase.from('pets').update({ status: 'REUNITED' }).eq('id', reuniteConfirmId);

    if (!error) {
      setPets(pets.map((pet) => (pet.id === reuniteConfirmId ? { ...pet, status: 'REUNITED' as const } : pet)));
    }
    setReunitingId(null);
    setReuniteConfirmId(null);
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
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
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
              <p className="text-sm text-muted-foreground">Avistados</p>
              <p className="text-3xl font-bold mt-1 text-blue-500">{sightedPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.SIGHTED.emoji}</div>
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Resgatados</p>
              <p className="text-3xl font-bold mt-1 text-cyan-500">{rescuedPets}</p>
            </div>
            <div className="text-3xl">{statusConfig.RESCUED.emoji}</div>
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
              <p className="text-sm text-muted-foreground">Reunidos</p>
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
            <Card
              key={pet.id}
              className="group overflow-hidden hover:shadow-2xl transition-all duration-300 border-0 bg-gradient-to-br from-background to-muted/20 py-0"
            >
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src={pet.photo_url || '/placeholder.svg?height=600&width=450'}
                  alt={pet.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />

                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />

                {/* Status Badge - Top Right */}
                <div className="absolute top-4 right-4 z-10">
                  <Badge
                    className={`${statusConfig[pet.status].color} text-white border-0 shadow-lg text-sm px-3 py-1.5`}
                  >
                    {statusConfig[pet.status].emoji} {statusConfig[pet.status].label}
                  </Badge>
                </div>

                {/* Type Badge - Top Left */}
                <div className="absolute top-4 left-4 z-10">
                  <Badge className="bg-white/95 backdrop-blur-sm text-foreground border-0 shadow-lg text-sm px-3 py-1.5">
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

                {/* Content Overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                  <Link href={`/pet/${pet.id}`}>
                    <h3 className="text-2xl font-bold mb-2 text-balance">{pet.name}</h3>
                  </Link>

                  {pet.breed && <p className="text-sm text-white/90 mb-2 font-medium">{pet.breed}</p>}

                  {pet.description && (
                    <p className="text-sm text-white/80 mb-3 line-clamp-2 leading-relaxed">{pet.description}</p>
                  )}

                  {pet.location_description && (
                    <div className="flex items-start gap-2 text-sm text-white/90 mb-4">
                      <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      <span className="line-clamp-1">{pet.location_description}</span>
                    </div>
                  )}

                  <div className="flex items-center gap-2 text-xs text-white/70 mb-4">
                    <Calendar className="h-3.5 w-3.5" />
                    <span>Reportado em {new Date(pet.created_at).toLocaleDateString('pt-BR')}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-white/95 hover:bg-white text-foreground backdrop-blur-sm shadow-lg"
                      asChild
                    >
                      <Link href={`/editar-pet/${pet.id}`}>
                        <Pencil className="mr-2 h-4 w-4" />
                        Editar
                      </Link>
                    </Button>

                    {pet.status === 'RESCUED' && (
                      <Button
                        size="sm"
                        variant="secondary"
                        className="bg-purple-500/95 hover:bg-purple-600 text-white backdrop-blur-sm shadow-lg"
                        onClick={() => setReuniteConfirmId(pet.id)}
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
                            Reunido
                          </>
                        )}
                      </Button>
                    )}

                    <Button
                      size="sm"
                      variant="secondary"
                      className="bg-red-500/95 hover:bg-red-600 text-white backdrop-blur-sm shadow-lg"
                      onClick={() => setDeleteId(pet.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      <AlertDialog open={!!reuniteConfirmId} onOpenChange={() => setReuniteConfirmId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar como reunido?</AlertDialogTitle>
            <AlertDialogDescription>
              Isso indicará que o pet foi reunido com seu dono. Esta ação pode ser revertida editando o pet
              posteriormente.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!reunitingId}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={markAsReunited}
              disabled={!!reunitingId}
              className="bg-purple-500 hover:bg-purple-600"
            >
              {reunitingId ? (
                <div className="flex items-center gap-2">
                  <div className="scale-75">
                    <LoadingSpinner size="sm" />
                  </div>
                  <span>Marcando...</span>
                </div>
              ) : (
                'Marcar como Reunido'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
