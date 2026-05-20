import { useEffect, useState } from 'react'
import { serviceQueries } from '@/lib/queries'
import type { Service } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input, Textarea } from '@/components/ui/Input'
import { Plus, Trash2, Pencil, Loader2, ToggleLeft, ToggleRight, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { ImageUpload } from '@/components/ui/ImageUpload'

type Draft = Omit<Service, 'id' | 'created_at'>

const EMPTY: Draft = {
  name: '', description: '', active: true, order_index: 0,
  image_url: null,
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

  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderedItems, setOrderedItems] = useState<Service[]>([])
  const [savingOrder, setSavingOrder] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await serviceQueries.listAll()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const openNew = () => { setEditing(null); setDraft({ ...EMPTY, order_index: items.length }); setModalOpen(true) }

  const openEdit = (s: Service) => {
    setEditing(s)
    setDraft({
      name: s.name,
      description: s.description,
      active: s.active,
      order_index: s.order_index,
      image_url: s.image_url ?? null
    })
    setModalOpen(true)
  }

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) =>
    setDraft(d => ({ ...d, [k]: v }))

  const handleSave = async () => {
    if (!draft.name || !draft.description) { onError('Nome e descrição são obrigatórios.'); return }
    setSaving(true)
    const { error } = editing
      ? await serviceQueries.update(editing.id, draft)
      : await serviceQueries.create(draft)
    setSaving(false)
    if (error) {
      console.error('Erro ao salvar serviço:', error)
      onError(`Erro ao salvar serviço: ${error.message || JSON.stringify(error)}`)
      return
    }
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

  const openOrderModal = () => {
    const sorted = [...items].sort((a, b) => a.order_index - b.order_index)
    setOrderedItems(sorted)
    setOrderModalOpen(true)
  }

  const moveItem = (index: number, direction: 'up' | 'down') => {
    const newItems = [...orderedItems]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    if (targetIndex < 0 || targetIndex >= newItems.length) return
    const temp = newItems[index]
    newItems[index] = newItems[targetIndex]
    newItems[targetIndex] = temp
    setOrderedItems(newItems)
  }

  const handleSaveOrder = async () => {
    setSavingOrder(true)
    try {
      const promises = orderedItems.map((item, idx) =>
        serviceQueries.update(item.id, { order_index: idx })
      )
      const results = await Promise.all(promises)
      const hasError = results.some(r => r.error)
      if (hasError) {
        onError('Erro ao salvar a nova ordenação.')
      } else {
        onSuccess('Ordenação salva com sucesso!')
        setOrderModalOpen(false)
        load()
      }
    } catch (e) {
      console.error(e)
      onError('Erro inesperado ao salvar ordenação.')
    } finally {
      setSavingOrder(false)
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Serviços</h1>
          <p className="text-stone-muted text-sm mt-1">Gerencie os serviços exibidos no site.</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={openOrderModal}
            className="flex items-center gap-2 border border-teal-clinic/20 text-teal-clinic px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-white/50 transition-all duration-300 shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            <ArrowUpDown size={14} /> Ordem
          </button>
          <button
            onClick={openNew}
            className="flex items-center gap-2 bg-teal-clinic text-cream px-5 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
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
                  {['Serviço','Status','Ações'].map(h => (
                    <th key={h} className="px-5 py-3.5 text-left text-[10px] tracking-[0.15em] uppercase text-stone-muted font-semibold whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {items.map(s => (
                  <tr key={s.id} className="border-b border-gold/5 last:border-0 hover:bg-white/50 transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-sm font-medium text-dark">{s.name}</p>
                      <p className="text-xs text-stone-muted mt-0.5 line-clamp-1">{s.description}</p>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge status={s.active ? 'active' : 'inactive'} label={s.active ? 'Ativo' : 'Inativo'} />
                    </td>
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

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Serviço' : 'Novo Serviço'} size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <Input label="Nome *" placeholder="Ex: Clareamento Dental" value={draft.name} onChange={e => set('name', e.target.value)} />
          <Textarea label="Descrição *" placeholder="Descrição do serviço..." value={draft.description} onChange={e => set('description', e.target.value)} />
          
          <ImageUpload
            label="Imagem do Serviço"
            value={draft.image_url || ''}
            onChange={url => set('image_url', url || null)}
            onError={onError}
          />
          
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input
              type="checkbox"
              checked={draft.active}
              onChange={e => set('active', e.target.checked as unknown as Draft['active'])}
              className="w-4 h-4 rounded border-white/80 accent-teal-clinic"
            />
            <span className="text-sm text-dark font-sans">Serviço ativo (visível no site)</span>
          </label>
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

      <Modal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="Ordenar Serviços" size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-stone-muted mb-2">Use as setas para mover os itens para cima ou para baixo e definir a ordem de exibição no site.</p>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {orderedItems.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/60 border border-white/80 rounded-xl shadow-sm">
                <span className="text-sm font-medium text-dark">{item.name}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => moveItem(idx, 'up')}
                    disabled={idx === 0}
                    className="p-1.5 rounded-lg border border-gold/10 hover:bg-white/80 text-stone-muted hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ArrowUp size={14} />
                  </button>
                  <button
                    onClick={() => moveItem(idx, 'down')}
                    disabled={idx === orderedItems.length - 1}
                    className="p-1.5 rounded-lg border border-gold/10 hover:bg-white/80 text-stone-muted hover:text-dark disabled:opacity-30 disabled:hover:bg-transparent transition-all"
                  >
                    <ArrowDown size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 mt-8">
          <button
            onClick={() => setOrderModalOpen(false)}
            className="px-6 py-2.5 border border-teal-clinic/20 rounded-full text-sm text-teal-clinic bg-white/40 hover:bg-white/75 hover:border-teal-clinic transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveOrder}
            disabled={savingOrder}
            className="flex items-center gap-2 bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-sm font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {savingOrder && <Loader2 size={14} className="animate-spin" />}
            Salvar Ordem
          </button>
        </div>
      </Modal>
    </div>
  )
}
