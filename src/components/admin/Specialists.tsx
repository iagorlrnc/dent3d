import { useEffect, useState } from 'react'
import { specialistQueries } from '@/lib/queries'
import type { Specialist } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Badge } from '@/components/ui/Badge'
import { Plus, Trash2, Pencil, Loader2, ToggleLeft, ToggleRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'

type Draft = Omit<Specialist, 'id' | 'created_at'>

const EMPTY: Draft = {
  name: '',
  specialty: '',
  cro: '',
  image_url: null,
  active: true,
  order_index: 0,
}

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Specialists({ onSuccess, onError }: Props) {
  const [items, setItems] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Specialist | null>(null)
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [saving, setSaving] = useState(false)
  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderedItems, setOrderedItems] = useState<Specialist[]>([])
  const [savingOrder, setSavingOrder] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await specialistQueries.listAll()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = <K extends keyof Draft>(key: K, value: Draft[K]) =>
    setDraft(current => ({ ...current, [key]: value }))

  const openNew = () => {
    setEditing(null)
    setDraft({ ...EMPTY, order_index: items.length })
    setModalOpen(true)
  }

  const openEdit = (item: Specialist) => {
    setEditing(item)
    setDraft({
      name: item.name,
      specialty: item.specialty,
      cro: item.cro ?? '',
      image_url: item.image_url ?? null,
      active: item.active,
      order_index: item.order_index,
    })
    setModalOpen(true)
  }

  const handleSave = async () => {
    if (!draft.name || !draft.specialty) {
      onError('Nome e especialidade são obrigatórios.')
      return
    }

    setSaving(true)
    const payload = { ...draft, cro: draft.cro?.trim() || null }
    const { error } = editing
      ? await specialistQueries.update(editing.id, payload)
      : await specialistQueries.create(payload)
    setSaving(false)

    if (error) {
      onError(`Erro ao salvar especialista: ${error.message || JSON.stringify(error)}`)
      return
    }

    setModalOpen(false)
    setEditing(null)
    setDraft(EMPTY)
    onSuccess(editing ? 'Especialista atualizado!' : 'Especialista criado!')
    load()
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este especialista?')) return
    const { error } = await specialistQueries.remove(id)
    if (error) {
      onError('Erro ao remover especialista.')
      return
    }
    onSuccess('Especialista removido.')
    setItems(current => current.filter(item => item.id !== id))
  }

  const toggleActive = async (item: Specialist) => {
    await specialistQueries.update(item.id, { active: !item.active })
    setItems(current => current.map(existing => existing.id === item.id ? { ...existing, active: !item.active } : existing))
  }

  const openOrderModal = () => {
    setOrderedItems([...items].sort((a, b) => a.order_index - b.order_index))
    setOrderModalOpen(true)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const next = [...orderedItems]
    const target = direction === 'up' ? index - 1 : index + 1
    if (target < 0 || target >= next.length) return
    const temp = next[index]
    next[index] = next[target]
    next[target] = temp
    setOrderedItems(next)
  }

  const handleSaveOrder = async () => {
    setSavingOrder(true)
    try {
      const results = await Promise.all(orderedItems.map((item, index) => specialistQueries.update(item.id, { order_index: index })))
      if (results.some(result => result.error)) {
        onError('Erro ao salvar a nova ordenação.')
      } else {
        onSuccess('Ordenação salva com sucesso!')
        setOrderModalOpen(false)
        load()
      }
    } catch (error) {
      console.error(error)
      onError('Erro inesperado ao salvar ordenação.')
    } finally {
      setSavingOrder(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Especialistas</h1>
          <p className="text-stone-muted text-sm mt-1">Gerencie a equipe exibida no site.</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={openOrderModal} className="flex items-center gap-2 border border-teal-clinic/20 text-teal-clinic px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-white/50 transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0">
            <ArrowUpDown size={14} /> Ordem
          </button>
          <button onClick={openNew} className="flex items-center gap-2 bg-teal-clinic text-cream px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0">
            <Plus size={14} /> Novo
          </button>
        </div>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-ivory/40 border-b border-gold/5">
                  {['Especialista', 'Status', 'Ações'].map(header => (
                    <th key={header} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold whitespace-nowrap">{header}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(item => (
                  <tr key={item.id} className="border-b border-gold/5 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-dark">{item.name}</p>
                      <p className="text-xs text-stone-muted mt-0.5 line-clamp-1">{item.specialty}</p>
                      <p className="text-[10px] text-stone-muted mt-1 uppercase tracking-[0.12em]">{item.cro || 'Sem registro'}</p>
                    </td>
                    <td className="px-5 py-3.5"><Badge status={item.active ? 'active' : 'inactive'} label={item.active ? 'Ativo' : 'Inativo'} /></td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(item)} className="text-stone-muted hover:text-dark transition-colors"><Pencil size={14} /></button>
                        <button onClick={() => toggleActive(item)} className="text-stone-muted hover:text-gold transition-colors">{item.active ? <ToggleRight size={18} className="text-teal-clinic" /> : <ToggleLeft size={18} />}</button>
                        <button onClick={() => handleDelete(item.id)} className="text-stone-muted hover:text-red-400 transition-colors"><Trash2 size={14} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Especialista' : 'Novo Especialista'} size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <Input label="Nome *" placeholder="Ex: Dra. Ana Ribeiro" value={draft.name} onChange={e => set('name', e.target.value)} />
          <Input label="Especialidade *" placeholder="Ex: Implantodontista" value={draft.specialty} onChange={e => set('specialty', e.target.value)} />
          <Input label="CRO/Registro" placeholder="Ex: CRO/SP 12345" value={draft.cro ?? ''} onChange={e => set('cro', e.target.value)} />
          <ImageUpload label="Imagem do especialista" value={draft.image_url || ''} onChange={url => set('image_url', url || null)} onError={onError} />
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked as Draft['active'])} className="w-4 h-4 rounded border-white/80 accent-teal-clinic" />
            <span className="text-sm text-dark font-sans">Especialista ativo (visível no site)</span>
          </label>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={() => setModalOpen(false)} className="px-6 py-2.5 border border-teal-clinic/20 rounded-full text-sm text-teal-clinic bg-white/40 hover:bg-white/75 hover:border-teal-clinic transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0">Cancelar</button>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
            {saving && <Loader2 size={14} className="animate-spin" />}
            Salvar
          </button>
        </div>
      </Modal>

      <Modal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="Ordenar Especialistas" size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-stone-muted mb-2">Use as setas para mover os itens para cima ou para baixo e definir a ordem de exibição no site.</p>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {orderedItems.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/60 border border-white/80 rounded-xl shadow-sm">
                <span className="text-sm font-medium text-dark">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button onClick={() => moveItem(idx, 'up')} disabled={idx === 0} className="p-1.5 rounded-lg border border-gold/10 hover:bg-white/80 text-stone-muted hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ArrowUp size={14} /></button>
                  <button onClick={() => moveItem(idx, 'down')} disabled={idx === orderedItems.length - 1} className="p-1.5 rounded-lg border border-gold/10 hover:bg-white/80 text-stone-muted hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent transition-all"><ArrowDown size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button onClick={() => setOrderModalOpen(false)} className="px-6 py-2.5 border border-teal-clinic/20 rounded-full text-sm text-teal-clinic bg-white/40 hover:bg-white/75 hover:border-teal-clinic transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0">Cancelar</button>
          <button onClick={handleSaveOrder} disabled={savingOrder} className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50">
            {savingOrder && <Loader2 size={14} className="animate-spin" />}
            Salvar ordem
          </button>
        </div>
      </Modal>
    </div>
  )
}