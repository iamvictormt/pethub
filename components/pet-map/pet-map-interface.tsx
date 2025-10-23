"use client"

import { useState, useEffect } from "react"
import type { Pet, Advertisement } from "@/lib/types/database"
import { PetMap } from "./pet-map"
import { PetListView } from "./pet-list-view"
import { AdSupportBanner } from "@/components/ads/ad-support-banner"
import { useSearchParams, useRouter } from "next/navigation"
import { Map, List } from "lucide-react"

interface PetMapInterfaceProps {
  pets: Pet[]
  ads: Advertisement[]
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLon = ((lon2 - lon1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function PetMapInterface({ pets, ads }: PetMapInterfaceProps) {
  const [status, setStatus] = useState<string[]>(["LOST", "FOUND"])
  const [petTypes, setPetTypes] = useState<string[]>([])
  const [distance, setDistance] = useState(10)
  const [sortBy, setSortBy] = useState("recent")
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [filteredPets, setFilteredPets] = useState<Pet[]>(pets)
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

          if (position.coords.accuracy > 100) {
            console.log("[v0] Low accuracy warning:", position.coords.accuracy, "meters")
          }
        },
        (error) => {
          console.error("[v0] Error getting location:", error)
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
      alert("Geolocalização não é suportada pelo seu navegador.")
    }
  }

  const clearFilters = () => {
    setStatus(["LOST", "FOUND"])
    setPetTypes([])
    setDistance(10)
    setSortBy("recent")
    // setUserLocation(null);
  }

  useEffect(() => {
    let filtered = [...pets]

    if (status.length > 0) {
      filtered = filtered.filter((pet) => status.includes(pet.status))
    }

    if (petTypes.length > 0) {
      filtered = filtered.filter((pet) => petTypes.includes(pet.type))
    }

    if (userLocation) {
      filtered = filtered.filter((pet) => {
        const dist = calculateDistance(userLocation.lat, userLocation.lng, pet.latitude, pet.longitude)
        return dist <= distance
      })
    }

    if (sortBy === "recent") {
      filtered.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortBy === "oldest") {
      filtered.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    } else if (sortBy === "distance" && userLocation) {
      filtered.sort((a, b) => {
        const distA = calculateDistance(userLocation.lat, userLocation.lng, a.latitude, a.longitude)
        const distB = calculateDistance(userLocation.lat, userLocation.lng, b.latitude, b.longitude)
        return distA - distB
      })
    }

    setFilteredPets(filtered)
  }, [pets, status, petTypes, distance, sortBy, userLocation])

  useEffect(() => {
    requestLocation()
  }, [])

  return (
    <div className="border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
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
            <span className="hidden sm:inline">Lista</span>
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
            <span className="hidden sm:inline">Mapa</span>
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {viewMode === "map" ? (
          <div className="flex h-[calc(75vh)] flex-col md:h-[calc(100vh-4rem)]">
            <PetMap pets={filteredPets} userLocation={userLocation} />
          </div>
        ) : (
          <PetListView
            pets={filteredPets}
            userLocation={userLocation}
            ads={ads}
            status={status}
            setStatus={setStatus}
            petTypes={petTypes}
            setPetTypes={setPetTypes}
            distance={distance}
            setDistance={setDistance}
            sortBy={sortBy}
            setSortBy={setSortBy}
            onRequestLocation={requestLocation}
            onClearFilters={clearFilters}
          />
        )}
      </div>
    </div>
  )
}
