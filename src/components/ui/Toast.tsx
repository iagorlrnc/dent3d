import type { Toast } from '@/hooks/useToast'
import { X } from 'lucide-react'

interface ToastContainerProps {
  toasts: Toast[]
  onRemove: (id: string) => void
}

export function ToastContainer({ toasts, onRemove }: ToastContainerProps) {
  return (
    <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-3 pointer-events-none">
      {toasts.map(toast => (
        <div
          key={toast.id}
          className={`
            flex items-center gap-3 min-w-[280px] px-4 py-3 rounded-sm shadow-xl
            border-l-[3px] animate-slide-up pointer-events-auto
            ${toast.type === 'success' ? 'bg-dark text-cream border-gold' : ''}
            ${toast.type === 'error'   ? 'bg-dark text-cream border-red-500' : ''}
            ${toast.type === 'info'    ? 'bg-dark text-cream border-teal-clinic' : ''}
          `}
        >
          <span className="text-sm flex-1 font-sans">{toast.message}</span>
          <button
            onClick={() => onRemove(toast.id)}
            className="text-stone-muted hover:text-cream transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      ))}
    </div>
  )
}
