import type { Pet } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Calendar, Eye, Milestone, Sparkles } from 'lucide-react';
import { statusConfig } from '@/utils/configPet';

interface PetMarkerPopupProps {
  pet: Pet;
  distance?: number;
}

export function PetMarkerPopup({ pet, distance }: PetMarkerPopupProps) {
  const currentStatus = statusConfig[pet.status as keyof typeof statusConfig] || statusConfig.LOST;

  const petTypeLabels: Record<string, string> = {
    DOG: 'Cachorro',
    CAT: 'Gato',
    BIRD: 'Pássaro',
    OTHER: 'Outro',
  };

  const buildInfoText = () => {
    const parts: string[] = [];

    if (pet.type) {
      parts.push(petTypeLabels[pet.type] || pet.type);
    }

    if (pet.breed && pet.breed.trim() !== '' && pet.breed !== 'Não informado') {
      parts.push(pet.breed);
    }

    if (pet.age) {
      parts.push(`${pet.age} ${pet.age === 1 ? 'ano' : 'anos'}`);
    }

    return parts.join(' • ');
  };

  const infoText = buildInfoText();

  return (
    <div className="w-full space-y-3">
      {pet.has_reward && pet.reward_amount && (
        <div className="relative overflow-hidden rounded-xl border-2 border-yellow-500/30 bg-gradient-to-br from-yellow-50 via-amber-50 to-orange-50 p-3 shadow-sm dark:from-yellow-950/20 dark:via-amber-950/20 dark:to-orange-950/20">
          <div className="absolute right-0 top-0 h-20 w-20 translate-x-8 -translate-y-8 rounded-full bg-yellow-400/20 blur-2xl" />
          <div className="relative flex items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div>
                <p className="text-xs font-medium text-yellow-900/70 dark:text-yellow-100/70">Recompensa</p>
                <p className="text-xl font-bold text-yellow-900 dark:text-yellow-100">
                  R$ {pet.reward_amount.toLocaleString('pt-BR')}
                </p>
              </div>
            </div>
            <div className="rounded-full bg-yellow-500/20 px-3 py-1">
              <p className="text-xs font-semibold text-yellow-900 dark:text-yellow-100">Oferecida</p>
            </div>
          </div>
        </div>
      )}

      {pet.photo_url && (
        <div className="relative h-48 w-full overflow-hidden rounded-xl">
          <img
            src={pet.photo_url || '/placeholder.svg'}
            alt={pet.name}
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=192&width=256';
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
            <div>
              <h3 className="text-lg font-bold text-white drop-shadow-lg">{pet.name}</h3>
              {infoText && <p className="text-sm text-white/90 drop-shadow-md">{infoText}</p>}
            </div>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold backdrop-blur-sm ${currentStatus.color} text-white`}
            >
              {currentStatus.label}
            </span>
          </div>
        </div>
      )}

      <div className="space-y-2 rounded-lg bg-muted/30 p-3">
        {pet.color && (
          <div className="flex items-center gap-2 text-sm">
            <div className="h-4 w-4 rounded-full border-2 border-foreground/20 bg-gradient-to-br from-foreground/10 to-foreground/5" />
            <span className="font-medium text-foreground/70">Cor:</span>
            <span className="text-foreground">{pet.color}</span>
          </div>
        )}

        {distance !== undefined && (
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Milestone className="h-4 w-4 flex-shrink-0 text-blue-farejei" />
            <span className="font-medium">
              {distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} de você
            </span>
          </div>
        )}

        {pet.location_description && (
          <div className="flex items-start gap-2 text-sm text-foreground/80">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-orange-alert" />
            <span className="line-clamp-2">{pet.location_description}</span>
          </div>
        )}

        {pet.last_seen_date && (
          <div className="flex items-center gap-2 text-sm text-foreground/80">
            <Calendar className="h-4 w-4 text-green-500" />
            <span>Visto em {pet.last_seen_date.split('T')[0].split('-').reverse().join('/')}</span>
          </div>
        )}

        {pet.view_count !== undefined && pet.view_count > 0 && (
          <div className="flex items-center gap-2 text-sm text-foreground/70">
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span>
              {pet.view_count} {pet.view_count === 1 ? 'visualização' : 'visualizações'}
            </span>
          </div>
        )}
      </div>

      <Button
        asChild
        className="w-full bg-gradient-to-r from-green-found to-green-600 text-white shadow-md transition-all hover:shadow-lg hover:from-green-600 hover:to-green-found"
      >
        <Link href={`/pet/${pet.id}`}>Ver detalhes</Link>
      </Button>
    </div>
  );
}
