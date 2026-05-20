import { useEffect, useState } from 'react'
import { serviceQueries } from '@/lib/queries'
import type { Service } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Plus, Trash2, Pencil, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

type Draft = Omit<Service, 'id' | 'created_at'>

const EMPTY: Draft = {
  name: '', description: '', price_from: 0,
  unit: null, icon: '🦷', active: true, order_index: 0,
}

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Services({ onSuccess, onError }: Props) {
  const [items, setItems]     = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Service | null>(null)
  const [draft, setDraft]     = useState<Draft>(EMPTY)
  const [saving, setSaving]   = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await serviceQueries.listAll()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setDraft(EMPTY); setModalOpen(true) }

  const openEdit = (s: Service) => {
    setEditing(s)
    setDraft({ name: s.name, description: s.description, price_from: s.price_from, unit: s.unit, icon: s.icon, active: s.active, order_index: s.order_index })
    setModalOpen(true)
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const handleSave = async () => {
    if (!draft.name || !draft.description) { onError('Nome e descrição são obrigatórios.'); return }
    setSaving(true)
    const payload = { ...draft, price_from: Number(draft.price_from) }
    const { error } = editing
      ? await serviceQueries.update(editing.id, payload)
      : await serviceQueries.create(payload)
    setSaving(false)
    if (error) { onError('Erro ao salvar serviço.'); return }
    setModalOpen(false)
    onSuccess(editing ? 'Serviço atualizado!' : 'Serviço criado!')
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este serviço?')) return
    const { error } = await serviceQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Serviço removido.')
    setItems(p => p.filter(i => i.id !== id))
  }

  const toggleActive = async (s: Service) => {
    await serviceQueries.update(s.id, { active: !s.active })
    setItems(p => p.map(i => i.id === s.id ? { ...i, active: !s.active } : i))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Serviços</h1>
          <p className="text-stone-muted text-sm mt-1">Gerencie os serviços exibidos no site.</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase hover:bg-gold hover:text-dark transition-all"
        >
          <Plus size={14} /> Novo
        </button>
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory">
                  {['Ícone','Serviço','Preço inicial','Status','Ordem','Ações'].map(h => (
                    <th key={h} className="px-5 py-3 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id} className="border-b border-ivory last:border-0 hover:bg-cream/30 transition-colors">
                    <td className="px-5 py-3.5 text-xl">{s.icon}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-dark">{s.name}</p>
                      <p className="text-xs text-stone-muted mt-0.5 line-clamp-1">{s.description}</p>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">
                      R$ {s.price_from.toLocaleString('pt-BR')}{s.unit ? ` / ${s.unit}` : ''}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={s.active ? 'active' : 'inactive'} label={s.active ? 'Ativo' : 'Inativo'} />
                    </td>
                    <td className="px-5 py-3.5 text-sm text-stone-muted">{s.order_index}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(s)} className="text-stone-muted hover:text-dark transition-colors">
                          <Pencil size={14} />
                        </button>
                        <button onClick={() => toggleActive(s)} className="text-stone-muted hover:text-gold transition-colors">
                          {s.active ? <ToggleRight size={18} className="text-teal-clinic" /> : <ToggleLeft size={18} />}
                        </button>
                        <button onClick={() => handleDelete(s.id)} className="text-stone-muted hover:text-red-400 transition-colors">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Serviço' : 'Novo Serviço'} size="md">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-4 gap-4">
            <Input label="Ícone (emoji)" value={draft.icon} onChange={e => set('icon', e.target.value)} className="text-center text-xl" />
            <div className="col-span-3">
              <Input label="Nome *" placeholder="Ex: Clareamento Dental" value={draft.name} onChange={e => set('name', e.target.value)} />
            </div>
          </div>
          <Textarea label="Descrição *" placeholder="Descrição do serviço..." value={draft.description} onChange={e => set('description', e.target.value)} />
          <div className="grid grid-cols-3 gap-4">
            <Input label="Preço (R$)" type="number" min="0" value={String(draft.price_from)} onChange={e => set('price_from', Number(e.target.value) as unknown as Draft['price_from'])} />
            <Input label="Unidade" placeholder="por dente, por mês..." value={draft.unit ?? ''} onChange={e => set('unit', e.target.value || null as unknown as string)} />
            <Input label="Ordem" type="number" min="0" value={String(draft.order_index)} onChange={e => set('order_index', Number(e.target.value) as unknown as Draft['order_index'])} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={e => set('active', e.target.checked as unknown as Draft['active'])}
              className="w-4 h-4 accent-gold"
            />
            <span className="text-sm text-dark">Serviço ativo (visível no site)</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={() => setModalOpen(false)} className="px-5 py-2.5 border border-ivory rounded-sm text-sm text-stone-muted hover:border-stone-muted transition-colors">
            Cancelar
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-dark text-cream px-6 py-2.5 rounded-sm text-sm hover:bg-gold hover:text-dark transition-all disabled:opacity-50"
          >
            {saving && <Loader2 size={14} className="animate-spin" />}
            Salvar
          </button>
        </div>
      </Modal>
    </div>
  )
}
