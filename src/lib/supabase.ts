import { createClient } from "@supabase/supabase-js"
import type {
  Appointment,
  Patient,
  Service,
  Specialist,
  BeforeAfter,
  Testimonial,
  ContactMessage,
  ClinicSettings,
} from "@/types"

// ─── Supabase Database type map ───────────────────────────────────────────────

export interface Database {
  public: {
    Tables: {
      appointments: {
        Row: Appointment
        Insert: Omit<Appointment, "id" | "created_at">
        Update: Partial<Omit<Appointment, "id" | "created_at">>
        Relationships: []
      }
      patients: {
        Row: Patient
        Insert: Omit<Patient, "id" | "created_at">
        Update: Partial<Omit<Patient, "id" | "created_at">>
        Relationships: []
      }
      services: {
        Row: Service
        Insert: Omit<Service, "id" | "created_at">
        Update: Partial<Omit<Service, "id" | "created_at">>
        Relationships: []
      }
      specialists: {
        Row: Specialist
        Insert: Omit<Specialist, "id" | "created_at">
        Update: Partial<Omit<Specialist, "id" | "created_at">>
        Relationships: []
      }
      before_after: {
        Row: BeforeAfter
        Insert: Omit<BeforeAfter, "id" | "created_at">
        Update: Partial<Omit<BeforeAfter, "id" | "created_at">>
        Relationships: []
      }
      testimonials: {
        Row: Testimonial
        Insert: Omit<Testimonial, "id" | "created_at">
        Update: Partial<Omit<Testimonial, "id" | "created_at">>
        Relationships: []
      }
      contact_messages: {
        Row: ContactMessage
        Insert: Omit<ContactMessage, "id" | "created_at" | "read">
        Update: Partial<Omit<ContactMessage, "id" | "created_at">>
        Relationships: []
      }
      clinic_settings: {
        Row: ClinicSettings
        Insert: Omit<ClinicSettings, "id" | "updated_at">
        Update: Partial<Omit<ClinicSettings, "id">>
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
  }
}

// ─── Client singleton ─────────────────────────────────────────────────────────

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "⚠️  Variáveis de ambiente Supabase não configuradas.\n" +
      "Crie um arquivo .env na raiz do projeto com:\n" +
      "  VITE_SUPABASE_URL=...\n" +
      "  VITE_SUPABASE_ANON_KEY=...",
  )
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)
