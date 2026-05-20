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
          <div key={label} className={`bg-white rounded-sm shadow-sm border-b-[3px] ${color} p-6`}>
            <div className="flex items-start justify-between">
              <div>
                <div className="font-display text-4xl font-light text-dark">{value}</div>
                <div className="text-[11px] tracking-[0.1em] uppercase text-stone--muted mt-1 text-stone-muted">
                  {label}
                </div>
              </div>
              <div className="w-9 h-9 rounded-full bg-ivory flex items-center justify-center">
                <Icon size={16} className="text-stone-muted" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Today's appointments */}
      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-ivory flex items-center justify-between">
          <h3 className="font-display text-xl font-light text-dark">Consultas de Hoje</h3>
          <span className="text-xs text-stone-muted">
            {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}
          </span>
        </div>
        {todayAppointments.length === 0 ? (
          <div className="px-6 py-10 text-center text-stone-muted text-sm">
            Nenhuma consulta agendada para hoje.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory">
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">Paciente</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">Procedimento</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">Horário</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">Dr(a).</th>
                  <th className="px-6 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">Status</th>
                </tr>
              </thead>
              <tbody>
                {todayAppointments.map(apt => (
                  <tr key={apt.id} className="border-b border-ivory last:border-0 hover:bg-cream/40 transition-colors">
                    <td className="px-6 py-4 text-sm text-dark">{apt.patient_name}</td>
                    <td className="px-6 py-4 text-sm text-stone-muted">{apt.service}</td>
                    <td className="px-6 py-4 text-sm text-stone-muted">{apt.time}</td>
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
