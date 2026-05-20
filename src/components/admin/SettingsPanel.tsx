import { useEffect, useState } from 'react'
import { settingsQueries } from '@/lib/queries'
import type { ClinicSettings } from '@/types'
import { Input, Textarea } from '@/components/ui/Input'
import { Loader2, Save } from 'lucide-react'

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

type Draft = Omit<ClinicSettings, 'id' | 'updated_at'>

const EMPTY_SETTINGS: Draft = {
  clinic_name: 'Sorrir Clinic',
  cro: 'CRO-SP 12345',
  phone: '(11) 9 9999-9999',
  whatsapp: '(11) 9 9999-9999',
  email: 'contato@sorrirclinic.com.br',
  address: 'Rua das Flores, 1250 — Sala 301, Centro, São Paulo — SP',
  hours: 'Segunda a Sexta: 8h às 18h | Sábados: 8h às 13h',
}

export function SettingsPanel({ onSuccess, onError }: Props) {
  const [settingsId, setSettingsId] = useState<string | null>(null)
  const [draft, setDraft]           = useState<Draft | null>(null)
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
          setLoading(false)
          return
        }
      } catch (err) {
        // Fallback to defaults
      }
      setDraft(EMPTY_SETTINGS)
      setLoading(false)
    }
    load()
  }, [])

  const set = (k: keyof Draft, v: string) =>
    setDraft(d => d ? { ...d, [k]: v } : d)

  const handleSave = async () => {
    if (!draft) return
    setSaving(true)
    const payload = settingsId ? { id: settingsId, ...draft } : draft
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
          <h3 className="font-display text-xl font-light text-dark">Informações da Clínica</h3>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
          <Input
            label="Nome da Clínica"
            value={draft.clinic_name}
            onChange={e => set('clinic_name', e.target.value)}
          />
          <Input
            label="CRO"
            value={draft.cro}
            onChange={e => set('cro', e.target.value)}
          />
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
          <div className="md:col-span-2">
            <Textarea
              label="Horário de Atendimento"
              value={draft.hours}
              onChange={e => set('hours', e.target.value)}
              rows={2}
            />
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
