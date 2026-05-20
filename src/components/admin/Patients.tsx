import { useEffect, useState } from 'react'
import { patientQueries } from '@/lib/queries'
import type { Patient } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Plus, Trash2, Search, Loader2 } from 'lucide-react'

type Draft = Omit<Patient, 'id' | 'created_at'>

const EMPTY: Draft = { name: '', phone: '', email: null, birth_date: null, notes: null }

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Patients({ onSuccess, onError }: Props) {
  const [items, setItems]     = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [query, setQuery]     = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [draft, setDraft]     = useState<Draft>(EMPTY)
  const [saving, setSaving]   = useState(false)

  const load = async (q = '') => {
    setLoading(true)
    const { data } = q ? await patientQueries.search(q) : await patientQueries.list()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  useEffect(() => {
    const t = setTimeout(() => load(query), 350)
    return () => clearTimeout(t)
  }, [query])

  const set = (k: keyof Draft, v: string) =>
    setDraft(d => ({ ...d, [k]: v || null }))

  const handleSave = async () => {
    if (!draft.name || !draft.phone) { onError('Nome e telefone são obrigatórios.'); return }
    setSaving(true)
    const { error } = await patientQueries.create(draft)
    setSaving(false)
    if (error) { onError('Erro ao salvar paciente.'); return }
    setModalOpen(false)
    setDraft(EMPTY)
    onSuccess('Paciente cadastrado com sucesso!')
    load(query)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este paciente?')) return
    const { error } = await patientQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Paciente removido.')
    setItems(p => p.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Pacientes</h1>
          <p className="text-stone-muted text-sm mt-1">Cadastro e histórico de pacientes.</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
        >
          <Plus size={14} /> Novo
        </button>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        {/* Search bar */}
        <div className="px-6 py-4.5 border-b border-white/60 flex items-center gap-3 bg-white/20">
          <Search size={16} className="text-teal-clinic flex-shrink-0" />
          <input
            type="text"
            placeholder="Buscar paciente por nome..."
            value={query}
            onChange={e => setQuery(e.target.value)}
            className="flex-1 text-sm bg-transparent focus:outline-none placeholder:text-stone-muted/40 text-dark font-sans"
          />
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-stone-muted text-sm">
            {query ? 'Nenhum paciente encontrado para a busca.' : 'Nenhum paciente cadastrado.'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory/40 border-b border-gold/5">
                  {['Nome','Telefone','E-mail','Nascimento','Cadastro','Ações'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(p => (
                  <tr key={p.id} className="border-b border-gold/5 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="px-5 py-3.5 text-sm font-medium text-dark">{p.name}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">{p.phone}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">{p.email ?? '—'}</td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">
                      {p.birth_date ? new Date(p.birth_date).toLocaleDateString('pt-BR') : '—'}
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">
                      {new Date(p.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => handleDelete(p.id)}
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Paciente" size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <Input label="Nome *" placeholder="Nome completo" value={draft.name} onChange={e => set('name', e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Telefone *" placeholder="(00) 9 0000-0000" value={draft.phone} onChange={e => set('phone', e.target.value)} />
            <Input label="E-mail" type="email" placeholder="email@exemplo.com" value={draft.email ?? ''} onChange={e => set('email', e.target.value)} />
          </div>
          <Input label="Data de Nascimento" type="date" value={draft.birth_date ?? ''} onChange={e => set('birth_date', e.target.value)} />
          <Textarea label="Observações" placeholder="Notas internas sobre o paciente..." value={draft.notes ?? ''} onChange={e => set('notes', e.target.value)} />
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
