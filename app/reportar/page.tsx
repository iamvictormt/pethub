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
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-background to-blue-50">
      <div className="container mx-auto max-w-4xl px-4 py-16 md:py-24">
        <div className="mb-12 space-y-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-balance text-orange-alert">
            Reportar Pet
          </h1>
          <p className="text-lg text-muted-foreground text-pretty max-w-2xl mx-auto">
            Preencha as informações abaixo para ajudar a reunir pets com seus tutores. Quanto mais detalhes, maiores as
            chances de sucesso!
          </p>
        </div>

        <PetReportForm userId={user.id} />
      </div>
    </div>
  )
}
