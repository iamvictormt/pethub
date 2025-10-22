'use client';

import { useState, useMemo } from 'react';
import type { Pet, Advertisement } from '@/lib/types/database';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { NativeAdCard } from '@/components/ads/native-ad-card';
import { InlineFilters } from './inline-filters';

interface PetListViewProps {
  pets: Pet[];
  userLocation: { lat: number; lng: number } | null;
  ads?: Advertisement[];
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
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth's radius in km
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
  ads = [],
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
}: PetListViewProps) {
  const [currentPage, setCurrentPage] = useState(1);

  // Calculate distances and add to pets
  const petsWithDistance = useMemo(() => {
    return pets.map((pet) => ({
      ...pet,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, pet.latitude, pet.longitude)
        : null,
    }));
  }, [pets, userLocation]);

  // Pagination
  const totalPages = Math.ceil(petsWithDistance.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentPets = petsWithDistance.slice(startIndex, endIndex);

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)));
    // Scroll to top of list
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const itemsWithAds = useMemo(() => {
    const items: Array<{ type: 'pet'; data: (typeof currentPets)[0] } | { type: 'ad'; data: Advertisement }> = [];
    const activeAds = ads.filter((ad) => ad.is_active);
    let adIndex = 0;

    currentPets.forEach((pet, index) => {
      items.push({ type: 'pet', data: pet });

      // Insert ad every 6 items (after positions 5, 11, 17, etc.)
      if ((index + 1) % 6 === 0 && activeAds.length > 0) {
        items.push({ type: 'ad', data: activeAds[adIndex % activeAds.length] });
        adIndex++;
      }
    });

    return items;
  }, [currentPets, ads]);

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6">
        <div className="hidden md:block">
          <InlineFilters
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
          />
        </div>

        {/* Header */}
        <div>
          <h2 className="text-2xl font-semibold">
            {petsWithDistance.length} {petsWithDistance.length === 1 ? 'pet encontrado' : 'pets encontrados'}
          </h2>
          {userLocation && (
            <p className="text-sm text-muted-foreground">Ordenados por proximidade da sua localização</p>
          )}
        </div>

        {/* Pet Grid */}
        {currentPets.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Nenhum pet encontrado com os filtros selecionados</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou aumentar a distância</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {itemsWithAds.map((item, index) => {
                if (item.type === 'ad') {
                  return <NativeAdCard key={`ad-${index}`} ad={item.data} />;
                }

                const pet = item.data;
                return (
                  <Link key={pet.id} href={`/pet/${pet.id}`}>
                    <Card className="group overflow-hidden transition-all hover:shadow-lg">
                      {/* Pet Image */}
                      <div className="relative aspect-square overflow-hidden bg-muted">
                        {pet.photo_url ? (
                          <Image
                            src={pet.photo_url || '/placeholder.svg'}
                            alt={pet.name}
                            fill
                            className="object-cover transition-transform group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <span className="text-4xl">🐾</span>
                          </div>
                        )}

                        {/* Status Badge */}
                        <div className="absolute left-2 top-2">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold text-white ${
                              pet.status === 'LOST' ? 'bg-orange-500' : 'bg-blue-500'
                            }`}
                          >
                            {pet.status === 'LOST' ? 'Perdido' : 'Encontrado'}
                          </span>
                        </div>

                        {/* Distance Badge */}
                        {pet.distance !== null && (
                          <div className="absolute right-2 top-2">
                            <span className="rounded-full bg-black/70 px-2 py-1 text-xs font-medium text-white backdrop-blur">
                              {pet.distance < 1
                                ? `${Math.round(pet.distance * 1000)}m`
                                : `${pet.distance.toFixed(1)}km`}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Pet Info */}
                      <div className="p-4">
                        <h3 className="mb-2 text-lg font-semibold">{pet.name}</h3>

                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <span className="capitalize">{pet.type.toLowerCase()}</span>
                            {pet.breed && <span>• {pet.breed}</span>}
                          </div>

                          <div className="flex items-center gap-1">
                            <MapPin className="h-3 w-3" />
                            <span className="line-clamp-1">{pet.location_description}</span>
                          </div>

                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>{new Date(pet.created_at).toLocaleDateString('pt-BR')}</span>
                          </div>
                        </div>

                        {pet.description && (
                          <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">{pet.description}</p>
                        )}
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="mt-8 flex items-center justify-center gap-2">
                <Button
                  onClick={() => goToPage(currentPage - 1)}
                  disabled={currentPage === 1}
                  variant="outline"
                  size="icon"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>

                <div className="flex gap-1">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                    // Show first page, last page, current page, and pages around current
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          onClick={() => goToPage(page)}
                          variant={currentPage === page ? 'default' : 'outline'}
                          size="sm"
                          className="min-w-[2.5rem]"
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
                  disabled={currentPage === totalPages}
                  variant="outline"
                  size="icon"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}

            {/* Page Info */}
            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, petsWithDistance.length)} de {petsWithDistance.length} pets
            </div>
          </>
        )}
      </div>
    </div>
  );
}
