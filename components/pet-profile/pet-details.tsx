import { Card, CardContent } from "@/components/ui/card"
import { MapPin, Calendar, Phone, Mail, User } from "lucide-react"
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
  const statusColor =
    pet.status === "LOST" ? "bg-orange-alert" : pet.status === "FOUND" ? "bg-blue-pethub" : "bg-green-found"
  const statusText = pet.status === "LOST" ? "Perdido" : pet.status === "FOUND" ? "Encontrado" : "Devolvido"

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        {/* Pet Photo */}
        {pet.photo_url && (
          <div className="relative h-96 w-full overflow-hidden rounded-xl">
            <img src={pet.photo_url || "/placeholder.svg"} alt={pet.name} className="h-full w-full object-cover" />
          </div>
        )}

        {/* Pet Header */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">{pet.name}</h1>
              <p className="text-lg text-muted-foreground">
                {pet.type === "DOG"
                  ? "Cachorro"
                  : pet.type === "CAT"
                    ? "Gato"
                    : pet.type === "BIRD"
                      ? "Pássaro"
                      : "Outro"}
                {pet.breed && ` • ${pet.breed}`}
              </p>
            </div>
            <span className={`rounded-full px-4 py-2 text-sm font-semibold text-white ${statusColor}`}>
              {statusText}
            </span>
          </div>

          {/* Pet Info Grid */}
          <div className="grid gap-4 rounded-xl bg-muted/30 p-4 md:grid-cols-2">
            {pet.color && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                  <div className="h-4 w-4 rounded-full border-2 border-border" style={{ backgroundColor: pet.color }} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Cor</p>
                  <p className="font-medium">{pet.color}</p>
                </div>
              </div>
            )}

            {pet.age && (
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-background">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Idade</p>
                  <p className="font-medium">{pet.age} anos</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        {pet.description && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Descrição</h2>
            <p className="text-muted-foreground">{pet.description}</p>
          </div>
        )}

        {/* Location */}
        <div className="space-y-2">
          <h2 className="text-lg font-semibold">Localização</h2>
          <div className="flex items-start gap-2 text-muted-foreground">
            <MapPin className="mt-1 h-5 w-5 flex-shrink-0" />
            <div>
              <p>{pet.location_description || "Localização não especificada"}</p>
              <p className="text-sm">
                Coordenadas: {pet.latitude}, {pet.longitude}
              </p>
            </div>
          </div>
        </div>

        {/* Last Seen */}
        {pet.last_seen_date && (
          <div className="space-y-2">
            <h2 className="text-lg font-semibold">Última vez visto</h2>
            <div className="flex items-center gap-2 text-muted-foreground">
              <Calendar className="h-5 w-5" />
              <p>{new Date(pet.last_seen_date).toLocaleDateString("pt-BR", { dateStyle: "long" })}</p>
            </div>
          </div>
        )}

        {/* Contact Information */}
        <div className="space-y-3 rounded-xl border border-border bg-card p-4">
          <h2 className="text-lg font-semibold">Informações de Contato</h2>

          <div className="space-y-2">
            <div className="flex items-center gap-2 text-muted-foreground">
              <User className="h-5 w-5" />
              <p>{pet.contact_name}</p>
            </div>

            <div className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-5 w-5" />
              <a href={`tel:${pet.contact_phone}`} className="hover:text-foreground">
                {pet.contact_phone}
              </a>
            </div>

            {pet.contact_email && (
              <div className="flex items-center gap-2 text-muted-foreground">
                <Mail className="h-5 w-5" />
                <a href={`mailto:${pet.contact_email}`} className="hover:text-foreground">
                  {pet.contact_email}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Posted By */}
        <div className="flex items-center gap-3 border-t border-border pt-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
            {pet.profiles.avatar_url ? (
              <img
                src={pet.profiles.avatar_url || "/placeholder.svg"}
                alt={pet.profiles.name}
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-muted-foreground" />
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Reportado por</p>
            <p className="font-medium">{pet.profiles.name}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
