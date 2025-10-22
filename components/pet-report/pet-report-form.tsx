"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextInput } from "@/components/ui/text-input"
import { RadioGroup } from "@/components/ui/radio-group"
import { SelectDropdown } from "@/components/ui/select-dropdown"
import { Upload, MapPin, Loader2 } from "lucide-react"
import type { PetStatus, PetType } from "@/lib/types/database"

interface PetReportFormProps {
  userId: string
}

export function PetReportForm({ userId }: PetReportFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  // Form fields
  const [status, setStatus] = useState<PetStatus>("LOST")
  const [name, setName] = useState("")
  const [type, setType] = useState<PetType>("DOG")
  const [breed, setBreed] = useState("")
  const [color, setColor] = useState("")
  const [age, setAge] = useState("")
  const [description, setDescription] = useState("")
  const [latitude, setLatitude] = useState("")
  const [longitude, setLongitude] = useState("")
  const [locationDescription, setLocationDescription] = useState("")
  const [contactName, setContactName] = useState("")
  const [contactPhone, setContactPhone] = useState("")
  const [contactEmail, setContactEmail] = useState("")
  const [lastSeenDate, setLastSeenDate] = useState("")

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude.toString())
          setLongitude(position.coords.longitude.toString())
        },
        (error) => {
          setError("Não foi possível obter sua localização. Por favor, insira manualmente.")
        },
      )
    } else {
      setError("Geolocalização não é suportada pelo seu navegador.")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Validate required fields
      if (!name || !contactName || !contactPhone || !latitude || !longitude) {
        throw new Error("Por favor, preencha todos os campos obrigatórios")
      }

      let photoUrl = null

      // Upload photo if provided
      if (photoFile) {
        const fileExt = photoFile.name.split(".").pop()
        const fileName = `${userId}-${Date.now()}.${fileExt}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("pet-photos")
          .upload(fileName, photoFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from("pet-photos").getPublicUrl(fileName)

        photoUrl = publicUrl
      }

      // Insert pet record
      const { error: insertError } = await supabase.from("pets").insert({
        user_id: userId,
        name,
        type,
        breed: breed || null,
        color: color || null,
        age: age ? Number.parseInt(age) : null,
        description: description || null,
        photo_url: photoUrl,
        status,
        latitude: Number.parseFloat(latitude),
        longitude: Number.parseFloat(longitude),
        location_description: locationDescription || null,
        contact_name: contactName,
        contact_phone: contactPhone,
        contact_email: contactEmail || null,
        last_seen_date: lastSeenDate || null,
      })

      if (insertError) throw insertError

      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao reportar o pet")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Selection */}
      <Card>
        <CardContent className="pt-6">
          <RadioGroup
            label="Status do Pet"
            options={[
              { id: "LOST", label: "Perdido - Estou procurando meu pet" },
              { id: "FOUND", label: "Encontrado - Encontrei um pet" },
            ]}
            value={status}
            onChange={(value) => setStatus(value as PetStatus)}
          />
        </CardContent>
      </Card>

      {/* Pet Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações do Pet</h2>

          <TextInput
            label="Nome do Pet"
            placeholder="Ex: Rex, Mimi..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <SelectDropdown
            label="Tipo de Animal"
            options={[
              { value: "DOG", label: "Cachorro" },
              { value: "CAT", label: "Gato" },
              { value: "BIRD", label: "Pássaro" },
              { value: "OTHER", label: "Outro" },
            ]}
            value={type}
            onChange={(value) => setType(value as PetType)}
          />

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Raça"
              placeholder="Ex: Labrador, Siamês..."
              value={breed}
              onChange={(e) => setBreed(e.target.value)}
            />

            <TextInput
              label="Cor predominante"
              placeholder="Ex: Marrom, Preto..."
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>

          <TextInput
            label="Idade (anos)"
            type="number"
            placeholder="Ex: 3"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            helperText="Aproximada, se não souber exatamente"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
              placeholder="Descreva características marcantes, comportamento, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto do Pet</label>
            <div className="flex flex-col gap-4">
              {photoPreview && (
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
                  <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 transition-colors hover:bg-muted/50">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Clique para fazer upload da foto</span>
                <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
              </label>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Location */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Localização</h2>
            <Button type="button" variant="outline" size="sm" onClick={getCurrentLocation}>
              <MapPin className="mr-2 h-4 w-4" />
              Usar minha localização
            </Button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <TextInput
              label="Latitude"
              type="number"
              step="any"
              placeholder="-23.5505"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              required
            />

            <TextInput
              label="Longitude"
              type="number"
              step="any"
              placeholder="-46.6333"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              required
            />
          </div>

          <TextInput
            label="Descrição do Local"
            placeholder="Ex: Próximo ao parque, na Rua X..."
            value={locationDescription}
            onChange={(e) => setLocationDescription(e.target.value)}
          />

          <TextInput
            label="Data em que foi visto pela última vez"
            type="date"
            value={lastSeenDate}
            onChange={(e) => setLastSeenDate(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações de Contato</h2>

          <TextInput
            label="Nome para contato"
            placeholder="Seu nome"
            value={contactName}
            onChange={(e) => setContactName(e.target.value)}
            required
          />

          <TextInput
            label="Telefone"
            type="tel"
            placeholder="(00) 00000-0000"
            value={contactPhone}
            onChange={(e) => setContactPhone(e.target.value)}
            required
          />

          <TextInput
            label="Email (opcional)"
            type="email"
            placeholder="seu@email.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Reportando...
          </>
        ) : (
          "Reportar Pet"
        )}
      </Button>
    </form>
  )
}
