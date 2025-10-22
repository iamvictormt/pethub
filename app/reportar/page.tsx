import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { PetReportForm } from "@/components/pet-report/pet-report-form"

export default async function ReportarPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  return (
    <div className="container mx-auto max-w-3xl px-4 py-8">
      <div className="mb-8 space-y-2">
        <h1 className="text-3xl font-bold text-balance">Reportar Pet</h1>
        <p className="text-muted-foreground text-pretty">
          Preencha as informações abaixo para ajudar a reunir pets com seus tutores
        </p>
      </div>

      <PetReportForm userId={user.id} />
    </div>
  )
}
