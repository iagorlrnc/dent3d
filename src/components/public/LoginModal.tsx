import { useState } from 'react'
import { X, Eye, EyeOff, Loader2 } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

interface LoginModalProps {
  open?: boolean
  onClose?: () => void
  onSuccess: () => void
  isPage?: boolean
  onBackToSite?: () => void
}

export function LoginModal({ open = true, onClose, onSuccess, isPage = false, onBackToSite }: LoginModalProps) {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  if (!isPage && !open) return null

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

  const innerCard = (
    <div className="w-full max-w-sm bg-gradient-to-br from-cream via-ivory to-teal-light/10 border border-white/80 rounded-3xl shadow-[0_20px_50px_rgba(201,169,110,0.15)] overflow-hidden animate-slide-up relative px-8 py-9">
      {/* Decorative elements */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
      <div className="absolute -top-12 -right-12 w-36 h-36 bg-teal-light/20 rounded-full blur-[80px] pointer-events-none" />
      <div className="absolute -bottom-12 -left-12 w-36 h-36 bg-gold-light/15 rounded-full blur-[80px] pointer-events-none" />

      {/* Close or Back Button */}
      {!isPage && onClose ? (
        <button
          onClick={onClose}
          className="absolute top-5 right-5 text-stone-muted hover:text-teal-clinic transition-colors z-20"
        >
          <X size={18} />
        </button>
      ) : onBackToSite ? (
        <button
          onClick={onBackToSite}
          className="absolute top-5 right-6 text-xs tracking-wider uppercase text-stone-muted hover:text-teal-clinic transition-colors font-semibold z-20"
        >
          Site →
        </button>
      ) : null}

      {/* Header */}
      <div className="text-center mb-8 relative z-10">
        <div className="font-display text-3xl font-light text-dark mb-1">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>
        <p className="text-[9px] tracking-[0.18em] uppercase text-stone-muted/70">
          Painel Administrativo
        </p>
      </div>

      {/* Body */}
      <div className="relative z-10">
        {error && (
          <div className="mb-5 bg-red-500/10 border border-red-500/20 text-red-500 text-xs px-4 py-3 rounded-2xl">
            ⚠ {error}
          </div>
        )}

        <div className="mb-4">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-stone-muted mb-2 font-medium">
            E-mail
          </label>
          <input
            type="email"
            placeholder="admin@sorrirclinic.com.br"
            value={email}
            onChange={e => setEmail(e.target.value)}
            onKeyDown={handleKey}
            className="w-full bg-white/60 border border-white/80 rounded-2xl px-4 py-3 text-dark text-sm focus:outline-none focus:border-teal-clinic focus:ring-1 focus:ring-teal-clinic/20 backdrop-blur-sm shadow-sm transition-all duration-300 placeholder:text-stone-muted/40"
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-[10px] tracking-[0.12em] uppercase text-stone-muted mb-2 font-medium">
            Senha
          </label>
          <input
            type={showPass ? 'text' : 'password'}
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKey}
            className="w-full bg-white/60 border border-white/80 rounded-2xl px-4 py-3 pr-11 text-dark text-sm focus:outline-none focus:border-teal-clinic focus:ring-1 focus:ring-teal-clinic/20 backdrop-blur-sm shadow-sm transition-all duration-300 placeholder:text-stone-muted/40"
          />
          <button
            type="button"
            onClick={() => setShowPass(v => !v)}
            className="absolute right-3.5 top-[34px] text-stone-muted hover:text-teal-clinic transition-colors"
          >
            {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>

        <button
          onClick={handleLogin}
          disabled={loading}
          className="w-full bg-teal-clinic hover:bg-dark text-cream py-4 rounded-full text-[11px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 font-sans shadow-md hover:shadow-lg hover:shadow-teal-clinic/20 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {loading && <Loader2 size={14} className="animate-spin" />}
          {loading ? 'Entrando...' : 'Entrar no Painel'}
        </button>

        <p className="text-center text-[10px] tracking-wide text-stone-muted/60 mt-6">
          Acesso restrito a administradores
        </p>
      </div>
    </div>
  )

  if (isPage) {
    return innerCard
  }

  return (
    <div
      className="fixed inset-0 z-[200] flex items-center justify-center bg-dark/85 backdrop-blur-md animate-fade-in p-4"
      onClick={e => { if (e.target === e.currentTarget && onClose) onClose() }}
    >
      {innerCard}
    </div>
  )
}
