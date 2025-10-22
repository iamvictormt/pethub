import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { AdForm } from "@/components/ads/ad-form"

export default async function AnunciarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  // Check if user is a petshop
  const { data: profile } = await supabase.from("profiles").select("role").eq("id", user.id).single()

  if (profile?.role !== "PETSHOP") {
    redirect("/")
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-balance">Criar Anúncio</h1>
        <p className="text-muted-foreground text-pretty">Promova seus produtos e serviços para a comunidade PetHub</p>
      </div>

      <AdForm userId={user.id} />
    </div>
  )
}
