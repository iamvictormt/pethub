'use client';

import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Share2, Pencil, Trash2, CheckCircle2, Clock } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import type { Pet } from '@/lib/types/database';
import { petTypeEmoji, statusConfig } from '@/utils/configPet';
import type React from 'react';

interface PetCardProps {
  pet: Pet;
  variant?: 'listing' | 'my-pets';
  distance?: number | null;
  onEdit?: (petId: string) => void;
  onDelete?: (petId: string) => void;
  onMarkAsReunited?: (petId: string) => void;
  isReuniting?: boolean;
  showActions?: boolean;
}

export function PetCard({
  pet,
  variant = 'listing',
  distance,
  onEdit,
  onDelete,
  onMarkAsReunited,
  isReuniting = false,
  showActions = false,
}: PetCardProps) {
  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/pet/${pet.id}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.name || 'Pet'} - Farejei`,
          text: `Ajude a encontrar ${pet.name || 'este pet'}!`,
          url: url,
        });
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          await navigator.clipboard.writeText(url);
        }
      }
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const petTypeLabel = {
    DOG: 'Cachorro',
    CAT: 'Gato',
    BIRD: 'Pássaro',
    OTHER: 'Outro',
  }[pet.type];

  const formatLastSeen = (date?: string) => {
    if (!date) return null;
    const lastSeen = new Date(date);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - lastSeen.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoje';
    if (diffDays === 1) return 'Ontem';
    if (diffDays < 7) return `Há ${diffDays} dias`;
    return lastSeen.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' });
  };

  return (
    <Card className="group relative h-full overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl pt-0">
      <Link href={`/pet/${pet.id}`} className="block">
        {/* Image Container */}
        <div className="relative aspect-[4/3] md:aspect-[3/4] overflow-hidden">
          {pet.photo_url ? (
            <Image
              src={pet.photo_url || '/placeholder.svg'}
              alt={pet.name || 'Pet'}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100">
              <span className="text-8xl opacity-40">🐾</span>
            </div>
          )}

          {/* Gradient Overlay - lighter on mobile, stronger on desktop */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:from-black/90 md:via-black/30" />

          {/* Top Badges - Always visible */}
          <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between gap-2">
            <Badge className="bg-white/95 backdrop-blur-sm text-foreground border-0 shadow-lg text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5">
              {petTypeEmoji[pet.type]} {petTypeLabel}
            </Badge>

            <Badge
              className={`${
                statusConfig[pet.status].color
              } text-white border-0 shadow-lg text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5`}
            >
              {statusConfig[pet.status].emoji} {statusConfig[pet.status].label}
            </Badge>
          </div>

          {/* Reward & Distance - Top left, below type badge */}
          <div className="absolute top-12 left-3 z-10 flex flex-col gap-1.5">
            {pet.has_reward && pet.reward_amount && (
              <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5 font-bold">
                💰 R$ {pet.reward_amount.toLocaleString('pt-BR')}
              </Badge>
            )}

            {distance !== null && distance !== undefined && (
              <Badge className="bg-black/60 backdrop-blur-sm text-white border-0 shadow-lg text-xs md:text-sm px-2 md:px-3 py-1 md:py-1.5">
                <MapPin className="h-3 w-3 mr-1" />
                {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`}
              </Badge>
            )}
          </div>

          {/* Pet Name - Only on desktop overlay */}
          <div className="hidden md:block absolute bottom-0 left-0 right-0 p-4 text-white z-10">
            <h3 className="text-2xl font-bold mb-2 text-balance line-clamp-1 drop-shadow-lg">
              {pet.name || 'Sem Nome'}
            </h3>
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Pet Name - Mobile only */}
          <h3 className="md:hidden text-xl font-bold text-foreground line-clamp-1">{pet.name || 'Sem Nome'}</h3>

          {/* Pet Characteristics */}
          {(pet.breed || pet.color) && (
            <div className="flex flex-wrap gap-2">
              {pet.breed && (
                <Badge variant="secondary" className="text-xs font-medium">
                  🐕 {pet.breed}
                </Badge>
              )}
              {pet.color && (
                <Badge variant="secondary" className="text-xs font-medium">
                  🎨 {pet.color}
                </Badge>
              )}
            </div>
          )}

          {/* Last Seen Date */}
          {(pet.status === 'LOST' || pet.status === 'SIGHTED') && pet.last_seen_date && (
            <div className="flex items-center gap-2 text-sm bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-400 rounded-lg px-3 py-2 border border-red-200 dark:border-red-800">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="font-semibold">Visto: {formatLastSeen(pet.last_seen_date)}</span>
            </div>
          )}

          {/* Location */}
          {pet.location_description && (
            <div className="flex items-start gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
              <span className="line-clamp-2">{pet.location_description}</span>
            </div>
          )}

          {/* Description */}
          {pet.description && (
            <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">{pet.description}</p>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-2 pt-2">
            {variant === 'listing' && (
              <Button variant="outline" size="sm" className="gap-2 bg-transparent" onClick={handleShare}>
                <Share2 className="h-4 w-4" />
                Compartilhar
              </Button>
            )}

            {showActions && variant === 'my-pets' && (
              <>
                {onEdit && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onEdit(pet.id);
                    }}
                  >
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </Button>
                )}

                {pet.status === 'RESCUED' && onMarkAsReunited && (
                  <Button
                    size="sm"
                    className="bg-purple-500 hover:bg-purple-600 text-white"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onMarkAsReunited(pet.id);
                    }}
                    disabled={isReuniting}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Reunido
                  </Button>
                )}

                {onDelete && (
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      onDelete(pet.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
}
