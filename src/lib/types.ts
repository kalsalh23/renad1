export type Role = 'customer' | 'admin'

export interface Profile {
  id: string
  email: string | null
  full_name: string | null
  phone: string | null
  role: Role
  created_at: string
}

export interface Category {
  id: string
  slug: string
  name_ar: string
  name_en: string | null
  image_url: string | null
  description: string | null
  sort_order: number
  created_at: string
}

export type DressStatus = 'available' | 'reserved' | 'rented' | 'unavailable' | 'sold'
export type Availability = 'sale' | 'rent' | 'both'

export interface Dress {
  id: string
  code: string
  slug: string
  name_ar: string
  name_en: string | null
  description: string | null
  category_id: string | null
  design_type: string | null
  sizes: string[]
  colors: string[]
  fabric: string | null
  sale_price: number | null
  rent_price: number | null
  availability: Availability
  status: DressStatus
  cover_image: string | null
  is_featured: boolean
  discount_percent: number
  sort_order: number
  is_active: boolean
  created_at: string
  updated_at: string
  category?: Category | null
}

export interface DressImage {
  id: string
  dress_id: string
  url: string
  alt: string | null
  sort_order: number
  created_at: string
}

export type AppointmentStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled'

export interface Appointment {
  id: string
  user_id: string | null
  customer_name: string
  phone: string
  email: string | null
  dress_id: string | null
  dress_code: string | null
  appointment_date: string
  appointment_time: string
  companions: number
  notes: string | null
  status: AppointmentStatus
  admin_note: string | null
  created_at: string
  updated_at: string
  dress?: { code: string; name_ar: string; slug: string; cover_image: string | null } | null
}

export interface WorkingHour {
  day: string
  open?: string
  close?: string
  closed?: boolean
}

export interface BusinessSettings {
  id: number
  brand_name_ar: string
  brand_name_en: string
  tagline: string
  phone: string | null
  whatsapp_number: string | null
  email: string | null
  instagram_url: string | null
  facebook_url: string | null
  address: string | null
  maps_url: string | null
  working_hours: WorkingHour[]
  hero_image: string | null
  hero_title: string
  hero_subtitle: string
  about_body: string | null
  updated_at: string
}

export interface Notification {
  id: string
  audience: 'admin' | 'customer'
  user_id: string | null
  title: string
  body: string | null
  link: string | null
  appointment_id: string | null
  is_read: boolean
  created_at: string
}
