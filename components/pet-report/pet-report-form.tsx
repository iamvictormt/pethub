"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextInput } from "@/components/ui/text-input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { SelectDropdown } from "@/components/ui/select-dropdown"
import { Heart, PawPrint, Search, Upload, X } from "lucide-react"
import { LocationPicker } from "./location-picker"
import type { PetStatus, PetType } from "@/lib/types/database"
import { formatPhoneBR } from "@/lib/utils"
import { validateImageFile } from "@/lib/image-validation"
import { toast } from "@/hooks/use-toast"
import { Label } from "@radix-ui/react-dropdown-menu"
import { Checkbox } from "@/components/ui/checkbox"
import { formatRewardAmount } from "@/utils/formatCurrency"
import { parseCurrencyToNumber } from "@/utils/parseCurrency"
import { DateInput } from "../ui/date-input"

export const PET_STATUS_OPTIONS = [
  {
    value: "LOST",
    label: "Perdido",
    description: "Estou procurando meu pet desaparecido",
    icon: Search,
  },
  {
    value: "SIGHTED",
    label: "Avistado",
    description: "Vi um pet, mas não consegui resgatar",
    icon: PawPrint,
  },
  {
    value: "RESCUED",
    label: "Resgatado",
    description: "Resgatei um pet e estou com ele",
    icon: Heart,
  },
  {
    value: "ADOPTION",
    label: "Adoção",
    description: "Este pet está disponível para adoção",
    icon: Heart,
  },
]

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
  const [lastSeenDate, setLastSeenDate] = useState(new Date().toISOString().split("T")[0])
  const [hasReward, setHasReward] = useState(false)
  const [rewardAmount, setRewardAmount] = useState("")

  // New states for "unknown" fields in SIGHTED and RESCUED statuses
  const [unknownName, setUnknownName] = useState(false)
  const [unknownBreed, setUnknownBreed] = useState(false)
  const [unknownAge, setUnknownAge] = useState(false)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        setError(validation.error || "Arquivo inválido")
        return
      }

      setPhotoFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = () => {
    setPhotoFile(null)
    setPhotoPreview(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!photoFile) {
        toast({
          title: "Foto obrigatória",
          description: "Por favor, faça upload de uma foto do pet",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      // Validate required fields
      if (!contactName || !contactPhone || !latitude || !longitude) {
        toast({
          title: "Campos obrigatórios",
          description: "Por favor, preencha todos os campos obrigatórios",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      if (status !== "LOST") {
        setHasReward(false)
        setRewardAmount("")
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

      const finalName =
        (status === "SIGHTED" || status === "RESCUED") && unknownName ? "Não informado" : name || "Não informado"
      const finalBreed =
        (status === "SIGHTED" || status === "RESCUED") && unknownBreed ? "Não informado" : breed || null
      const finalAge =
        (status === "SIGHTED" || status === "RESCUED") && unknownAge ? null : age ? Number.parseInt(age) : null

      const expirationDate = status === "SIGHTED" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null

      // Insert pet record
      const { error: insertError } = await supabase.from("pets").insert({
        user_id: userId,
        name: finalName,
        type,
        breed: finalBreed,
        color: color || null,
        age: finalAge,
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
        has_reward: hasReward,
        reward_amount: hasReward && rewardAmount ? parseCurrencyToNumber(rewardAmount) : null,
        expiration_date: expirationDate,
      })

      if (insertError) throw insertError
      toast({
        title: "Pet reportado com sucesso!",
        description: "Obrigado por ajudar a reunir pets perdidos com seus donos.",
      })
      router.push("/meus-pets")
    } catch (err) {
      toast({
        title: "Erro ao reportar pet!",
        description: "" + (err instanceof Error ? err.message : "Ocorreu um erro ao reportar o pet"),
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAmountChangeForm = (value: string) => {
    setRewardAmount(formatRewardAmount(value))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Status Selection */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <Label className="mb-3 block text-sm font-medium">Status do Pet</Label>
            <RadioGroup value={status} onValueChange={setStatus} className="space-y-3">
              {PET_STATUS_OPTIONS.map((option) => {
                return (
                  <div
                    key={option.value}
                    className={`flex items-start space-x-3 rounded-lg border p-3 transition-colors cursor-pointer ${
                      status === option.value
                        ? "border-orange-alert bg-orange-alert/5"
                        : "border-border hover:border-orange-alert/50"
                    }`}
                  >
                    <RadioGroupItem value={option.value} id={option.value} className="mt-1" />
                    <label htmlFor={option.value} className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{option.label}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
                    </label>
                  </div>
                )
              })}
            </RadioGroup>
          </div>
        </CardContent>
      </Card>

      {/* Pet Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações do Pet</h2>

          <div className="space-y-2">
            <TextInput
              label="Nome do Pet"
              placeholder="Ex: Rex, Mimi..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required={status !== "SIGHTED" && status !== "RESCUED" && !unknownName}
              disabled={(status === "SIGHTED" || status === "RESCUED") && unknownName}
            />
            {(status === "SIGHTED" || status === "RESCUED") && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="unknown-name"
                  checked={unknownName}
                  onCheckedChange={(checked) => {
                    setUnknownName(checked as boolean)
                    if (checked) setName("")
                  }}
                />
                <label htmlFor="unknown-name" className="text-sm text-muted-foreground cursor-pointer">
                  Não sei o nome
                </label>
              </div>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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

            <div className="space-y-2">
              <TextInput
                label="Raça"
                placeholder="Ex: Labrador, Siamês..."
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                disabled={(status === "SIGHTED" || status === "RESCUED") && unknownBreed}
              />
              {(status === "SIGHTED" || status === "RESCUED") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unknown-breed"
                    checked={unknownBreed}
                    onCheckedChange={(checked) => {
                      setUnknownBreed(checked as boolean)
                      if (checked) setBreed("")
                    }}
                  />
                  <label htmlFor="unknown-breed" className="text-sm text-muted-foreground cursor-pointer">
                    Não sei a raça
                  </label>
                </div>
              )}
            </div>

            <TextInput
              label="Cor predominante"
              placeholder="Ex: Marrom, Preto..."
              value={color}
              onChange={(e) => setColor(e.target.value)}
              required
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <TextInput
                label="Idade (anos)"
                type="number"
                placeholder="Ex: 3"
                value={age}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, "")
                  let numberValue = Number(value)
                  if (numberValue < 0) numberValue = 0
                  if (numberValue > 25) numberValue = 25
                  setAge(numberValue.toString())
                }}
                helperText="Aproximada, se não souber exatamente"
                required={status !== "SIGHTED" && status !== "RESCUED" && !unknownAge}
                disabled={(status === "SIGHTED" || status === "RESCUED") && unknownAge}
              />
              {(status === "SIGHTED" || status === "RESCUED") && (
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="unknown-age"
                    checked={unknownAge}
                    onCheckedChange={(checked) => {
                      setUnknownAge(checked as boolean)
                      if (checked) setAge("")
                    }}
                  />
                  <label htmlFor="unknown-age" className="text-sm text-muted-foreground cursor-pointer">
                    Não sei a idade
                  </label>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <DateInput
                label="Visto pela última vez"
                value={lastSeenDate}
                onChange={(e) => setLastSeenDate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição</label>
            <textarea
              className="min-h-24 w-full rounded-2xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
              placeholder="Descreva características marcantes, comportamento, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Foto do Pet</label>
            <div className="flex flex-col gap-4">
              {photoPreview && (
                <div className="relative h-[50vh] w-full overflow-hidden rounded-xl">
                  <img src={photoPreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                  <button
                    type="button"
                    onClick={handleRemovePhoto}
                    className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
                    aria-label="Remover foto"
                  >
                    <X className="h-5 w-5" />
                  </button>
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
          <LocationPicker
            latitude={latitude}
            longitude={longitude}
            onLocationChange={(lat, lng) => {
              setLatitude(lat)
              setLongitude(lng)
            }}
            locationDescription={locationDescription}
            onDescriptionChange={setLocationDescription}
          />
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações de Contato</h2>

          <div className="grid gap-4 sm:grid-cols-2">
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
              onChange={(e) => setContactPhone(formatPhoneBR(e.target.value))}
              onBlur={() => {
                if (contactPhone.length < 14) setContactPhone("")
              }}
              required
            />
          </div>

          <TextInput
            label="Email (opcional)"
            type="email"
            placeholder="seu@email.com"
            value={contactEmail}
            onChange={(e) => setContactEmail(e.target.value)}
          />
        </CardContent>
      </Card>

      {/* Reward */}
      {status === "LOST" && (
        <Card>
          <CardContent className="space-y-4 pt-6">
            <h2 className="text-xl font-semibold">Recompensa</h2>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="has-reward"
                checked={hasReward}
                onCheckedChange={(checked) => {
                  setHasReward(checked as boolean)
                  if (!checked) setRewardAmount("")
                }}
              />
              <label
                htmlFor="has-reward"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
              >
                Ofereço recompensa pela devolução do pet
              </label>
            </div>

            {hasReward && (
              <TextInput
                label="Valor da recompensa (R$)"
                type="text"
                placeholder="Ex: 500"
                value={rewardAmount}
                onChange={(e) => handleAmountChangeForm(e.target.value)}
                helperText="Valor entre R$ 1 e R$ 10.000"
                required={hasReward}
                inputMode="numeric"
              />
            )}
          </CardContent>
        </Card>
      )}

      {/* Error Message */}
      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      {/* Submit Button */}
      <Button
        type="submit"
        size="lg"
        className="w-full bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
        disabled={isLoading}
      >
        {isLoading ? "Reportando..." : "Reportar Pet"}
      </Button>
    </form>
  )
}
