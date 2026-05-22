import { useEffect, useState } from 'react'
import { settingsQueries } from '@/lib/queries'
import type { ClinicSettings } from '@/types'
import { Input } from '@/components/ui/Input'
import { Loader2, Save } from 'lucide-react'

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

type Draft = Omit<ClinicSettings, 'id' | 'updated_at'>

type Weekday = {
  key: string
  label: string
}

type ScheduleItem = {
  day: string
  open: boolean
  start: string
  end: string
}

const WEEKDAYS: Weekday[] = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
]

const DEFAULT_SCHEDULE: ScheduleItem[] = [
  { day: 'monday', open: true, start: '08:00', end: '18:00' },
  { day: 'tuesday', open: false, start: '08:00', end: '18:00' },
  { day: 'wednesday', open: false, start: '08:00', end: '18:00' },
  { day: 'thursday', open: false, start: '08:00', end: '18:00' },
  { day: 'friday', open: true, start: '08:00', end: '18:00' },
  { day: 'saturday', open: true, start: '08:00', end: '18:00' },
  { day: 'sunday', open: true, start: '08:00', end: '18:00' },
]

const EMPTY_SETTINGS: Draft = {
  clinic_name: 'Sorrir Clinic',
  cro: 'CRO-SP 12345',
  phone: '(11) 9 9999-9999',
  whatsapp: '(11) 9 9999-9999',
  email: 'contato@sorrirclinic.com.br',
  address: 'Rua das Flores, 1250 — Sala 301, Centro, São Paulo — SP',
  hours: 'Segunda a Sexta: 8h às 18h | Sábados: 8h às 13h',
}

function parseSchedule(value: string | null | undefined): ScheduleItem[] {
  if (!value) return DEFAULT_SCHEDULE

  try {
    const parsed = JSON.parse(value) as unknown
    if (Array.isArray(parsed)) {
      const normalized = parsed
        .filter((item): item is ScheduleItem => !!item && typeof item === 'object' && 'day' in item)
        .map(item => ({
          day: String(item.day),
          open: Boolean(item.open),
          start: typeof item.start === 'string' ? item.start : '08:00',
          end: typeof item.end === 'string' ? item.end : '18:00',
        }))

      if (normalized.length === WEEKDAYS.length) {
        return WEEKDAYS.map(day => normalized.find(item => item.day === day.key) ?? {
          day: day.key,
          open: false,
          start: '08:00',
          end: '18:00',
        })
      }
    }
  } catch {
    // Keep fallback schedule when hours is plain text.
  }

  return DEFAULT_SCHEDULE
}

function serializeSchedule(schedule: ScheduleItem[]): string {
  return JSON.stringify(schedule)
}

export function SettingsPanel({ onSuccess, onError }: Props) {
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [draft, setDraft]           = useState<Draft | null>(null)
  const [schedule, setSchedule]     = useState<ScheduleItem[]>(DEFAULT_SCHEDULE)
  const [loading, setLoading]       = useState(true)
  const [saving, setSaving]         = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const { data } = await settingsQueries.get()
        if (data) {
          setSettingsId(data.id)
          setDraft({
            clinic_name: data.clinic_name,
            cro: data.cro,
            phone: data.phone,
            whatsapp: data.whatsapp,
            email: data.email,
            address: data.address,
            hours: data.hours,
          })
          setSchedule(parseSchedule(data.hours))
          setLoading(false)
          return
        }
      } catch (err) {
        // Fallback to defaults
      }
      setDraft(EMPTY_SETTINGS)
      setSchedule(DEFAULT_SCHEDULE)
      setLoading(false)
    }
    load()
  }, [])

  const set = (k: keyof Draft, v: string) =>
    setDraft(d => d ? { ...d, [k]: v } : d)

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    const payload = settingsId
      ? { id: settingsId, ...draft, hours: serializeSchedule(schedule) }
      : { ...draft, hours: serializeSchedule(schedule) }
    const { data, error } = await settingsQueries.upsert(payload)
    setSaving(false)
    if (error) { onError('Erro ao salvar configurações.'); return }
    if (data) {
      setSettingsId(data.id)
    }
    onSuccess('Configurações salvas com sucesso!')
  }

  if (loading || !draft) {
    return (
      <div className="flex items-center justify-center py-20 text-stone-muted">
        <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-dark">Configurações</h1>
        <p className="text-stone-muted text-sm mt-1">Informações gerais exibidas no site.</p>
      </div>

      {/* Clinic info */}
      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-white/60">
          <h3 className="font-display text-xl font-light text-dark">Informações de Contato</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Telefone"
            value={draft.phone}
            onChange={e => set('phone', e.target.value)}
          />
          <Input
            label="WhatsApp"
            value={draft.whatsapp}
            onChange={e => set('whatsapp', e.target.value)}
          />
          <Input
            label="E-mail"
            type="email"
            value={draft.email}
            onChange={e => set('email', e.target.value)}
          />
          <Input
            label="Endereço"
            value={draft.address}
            onChange={e => set('address', e.target.value)}
          />
          <div className="md:col-span-2 mt-2 rounded-[28px] border border-white/70 bg-white/50 overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-white/60 bg-white/40">
              <h3 className="font-display text-lg font-light text-dark uppercase tracking-[0.08em]">Grade de horários</h3>
            </div>
            <div className="divide-y divide-white/70">
              {WEEKDAYS.map((weekday, index) => {
                const item = schedule[index]
                return (
                  <div key={weekday.key} className="flex items-center justify-between gap-4 px-5 py-4 flex-wrap md:flex-nowrap">
                    <label className="flex items-center gap-4 min-w-[180px]">
                      <input
                        type="checkbox"
                        checked={item.open}
                        onChange={e => setSchedule(current => current.map(currentItem => currentItem.day === weekday.key ? { ...currentItem, open: e.target.checked } : currentItem))}
                        className="w-5 h-5 rounded-full border-white/80 accent-teal-clinic"
                      />
                      <span className="text-sm font-semibold text-dark">{weekday.label}</span>
                    </label>

                    {item.open ? (
                      <div className="flex items-center gap-3 ml-auto">
                        <Input
                          type="time"
                          value={item.start}
                          onChange={e => setSchedule(current => current.map(currentItem => currentItem.day === weekday.key ? { ...currentItem, start: e.target.value } : currentItem))}
                          className="w-[120px] md:w-[136px] text-center bg-white border-white/70 rounded-2xl shadow-sm"
                        />
                        <span className="text-stone-muted text-lg">→</span>
                        <Input
                          type="time"
                          value={item.end}
                          onChange={e => setSchedule(current => current.map(currentItem => currentItem.day === weekday.key ? { ...currentItem, end: e.target.value } : currentItem))}
                          className="w-[120px] md:w-[136px] text-center bg-white border-white/70 rounded-2xl shadow-sm"
                        />
                      </div>
                    ) : (
                      <span className="ml-auto inline-flex items-center justify-center px-4 py-2 rounded-full border border-red-200 bg-red-50 text-red-400 text-[10px] tracking-[0.15em] uppercase font-semibold">
                        Fechado
                      </span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        </div>
        <div className="px-6 py-4.5 border-t border-white/60 bg-white/20 flex justify-end">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            {saving ? 'Salvando...' : 'Salvar Configurações'}
          </button>
        </div>
      </div>
    </div>
  )
}
