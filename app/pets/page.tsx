import { createClient } from "@/lib/supabase/server"
import { PetMapInterface } from "@/components/pet-map/pet-map-interface"

export default async function PetsPage() {

  return <PetMapInterface />
}
