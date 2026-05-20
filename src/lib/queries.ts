import { supabase } from './supabase'
import type {
  Appointment,
  Patient,
  Service,
  BeforeAfter,
  Testimonial,
  ContactMessage,
  ClinicSettings,
} from '@/types'

// ─── Auth ────────────────────────────────────────────────────────────────────

export const authQueries = {
  signIn: (email: string, password: string) =>
    supabase.auth.signInWithPassword({ email, password }),

  signOut: () => supabase.auth.signOut(),

  getSession: () => supabase.auth.getSession(),

  onAuthStateChange: (cb: Parameters<typeof supabase.auth.onAuthStateChange>[0]) =>
    supabase.auth.onAuthStateChange(cb),
}

// ─── Appointments ─────────────────────────────────────────────────────────────

export const appointmentQueries = {
  list: () =>
    supabase
      .from('appointments')
      .select('*')
      .order('date', { ascending: true })
      .order('time', { ascending: true }),

  today: () => {
    const today = new Date().toISOString().split('T')[0]
    return supabase
      .from('appointments')
      .select('*')
      .eq('date', today)
      .order('time', { ascending: true })
  },

  create: (data: Omit<Appointment, 'id' | 'created_at'>) =>
    supabase.from('appointments').insert(data).select().single(),

  update: (id: string, data: Partial<Appointment>) =>
    supabase.from('appointments').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('appointments').delete().eq('id', id),
}

// ─── Patients ─────────────────────────────────────────────────────────────────

export const patientQueries = {
  list: () =>
    supabase.from('patients').select('*').order('name', { ascending: true }),

  search: (q: string) =>
    supabase
      .from('patients')
      .select('*')
      .ilike('name', `%${q}%`)
      .order('name', { ascending: true }),

  create: (data: Omit<Patient, 'id' | 'created_at'>) =>
    supabase.from('patients').insert(data).select().single(),

  update: (id: string, data: Partial<Patient>) =>
    supabase.from('patients').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('patients').delete().eq('id', id),
}

// ─── Services ────────────────────────────────────────────────────────────────

export const serviceQueries = {
  listAll: () =>
    supabase.from('services').select('*').order('order_index', { ascending: true }),

  listActive: () =>
    supabase
      .from('services')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true }),

  create: (data: Omit<Service, 'id' | 'created_at'>) =>
    supabase.from('services').insert(data).select().single(),

  update: (id: string, data: Partial<Service>) =>
    supabase.from('services').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('services').delete().eq('id', id),
}

// ─── Before / After ───────────────────────────────────────────────────────────

export const beforeAfterQueries = {
  listAll: () =>
    supabase.from('before_after').select('*').order('order_index', { ascending: true }),

  listActive: () =>
    supabase
      .from('before_after')
      .select('*')
      .eq('active', true)
      .order('order_index', { ascending: true }),

  create: (data: Omit<BeforeAfter, 'id' | 'created_at'>) =>
    supabase.from('before_after').insert(data).select().single(),

  update: (id: string, data: Partial<BeforeAfter>) =>
    supabase.from('before_after').update(data).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('before_after').delete().eq('id', id),
}

// ─── Testimonials ────────────────────────────────────────────────────────────

export const testimonialQueries = {
  listAll: () =>
    supabase
      .from('testimonials')
      .select('*')
      .order('created_at', { ascending: false }),

  listApproved: () =>
    supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'approved')
      .order('created_at', { ascending: false }),

  listPending: () =>
    supabase
      .from('testimonials')
      .select('*')
      .eq('status', 'pending')
      .order('created_at', { ascending: false }),

  create: (data: Omit<Testimonial, 'id' | 'created_at'>) =>
    supabase.from('testimonials').insert(data).select().single(),

  updateStatus: (id: string, status: Testimonial['status']) =>
    supabase.from('testimonials').update({ status }).eq('id', id).select().single(),

  remove: (id: string) =>
    supabase.from('testimonials').delete().eq('id', id),
}

// ─── Contact Messages ─────────────────────────────────────────────────────────

export const contactQueries = {
  list: () =>
    supabase
      .from('contact_messages')
      .select('*')
      .order('created_at', { ascending: false }),

  create: (data: Omit<ContactMessage, 'id' | 'created_at' | 'read'>) =>
    supabase.from('contact_messages').insert(data).select().single(),

  markRead: (id: string) =>
    supabase.from('contact_messages').update({ read: true }).eq('id', id),

  remove: (id: string) =>
    supabase.from('contact_messages').delete().eq('id', id),
}

// ─── Clinic Settings ──────────────────────────────────────────────────────────

export const settingsQueries = {
  get: () =>
    supabase.from('clinic_settings').select('*').single(),

  update: (id: string, data: Partial<ClinicSettings>) =>
    supabase
      .from('clinic_settings')
      .update({ ...data, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single(),
}
