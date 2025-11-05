"use client"
import { Button } from "@/components/ui/button"
import { SliderInput } from "@/components/ui/slider-input"
import { SelectDropdown } from "@/components/ui/select-dropdown"
import { Filter, MapPin, Search } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

interface MapFiltersProps {
  isMobile?: boolean
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
  hasReward: boolean
  setHasReward: (value: boolean) => void
  onApplyFilters: () => void
  searchQuery: string
  setSearchQuery: (value: string) => void
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
  hasReward,
  setHasReward,
  onApplyFilters,
  searchQuery,
  setSearchQuery,
}: MapFiltersProps) {
  const hasActiveFilters =
    status.length > 0 || petTypes.length > 0 || userLocation !== null || hasReward || searchQuery.trim().length > 0
  const activeFilterCount =
    status.length +
    petTypes.length +
    (userLocation ? 1 : 0) +
    (hasReward ? 1 : 0) +
    (searchQuery.trim().length > 0 ? 1 : 0)

  const FilterContent = (
    <div className="space-y-6">
      {/* Header with Clear Button */}
      {!isMobile && (
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold">Filtros</h2>
            {hasActiveFilters && (
              <p className="text-xs text-muted-foreground mt-1">{activeFilterCount} filtro(s) ativo(s)</p>
            )}
          </div>
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
              Limpar tudo
            </Button>
          )}
        </div>
      )}

      <Separator />

      {/* Search Input Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Buscar Pet</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Nome, raça, cor, descrição..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 py-6"
          />
        </div>
        <p className="text-xs text-muted-foreground">Pesquise por nome, raça, cor ou descrição do pet</p>
      </div>

      <Separator />

      {/* Location Section */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <h3 className="text-sm font-semibold">Localização</h3>
        </div>
        <Button
          onClick={onRequestLocation}
          variant={userLocation ? "default" : "outline"}
          className={`w-full justify-center py-6 ${userLocation ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
        >
          <MapPin className="h-4 w-4 mr-2" />
          {userLocation ? "Localização ativa" : "Usar minha localização"}
        </Button>
        {userLocation && (
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-sm font-semibold">Raio de busca</span>
            </div>
            <SliderInput value={distance} onChange={setDistance} min={1} max={100} unit="km" />
          </div>
        )}
      </div>

      <Separator />

      {/* Status Section */}
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-semibold">Status do Pet</h3>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "LOST", label: "Perdido", emoji: "😢", color: "bg-orange-500 hover:bg-orange-600" },
            { id: "SIGHTED", label: "Avistado", emoji: "👀", color: "bg-blue-500 hover:bg-blue-600" },
            { id: "RESCUED", label: "Resgatado", emoji: "🏥", color: "bg-cyan-500 hover:bg-cyan-600" },
            { id: "ADOPTION", label: "Adoção", emoji: "💚", color: "bg-green-500 hover:bg-green-600" },
          ].map((item) => {
            const isActive = status.includes(item.id)
            return (
              <Button
                key={item.id}
                onClick={() => setStatus(isActive ? status.filter((s) => s !== item.id) : [...status, item.id])}
                variant={isActive ? "default" : "outline"}
                className={`flex-col gap-1.5 h-auto py-3 ${isActive ? `${item.color} text-white border-0` : "hover:bg-accent"}`}
              >
                <span className="text-xl">{item.emoji}</span>
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Pet Type Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Tipo de Animal</h3>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: "DOG", label: "Cachorro", emoji: "🐕" },
            { id: "CAT", label: "Gato", emoji: "🐈" },
            { id: "BIRD", label: "Pássaro", emoji: "🦜" },
            { id: "OTHER", label: "Outro", emoji: "🐾" },
          ].map((type) => {
            const isActive = petTypes.includes(type.id)
            return (
              <Button
                key={type.id}
                onClick={() => setPetTypes(isActive ? petTypes.filter((t) => t !== type.id) : [...petTypes, type.id])}
                variant={isActive ? "default" : "outline"}
                className={`gap-1.5 py-6 ${isActive ? "bg-primary text-primary-foreground" : "hover:bg-accent"}`}
              >
                <span>{type.emoji}</span>
                <span className="text-sm">{type.label}</span>
              </Button>
            )
          })}
        </div>
      </div>

      <Separator />

      {/* Reward Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Recompensa</h3>
        <Button
          onClick={() => setHasReward(!hasReward)}
          variant={hasReward ? "default" : "outline"}
          className={`w-full justify-center py-6 ${
            hasReward ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-accent"
          }`}
        >
          <span className="text-lg mr-2">💵</span>
          <span className="text-sm">Apenas com recompensa</span>
        </Button>
      </div>

      <Separator />

      {/* Sort Section */}
      <div className="space-y-3">
        <h3 className="text-sm font-semibold">Ordenar por</h3>
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

      {/* Apply Button */}
      <Button
        onClick={onApplyFilters}
        className="w-full py-6 bg-gradient-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white font-semibold shadow-lg"
      >
        <Search className="h-4 w-4 mr-2" />
        Aplicar Filtros
      </Button>
    </div>
  )

  if (isMobile) {
    return (
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="default" className="w-full gap-2 relative bg-transparent">
            <Filter className="h-4 w-4" />
            Filtros
            {hasActiveFilters && (
              <Badge className="ml-auto bg-orange-500 text-white hover:bg-orange-600">{activeFilterCount}</Badge>
            )}
          </Button>
        </SheetTrigger>
        <SheetContent side="bottom" className="h-[90vh] overflow-hidden">
          <SheetHeader className="pb-4">
            <div className="flex items-center justify-between">
              <SheetTitle>Filtros</SheetTitle>
              {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={onClearFilters} className="text-xs">
                  Limpar tudo
                </Button>
              )}
            </div>
          </SheetHeader>
          <div className="overflow-y-auto h-[calc(90vh-80px)] pb-6">{FilterContent}</div>
        </SheetContent>
      </Sheet>
    )
  }

  return <div className="space-y-4">{FilterContent}</div>
}
