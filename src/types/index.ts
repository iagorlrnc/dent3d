// ─── Database row types (mirror Supabase tables) ─────────────────────────────

export type Appointment = {
  id: string
  patient_name: string
  phone: string
  email: string | null
  service: string
  dentist: string
  date: string // ISO date string YYYY-MM-DD
  time: string // HH:MM
  status: "confirmado" | "aguardando" | "cancelado"
  notes: string | null
  created_at: string
}

export type Patient = {
  id: string
  name: string
  phone: string
  email: string | null
  birth_date: string | null
  notes: string | null
  created_at: string
}

export type Service = {
  id: string
  name: string
  description: string
  active: boolean
  order_index: number
  image_url?: string | null // custom uploaded service image URL
  created_at: string
}

export type Specialist = {
  id: string
  name: string
  specialty: string
  cro: string | null
  image_url?: string | null
  active: boolean
  order_index: number
  created_at: string
}

export type BeforeAfter = {
  id: string
  title: string
  category: string
  before_url: string
  after_url: string
  active: boolean
  order_index: number
  created_at: string
}

export type Testimonial = {
  id: string
  patient_name: string
  rating: number
  text: string
  status: "pending" | "approved" | "rejected"
  created_at: string
}

export type ContactMessage = {
  id: string
  name: string
  phone: string
  email: string
  service: string | null
  message: string
  read: boolean
  created_at: string
}

export type ClinicSettings = {
  id: string
  clinic_name: string
  cro: string
  phone: string
  whatsapp: string
  email: string
  address: string
  hours: string
  updated_at: string
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string
  email: string
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

export type AppointmentStatus = Appointment["status"]
export type TestimonialStatus = Testimonial["status"]

export type NavItem = {
  label: string
  href: string
}

export type AdminNavItem = {
  id: string
  label: string
  icon: string
}
