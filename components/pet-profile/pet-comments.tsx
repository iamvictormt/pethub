"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { User, Send } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { Comment } from "@/lib/types/database"

interface PetCommentsProps {
  petId: string
  comments: (Comment & {
    profiles: {
      id: string
      name: string
      avatar_url?: string
    }
  })[]
  userId?: string
}

export function PetComments({ petId, comments, userId }: PetCommentsProps) {
  const router = useRouter()
  const supabase = createClient()
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userId || !newComment.trim()) return

    setIsLoading(true)
    try {
      const { error } = await supabase.from("comments").insert({
        pet_id: petId,
        user_id: userId,
        content: newComment.trim(),
      })

      if (error) throw error

      setNewComment("")
      router.refresh()
    } catch (err) {
      alert("Erro ao enviar comentário")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Card>
      <CardContent className="space-y-6 p-6">
        <h2 className="text-xl font-semibold">Comentários ({comments.length})</h2>

        {/* Comment Form */}
        {userId ? (
          <form onSubmit={handleSubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Adicione um comentário..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-xl border border-input bg-background px-4 py-3 text-sm outline-none ring-ring transition-colors placeholder:text-muted-foreground focus:border-ring focus:ring-2"
            />
            <Button
              type="submit"
              disabled={isLoading || !newComment.trim()}
              className="bg-orange-alert text-orange-alert-foreground hover:bg-orange-alert/90"
            >
              <Send className="h-5 w-5" />
            </Button>
          </form>
        ) : (
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center text-sm text-muted-foreground">
            <a href="/auth/login" className="font-medium text-orange-alert hover:underline">
              Faça login
            </a>{" "}
            para comentar
          </div>
        )}

        {/* Comments List */}
        <div className="space-y-4">
          {comments.length === 0 ? (
            <p className="text-center text-muted-foreground">Nenhum comentário ainda. Seja o primeiro!</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.id} className="flex gap-3">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-muted">
                  {comment.profiles.avatar_url ? (
                    <img
                      src={comment.profiles.avatar_url || "/placeholder.svg"}
                      alt={comment.profiles.name}
                      className="h-full w-full rounded-full object-cover"
                    />
                  ) : (
                    <User className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center gap-2">
                    <p className="font-medium">{comment.profiles.name}</p>
                    <span className="text-xs text-muted-foreground">
                      {new Date(comment.created_at).toLocaleDateString("pt-BR")}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">{comment.content}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  )
}
