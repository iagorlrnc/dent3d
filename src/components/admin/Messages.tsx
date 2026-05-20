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
        <p className="text-stone-muted text-sm mt-1">
          {unread > 0
            ? <span className="text-gold font-medium">{unread} mensagem{unread > 1 ? 's' : ''} não lida{unread > 1 ? 's' : ''}</span>
            : 'Todas as mensagens foram lidas.'}
        </p>
      </div>

      <div className="bg-white rounded-sm shadow-sm overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-16 text-stone-muted">
            <Loader2 size={20} className="animate-spin mr-2" /> Carregando...
          </div>
        ) : items.length === 0 ? (
          <div className="py-12 text-center text-stone-muted text-sm">
            Nenhuma mensagem recebida ainda.
          </div>
        ) : (
          <div className="divide-y divide-ivory">
            {items.map(msg => (
              <div key={msg.id} className={`transition-colors ${!msg.read ? 'bg-gold/4' : ''}`}>
                {/* Row header */}
                <div
                  className="px-6 py-4 flex items-center gap-4 cursor-pointer hover:bg-cream/40 transition-colors"
                  onClick={() => handleExpand(msg)}
                >
                  <div className="flex-shrink-0">
                    {msg.read
                      ? <MailOpen size={16} className="text-stone-muted/50" />
                      : <Mail size={16} className="text-gold" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3">
                      <span className={`text-sm ${msg.read ? 'text-dark' : 'text-dark font-semibold'}`}>
                        {msg.name}
                      </span>
                      {msg.service && (
                        <span className="text-[10px] tracking-widest uppercase bg-ivory text-stone-muted px-2 py-0.5 rounded-sm">
                          {msg.service}
                        </span>
                      )}
                      {!msg.read && (
                        <span className="w-2 h-2 rounded-full bg-gold flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-xs text-stone-muted mt-0.5 truncate">{msg.message}</p>
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
                  <div className="px-6 pb-5 border-t border-ivory bg-ivory/50">
                    <div className="grid grid-cols-3 gap-4 py-4 text-xs text-stone-muted mb-3">
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1">Telefone</span>
                        <span className="text-dark">{msg.phone}</span>
                      </div>
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1">E-mail</span>
                        <a href={`mailto:${msg.email}`} className="text-gold hover:underline">{msg.email}</a>
                      </div>
                      <div>
                        <span className="block text-[10px] tracking-widest uppercase mb-1">Data</span>
                        <span className="text-dark">
                          {new Date(msg.created_at).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}
                        </span>
                      </div>
                    </div>
                    <div>
                      <span className="block text-[10px] tracking-widest uppercase mb-2 text-stone-muted">Mensagem</span>
                      <p className="text-sm text-dark leading-relaxed bg-white rounded-sm p-4 border border-ivory">
                        {msg.message}
                      </p>
                    </div>
                    <div className="flex gap-3 mt-4">
                      <a
                        href={`mailto:${msg.email}?subject=Retorno%20-%20Sorrir%20Clinic`}
                        className="text-xs px-4 py-2 bg-dark text-cream rounded-sm hover:bg-gold hover:text-dark transition-all"
                      >
                        Responder por E-mail
                      </a>
                      <a
                        href={`https://wa.me/55${msg.phone.replace(/\D/g, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs px-4 py-2 bg-teal-clinic/10 text-teal-clinic border border-teal-clinic/20 rounded-sm hover:bg-teal-clinic/20 transition-colors"
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
