'use client';

import type { Pet } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, SlidersHorizontal } from 'lucide-react';
import { Badge } from '../ui/badge';
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
import { PetCard } from '@/components/pets/pet-card';
import { PetCardSkeleton } from '../pets/pet-card-skeleton';

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
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 12 }).map((_, i) => (
                <PetCardSkeleton key={i} />
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
              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {currentPets.map((pet) => (
                  <PetCard key={pet.id} pet={pet} variant="listing" distance={pet.distance} />
                ))}
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
