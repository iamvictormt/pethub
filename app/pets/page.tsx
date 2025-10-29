import { createClient } from "@/lib/supabase/server"
import { PetMapInterface } from "@/components/pet-map/pet-map-interface"

export default async function PetsPage() {
  const supabase = await createClient()

  const { data: pets } = await supabase
    .from("pets")
    .select("*")
    .in("status", ["LOST", "SIGHTED", "RESCUED", "ADOPTION"])
    .order("created_at", { ascending: false })

  return <PetMapInterface pets={pets || []} />
}
