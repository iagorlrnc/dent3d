import { useEffect, useState } from 'react'
import { beforeAfterQueries } from '@/lib/queries'
import type { BeforeAfter } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { ImageUpload } from '@/components/ui/ImageUpload'
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight, ArrowUpDown, ArrowUp, ArrowDown, Pencil } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'

type Draft = Omit<BeforeAfter, 'id' | 'created_at'>

const EMPTY: Draft = {
  title: '', category: '', before_url: '',
  after_url: '', active: true, order_index: 0,
}

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Gallery({ onSuccess, onError }: Props) {
  const [items, setItems]     = useState<BeforeAfter[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<BeforeAfter | null>(null)
  const [draft, setDraft]     = useState<Draft>(EMPTY)
  const [saving, setSaving]   = useState(false)

  const [orderModalOpen, setOrderModalOpen] = useState(false)
  const [orderedItems, setOrderedItems] = useState<BeforeAfter[]>([])
  const [savingOrder, setSavingOrder] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await beforeAfterQueries.listAll()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const set = (k: keyof Draft, v: string | boolean | number) =>
    setDraft(d => ({ ...d, [k]: v }))

  const handleSave = async () => {
    if (!draft.title || !draft.category || !draft.before_url || !draft.after_url) {
      onError('Título, categoria e imagens (Antes/Depois) são obrigatórios.')
      return
    }
    setSaving(true)
    const { error } = editing
      ? await beforeAfterQueries.update(editing.id, draft)
      : await beforeAfterQueries.create(draft)
    setSaving(false)
    if (error) { onError('Erro ao salvar caso.'); return }
    setModalOpen(false)
    setDraft(EMPTY)
    setEditing(null)
    onSuccess(editing ? 'Caso atualizado com sucesso!' : 'Caso adicionado com sucesso!')
    load()
  }

  const openNew = () => {
    setEditing(null)
    setDraft({ ...EMPTY, order_index: items.length })
    setModalOpen(true)
  }

  const openEdit = (item: BeforeAfter) => {
    setEditing(item)
    setDraft({
      title: item.title,
      category: item.category,
      before_url: item.before_url,
      after_url: item.after_url,
      active: item.active,
      order_index: item.order_index,
    })
    setModalOpen(true)
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
        beforeAfterQueries.update(item.id, { order_index: idx })
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

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este caso?')) return
    const { error } = await beforeAfterQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Caso removido.')
    setItems(p => p.filter(i => i.id !== id))
  }

  const toggleActive = async (item: BeforeAfter) => {
    await beforeAfterQueries.update(item.id, { active: !item.active })
    setItems(p => p.map(i => i.id === item.id ? { ...i, active: !item.active } : i))
  }

  return (
    <div>
      <div className="flex items-start justify-between mb-8">
        <div>
          <h1 className="font-display text-3xl font-light text-dark">Galeria Antes/Depois</h1>
          <p className="text-stone-muted text-sm mt-1">Gerencie as imagens exibidas na seção de resultados.</p>
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
            <Plus size={14} /> Novo Caso
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-stone-muted">
          <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] py-16 text-center">
          <p className="text-stone-muted text-sm mb-4">Nenhum caso cadastrado ainda.</p>
          <button
            onClick={openNew}
            className="flex items-center gap-2 mx-auto bg-teal-clinic text-cream px-6 py-2.5 rounded-full text-xs tracking-widest uppercase font-semibold hover:bg-dark transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
          >
            <Plus size={14} /> Adicionar Primeiro Caso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(item => (
            <div key={item.id} className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
              {/* Preview row */}
              <div className="grid grid-cols-2 h-36">
                <div className="relative bg-dark-mid flex items-center justify-center overflow-hidden">
                  {item.before_url ? (
                    <img src={item.before_url} alt="Antes" className="w-full h-full object-cover opacity-70" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-cream/30">
                      <span className="text-3xl">😬</span>
                      <span className="text-[10px] tracking-widest uppercase">Antes</span>
                    </div>
                  )}
                  <span className="absolute top-3 left-3 bg-dark/70 text-cream text-[9px] tracking-widest uppercase px-2 py-1 rounded-md backdrop-blur-sm">
                    Antes
                  </span>
                </div>
                <div className="relative bg-ivory flex items-center justify-center overflow-hidden">
                  {item.after_url ? (
                    <img src={item.after_url} alt="Depois" className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-dark/30">
                      <span className="text-3xl">😁</span>
                      <span className="text-[10px] tracking-widest uppercase">Depois</span>
                    </div>
                  )}
                  <span className="absolute top-3 right-3 bg-teal-clinic/90 text-cream text-[9px] tracking-widest uppercase px-2 py-1 rounded-md backdrop-blur-sm">
                    Depois
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 flex items-center justify-between border-t border-white/60">
                <div>
                  <p className="text-sm font-medium text-dark">{item.title}</p>
                  <p className="text-xs text-stone-muted mt-0.5">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={item.active ? 'active' : 'inactive'} label={item.active ? 'Ativo' : 'Inativo'} />
                  <div className="flex items-center gap-2">
                    <button onClick={() => openEdit(item)} className="text-stone-muted hover:text-dark transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => toggleActive(item)} className="text-stone-muted hover:text-gold transition-colors">
                      {item.active ? <ToggleRight size={18} className="text-teal-clinic" /> : <ToggleLeft size={18} />}
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-stone-muted hover:text-red-400 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={openNew}
            className="h-full min-h-[200px] border-2 border-dashed border-teal-clinic/20 rounded-2xl flex flex-col items-center justify-center gap-3 text-stone-muted hover:border-teal-clinic/60 hover:text-teal-clinic hover:bg-white/10 transition-all duration-300"
          >
            <Plus size={28} />
            <span className="text-xs tracking-widest uppercase font-semibold">Adicionar Caso</span>
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title={editing ? 'Editar Caso Antes/Depois' : 'Novo Caso Antes/Depois'} size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Título *" placeholder="Ex: Clareamento completo" value={draft.title} onChange={e => set('title', e.target.value)} />
            <Input label="Categoria *" placeholder="Ex: Clareamento" value={draft.category} onChange={e => set('category', e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <ImageUpload label="Imagem — Antes *" value={draft.before_url} onChange={url => set('before_url', url)} onError={onError} />
            <ImageUpload label="Imagem — Depois *" value={draft.after_url} onChange={url => set('after_url', url)} onError={onError} />
          </div>
          <label className="flex items-center gap-3 cursor-pointer mt-2">
            <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 rounded border-white/80 accent-teal-clinic" />
            <span className="text-sm text-dark font-sans">Caso ativo (visível no site)</span>
          </label>
          <p className="text-xs text-stone-muted bg-white/40 border border-white/60 rounded-2xl px-4 py-3">
            💡 Selecione ou arraste imagens locais de Antes/Depois para enviá-las diretamente para o Supabase Storage. Dimensões recomendadas: 800×450px.
          </p>
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

      <Modal open={orderModalOpen} onClose={() => setOrderModalOpen(false)} title="Ordenar Casos" size="md" variant="solid-light">
        <div className="flex flex-col gap-4">
          <p className="text-xs text-stone-muted mb-2">Use as setas para mover os itens para cima ou para baixo e definir a ordem de exibição no site.</p>
          <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-1">
            {orderedItems.map((item, idx) => (
              <div key={item.id} className="flex items-center justify-between p-3 bg-white/60 border border-white/80 rounded-xl shadow-sm">
                <span className="text-sm font-medium text-dark">{item.title}</span>
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
