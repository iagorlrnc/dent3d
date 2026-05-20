import { useEffect, useState } from 'react'
import { testimonialQueries } from '@/lib/queries'
import type { Testimonial } from '@/types'
import { Badge } from '@/components/ui/Badge'
import { CheckCircle, XCircle, Trash2, Loader2 } from 'lucide-react'

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Testimonials({ onSuccess, onError }: Props) {
  const [items, setItems]     = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter]   = useState<'all' | Testimonial['status']>('all')

  const load = async () => {
    setLoading(true)
    const { data } = await testimonialQueries.listAll()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleStatus = async (id: string, status: Testimonial['status']) => {
    const { error } = await testimonialQueries.updateStatus(id, status)
    if (error) { onError('Erro ao atualizar status.'); return }
    setItems(p => p.map(i => i.id === id ? { ...i, status } : i))
    onSuccess(status === 'approved' ? 'Depoimento aprovado!' : 'Depoimento rejeitado.')
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover este depoimento?')) return
    const { error } = await testimonialQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Depoimento removido.')
    setItems(p => p.filter(i => i.id !== id))
  }

  const filtered = filter === 'all' ? items : items.filter(i => i.status === filter)

  const counts = {
    all: items.length,
    pending:  items.filter(i => i.status === 'pending').length,
    approved: items.filter(i => i.status === 'approved').length,
    rejected: items.filter(i => i.status === 'rejected').length,
  }

  const tabs: { key: 'all' | Testimonial['status']; label: string }[] = [
    { key: 'all',      label: `Todos (${counts.all})` },
    { key: 'pending',  label: `Pendentes (${counts.pending})` },
    { key: 'approved', label: `Aprovados (${counts.approved})` },
    { key: 'rejected', label: `Rejeitados (${counts.rejected})` },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-dark">Depoimentos</h1>
        <p className="text-stone-muted text-sm mt-1">Modere os depoimentos dos pacientes.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-6 border-b border-white/60">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-5 py-3.5 text-[10px] tracking-widest uppercase font-semibold transition-all border-b-2 -mb-px ${
              filter === tab.key
                ? 'text-teal-clinic border-teal-clinic'
                : 'text-stone-muted border-transparent hover:text-dark'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-stone-muted text-sm font-light">
            Nenhum depoimento nesta categoria.
          </div>
        ) : (
          <div className="divide-y divide-white/60">
            {filtered.map(t => (
              <div key={t.id} className="px-6 py-5.5 hover:bg-white/50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="text-sm font-medium text-dark">{t.patient_name}</span>
                      <span className="text-gold text-xs tracking-[2px]">{'★'.repeat(t.rating)}</span>
                      <Badge status={t.status} />
                    </div>
                    <p className="text-sm text-stone-muted font-display italic leading-relaxed pl-4 border-l-2 border-gold/40">
                      "{t.text}"
                    </p>
                    <p className="text-xs text-stone-muted/60 mt-3 font-sans">
                      {new Date(t.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' })}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    {t.status === 'pending' && (
                      <>
                        <button
                          onClick={() => handleStatus(t.id, 'approved')}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 bg-teal-clinic hover:bg-dark text-cream rounded-full transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <CheckCircle size={13} /> Aprovar
                        </button>
                        <button
                          onClick={() => handleStatus(t.id, 'rejected')}
                          className="flex items-center gap-1.5 text-xs px-4 py-2 bg-white/40 text-red-500 border border-red-200 rounded-full hover:bg-red-50 transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                        >
                          <XCircle size={13} /> Rejeitar
                        </button>
                      </>
                    )}
                    {t.status === 'approved' && (
                      <button
                        onClick={() => handleStatus(t.id, 'rejected')}
                        className="text-xs text-stone-muted hover:text-red-400 font-semibold transition-colors mr-2"
                      >
                        Desaprovar
                      </button>
                    )}
                    {t.status === 'rejected' && (
                      <button
                        onClick={() => handleStatus(t.id, 'approved')}
                        className="text-xs text-stone-muted hover:text-teal-clinic font-semibold transition-colors mr-2"
                      >
                        Reativar
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(t.id)}
                      className="text-stone-muted hover:text-red-400 transition-colors p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
