import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'

interface HeaderProps {
  onAdminClick: () => void
}

const navLinks = [
  { label: 'Serviços',     href: '#servicos' },
  { label: 'Resultados',   href: '#resultados' },
  { label: 'Equipe',       href: '#equipe' },
  { label: 'Depoimentos',  href: '#depoimentos' },
  { label: 'Contato',      href: '#contato' },
]

export function Header({ onAdminClick }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 py-4 transition-all duration-300">
      <div className={`mx-auto px-6 md:px-8 flex items-center justify-between transition-all duration-500 ${
        scrolled 
          ? 'max-w-5xl bg-white/60 border border-white/80 shadow-[0_10px_30px_rgba(74,123,111,0.06)] rounded-full py-3.5 backdrop-blur-lg'
          : 'max-w-7xl bg-transparent border-transparent py-4'
      }`}>
        {/* Logo */}
        <div className="font-display text-xl md:text-2xl font-light text-dark tracking-wide">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-[10px] tracking-[0.15em] uppercase text-stone-muted hover:text-teal-clinic font-semibold transition-colors font-sans"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="hidden md:block bg-teal-clinic hover:bg-dark text-cream px-6 py-2.5 rounded-full text-[10px] tracking-[0.15em] uppercase font-semibold transition-all duration-300 font-sans shadow-sm"
          >
            Área Admin
          </button>
          <button
            onClick={() => setMenuOpen(v => !v)}
            className="md:hidden text-dark"
          >
            {menuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-cream/95 backdrop-blur-lg border border-white/60 px-6 py-6 flex flex-col gap-4 mt-2 mx-4 rounded-3xl shadow-lg">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left text-xs tracking-widest uppercase text-stone-muted hover:text-teal-clinic transition-colors font-semibold"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onAdminClick() }}
            className="bg-teal-clinic text-cream px-5 py-3 text-[10px] tracking-[0.15em] uppercase rounded-full font-semibold mt-2 text-center"
          >
            Área Admin
          </button>
        </div>
      )}
    </header>
  )
}
