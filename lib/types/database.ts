export type PetStatus = "LOST" | "SIGHTED" | "RESCUED" | "REUNITED" | "ADOPTION"
export type UserRole = "USER" | "PETSHOP"
export type PetType = "DOG" | "CAT" | "BIRD" | "OTHER"

export interface Profile {
  id: string
  email: string
  name: string
  phone?: string
  state?: string
  city?: string
  bio?: string
  role: UserRole
  avatar_url?: string
  created_at: string
  updated_at: string
}

export interface Pet {
  id: string
  user_id: string
  name: string
  type: PetType
  breed?: string
  color?: string
  age?: number
  description?: string
  photo_url?: string
  photo_url_2?: string
  photo_url_3?: string
  photo_url_4?: string
  status: PetStatus
  latitude: number
  longitude: number
  location_description?: string
  contact_name: string
  contact_phone: string
  contact_email?: string
  last_seen_date?: string
  has_reward?: boolean
  reward_amount?: number
  created_at: string
  updated_at: string
  view_count?: number
  expiration_date?: string
}

export interface Advertisement {
  id: string
  petshop_id: string
  title: string
  description?: string
  image_url: string
  link_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Comment {
  id: string
  pet_id: string
  user_id: string
  content: string
  created_at: string
}
