import { useEffect, useState } from 'react'
import { appointmentQueries, patientQueries, contactQueries, testimonialQueries } from '@/lib/queries'
import type { Appointment } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Calendar, Users, MessageSquare, Star } from 'lucide-react'

interface Stats {
  todayCount: number
  patientsCount: number
  unreadMessages: number
  pendingTestimonials: number
}

export function Dashboard() {
  const [todayAppointments, setTodayAppointments] = useState<Appointment[]>([])
  const [stats, setStats] = useState<Stats>({ todayCount: 0, patientsCount: 0, unreadMessages: 0, pendingTestimonials: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      const [apptRes, patientsRes, messagesRes, testimonialsRes] = await Promise.all([
        appointmentQueries.today(),
        patientQueries.list(),
        contactQueries.list(),
        testimonialQueries.listPending(),
      ])
      const today = apptRes.data ?? []
      const patients = patientsRes.data ?? []
      const messages = messagesRes.data ?? []
      const testimonials = testimonialsRes.data ?? []

      setTodayAppointments(today)
      setStats({
        todayCount: today.length,
        patientsCount: patients.length,
        unreadMessages: messages.filter(m => !m.read).length,
        pendingTestimonials: testimonials.length,
      })
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Consultas Hoje',      value: stats.todayCount,           icon: Calendar,      color: 'border-gold' },
    { label: 'Pacientes Ativos',    value: stats.patientsCount,        icon: Users,         color: 'border-teal-clinic' },
    { label: 'Mensagens não lidas', value: stats.unreadMessages,       icon: MessageSquare, color: 'border-blue-400' },
    { label: 'Depoimentos Pendentes', value: stats.pendingTestimonials, icon: Star,          color: 'border-amber-400' },
  ]

  if (loading) return (
    <div className="flex items-center justify-center h-48 text-stone-muted text-sm">
      Carregando...
    </div>
  )

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-dark">Dashboard</h1>
        <p className="text-stone-muted text-sm mt-1">
          Bem-vindo de volta! Aqui está o resumo de hoje.
        </p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
        {statCards.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className={`group/stat flex flex-col p-6 rounded-2xl bg-white/40 backdrop-blur-md border border-white/70 border-b-[3px] ${color} hover:bg-white/80 transition-all duration-300 shadow-[0_8px_30px_rgb(26,22,18,0.02)] hover:shadow-md hover:-translate-y-0.5`}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-4xl font-light text-dark group-hover/stat:text-teal-clinic transition-colors duration-300">{value}</div>
                <div className="text-[10px] tracking-[0.1em] uppercase text-stone-muted mt-2 font-medium font-sans">
                  {label}
                </div>
              </div>
              <div className="w-9 h-9 rounded-xl bg-teal-clinic/5 border border-teal-clinic/10 flex items-center justify-center transition-colors group-hover/stat:bg-teal-clinic/10">
                <Icon size={16} className="text-teal-clinic" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        <div className="px-6 py-5 border-b border-white/60 flex items-center justify-between">
          <h3 className="font-display text-xl font-light text-dark">Consultas de Hoje</h3>
          <span className="text-xs text-stone-muted font-medium bg-white/60 px-3 py-1 rounded-full border border-white/80 shadow-sm">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        {todayAppointments.length === 0 ? (
          <div className="px-6 py-12 text-center text-stone-muted text-sm font-light">
            Nenhuma consulta agendada para hoje.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory/40 border-b border-gold/5">
                  <th className="px-6 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold">Paciente</th>
                  <th className="px-6 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold">Procedimento</th>
                  <th className="px-6 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold">Horário</th>
                  <th className="px-6 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold">Dr(a).</th>
                  <th className="px-6 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map(apt => (
                  <tr key={apt.id} className="border-b border-gold/5 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="px-6 py-4 text-sm text-dark font-medium">{apt.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-stone-muted">{apt.service}</td>
                    <td className="px-6 py-4 text-sm text-stone-muted font-medium">{apt.time}</td>
                    <td className="px-6 py-4 text-sm text-stone-muted">{apt.dentist}</td>
                    <td className="px-6 py-4">
                      <Badge status={apt.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
