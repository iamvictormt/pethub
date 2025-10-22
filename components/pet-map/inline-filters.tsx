"use client"

import { Button } from "@/components/ui/button"
import { SliderInput } from "@/components/ui/slider-input"
import { SelectDropdown } from "@/components/ui/select-dropdown"
import { MapPin, X } from "lucide-react"

interface InlineFiltersProps {
  status: string[]
  setStatus: (value: string[]) => void
  petTypes: string[]
  setPetTypes: (value: string[]) => void
  distance: number
  setDistance: (value: number) => void
  sortBy: string
  setSortBy: (value: string) => void
  userLocation: { lat: number; lng: number } | null
  onRequestLocation: () => void
  onClearFilters: () => void
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
  return (
    <div className="space-y-6 rounded-xl border border-border/50 bg-card/50 p-6 shadow-sm backdrop-blur-sm">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold">Filtros</h3>
          <p className="text-sm text-muted-foreground">Refine sua busca por pets</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearFilters}
          className="text-muted-foreground hover:text-foreground"
        >
          <X className="mr-2 h-4 w-4" />
          Limpar
        </Button>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {/* Location Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Localização</label>
          <Button
            onClick={onRequestLocation}
            variant={userLocation ? "default" : "outline"}
            className={`w-full ${userLocation ? "bg-pink-500 hover:bg-pink-600" : ""}`}
          >
            <MapPin className="mr-2 h-4 w-4" />
            {userLocation ? "Localização Ativa" : "Ativar Localização"}
          </Button>
          {userLocation && <p className="text-xs text-muted-foreground">Mostrando pets em um raio de {distance}km</p>}
        </div>

        {/* Status Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Status</label>
          <div className="flex gap-2">
            <Button
              onClick={() =>
                setStatus(status.includes("LOST") ? status.filter((s) => s !== "LOST") : [...status, "LOST"])
              }
              variant={status.includes("LOST") ? "default" : "outline"}
              className={`flex-1 ${status.includes("LOST") ? "bg-orange-500 hover:bg-orange-600" : ""}`}
            >
              Perdidos
            </Button>
            <Button
              onClick={() =>
                setStatus(status.includes("FOUND") ? status.filter((s) => s !== "FOUND") : [...status, "FOUND"])
              }
              variant={status.includes("FOUND") ? "default" : "outline"}
              className={`flex-1 ${status.includes("FOUND") ? "bg-blue-500 hover:bg-blue-600" : ""}`}
            >
              Encontrados
            </Button>
          </div>
        </div>

        {/* Distance Filter */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Distância Máxima</label>
          <SliderInput value={distance} onChange={setDistance} min={1} max={50} unit="km" />
        </div>

        {/* Sort By */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Ordenar Por</label>
          <SelectDropdown
            options={[
              { value: "recent", label: "Mais recentes" },
              { value: "distance", label: "Mais próximos" },
              { value: "oldest", label: "Mais antigos" },
            ]}
            value={sortBy}
            onChange={setSortBy}
          />
        </div>
      </div>

      {/* Pet Type Chips */}
      <div className="space-y-3">
        <label className="text-sm font-medium text-foreground">Tipo de Pet</label>
        <div className="flex flex-wrap gap-2">
          {[
            { id: "DOG", label: "🐕 Cachorro" },
            { id: "CAT", label: "🐈 Gato" },
            { id: "BIRD", label: "🦜 Pássaro" },
            { id: "OTHER", label: "🐾 Outro" },
          ].map((type) => (
            <Button
              key={type.id}
              onClick={() =>
                setPetTypes(petTypes.includes(type.id) ? petTypes.filter((t) => t !== type.id) : [...petTypes, type.id])
              }
              variant={petTypes.includes(type.id) ? "default" : "outline"}
              className={petTypes.includes(type.id) ? "bg-pink-500 hover:bg-pink-600" : ""}
            >
              {type.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

