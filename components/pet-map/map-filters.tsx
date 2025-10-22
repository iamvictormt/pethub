'use client';
import { Button } from '@/components/ui/button';
import { SliderInput } from '@/components/ui/slider-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Filter, X, MapPin } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

interface MapFiltersProps {
  isMobile?: boolean;
  status: string[];
  setStatus: (value: string[]) => void;
  petTypes: string[];
  setPetTypes: (value: string[]) => void;
  distance: number;
  setDistance: (value: number) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  userLocation: { lat: number; lng: number } | null;
  onRequestLocation: () => void;
  onClearFilters: () => void;
}

export function MapFilters({
  isMobile = false,
  status,
  setStatus,
  petTypes,
  setPetTypes,
  distance,
  setDistance,
  sortBy,
  setSortBy,
  userLocation,
  onRequestLocation,
  onClearFilters,
}: MapFiltersProps) {
  const FilterContent = () => (
    <div className="space-y-6 p-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Filtros</h2>
        <Button
          variant="ghost"
          size="sm"
          className="text-muted-foreground hover:text-foreground"
          onClick={onClearFilters}
        >
          <X className="mr-2 h-4 w-4" />
          Limpar filtros
        </Button>
      </div>

      <div className="space-y-2">
        <Button
          onClick={onRequestLocation}
          variant={userLocation ? 'default' : 'outline'}
          className={`w-full ${userLocation ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
        >
          <MapPin className="mr-2 h-4 w-4" />
          {userLocation ? 'Localização ativa' : 'Próximo a mim'}
        </Button>
        {userLocation && (
          <p className="text-center text-xs text-muted-foreground">Mostrando pets em um raio de {distance}km</p>
        )}
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Status</h3>
        <div className="flex gap-2">
          <Button
            onClick={() =>
              setStatus(status.includes('LOST') ? status.filter((s) => s !== 'LOST') : [...status, 'LOST'])
            }
            variant={status.includes('LOST') ? 'default' : 'outline'}
            className={`flex-1 ${status.includes('LOST') ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
          >
            Perdidos
          </Button>
          <Button
            onClick={() =>
              setStatus(status.includes('FOUND') ? status.filter((s) => s !== 'FOUND') : [...status, 'FOUND'])
            }
            variant={status.includes('FOUND') ? 'default' : 'outline'}
            className={`flex-1 ${status.includes('FOUND') ? 'bg-pink-500 hover:bg-pink-600' : ''}`}
          >
            Encontrados
          </Button>
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Tipo de Pet</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'DOG', label: 'Cachorro' },
            { id: 'CAT', label: 'Gato' },
            { id: 'BIRD', label: 'Pássaro' },
            { id: 'OTHER', label: 'Outro' },
          ].map((type) => (
            <Button
              key={type.id}
              onClick={() =>
                setPetTypes(petTypes.includes(type.id) ? petTypes.filter((t) => t !== type.id) : [...petTypes, type.id])
              }
              variant={petTypes.includes(type.id) ? 'secondary' : 'outline'}
              className="justify-start"
              size="sm"
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Distância máxima</h3>
        <SliderInput value={distance} onChange={setDistance} min={1} max={50} unit="km" />
      </div>

      <div className="space-y-3">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Ordenar por</h3>
        <SelectDropdown
          options={[
            { value: 'recent', label: 'Mais recentes' },
            { value: 'distance', label: 'Mais próximos' },
            { value: 'oldest', label: 'Mais antigos' },
          ]}
          value={sortBy}
          onChange={setSortBy}
        />
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button
            size="lg"
            className="h-14 w-14 rounded-full bg-orange-alert text-orange-alert-foreground shadow-lg hover:bg-orange-alert/90"
          >
            <Filter className="h-6 w-6" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[80vh]">
          <SheetHeader>
            <SheetTitle>Filtros</SheetTitle>
          </SheetHeader>
          <FilterContent />
        </SheetContent>
      </Sheet>
    );
  }

  return (
    <div className="h-full overflow-y-auto">
      <FilterContent />
    </div>
  );
}
