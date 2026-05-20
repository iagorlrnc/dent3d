import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ModalProps {
  open: boolean
  onClose: () => void
  title: string
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'solid-light'
}

export function Modal({ open, onClose, title, children, size = 'md', variant = 'default' }: ModalProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  if (!open) return null

  const widths = { sm: 'max-w-sm', md: 'max-w-lg', lg: 'max-w-2xl' }
  const bgClass = variant === 'solid-light'
    ? 'bg-cream border border-gold/30'
    : 'bg-gradient-to-br from-cream via-ivory to-teal-light/10 border border-white/80'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-dark/80 backdrop-blur-md animate-fade-in px-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={`w-full ${widths[size]} ${bgClass} rounded-3xl shadow-[0_20px_50px_rgba(201,169,110,0.15)] animate-slide-up overflow-hidden relative max-h-[90vh] flex flex-col`}>
        {/* Soft glowing ambient light inside modal */}
        {variant !== 'solid-light' && (
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-teal-light/20 rounded-full blur-[80px] pointer-events-none" />
        )}
        {variant !== 'solid-light' && (
          <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
        )}

        <div className="relative z-10 flex items-center justify-between px-7 py-5 border-b border-white/60 flex-shrink-0">
          <h3 className="font-display text-xl font-light text-dark">{title}</h3>
          <button onClick={onClose} className="text-stone-muted hover:text-teal-clinic transition-colors">
            <X size={18} />
          </button>
        </div>
        <div className="relative z-10 p-7 overflow-y-auto flex-1">{children}</div>
      </div>
    </div>
  )
}
