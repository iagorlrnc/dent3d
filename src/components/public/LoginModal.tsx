import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface LoginModalProps {
  open: boolean
  onClose: () => void
  onSuccess: () => void
}

export function LoginModal({ open, onClose, onSuccess }: LoginModalProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!open) return null

  const handleLogin = async () => {
    if (!email || !password) { setError('Preencha e-mail e senha.'); return }
    setLoading(true)
    setError('')
    const err = await signIn(email, password)
    setLoading(false)
    if (err) {
      setError('E-mail ou senha incorretos.')
    } else {
      onSuccess()
    }
  }

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleLogin()
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/85 backdrop-blur-md animate-fade-in"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-sm bg-cream rounded-sm shadow-2xl overflow-hidden animate-slide-up relative">
        {/* Header */}
        <div className="bg-dark px-9 py-8 text-center">
          <div className="font-display text-2xl font-light text-cream mb-1">
            Sorrir<span className="text-gold">.</span>Clinic
          </div>
          <p className="text-[10px] tracking-[0.18em] uppercase text-cream/35">
            Painel Administrativo
          </p>
        </div>

        {/* Body */}
        <div className="px-9 py-8">
          {error && (
            <div className="mb-5 bg-red-50 border border-red-200 text-red-600 text-xs px-4 py-3 rounded-sm">
              ⚠ {error}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-stone-muted mb-2">
              E-mail
            </label>
            <input
              type="email"
              placeholder="admin@sorrirclinic.com.br"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={handleKey}
              className="w-full bg-ivory border border-ivory rounded-sm px-4 py-3 text-dark text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-stone-muted/40"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-[10px] tracking-[0.12em] uppercase text-stone-muted mb-2">
              Senha
            </label>
            <input
              type={showPass ? 'text' : 'password'}
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              onKeyDown={handleKey}
              className="w-full bg-ivory border border-ivory rounded-sm px-4 py-3 pr-11 text-dark text-sm focus:outline-none focus:border-gold transition-colors placeholder:text-stone-muted/40"
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              className="absolute right-3 top-[34px] text-stone-muted hover:text-dark transition-colors"
            >
              {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full bg-dark text-cream py-4 text-[11px] tracking-[0.15em] uppercase rounded-sm hover:bg-gold hover:text-dark transition-all disabled:opacity-60 flex items-center justify-center gap-2"
          >
            {loading && <Loader2 size={14} className="animate-spin" />}
            {loading ? 'Entrando...' : 'Entrar no Painel'}
          </button>

          <p className="text-center text-[11px] text-stone-muted/60 mt-5">
            Acesso restrito a administradores
          </p>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-cream/50 hover:text-cream transition-colors"
        >
          <X size={18} />
        </button>
      </div>
    </div>
  )
}
