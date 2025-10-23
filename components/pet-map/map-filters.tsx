'use client';
import { Button } from '@/components/ui/button';
import type React from 'react';
import { useState, useMemo } from 'react';
import { SliderInput } from '@/components/ui/slider-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { Filter, X, MapPin, ChevronUp, Search } from 'lucide-react';
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
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  onSearch: (query: string) => void;
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
  searchQuery,
  setSearchQuery,
  onSearch,
}: MapFiltersProps) {
  const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery || '');

  const hasActiveFilters =
    status.length > 0 || petTypes.length > 0 || userLocation !== null || localSearchQuery.length > 0;

  const handleSearch = () => {
    onSearch(localSearchQuery);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const FilterContent = useMemo(() => {
    return (
      <div className="space-y-6 p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-alert to-pink-500 shadow-lg">
              <Filter className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Filtros</h2>
              <p className="text-sm text-muted-foreground">Refine sua busca</p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground border-1"
              onClick={() => {
                setLocalSearchQuery('');
                onClearFilters();
              }}
            >
              <X className="h-4 w-4" />
              Limpar
            </Button>
          )}
        </div>

        {/* Search */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Buscar Pet</label>
          </div>
          <p className="text-xs text-muted-foreground">Pesquise por nome, descrição, cor ou raça</p>
          <div className="flex flex-col gap-2">
            <input
              type="text"
              value={localSearchQuery}
              onChange={(e) => setLocalSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Digite sua busca..."
              autoComplete="off"
              className="w-full rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            />
          </div>
        </div>

        {/* Location */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-semibold">Localização</label>
          </div>
          <Button
            onClick={onRequestLocation}
            variant={userLocation ? 'default' : 'outline'}
            size="lg"
            className={`w-full ${
              userLocation
                ? 'bg-gradient-to-r from-orange-alert to-pink-500 text-white shadow-lg'
                : 'hover:border-orange-alert/50'
            }`}
          >
            <MapPin className="h-4 w-4" />
            {userLocation ? 'Localização ativa' : 'Ativar localização'}
          </Button>
          {userLocation && (
            <>
              <p className="rounded-lg bg-background/50 p-2 text-center text-sm font-medium">Raio: {distance}km</p>
              <SliderInput value={distance} onChange={setDistance} min={1} max={50} unit="km" />
            </>
          )}
        </div>

        {/* Status */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">Status do Pet</h3>
          <div className="grid grid-cols-2 gap-2">
            <Button
              onClick={() =>
                setStatus(status.includes('LOST') ? status.filter((s) => s !== 'LOST') : [...status, 'LOST'])
              }
              variant={status.includes('LOST') ? 'default' : 'outline'}
              size="lg"
              className={`flex-col gap-1 p-7 ${
                status.includes('LOST')
                  ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                  : 'hover:border-orange-500/50'
              }`}
            >
              <span className="text-2xl">😢</span>
              <span className="text-xs font-semibold">Perdidos</span>
            </Button>
            <Button
              onClick={() =>
                setStatus(status.includes('FOUND') ? status.filter((s) => s !== 'FOUND') : [...status, 'FOUND'])
              }
              variant={status.includes('FOUND') ? 'default' : 'outline'}
              size="lg"
              className={`flex-col gap-1 p-7 ${
                status.includes('FOUND')
                  ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30'
                  : 'hover:border-blue-500/50'
              }`}
            >
              <span className="text-2xl">🎉</span>
              <span className="text-xs font-semibold">Encontrados</span>
            </Button>
            <Button
              onClick={() =>
                setStatus(
                  status.includes('ADOPTION') ? status.filter((s) => s !== 'ADOPTION') : [...status, 'ADOPTION']
                )
              }
              variant={status.includes('ADOPTION') ? 'default' : 'outline'}
              size="lg"
              className={`col-span-2 flex-col gap-1 p-7 ${
                status.includes('ADOPTION')
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/30'
                  : 'hover:border-green-500/50'
              }`}
            >
              <span className="text-2xl">💚</span>
              <span className="text-xs font-semibold">Para Adoção</span>
            </Button>
          </div>
        </div>

        {/* Pet Types */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">Tipo de Animal</h3>
          <div className="grid grid-cols-2 gap-2">
            {[
              { id: 'DOG', label: 'Cachorro', emoji: '🐕' },
              { id: 'CAT', label: 'Gato', emoji: '🐈' },
              { id: 'BIRD', label: 'Pássaro', emoji: '🦜' },
              { id: 'OTHER', label: 'Outro', emoji: '🐾' },
            ].map((type) => (
              <Button
                key={type.id}
                onClick={() =>
                  setPetTypes(
                    petTypes.includes(type.id) ? petTypes.filter((t) => t !== type.id) : [...petTypes, type.id]
                  )
                }
                variant={petTypes.includes(type.id) ? 'default' : 'outline'}
                size="lg"
                className={`gap-2 ${
                  petTypes.includes(type.id)
                    ? 'bg-gradient-to-r from-pink-500 to-orange-alert text-white shadow-lg'
                    : 'hover:border-pink-500/50'
                }`}
              >
                <span className="text-lg">{type.emoji}</span>
                <span className="text-sm font-semibold">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>

        {/* Sort */}
        <div className="space-y-3 rounded-xl bg-muted/30 p-4">
          <h3 className="text-sm font-semibold">Ordenar por</h3>
          <SelectDropdown
            options={[
              { value: 'recent', label: '⏰ Mais recentes' },
              { value: 'distance', label: '📍 Mais próximos' },
              { value: 'oldest', label: '📅 Mais antigos' },
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>
    );
  }, [localSearchQuery, hasActiveFilters, status, petTypes, distance, userLocation, sortBy]);

  if (isMobile) {
    return (
      <Sheet
        onOpenChange={(open) => {
          if (!open) {
            handleSearch();
          }
        }}
      >
        <SheetTrigger asChild>
          <Button variant="ghost" size="sm" className="gap-2">
            Mostrar <ChevronUp className="h-4 w-4" />
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[85vh]" onOpenAutoFocus={(e) => e.preventDefault()}>
          <SheetHeader>
            <SheetTitle>Filtros Inteligentes</SheetTitle>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(85vh-80px)]">{FilterContent}</div>
        </SheetContent>
      </Sheet>
    );
  }

  return <div className="h-full overflow-y-auto">{FilterContent}</div>;
}
