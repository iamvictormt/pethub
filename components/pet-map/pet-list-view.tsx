'use client';

import type { Pet, Advertisement } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ChevronLeft, ChevronRight, Eye, Share2, SlidersHorizontal } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '../ui/badge';
import { petTypeEmoji, statusConfig } from '@/utils/configPet';
import { MapFilters } from './map-filters';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import React from 'react';

interface PetListViewProps {
  pets: Pet[];
  userLocation: { lat: number; lng: number } | null;
  status: string[];
  setStatus: (value: string[]) => void;
  petTypes: string[];
  setPetTypes: (value: string[]) => void;
  distance: number;
  setDistance: (value: number) => void;
  sortBy: string;
  setSortBy: (value: string) => void;
  onRequestLocation: () => void;
  onClearFilters: () => void;
  onSearch: (query: string) => void;
  hasReward: boolean;
  setHasReward: (value: boolean) => void;
  onApplyFilters: () => void;
  onResetPendingFilters: () => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  isLoading: boolean;
  totalPets: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

const ITEMS_PER_PAGE = 12;

export function PetListView({
  pets,
  userLocation,
  status,
  setStatus,
  petTypes,
  setPetTypes,
  distance,
  setDistance,
  sortBy,
  setSortBy,
  onRequestLocation,
  onClearFilters,
  onSearch,
  hasReward,
  setHasReward,
  onApplyFilters,
  onResetPendingFilters,
  searchQuery,
  setSearchQuery,
  isLoading,
  totalPets,
  currentPage,
  onPageChange,
}: PetListViewProps) {
  const [isFilterOpen, setIsFilterOpen] = React.useState(false);

  const safePets = pets || [];

  const petsWithDistance = React.useMemo(() => {
    return safePets.map((pet) => ({
      ...pet,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, pet.latitude, pet.longitude)
        : (pet as any).distance || null,
    }));
  }, [safePets, userLocation]);

  const totalPages = Math.ceil(totalPets / ITEMS_PER_PAGE);
  const currentPets = petsWithDistance;

