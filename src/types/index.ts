// ─── Database row types (mirror Supabase tables) ─────────────────────────────

export interface Appointment {
  id: string
  patient_name: string
  phone: string
  email: string | null
  service: string
  dentist: string
  date: string        // ISO date string YYYY-MM-DD
  time: string        // HH:MM
  status: 'confirmado' | 'aguardando' | 'cancelado'
  notes: string | null
  created_at: string
}

export interface Patient {
  id: string
  name: string
  phone: string
  email: string | null
  birth_date: string | null
  notes: string | null
  created_at: string
}

export interface Service {
  id: string
  name: string
  description: string
  price_from: number
  unit: string | null   // e.g. "por dente", "por mês"
  icon: string
  active: boolean
  order_index: number
  created_at: string
}

export interface BeforeAfter {
  id: string
  title: string
  category: string
  before_url: string
  after_url: string
  active: boolean
  order_index: number
  created_at: string
}

export interface Testimonial {
  id: string
  patient_name: string
  rating: number
  text: string
  status: 'pending' | 'approved' | 'rejected'
  created_at: string
}

export interface ContactMessage {
  id: string
  name: string
  phone: string
  email: string
  service: string | null
  message: string
  read: boolean
  created_at: string
}

export interface ClinicSettings {
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

export interface AdminUser {
  id: string
  email: string
}

// ─── UI helpers ──────────────────────────────────────────────────────────────

export type AppointmentStatus = Appointment['status']
export type TestimonialStatus = Testimonial['status']

export interface NavItem {
  label: string
  href: string
}

export interface AdminNavItem {
  id: string
  label: string
  icon: string
}
