import type { Pet } from '@/lib/types/database';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { MapPin, Calendar, Eye, Milestone } from 'lucide-react';

interface PetMarkerPopupProps {
  pet: Pet;
  distance?: number;
}

export function PetMarkerPopup({ pet, distance }: PetMarkerPopupProps) {
  const statusColor =
    pet.status === 'LOST' ? 'text-orange-alert' : pet.status === 'ADOPTION' ? 'text-green-500' : 'text-blue-pethub';
  const statusBg =
    pet.status === 'LOST' ? 'bg-orange-alert/10' : pet.status === 'ADOPTION' ? 'bg-green-500/10' : 'bg-blue-pethub/10';

  const petTypeLabels: Record<string, string> = {
    DOG: 'Cachorro',
    CAT: 'Gato',
    BIRD: 'Pássaro',
    OTHER: 'Outro',
  };

  const buildInfoText = () => {
    const parts: string[] = [];

    // Add pet type
    if (pet.type) {
      parts.push(petTypeLabels[pet.type] || pet.type);
    }

    // Add breed if available and not empty
    if (pet.breed && pet.breed.trim() !== '') {
      parts.push(pet.breed);
    }

    // Add age if available
    if (pet.age) {
      parts.push(`${pet.age} ${pet.age === 1 ? 'ano' : 'anos'}`);
    }

    return parts.join(' • ');
  };

  const infoText = buildInfoText();

  return (
    <div className="w-full h-full space-y-3">
      {/* Pet Image */}
      {pet.photo_url && (
        <div className="relative h-40 w-full overflow-hidden rounded-lg">
          <img
            src={pet.photo_url || '/placeholder.svg'}
            alt={pet.name}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src = '/placeholder.svg?height=160&width=256';
            }}
          />
        </div>
      )}

      {/* Pet Info */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-lg font-semibold leading-tight">{pet.name}</h3>
          <span className={`rounded-full px-2 py-1 text-xs font-medium whitespace-nowrap ${statusBg} ${statusColor}`}>
            {pet.status === 'LOST'
              ? 'Perdido'
              : pet.status === 'FOUND'
              ? 'Encontrado'
              : pet.status === 'ADOPTION'
              ? 'Adoção'
              : 'Reunido'}
          </span>
        </div>

        {infoText && <p className="text-sm text-muted-foreground">{infoText}</p>}

        {pet.color && <p className="text-sm text-muted-foreground">Cor: {pet.color}</p>}

        {pet.view_count !== undefined && pet.view_count > 0 && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Eye className="h-4 w-4 flex-shrink-0" />
            <span>
              {pet.view_count} {pet.view_count === 1 ? 'visualização' : 'visualizações'}
            </span>
          </div>
        )}

        {distance !== undefined && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Milestone className="h-4 w-4 flex-shrink-0" />
            <span>{distance < 1 ? `${Math.round(distance * 1000)}m` : `${distance.toFixed(1)}km`} de você</span>
          </div>
        )}

        {pet.location_description && (
          <div className="flex items-start gap-2 text-sm text-muted-foreground">
            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0" />
            <span className="line-clamp-2">{pet.location_description}</span>
          </div>
        )}

        {pet.last_seen_date && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Visto em {new Date(pet.last_seen_date).toLocaleDateString('pt-BR')}</span>
          </div>
        )}
      </div>

      {/* Action Button */}
      <Button asChild className="w-full bg-green-found text-white hover:bg-green-found/90">
        <Link href={`/pet/${pet.id}`}>Ver Detalhes</Link>
      </Button>
    </div>
  );
}
