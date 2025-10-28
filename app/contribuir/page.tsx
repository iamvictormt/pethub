import ContribuirContent from "@/components/contributions/contribuir-content"
import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"

export default async function ContribuirPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const [totalAmountResult, contributorsResult] = await Promise.all([
    supabase.from("contributions").select("amount_in_cents").eq("status", "completed"),
    supabase.from("contributions").select("user_id").eq("status", "completed"),
  ])

  const totalAmountCents = totalAmountResult.data?.reduce((sum, c) => sum + (c.amount_in_cents || 0), 0) || 0
  const totalAmount = totalAmountCents / 100 // Convert cents to reais
  const uniqueContributors = new Set(contributorsResult.data?.map((c) => c.user_id) || []).size

  return <ContribuirContent totalAmount={totalAmount} uniqueContributors={uniqueContributors} isLogged={user != null} />
}
