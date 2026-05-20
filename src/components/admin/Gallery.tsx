import { useEffect, useState } from 'react'
import { beforeAfterQueries } from '@/lib/queries'
import type { BeforeAfter } from '@/types'
import { Modal } from '@/components/ui/Modal'
import { Input } from '@/components/ui/Input'
import { Plus, Trash2, Loader2, ToggleLeft, ToggleRight } from 'lucide-react'
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
  const [draft, setDraft]     = useState<Draft>(EMPTY)
  const [saving, setSaving]   = useState(false)

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
    if (!draft.title || !draft.category) { onError('Título e categoria são obrigatórios.'); return }
    setSaving(true)
    const { error } = await beforeAfterQueries.create(draft)
    setSaving(false)
    if (error) { onError('Erro ao salvar caso.'); return }
    setModalOpen(false)
    setDraft(EMPTY)
    onSuccess('Caso adicionado com sucesso!')
    load()
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
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 bg-dark text-cream px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase hover:bg-gold hover:text-dark transition-all"
        >
          <Plus size={14} /> Novo Caso
        </button>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16 text-stone-muted">
          <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
        </div>
      ) : items.length === 0 ? (
        <div className="bg-white rounded-sm shadow-sm py-16 text-center">
          <p className="text-stone-muted text-sm mb-4">Nenhum caso cadastrado ainda.</p>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-2 mx-auto bg-dark text-cream px-5 py-2.5 rounded-sm text-xs tracking-widest uppercase hover:bg-gold hover:text-dark transition-all"
          >
            <Plus size={14} /> Adicionar Primeiro Caso
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {items.map(item => (
            <div key={item.id} className="bg-white rounded-sm shadow-sm overflow-hidden">
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
                  <span className="absolute top-2 left-2 bg-dark/70 text-cream text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm">
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
                  <span className="absolute top-2 right-2 bg-gold/80 text-dark text-[9px] tracking-widest uppercase px-2 py-1 rounded-sm">
                    Depois
                  </span>
                </div>
              </div>

              {/* Footer */}
              <div className="px-5 py-4 flex items-center justify-between border-t border-ivory">
                <div>
                  <p className="text-sm font-medium text-dark">{item.title}</p>
                  <p className="text-xs text-stone-muted mt-0.5">{item.category}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge status={item.active ? 'active' : 'inactive'} label={item.active ? 'Ativo' : 'Inativo'} />
                  <button onClick={() => toggleActive(item)} className="text-stone-muted hover:text-gold transition-colors">
                    {item.active ? <ToggleRight size={18} className="text-teal-clinic" /> : <ToggleLeft size={18} />}
                  </button>
                  <button onClick={() => handleDelete(item.id)} className="text-stone-muted hover:text-red-400 transition-colors">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Add card */}
          <button
            onClick={() => setModalOpen(true)}
            className="h-full min-h-[200px] border-2 border-dashed border-gold/25 rounded-sm flex flex-col items-center justify-center gap-3 text-stone-muted hover:border-gold/60 hover:text-gold transition-all"
          >
            <Plus size={28} />
            <span className="text-xs tracking-widest uppercase">Adicionar Caso</span>
          </button>
        </div>
      )}

      <Modal open={modalOpen} onClose={() => setModalOpen(false)} title="Novo Caso Antes/Depois" size="md">
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Título *" placeholder="Ex: Clareamento completo" value={draft.title} onChange={e => set('title', e.target.value)} />
            <Input label="Categoria *" placeholder="Ex: Clareamento" value={draft.category} onChange={e => set('category', e.target.value)} />
          </div>
          <Input label="URL imagem — Antes" placeholder="https://..." value={draft.before_url} onChange={e => set('before_url', e.target.value)} />
          <Input label="URL imagem — Depois" placeholder="https://..." value={draft.after_url} onChange={e => set('after_url', e.target.value)} />
          <Input label="Ordem" type="number" min="0" value={String(draft.order_index)} onChange={e => set('order_index', Number(e.target.value))} />
          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={draft.active} onChange={e => set('active', e.target.checked)} className="w-4 h-4 accent-gold" />
            <span className="text-sm text-dark">Caso ativo (visível no site)</span>
          </label>
          <p className="text-xs text-stone-muted bg-ivory rounded-sm px-4 py-3">
            💡 Use URLs de imagens hospedadas (Supabase Storage, Cloudinary, etc). Dimensões recomendadas: 800×450px.
          </p>
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
