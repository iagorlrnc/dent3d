import { useEffect, useState } from 'react'
import { contactQueries } from '@/lib/queries'
import type { ContactMessage } from '@/types'
import { Trash2, Loader2, Mail, MailOpen } from 'lucide-react'

interface Props {
  onSuccess: (m: string) => void
  onError: (m: string) => void
}

export function Messages({ onSuccess, onError }: Props) {
  const [items, setItems]     = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)
  const [expanded, setExpanded] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    const { data } = await contactQueries.list()
    setItems(data ?? [])
    setLoading(false)
  }

  useEffect(() => { load() }, [])

  const handleExpand = async (msg: ContactMessage) => {
    if (expanded === msg.id) { setExpanded(null); return }
    setExpanded(msg.id)
    if (!msg.read) {
      await contactQueries.markRead(msg.id)
      setItems(p => p.map(i => i.id === msg.id ? { ...i, read: true } : i))
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Remover esta mensagem?')) return
    const { error } = await contactQueries.remove(id)
    if (error) { onError('Erro ao remover.'); return }
    onSuccess('Mensagem removida.')
    setItems(p => p.filter(i => i.id !== id))
  }

  const unread = items.filter(i => !i.read).length

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-light text-dark">Mensagens</h1>
        <p className="text-stone-muted text-sm mt-1 font-sans">
          {unread > 0
            ? <span className="text-teal-clinic font-semibold">{unread} mensagem{unread > 1 ? 's' : ''} não lida{unread > 1 ? 's' : ''}</span>
            : 'Todas as mensagens foram lidas.'}
        </p>
      </div>

      <div className="bg-white/40 backdrop-blur-md rounded-2xl border border-white/70 shadow-[0_8px_30px_rgb(26,22,18,0.02)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-stone-muted text-sm font-light">
            Nenhuma mensagem recebida ainda.
          </div>
        ) : (
          <div className="divide-y divide-white/60">
            {items.map(msg => (
              <div key={msg.id} className={`transition-colors ${!msg.read ? 'bg-teal-clinic/[0.02]' : ''}`}>
                {/* Row header */}
                <div
                  className="px-6 py-4.5 flex items-center gap-4 cursor-pointer hover:bg-white/50 transition-colors"
                  onClick={() => handleExpand(msg)}
                >
                  <div className="flex-shrink-0">
                    {msg.read
                      ? <MailOpen size={16} className="text-stone-muted/50" />
                      : <Mail size={16} className="text-teal-clinic" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${msg.read ? 'text-dark' : 'text-dark font-semibold'}`}>
                        {msg.name}
                      </span>
                      {msg.service && (
                        <span className="text-[10px] tracking-widest uppercase bg-teal-clinic/5 text-teal-clinic px-2.5 py-0.5 rounded-full border border-teal-clinic/10">
                          {msg.service}
                        </span>
                      )}
                      {!msg.read && (
                        <span className="w-2.5 h-2.5 rounded-full bg-teal-clinic flex-shrink-0 animate-pulse" />
                      )}
                    </div>
                    <p className="text-xs text-stone-muted mt-1.5 truncate">{msg.message}</p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <span className="text-xs text-stone-muted hidden sm:block">
                      {new Date(msg.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <button
                      onClick={e => { e.stopPropagation(); handleDelete(msg.id) }}
                      className="text-stone-muted hover:text-red-400 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                {/* Expanded detail */}
                {expanded === msg.id && (
                  <div className="px-6 pb-6 border-t border-white/60 bg-white/10">
                    <div className="grid grid-cols-3 gap-4 py-4 text-xs text-stone-muted mb-3">
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1 font-semibold text-stone-muted/80">Telefone</span>
                        <span className="text-dark font-medium">{msg.phone}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1 font-semibold text-stone-muted/80">E-mail</span>
                        <a href={`mailto:${msg.email}`} className="text-teal-clinic hover:underline font-semibold">{msg.email}</a>
                      </div>
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1 font-semibold text-stone-muted/80">Data</span>
                        <span className="text-dark font-medium">
                          {new Date(msg.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase mb-2 font-semibold text-stone-muted/85">Mensagem</span>
                      <p className="text-sm text-dark leading-relaxed bg-white/60 border border-white/80 rounded-2xl p-4 shadow-sm">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex gap-3 mt-5">
                      <a
                        href={`mailto:${msg.email}?subject=Retorno%20-%20Sorrir%20Clinic`}
                        className="text-xs px-5 py-2.5 bg-teal-clinic hover:bg-dark text-cream rounded-full transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                      >
                        Responder por E-mail
                      </a>
                      <a
                        href={`https://wa.me/55${msg.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-5 py-2.5 bg-white/40 text-teal-clinic border border-teal-clinic/20 rounded-full hover:bg-teal-clinic/10 transition-all duration-300 font-semibold shadow-sm hover:-translate-y-0.5 active:translate-y-0"
                      >
                        WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
