'use client';

import { Button } from '@/components/ui/button';
import { SliderInput } from '@/components/ui/slider-input';
import { SelectDropdown } from '@/components/ui/select-dropdown';
import { MapPin, X, Sparkles } from 'lucide-react';

interface InlineFiltersProps {
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

export function InlineFilters({
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
}: InlineFiltersProps) {
  const hasActiveFilters = status.length > 0 || petTypes.length > 0 || userLocation !== null;

  return (
    <div className="relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br from-background via-background to-muted/20 p-8 shadow-lg backdrop-blur-sm">
      {/* Decorative gradient orb */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-40 w-40 rounded-full bg-orange-alert/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-20 -left-20 h-40 w-40 rounded-full bg-blue-500/10 blur-3xl" />

      <div className="relative space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-orange-alert to-pink-500 shadow-lg">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold tracking-tight">Filtros Inteligentes</h3>
              <p className="text-sm text-muted-foreground">Encontre o pet perfeito</p>
            </div>
          </div>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearFilters}
              className="text-muted-foreground transition-colors hover:text-foreground"
            >
              <X className="mr-2 h-4 w-4" />
              Limpar tudo
            </Button>
          )}
        </div>

        {/* Main Filters Grid */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Location Section */}
          <div className="space-y-4 rounded-xl bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
            <div className="flex items-center gap-2">
              <label className="font-semibold text-foreground">Localização</label>
            </div>
            <Button
              onClick={onRequestLocation}
              variant={userLocation ? 'default' : 'outline'}
              size="lg"
              className={`w-full transition-all ${
                userLocation
                  ? 'bg-gradient-to-r from-orange-alert to-pink-500 text-white shadow-lg hover:shadow-xl'
                  : 'hover:border-orange-alert/50'
              }`}
            >
              <MapPin className="h-5 w-5" />
              {userLocation ? 'Localização Ativa' : 'Ativar Localização'}
            </Button>
            {userLocation && (
              <div className="rounded-lg bg-muted/50 p-3 text-center">
                <p className="text-sm font-medium text-foreground">Raio de busca: {distance}km</p>
                <p className="text-xs text-muted-foreground">Ajuste abaixo para expandir</p>
              </div>
            )}
            {userLocation && (
              <div className="space-y-2">
                <SliderInput value={distance} onChange={setDistance} min={1} max={50} unit="km" />
              </div>
            )}
          </div>

          {/* Status & Sort Section */}
          <div className="space-y-4 rounded-xl bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
            <label className="font-semibold text-foreground">Status do Pet</label>
            <div className="grid grid-cols-3 gap-2">
              <Button
                onClick={() =>
                  setStatus(status.includes('LOST') ? status.filter((s) => s !== 'LOST') : [...status, 'LOST'])
                }
                variant={status.includes('LOST') ? 'default' : 'outline'}
                size="lg"
                className={`flex-col gap-1 transition-all py-8 ${
                  status.includes('LOST')
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30 hover:bg-orange-600'
                    : 'hover:border-orange-500/50 hover:bg-orange-500/10'
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
                className={`flex-col gap-1 transition-all py-8 ${
                  status.includes('FOUND')
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30 hover:bg-blue-600'
                    : 'hover:border-blue-500/50 hover:bg-blue-500/10'
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
                className={`flex-col gap-1 transition-all py-8 ${
                  status.includes('ADOPTION')
                    ? 'bg-green-500 text-white shadow-lg shadow-green-500/30 hover:bg-green-600'
                    : 'hover:border-green-500/50 hover:bg-green-500/10'
                }`}
              >
                <span className="text-2xl">💚</span>
                <span className="text-xs font-semibold">Adoção</span>
              </Button>
            </div>

            <div className="pt-2">
              <label className="mb-3 block font-semibold text-foreground">Ordenar Por</label>
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
        </div>

        {/* Pet Type Pills */}
        <div className="space-y-4 rounded-xl bg-card/50 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md">
          <label className="font-semibold text-foreground">Tipo de Animal</label>
          <div className="flex flex-wrap gap-3">
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
                className={`gap-2 transition-all ${
                  petTypes.includes(type.id)
                    ? 'bg-gradient-to-r from-pink-500 to-orange-alert text-white shadow-lg shadow-pink-500/30 hover:shadow-xl'
                    : 'hover:border-pink-500/50 hover:bg-pink-500/10'
                }`}
              >
                <span className="text-xl">{type.emoji}</span>
                <span className="font-semibold">{type.label}</span>
              </Button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
