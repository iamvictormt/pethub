"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { createClient } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { TextInput } from "@/components/ui/text-input"
import { Upload, Loader2 } from "lucide-react"

interface AdFormProps {
  userId: string
}

export function AdForm({ userId }: AdFormProps) {
  const router = useRouter()
  const supabase = createClient()

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [linkUrl, setLinkUrl] = useState("")

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      if (!title || !imageFile) {
        throw new Error("Por favor, preencha todos os campos obrigatórios")
      }

      // Upload image
      const fileExt = imageFile.name.split(".").pop()
      const fileName = `${userId}-${Date.now()}.${fileExt}`
      const { error: uploadError } = await supabase.storage.from("ad-images").upload(fileName, imageFile)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from("ad-images").getPublicUrl(fileName)

      // Insert advertisement
      const { error: insertError } = await supabase.from("advertisements").insert({
        petshop_id: userId,
        title,
        description: description || null,
        image_url: publicUrl,
        link_url: linkUrl || null,
        is_active: true,
      })

      if (insertError) throw insertError

      router.push("/")
      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro ao criar o anúncio")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardContent className="space-y-4 pt-6">
          <h2 className="text-xl font-semibold">Informações do Anúncio</h2>

          <TextInput
            label="Título do Anúncio"
            placeholder="Ex: Ração Premium com 20% de desconto"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Descrição (opcional)</label>
            <textarea
              className="min-h-24 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
              placeholder="Descreva seu produto ou serviço..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>

          <TextInput
            label="Link do Anúncio (opcional)"
            type="url"
            placeholder="https://seupetshop.com.br/promocao"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            helperText="Para onde os usuários serão direcionados ao clicar"
          />

          <div className="space-y-2">
            <label className="text-sm font-medium">Imagem do Anúncio</label>
            <div className="flex flex-col gap-4">
              {imagePreview && (
                <div className="relative h-48 w-full overflow-hidden rounded-xl">
                  <img src={imagePreview || "/placeholder.svg"} alt="Preview" className="h-full w-full object-cover" />
                </div>
              )}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-border bg-muted/30 px-4 py-8 transition-colors hover:bg-muted/50">
                <Upload className="h-5 w-5 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Clique para fazer upload da imagem</span>
                <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
              </label>
              <p className="text-xs text-muted-foreground">Recomendado: 1200x400px para melhor visualização</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {error && <div className="rounded-lg bg-destructive/10 p-4 text-sm text-destructive">{error}</div>}

      <Button
        type="submit"
        size="lg"
        className="w-full bg-blue-farejei text-blue-farejei-foreground hover:bg-blue-farejei/90"
        disabled={isLoading}
      >
        {isLoading ? (
          <>
            <Loader2 className="h-5 w-5 animate-spin" />
            Criando anúncio...
          </>
        ) : (
          "Criar Anúncio"
        )}
      </Button>
    </form>
  )
}
