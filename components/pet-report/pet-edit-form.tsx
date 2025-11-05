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
import { Upload, ArrowLeft, X } from "lucide-react"
import { LocationPicker } from "./location-picker"
import type { Pet, PetStatus, PetType } from "@/lib/types/database"
import Link from "next/link"
import { formatPhoneBR } from "@/lib/utils"
import { validateImageFile } from "@/lib/image-validation"
import { toast } from "@/hooks/use-toast"
import { Label } from "@radix-ui/react-dropdown-menu"
import { PET_STATUS_OPTIONS } from "./pet-report-form"
import { Checkbox } from "@/components/ui/checkbox"
import { formatRewardAmount } from "@/utils/formatCurrency"
import { parseCurrencyToNumber } from "@/utils/parseCurrency"
import { DateInput } from "../ui/date-input"
import { uploadFileWithRetry } from "@/lib/upload-helper"

interface PetEditFormProps {
  pet: Pet
}

export function PetEditForm({ pet }: PetEditFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)

  const [photoFiles, setPhotoFiles] = useState<(File | null)[]>([null, null, null, null])
  const [photoPreviews, setPhotoPreviews] = useState<(string | null)[]>([
    pet.photo_url || null,
    pet.photo_url_2 || null,
    pet.photo_url_3 || null,
    pet.photo_url_4 || null,
  ])

  const [status, setStatus] = useState<PetStatus>(pet.status)
  const [name, setName] = useState(pet.name)
  const [type, setType] = useState<PetType>(pet.type)
  const [breed, setBreed] = useState(pet.breed || "")
  const [color, setColor] = useState(pet.color || "")
  const [age, setAge] = useState(pet.age?.toString() || "")
  const [description, setDescription] = useState(pet.description || "")
  const [latitude, setLatitude] = useState(pet.latitude?.toString() || "")
  const [longitude, setLongitude] = useState(pet.longitude?.toString() || "")
  const [locationDescription, setLocationDescription] = useState(pet.location_description || "")
  const [contactName, setContactName] = useState(pet.contact_name)
  const [contactPhone, setContactPhone] = useState(pet.contact_phone)
  const [contactEmail, setContactEmail] = useState(pet.contact_email || "")
  const [lastSeenDate, setLastSeenDate] = useState(new Date(pet.last_seen_date || "").toISOString().split("T")[0])
  const [hasReward, setHasReward] = useState(pet.has_reward || false)
  const [rewardAmount, setRewardAmount] = useState(
    pet.reward_amount ? formatRewardAmount(pet.reward_amount.toString()) : "",
  )
  const [unknownName, setUnknownName] = useState(pet.name === "Não informado")
  const [unknownBreed, setUnknownBreed] = useState(pet.breed === "Não informado")
  const [unknownAge, setUnknownAge] = useState(pet.age === null)

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0]
    if (file) {
      const validation = validateImageFile(file)
      if (!validation.valid) {
        toast({
          title: validation.title,
          description: validation.error || "Arquivo inválido",
          variant: "destructive",
        })
        return
      }

      const newPhotoFiles = [...photoFiles]
      newPhotoFiles[index] = file
      setPhotoFiles(newPhotoFiles)

      const reader = new FileReader()
      reader.onloadend = () => {
        const newPreviews = [...photoPreviews]
        newPreviews[index] = reader.result as string
        setPhotoPreviews(newPreviews)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleRemovePhoto = (index: number) => {
    const newPhotoFiles = [...photoFiles]
    newPhotoFiles[index] = null
    setPhotoFiles(newPhotoFiles)

    const newPreviews = [...photoPreviews]
    newPreviews[index] = null
    setPhotoPreviews(newPreviews)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      if (!photoFiles[0] && !photoPreviews[0]) {
        toast({
          title: "Foto obrigatória",
          description: "Por favor, mantenha ou faça upload de pelo menos uma foto do pet",
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

      const photoUrls: (string | null)[] = [
        pet.photo_url || null,
        pet.photo_url_2 || null,
        pet.photo_url_3 || null,
        pet.photo_url_4 || null,
      ]
      const uploadErrors: string[] = []

      for (let i = 0; i < photoFiles.length; i++) {
        const file = photoFiles[i]
        if (!file) continue

        console.log(`Uploading photo ${i + 1}...`)
        const result = await uploadFileWithRetry(file, pet.user_id, i)

        if (result.success && result.url) {
          photoUrls[i] = result.url
          console.log(`Photo ${i + 1} uploaded successfully`)
        } else {
          console.error(`Failed to upload photo ${i + 1}:`, result.error)
          uploadErrors.push(`Foto ${i + 1}: ${result.error}`)

          // If first photo fails and there's no existing photo, stop the process
          if (i === 0 && !photoPreviews[0]) {
            toast({
              title: "Erro no upload da foto principal",
              description: result.error || "Não foi possível fazer upload da primeira foto. Tente novamente.",
              variant: "destructive",
            })
            setIsLoading(false)
            return
          }
        }
      }

      // Show warning if some photos failed
      if (uploadErrors.length > 0) {
        toast({
          title: "Algumas fotos não foram enviadas",
          description: uploadErrors.join(", "),
          variant: "destructive",
        })
      }

      if (status !== "LOST") {
        setHasReward(false)
        setRewardAmount("")
      }

      const finalName = unknownName ? "Não informado" : name || "Não informado"
      const finalBreed = unknownBreed ? "Não informado" : breed || null
      const finalAge = unknownAge ? null : age ? Number.parseInt(age) : null

      const expirationDate = status === "SIGHTED" ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString() : null

      const { error: updateError } = await supabase
        .from("pets")
        .update({
          name: finalName,
          type,
          breed: finalBreed,
          color: color || null,
          age: finalAge,
          description: description || null,
          photo_url: photoUrls[0],
          photo_url_2: photoUrls[1],
          photo_url_3: photoUrls[2],
          photo_url_4: photoUrls[3],
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
        .eq("id", pet.id)

      if (updateError) {
        console.error("Update error:", updateError)
        throw updateError
      }

      toast({
        title: "Pet salvo com sucesso!",
        description: "As informações do pet foram atualizadas.",
      })

      router.push("/meus-pets")
    } catch (err) {
      console.error("Error in handleSubmit:", err)
      toast({
        title: "Erro ao salvar pet!",
        description: err instanceof Error ? err.message : "Ocorreu um erro ao salvar o pet.",
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
                required={!unknownBreed}
                disabled={unknownBreed}
              />
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
                required={!unknownAge}
                disabled={unknownAge}
              />
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
              className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
              placeholder="Descreva características marcantes, comportamento, etc..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Fotos do Pet (até 4)</label>
            <p className="text-xs text-muted-foreground">A primeira foto será a principal</p>
            <div className="grid gap-4 sm:grid-cols-2">
              {[0, 1, 2, 3].map((index) => (
                <div key={index} className="space-y-2">
                  {photoPreviews[index] && (
                    <div className="relative h-48 w-full overflow-hidden rounded-xl">
                      <img
                        src={photoPreviews[index] || "/placeholder.svg"}
                        alt={`Preview ${index + 1}`}
                        className="h-full w-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={() => handleRemovePhoto(index)}
                        className="absolute right-2 top-2 rounded-full bg-destructive p-2 text-destructive-foreground shadow-lg transition-opacity hover:opacity-90 cursor-pointer"
                        aria-label={`Remover foto ${index + 1}`}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  )}
                  <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-6 transition-colors hover:bg-muted/50">
                    <Upload className="h-4 w-4 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {photoPreviews[index] ? "Alterar" : index === 0 ? "Foto principal *" : `Foto ${index + 1}`}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => handlePhotoChange(e, index)}
                      className="hidden"
                    />
                  </label>
                </div>
              ))}
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

      {/* Submit Buttons */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <Button type="button" variant="outline" size="lg" asChild className="flex-1 bg-transparent">
          <Link href="/meus-pets">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Cancelar
          </Link>
        </Button>
        <Button
          type="submit"
          size="lg"
          className="flex-1 bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
          disabled={isLoading}
        >
          {isLoading ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>
    </form>
  )
}
