"use client"

import type React from "react"

import { useState, useMemo } from "react"
import type { Pet, Advertisement } from "@/lib/types/database"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  MapPin,
  Calendar,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Eye,
  Share2,
  DollarSign,
} from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { NativeAdCard } from "@/components/ads/native-ad-card"
import { InlineFilters } from "./inline-filters"
import { MapFilters } from "./map-filters"

interface PetListViewProps {
  pets: Pet[]
  userLocation: { lat: number; lng: number } | null
  ads?: Advertisement[]
  status: string[]
  setStatus: (value: string[]) => void
  petTypes: string[]
  setPetTypes: (value: string[]) => void
  distance: number
  setDistance: (value: number) => void
  sortBy: string
  setSortBy: (value: string) => void
  onRequestLocation: () => void
  onClearFilters: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
  onSearch: () => void
  hasReward: boolean
  setHasReward: (value: boolean) => void
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371 // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

const ITEMS_PER_PAGE = 12

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
  searchQuery,
  setSearchQuery,
  onSearch,
  hasReward,
  setHasReward,
}: PetListViewProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [showDesktopFilters, setShowDesktopFilters] = useState(false)

  const safePets = pets || []
  const safeSearchQuery = searchQuery || ""

  const petsWithDistance = useMemo(() => {
    return safePets.map((pet) => ({
      ...pet,
      distance: userLocation
        ? calculateDistance(userLocation.lat, userLocation.lng, pet.latitude, pet.longitude)
        : null,
    }))
  }, [safePets, userLocation])

  const totalPages = Math.ceil(petsWithDistance.length / ITEMS_PER_PAGE)
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
  const endIndex = startIndex + ITEMS_PER_PAGE
  const currentPets = petsWithDistance.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  const itemsWithAds = useMemo(() => {
    const items: Array<{ type: "pet"; data: (typeof currentPets)[0] } | { type: "ad"; data: Advertisement }> = []
    const activeAds = ads.filter((ad) => ad.is_active)
    let adIndex = 0

    currentPets.forEach((pet, index) => {
      items.push({ type: "pet", data: pet })

      if ((index + 1) % 6 === 0 && activeAds.length > 0) {
        items.push({ type: "ad", data: activeAds[adIndex % activeAds.length] })
        adIndex++
      }
    })

    return items
  }, [currentPets, ads])

  const handleShare = async (e: React.MouseEvent, petId: string, petName: string) => {
    e.preventDefault()
    e.stopPropagation()

    const url = `${window.location.origin}/pet/${petId}`

    if (navigator.share) {
      try {
        await navigator.share({
          title: `${petName || "Pet"} - Farejei`,
          text: `Ajude a encontrar ${petName || "este pet"}!`,
          url: url,
        })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard.writeText(url)
        }
      }
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  return (
    <div className="w-full">
      <div className="container mx-auto px-4 py-8 max-w-7xl space-y-6 min-h-screen">
        <div className="hidden md:block space-y-3">
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Filtros</span>
              {(status.length > 0 ||
                petTypes.length > 0 ||
                userLocation ||
                safeSearchQuery.length > 0 ||
                hasReward) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-alert text-xs font-bold text-white">
                  {status.length +
                    petTypes.length +
                    (userLocation ? 1 : 0) +
                    (safeSearchQuery.length > 0 ? 1 : 0) +
                    (hasReward ? 1 : 0)}
                </span>
              )}
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowDesktopFilters(!showDesktopFilters)}
              className="gap-2"
            >
              {showDesktopFilters ? (
                <>
                  Ocultar <ChevronUp className="h-4 w-4" />
                </>
              ) : (
                <>
                  Mostrar <ChevronDown className="h-4 w-4" />
                </>
              )}
            </Button>
          </div>

          {showDesktopFilters && (
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
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={onSearch}
              hasReward={hasReward}
              setHasReward={setHasReward}
            />
          )}
        </div>

        <div className="md:hidden">
          <div className="flex items-center justify-between gap-3 rounded-xl border bg-background p-3 shadow-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium">Filtros</span>
              {(status.length > 0 ||
                petTypes.length > 0 ||
                userLocation ||
                safeSearchQuery.length > 0 ||
                hasReward) && (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-alert text-xs font-bold text-white">
                  {status.length +
                    petTypes.length +
                    (userLocation ? 1 : 0) +
                    (safeSearchQuery.length > 0 ? 1 : 0) +
                    (hasReward ? 1 : 0)}
                </span>
              )}
            </div>
            <MapFilters
              isMobile
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
            />
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold">
            {petsWithDistance.length} {petsWithDistance.length === 1 ? "pet encontrado" : "pets encontrados"}
          </h2>
          {userLocation && (
            <p className="text-sm text-muted-foreground">Ordenados por proximidade da sua localização</p>
          )}
        </div>

        {currentPets.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center">
            <div className="text-center">
              <p className="text-lg text-muted-foreground">Nenhum pet encontrado com os filtros selecionados</p>
              <p className="text-sm text-muted-foreground">Tente ajustar os filtros ou aumentar a distância</p>
            </div>
          </div>
        ) : (
          <>
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {itemsWithAds.map((item, index) => {
                if (item.type === "ad") {
                  return <NativeAdCard key={`ad-${index}`} ad={item.data} />
                }

                const pet = item.data
                return (
                  <Link key={pet.id} href={`/pet/${pet.id}`} className="group">
                    <Card className="group relative h-full overflow-hidden border-0 bg-card shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl py-0">
                      {/* Image Section with Overlay */}
                      <div className="relative aspect-[3/4] overflow-hidden">
                        {pet.photo_url ? (
                          <Image
                            src={pet.photo_url || "/placeholder.svg"}
                            alt={pet.name || "Pet"}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-gradient-to-br from-orange-100 via-orange-50 to-blue-100">
                            <span className="text-8xl opacity-40">🐾</span>
                          </div>
                        )}

                        {/* Gradient Overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                        {/* Top Badges Row */}
                        <div className="absolute left-0 right-0 top-0 flex items-start justify-between p-3">
                          {/* Status Badge */}
                          <div
                            className={`rounded-full px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md ${
                              pet.status === "LOST"
                                ? "bg-gradient-to-r from-orange-500 to-red-500"
                                : "bg-gradient-to-r from-blue-500 to-cyan-500"
                            }`}
                          >
                            {pet.status === "LOST" ? "🔍 Perdido" : "✓ Encontrado"}
                          </div>

                          <div className="flex flex-col gap-2">
                            {pet.has_reward && pet.reward_amount && (
                              <div className="rounded-full bg-gradient-to-r from-green-500 to-emerald-500 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
                                <div className="flex items-center gap-1">
                                  R$ {pet.reward_amount.toLocaleString("pt-BR")}
                                </div>
                              </div>
                            )}

                            {/* Distance Badge */}
                            {pet.distance !== null && (
                              <div className="rounded-full bg-black/60 px-3 py-1.5 text-xs font-bold text-white shadow-lg backdrop-blur-md">
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

                        {/* Bottom Content Overlay */}
                        <div className="absolute inset-x-0 bottom-0 p-4 text-white">
                          {/* Pet Name */}
                          <h3 className="mb-2 text-xl font-bold leading-tight drop-shadow-lg line-clamp-1">
                            {pet.name || "Sem Nome"}
                          </h3>

                          {/* Pet Type Badge */}
                          <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold backdrop-blur-md">
                            {pet.type === "DOG" && "🐕"}
                            {pet.type === "CAT" && "🐈"}
                            {pet.type === "BIRD" && "🐦"}
                            {pet.type === "OTHER" && "🐾"}
                            <span>
                              {pet.type === "DOG"
                                ? "Cachorro"
                                : pet.type === "CAT"
                                  ? "Gato"
                                  : pet.type === "BIRD"
                                    ? "Pássaro"
                                    : "Outro"}
                            </span>
                            {pet.breed && <span className="opacity-80">• {pet.breed}</span>}
                          </div>

                          {/* Location */}
                          <div className="mb-3 flex items-start gap-2 text-sm">
                            <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 opacity-90" />
                            <span className="flex-1 drop-shadow line-clamp-1">
                              {pet.location_description || "Localização não especificada"}
                            </span>
                          </div>

                          {/* Bottom Row: Date, Views, Share */}
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-3 text-xs">
                              <div className="flex items-center gap-1.5 opacity-90">
                                <Calendar className="h-3.5 w-3.5" />
                                <span>
                                  {new Date(pet.created_at).toLocaleDateString("pt-BR", {
                                    day: "2-digit",
                                    month: "short",
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
                )
              })}
            </div>

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
                    if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                      return (
                        <Button
                          key={page}
                          onClick={() => goToPage(page)}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          className="min-w-[2.5rem]"
                        >
                          {page}
                        </Button>
                      )
                    } else if (page === currentPage - 2 || page === currentPage + 2) {
                      return (
                        <span key={page} className="flex items-center px-2">
                          ...
                        </span>
                      )
                    }
                    return null
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

            <div className="mt-4 text-center text-sm text-muted-foreground">
              Mostrando {startIndex + 1}-{Math.min(endIndex, petsWithDistance.length)} de {petsWithDistance.length} pets
            </div>
          </>
        )}
      </div>
    </div>
  )
}
