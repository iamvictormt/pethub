"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
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
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showReunitedDialog, setShowReunitedDialog] = useState(false)

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
    setIsLoading(true)
    try {
      const { error } = await supabase.from("pets").update({ status: "REUNITED" }).eq("id", pet.id)

      if (error) throw error

      router.refresh()
      setShowReunitedDialog(false)
    } catch (err) {
      alert("Erro ao atualizar status do pet")
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async () => {
    setIsLoading(true)
    try {
      const { error } = await supabase.from("pets").delete().eq("id", pet.id)

      if (error) throw error

      router.push("/")
      router.refresh()
      setShowDeleteDialog(false)
    } catch (err) {
      alert("Erro ao excluir reporte")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
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
                onClick={() => setShowReunitedDialog(true)}
                disabled={isLoading}
                className="w-full justify-start bg-purple-500/95 hover:bg-purple-600"
                size="lg"
              >
                <CheckCircle className="h-5 w-5" />
                Marcar como Reunido
              </Button>
            )}

            {isOwner && (
              <>
                <Button
                  onClick={() => router.push(`/editar-pet/${pet.id}`)}
                  variant="outline"
                  className="w-full justify-start bg-transparent"
                  size="lg"
                >
                  <Edit className="h-5 w-5" />
                  Editar Reporte
                </Button>

                <Button
                  onClick={() => setShowDeleteDialog(true)}
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

      <AlertDialog open={showReunitedDialog} onOpenChange={setShowReunitedDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Marcar como Reunido?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja marcar {pet.name} como reunido? Esta ação irá atualizar o status do pet e
              notificar que ele foi reencontrado com seu tutor.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleMarkAsReunited}
              disabled={isLoading}
              className="bg-purple-500/95 hover:bg-purple-600"
            >
              {isLoading ? "Atualizando..." : "Confirmar"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Excluir Reporte?</AlertDialogTitle>
            <AlertDialogDescription>
              Tem certeza que deseja excluir este reporte? Esta ação não pode ser desfeita e todos os dados, incluindo
              comentários e fotos, serão permanentemente removidos.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isLoading}>Cancelar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Excluindo..." : "Excluir"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