  const goToPage = (page: number) => {
    const newPage = Math.max(1, Math.min(page, totalPages));
    onPageChange(newPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleShare = async (e: React.MouseEvent, petId: string, petName: string) => {
    e.preventDefault();
    e.stopPropagation();

    const url = `${window.location.origin}/pet/${petId}`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petName || 'Pet'} - Farejei`,
          text: `Ajude a encontrar ${petName || 'este pet'}!`,
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

  const handleApplyFilters = () => {
    onApplyFilters();
    setIsFilterOpen(false);
  };

  const handleFilterModalChange = (open: boolean) => {
    if (!open) {
      onResetPendingFilters();
    }
    setIsFilterOpen(open);
  };

  const activeFiltersCount =
    status.length +
    petTypes.length +
    (hasReward ? 1 : 0) +
    (userLocation && distance < 50 ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0);

  return (
    <div className="w-full min-h-screen">
      <main className="flex-1">
        <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex-1">
              {isLoading ? (
                <>
                  <Skeleton className="h-7 w-48 mt-1" />
                  <Skeleton className="h-5 w-80 mt-1" />
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-semibold">
                    {totalPets} {totalPets === 1 ? 'pet encontrado' : 'pets encontrados'}
                  </h2>
                  {userLocation && (
                    <p className="text-sm text-muted-foreground mt-1">Ordenados por proximidade da sua localização</p>
                  )}
                </>
              )}
            </div>

            <Dialog open={isFilterOpen} onOpenChange={handleFilterModalChange}>
              <DialogTrigger asChild>
                <Button size="default" className="gap-2 relative w-full md:w-auto md:min-w-[140px]">
                  <SlidersHorizontal className="h-5 w-5" />
                  <span className="font-semibold">Filtros</span>
                  {activeFiltersCount > 0 && (
                    <Badge className="ml-1 h-5 min-w-5 rounded-full bg-orange-500 px-1.5 text-xs">
                      {activeFiltersCount}
                    </Badge>
                  )}
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl"></DialogTitle>
                  <DialogDescription></DialogDescription>
                </DialogHeader>
                <MapFilters
                  isMobile={false}
                  status={status}
                  setStatus={setStatus}
                  petTypes={petTypes}
                  setPetTypes={setPetTypes}
                  distance={distance}
                  setDistance={setDistance}
                  sortBy={sortBy}
                  setSortBy={setSortBy}
                  userLocation={userLocation}
                  onRequestLocation={onRequestLocation}
                  onClearFilters={onClearFilters}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  onSearch={onSearch}
                  hasReward={hasReward}
                  setHasReward={setHasReward}
                  onApplyFilters={handleApplyFilters}
                />
              </DialogContent>
            </Dialog>
          </div>

          {isLoading ? (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Array.from({ length: 12 }).map((_, i) => (
                <Card key={i} className="overflow-hidden border-0 bg-card shadow-md py-0">
                  <Skeleton className="aspect-[3/4] w-full" />
                </Card>
              ))}
            </div>
          ) : currentPets.length === 0 ? (
            <div className="flex min-h-[400px] items-center justify-center">
              <div className="text-center">
                <p className="text-lg text-muted-foreground">Nenhum pet encontrado com os filtros selecionados</p>
                <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou aumentar a distância</p>
              </div>
            </div>
          ) : (
            <>
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {currentPets.map((item) => {
                  const pet = item;
                  return (
                    <Link key={pet.id} href={`/pet/${pet.id}`} className="group">
                      <Card className="group relative h-full overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl py-0">
                        <div className="relative aspect-[3/4] overflow-hidden">
                          {pet.photo_url ? (
                            <Image
                              src={pet.photo_url || '/placeholder.svg'}
                              alt={pet.name || 'Pet'}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100">
                              <span className="text-8xl opacity-40">🐾</span>
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                          <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-3">
                            <div className="absolute top-3 right-4 z-10">
                              <Badge
                                className={`${
                                  statusConfig[pet.status].color
                                } text-white border-0 shadow-lg text-sm px-3 py-1.5`}
                              >
                                {statusConfig[pet.status].emoji} {statusConfig[pet.status].label}
                              </Badge>
                            </div>

                            <div className="flex flex-col gap-2">
                              {pet.has_reward && pet.reward_amount && (
                                <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                                  <div className="flex items-center gap-1">
                                    R$ {pet.reward_amount.toLocaleString('pt-BR')}
                                  </div>
                                </div>
                              )}

                              {pet.distance !== null && (
                                <div className="rounded-full bg-black/60 text-xs font-bold text-white shadow-lg backdrop-blur-md p-2">
                                  <div className="flex items-center gap-1">
                                    <MapPin className="h-3 w-3" />
                                    {pet.distance < 1
                                      ? `${Math.round(pet.distance * 1000)}m`
                                      : `${pet.distance.toFixed(1)}km`}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>

                          <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                            <h3 className="mb-2 text-xl font-bold leading-tight drop-shadow-lg line-clamp-1">
                              {pet.name || 'Sem Nome'}
                            </h3>

                            <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                              {petTypeEmoji[pet.type]}
                              <span>
                                {pet.type === 'DOG'
                                  ? 'Cachorro'
                                  : pet.type === 'CAT'
                                  ? 'Gato'
                                  : pet.type === 'BIRD'
                                  ? 'Pássaro'
                                  : 'Outro'}
                              </span>
                            </div>

                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-3 text-xs">
                                <div className="flex items-center gap-1.5 opacity-90">
                                  <Calendar className="h-3.5 w-3.5" />
                                  <span>
                                    {new Date(pet.created_at).toLocaleDateString('pt-BR', {
                                      day: '2-digit',
                                      month: 'short',
                                    })}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1.5 opacity-90">
                                  <Eye className="h-3.5 w-3.5" />
                                  <span>{pet.view_count || 0}</span>
                                </div>
                              </div>

                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-8 gap-1.5 rounded-full bg-white/20 px-3 text-white backdrop-blur-md transition-all hover:bg-white/30 hover:text-white"
                                onClick={(e) => handleShare(e, pet.id, pet.name)}
                              >
                                <Share2 className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium">Compartilhar</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </Link>
                  );
                })}
              </div>

              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-2">
                  <Button
                    onClick={() => goToPage(currentPage - 1)}
                    disabled={currentPage === 1 || isLoading}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>

                  <div className="flex gap-1">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                      if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                        return (
                          <Button
                            key={page}
                            onClick={() => goToPage(page)}
                            variant={currentPage === page ? 'default' : 'outline'}
                            size="sm"
                            className="min-w-[2.5rem]"
                            disabled={isLoading}
                          >
                            {page}
                          </Button>
                        );
                      } else if (page === currentPage - 2 || page === currentPage + 2) {
                        return (
                          <span key={page} className="flex items-center px-2">
                            ...
                          </span>
                        );
                      }
                      return null;
                    })}
                  </div>

                  <Button
                    onClick={() => goToPage(currentPage + 1)}
                    disabled={currentPage === totalPages || isLoading}
                    variant="outline"
                    size="icon"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              )}

              <div className="mt-4 text-center text-sm text-muted-foreground">
                {isLoading ? (
                  <Skeleton className="h-4 w-48 mx-auto" />
                ) : (
                  <>
                    Mostrando {(currentPage - 1) * ITEMS_PER_PAGE + 1}-
                    {Math.min(currentPage * ITEMS_PER_PAGE, totalPets)} de {totalPets} pets
                  </>
                )}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
