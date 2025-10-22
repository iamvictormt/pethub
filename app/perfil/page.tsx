import { createClient } from "@/lib/supabase/server"
import { redirect } from "next/navigation"
import { ProfileContent } from "@/components/profile/profile-content"
import { PetshopProfile } from "@/components/profile/petshop-profile"

export default async function ProfilePage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/auth/login")
  }

  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  if (!profile) {
    redirect("/auth/login")
  }

  if (profile.role === "PETSHOP") {
    // Fetch advertisements for petshop users
    const { data: advertisements } = await supabase
      .from("advertisements")
      .select("*")
      .eq("petshop_id", user.id)
      .order("created_at", { ascending: false })

    return <PetshopProfile profile={profile} advertisements={advertisements || []} />
  } else {
    // Fetch pets for regular users
    const { data: pets } = await supabase
      .from("pets")
      .select("*")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })

    return <ProfileContent profile={profile} pets={pets || []} />
  }
}
