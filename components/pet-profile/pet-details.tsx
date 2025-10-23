import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Phone, Mail, User, Clock, Palette } from "lucide-react"
import type { Pet } from "@/lib/types/database"

interface PetDetailsProps {
  pet: Pet & {
    profiles: {
      id: string
      name: string
      avatar_url?: string
    }
  }
}

export function PetDetails({ pet }: PetDetailsProps) {
  const statusConfig = {
    LOST: { color: "bg-orange-alert", text: "Perdido" },
    FOUND: { color: "bg-blue-pethub", text: "Encontrado" },
    RETURNED: { color: "bg-green-found", text: "Devolvido" }
  }

  const status = statusConfig[pet.status as keyof typeof statusConfig] || statusConfig.LOST

  const petTypeEmoji = {
    DOG: "🐕",
    CAT: "🐈",
    BIRD: "🐦",
  }

  const petTypeName = {
    DOG: "Cachorro",
    CAT: "Gato",
    BIRD: "Pássaro",
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        {/* Pet Photo */}
        {pet.photo_url && (
          <div className="relative h-[400px] w-full overflow-hidden bg-muted">
            <img 
              src={pet.photo_url || "/placeholder.svg"} 
              alt={pet.name} 
              className="h-full w-full object-cover" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0" />
            
            {/* Status Badge */}
            <div className="absolute left-4 top-4">
              <span className={`inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-white shadow-lg ${status.color}`}>
                <span className="h-2 w-2 rounded-full bg-white animate-pulse" />
                {status.text}
              </span>
            </div>
          </div>
        )}

        <div className="space-y-6 p-6">
          {/* Pet Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">{pet.name}</h1>
            <div className="flex items-center gap-2 text-lg text-muted-foreground">
              <span>
                {petTypeEmoji[pet.type as keyof typeof petTypeEmoji] || "🐾"}{" "}
                {petTypeName[pet.type as keyof typeof petTypeName] || "Outro"}
              </span>
              {pet.breed && (
                <>
                  <span className="text-muted-foreground/50">•</span>
                  <span className="font-medium">{pet.breed}</span>
                </>
              )}
            </div>
          </div>

          {/* Pet Info Cards */}
          {(pet.color || pet.age) && (
            <div className="grid gap-3 sm:grid-cols-2">
              {pet.color && (
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Palette className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Cor</p>
                    <p className="font-semibold truncate">{pet.color}</p>
                  </div>
                </div>
              )}

              {pet.age && (
                <div className="flex items-center gap-3 rounded-lg border bg-card p-4 transition-colors hover:bg-accent/50">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <Calendar className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Idade</p>
                    <p className="font-semibold truncate">{pet.age} {pet.age === 1 ? 'ano' : 'anos'}</p>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Description */}
          {pet.description && (
            <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Descrição</h2>
              <p className="text-foreground leading-relaxed">{pet.description}</p>
            </div>
          )}

          {/* Location */}
          <div className="space-y-3 rounded-lg border bg-muted/30 p-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Localização</h2>
            <div className="flex gap-3">
              <MapPin className="mt-0.5 h-5 w-5 flex-shrink-0 text-primary" />
              <div className="flex-1 min-w-0 space-y-1">
                <p className="font-medium leading-relaxed">
                  {pet.location_description || "Localização não especificada"}
                </p>
                <p className="text-xs text-muted-foreground">
                  {pet.latitude.toFixed(6)}, {pet.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>

          {/* Last Seen */}
          {pet.last_seen_date && (
            <div className="flex items-center gap-3 rounded-lg border border-orange-200 bg-orange-50 dark:border-orange-900 dark:bg-orange-950/30 p-4">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-100 dark:bg-orange-900/50">
                <Clock className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-orange-700 dark:text-orange-300 uppercase tracking-wider">
                  Última vez visto
                </p>
                <p className="font-semibold text-orange-900 dark:text-orange-100">
                  {new Date(pet.last_seen_date).toLocaleDateString("pt-BR", { 
                    dateStyle: "long" 
                  })}
                </p>
              </div>
            </div>
          )}

          {/* Contact Information */}
          <div className="space-y-4 rounded-lg border-2 border-primary/20 bg-primary/5 p-5">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-primary">
              Informações de Contato
            </h2>

            <div className="space-y-3">
              <div className="flex items-center gap-3 group">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                  <User className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="font-medium">{pet.contact_name}</p>
              </div>

              <a 
                href={`tel:${pet.contact_phone}`} 
                className="flex items-center gap-3 group transition-colors hover:text-primary"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                  <Phone className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <p className="font-medium">{pet.contact_phone}</p>
              </a>

              {pet.contact_email && (
                <a 
                  href={`mailto:${pet.contact_email}`} 
                  className="flex items-center gap-3 group transition-colors hover:text-primary"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background group-hover:bg-primary/10 transition-colors">
                    <Mail className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
                  </div>
                  <p className="font-medium truncate">{pet.contact_email}</p>
                </a>
              )}
            </div>
          </div>

          {/* Posted By */}
          <div className="flex items-center gap-4 border-t pt-6">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/5 ring-2 ring-primary/10">
              {pet.profiles.avatar_url ? (
                <img
                  src={pet.profiles.avatar_url || "/placeholder.svg"}
                  alt={pet.profiles.name}
                  className="h-full w-full rounded-full object-cover"
                />
              ) : (
                <User className="h-7 w-7 text-primary" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Reportado por
              </p>
              <p className="font-semibold text-lg truncate">{pet.profiles.name}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}