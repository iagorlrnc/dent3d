import { useEffect, useState } from 'react'
import { appointmentQueries } from '@/lib/queries'
import type { Appointment } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { Modal } from '@/components/ui/Modal'
import { Input, Select } from '@/components/ui/Input'
import { Plus, Trash2, Loader2 } from 'lucide-react'

const SERVICES = ['Clareamento Dental','Lentes de Contato','Implante Dentário','Ortodontia','Periodontia','Prevenção']
const DENTISTS = ['Dra. Ana Ribeiro','Dr. Carlos Mendes','Dra. Patrícia Lima','Dr. Rafael Costa']
const STATUSES = [
  { value: 'confirmado', label: 'Confirmado' },
  { value: 'aguardando', label: 'Aguardando' },
  { value: 'cancelado',  label: 'Cancelado' },
]

type Draft = Omit<Appointment, 'id' | 'created_at'>

const EMPTY_DRAFT: Draft = {
  patient_name: '', phone: '', email: null,
  service: SERVICES[0], dentist: DENTISTS[0],
  date: '', time: '', status: 'aguardando', notes: null,
}

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Appointments({ onSuccess, onError }: Props) {
  const [items, setItems]   = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft]   = useState<Draft>(EMPTY_DRAFT)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await appointmentQueries.list()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (k: keyof Draft, v: string) => setDraft(d => ({ ...d, [k]: v || null }))

  const handleSave = async () => {
    if (!draft.patient_name || !draft.date || !draft.time) {
      onError('Preencha nome, data e horário.')
      return
    }
    setSaving(true)
    const { error } = await appointmentQueries.create(draft)
    setSaving(false)
    if (error) { onError('Erro ao salvar agendamento.'); return }
    setModalOpen(false)
    setDraft(EMPTY_DRAFT)
    onSuccess('Agendamento criado com sucesso!')
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este agendamento?')) return
    const { error } = await appointmentQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Agendamento removido.')
    setItems(prev => prev.filter(i => i.id !== id))
  }

  const handleStatusChange = async (id: string, status: Appointment['status']) => {
    await appointmentQueries.update(id, { status })
    setItems(prev => prev.map(i => i.id === id ? { ...i, status } : i))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Agendamentos</h1>
          <p className="text-stone-muted text-sm mt-1">Gerencie todas as consultas e horários.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={14} /> Novo
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-stone-muted text-sm">Nenhum agendamento encontrado.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory/40 border-b border-gold/5">
                  {['Paciente','Procedimento','Data','Horário','Dr(a).','Alterar Status','Status','Ações'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(apt => (
                  <tr key={apt.id} className="border-b border-gold/5 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm text-dark font-medium">{apt.patient_name}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">{apt.service}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted whitespace-nowrap">
                      {new Date(apt.date).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">{apt.time}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted whitespace-nowrap">{apt.dentist}</td>
                    <td className="px-5 py-3.5">
                      <select
                        value={apt.status}
                        onChange={e => handleStatusChange(apt.id, e.target.value as Appointment['status'])}
                        className="text-xs border border-white/60 bg-white/40 backdrop-blur-sm rounded-full px-3 py-1 focus:outline-none focus:border-teal-clinic cursor-pointer font-medium text-stone-muted hover:text-dark transition-all duration-300"
                      >
                        {STATUSES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                      </select>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={apt.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(apt.id)}
                        className="text-stone-muted hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Agendamento" size="lg" variant="solid-light">
        <div className="grid grid-cols-2 gap-4">
          <Input label="Paciente *" placeholder="Nome completo" value={draft.patient_name} onChange={e => set('patient_name', e.target.value)} />
          <Input label="Telefone *" placeholder="(00) 9 0000-0000" value={draft.phone} onChange={e => set('phone', e.target.value)} />
          <Input label="E-mail" type="email" placeholder="email@exemplo.com" value={draft.email ?? ''} onChange={e => set('email', e.target.value)} />
          <Input label="Data *" type="date" value={draft.date} onChange={e => set('date', e.target.value)} />
          <Input label="Horário *" type="time" value={draft.time} onChange={e => set('time', e.target.value)} />
          <Select label="Procedimento" value={draft.service} onChange={e => set('service', e.target.value)} options={SERVICES.map(s => ({ value: s, label: s }))} />
          <Select label="Dentista" value={draft.dentist} onChange={e => set('dentist', e.target.value)} options={DENTISTS.map(d => ({ value: d, label: d }))} />
          <Select label="Status" value={draft.status} onChange={e => set('status', e.target.value)} options={STATUSES} />
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setModalOpen(false)}
            className="px-6 py-2.5 border border-teal-clinic/20 rounded-full text-sm text-teal-clinic bg-white/40 hover:bg-white/75 hover:border-teal-clinic transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  )
}
