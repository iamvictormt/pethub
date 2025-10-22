"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Share2, Flag, CheckCircle, Trash2, Edit } from "lucide-react"
import type { Pet } from "@/lib/types/database"
import { createClient } from "@/lib/supabase/client"

interface PetActionsProps {
  pet: Pet
  isOwner: boolean
  userId?: string
}

export function PetActions({ pet, isOwner, userId }: PetActionsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [isLoading, setIsLoading] = useState(false)

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${pet.name} - ${pet.status === "LOST" ? "Pet Perdido" : "Pet Encontrado"}`,
          text: `Ajude a ${pet.status === "LOST" ? "encontrar" : "devolver"} ${pet.name}!`,
          url: window.location.href,
        })
      } catch (err) {
        console.error("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      alert("Link copiado para a área de transferência!")
    }
  }

  const handleMarkAsReunited = async () => {
    if (!confirm("Tem certeza que deseja marcar este pet como devolvido?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("pets").update({ status: "REUNITED" }).eq("id", pet.id)

      if (error) throw error

      router.refresh()
    } catch (err) {
      alert("Erro ao atualizar status do pet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm("Tem certeza que deseja excluir este reporte?")) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("pets").delete().eq("id", pet.id)

      if (error) throw error

      router.push("/")
      router.refresh()
    } catch (err) {
      alert("Erro ao excluir reporte")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="space-y-3 p-4">
          <Button onClick={handleShare} variant="outline" className="w-full justify-start bg-transparent" size="lg">
            <Share2 className="h-5 w-5" />
            Compartilhar
          </Button>

          {!userId && (
            <Button asChild variant="outline" className="w-full justify-start bg-transparent" size="lg">
              <a href="/auth/login">
                <Flag className="h-5 w-5" />
                Fazer Login para Comentar
              </a>
            </Button>
          )}

          {isOwner && pet.status !== "REUNITED" && (
            <Button
              onClick={handleMarkAsReunited}
              disabled={isLoading}
              className="w-full justify-start bg-green-found text-green-found-foreground hover:bg-green-found/90"
              size="lg"
            >
              <CheckCircle className="h-5 w-5" />
              Marcar como Devolvido
            </Button>
          )}

          {isOwner && (
            <>
              <Button variant="outline" className="w-full justify-start bg-transparent" size="lg">
                <Edit className="h-5 w-5" />
                Editar Reporte
              </Button>

              <Button
                onClick={handleDelete}
                disabled={isLoading}
                variant="destructive"
                className="w-full justify-start"
                size="lg"
              >
                <Trash2 className="h-5 w-5" />
                Excluir Reporte
              </Button>
            </>
          )}
        </CardContent>
      </Card>

      {/* Safety Tips */}
      <Card>
        <CardContent className="space-y-2 p-4">
          <h3 className="font-semibold">Dicas de Segurança</h3>
          <ul className="space-y-1 text-sm text-muted-foreground">
            <li>• Sempre encontre em local público</li>
            <li>• Peça documentos do pet</li>
            <li>• Verifique microchip se possível</li>
            <li>• Não compartilhe dados pessoais</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}
