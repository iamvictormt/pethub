"use client"

import { useState, useEffect, useCallback } from "react"
import type { Pet, Advertisement } from "@/lib/types/database"
import { PetMap } from "./pet-map"
import { PetListView } from "./pet-list-view"
import { useSearchParams, useRouter } from "next/navigation"
import { Map, List } from "lucide-react"
import { toast } from "@/hooks/use-toast"


export function PetMapInterface() {
  const [isLoading, setIsLoading] = useState(true)
  const [pets, setPets] = useState<Pet[]>([])
  const [totalPets, setTotalPets] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)

  const [appliedSearchQuery, setAppliedSearchQuery] = useState("")
  const [pendingSearchQuery, setPendingSearchQuery] = useState("")
  const [pendingStatus, setPendingStatus] = useState<string[]>(["LOST", "SIGHTED", "RESCUED", "ADOPTION"])
  const [pendingPetTypes, setPendingPetTypes] = useState<string[]>([])
  const [pendingDistance, setPendingDistance] = useState(100)
  const [pendingSortBy, setPendingSortBy] = useState("recent")
  const [pendingHasReward, setPendingHasReward] = useState(false)
  const [status, setStatus] = useState<string[]>(["LOST", "SIGHTED", "RESCUED", "ADOPTION"])
  const [petTypes, setPetTypes] = useState<string[]>([])
  const [distance, setDistance] = useState(100)
  const [sortBy, setSortBy] = useState("recent")
  const [hasReward, setHasReward] = useState(false)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)

  const searchParams = useSearchParams()
  const router = useRouter()
  const viewMode = (searchParams.get("view") as "list" | "map") || "list"

  const setViewMode = (mode: "map" | "list") => {
    const params = new URLSearchParams(searchParams.toString())
    params.set("view", mode)
    router.push(`/pets?${params.toString()}`)
  }

  const requestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          let errorMessage = "Não foi possível obter sua localização. "

          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage += "Permissão negada. Verifique as configurações do navegador."
              break
            case error.POSITION_UNAVAILABLE:
              errorMessage += "Localização indisponível no momento."
              break
            case error.TIMEOUT:
              errorMessage += "Tempo esgotado. Tente novamente."
              break
            default:
              errorMessage += "Erro desconhecido."
          }

          alert(errorMessage)
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        },
      )
    } else {
      toast({
        title: "Erro",
        description: "Geolocalização não é suportada pelo seu navegador.",
        variant: "destructive",
      })
    }
  }

  const fetchPets = useCallback(
    async (page = 1) => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          status: status.join(","),
          petTypes: petTypes.join(","),
          hasReward: hasReward.toString(),
          search: appliedSearchQuery,
          sortBy: sortBy,
          page: page.toString(),
          limit: "12",
          distance: distance.toString(),
        })

        if (userLocation) {
          params.append("userLat", userLocation.lat.toString())
          params.append("userLng", userLocation.lng.toString())
        }

        const response = await fetch(`/api/pets?${params.toString()}`)

        if (!response.ok) {
          throw new Error("Failed to fetch pets")
        }

        const data = await response.json()
        setPets(data.pets || [])
        setTotalPets(data.pagination.total)
        setCurrentPage(page)
      } catch (error) {
        console.error("Error fetching pets:", error)
        toast({
          title: "Erro",
          description: "Não foi possível carregar os pets. Tente novamente.",
          variant: "destructive",
        })
        setPets([])
        setTotalPets(0)
      } finally {
        setIsLoading(false)
      }
    },
    [status, petTypes, hasReward, appliedSearchQuery, sortBy, distance, userLocation],
  )

  const handleSearch = (query: string) => {
    setStatus(pendingStatus)
    setPetTypes(pendingPetTypes)
    setDistance(pendingDistance)
    setSortBy(pendingSortBy)
    setHasReward(pendingHasReward)
    setAppliedSearchQuery(query)
  }

  const handleApplyFilters = () => {
    setStatus(pendingStatus)
    setPetTypes(pendingPetTypes)
    setDistance(pendingDistance)
    setSortBy(pendingSortBy)
    setHasReward(pendingHasReward)
    setAppliedSearchQuery(pendingSearchQuery)
  }

  const handleResetPendingFilters = () => {
    setPendingStatus(status)
    setPendingPetTypes(petTypes)
    setPendingDistance(distance)
    setPendingSortBy(sortBy)
    setPendingHasReward(hasReward)
    setPendingSearchQuery(appliedSearchQuery)
  }

  const clearFilters = () => {
    setPendingSearchQuery("")
    setAppliedSearchQuery("")
    setPendingStatus(["LOST", "SIGHTED", "RESCUED", "ADOPTION"])
    setPendingPetTypes([])
    setPendingDistance(100)
    setPendingSortBy("recent")
    setPendingHasReward(false)
    setStatus(["LOST", "SIGHTED", "RESCUED", "ADOPTION"])
    setPetTypes([])
    setDistance(100)
    setSortBy("recent")
    setHasReward(false)
  }

  useEffect(() => {
    fetchPets(1)
  }, [fetchPets])

  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <div className="bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 py-4 md:px-6 lg:px-8 justify-center flex">
        <div className="inline-flex items-center gap-1 rounded-full bg-muted p-1">
          <button
            onClick={() => setViewMode("list")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              viewMode === "list"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
            <span>Lista</span>
          </button>
          <button
            onClick={() => setViewMode("map")}
            className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all cursor-pointer ${
              viewMode === "map"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Map className="h-4 w-4" />
            <span>Mapa</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === "map" ? (
          <div className="flex h-[calc(75vh)] flex-col md:h-[calc(90vh-4rem)]">
            <PetMap pets={pets} userLocation={userLocation} />
          </div>
        ) : (
          <PetListView
            pets={pets}
            userLocation={userLocation}
            status={pendingStatus}
            setStatus={setPendingStatus}
            petTypes={pendingPetTypes}
            setPetTypes={setPendingPetTypes}
            distance={pendingDistance}
            setDistance={setPendingDistance}
            sortBy={pendingSortBy}
            setSortBy={setPendingSortBy}
            onRequestLocation={requestLocation}
            onClearFilters={clearFilters}
            onSearch={handleSearch}
            hasReward={pendingHasReward}
            setHasReward={setPendingHasReward}
            onApplyFilters={handleApplyFilters}
            onResetPendingFilters={handleResetPendingFilters}
            searchQuery={pendingSearchQuery}
            setSearchQuery={setPendingSearchQuery}
            isLoading={isLoading}
            totalPets={totalPets}
            currentPage={currentPage}
            onPageChange={fetchPets}
          />
        )}
      </div>
    </div>
  )
}
