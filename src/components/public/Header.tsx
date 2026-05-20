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
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleNav = (href: string) => {
    setMenuOpen(false)
    const el = document.querySelector(href)
    el?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'py-4 bg-cream/95 backdrop-blur-md shadow-sm border-b border-gold/10' : 'py-6 bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="font-display text-2xl font-light text-dark tracking-wide">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-9">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-[11px] tracking-[0.14em] uppercase text-stone-muted hover:text-gold transition-colors font-sans"
            >
              {link.label}
            </button>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <button
            onClick={onAdminClick}
            className="hidden md:block bg-dark text-cream px-5 py-2.5 text-[11px] tracking-[0.14em] uppercase rounded-sm hover:bg-gold hover:text-dark transition-all font-sans"
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
        <div className="md:hidden bg-cream border-t border-ivory px-6 py-5 flex flex-col gap-4 animate-fade-in">
          {navLinks.map(link => (
            <button
              key={link.href}
              onClick={() => handleNav(link.href)}
              className="text-left text-sm tracking-widest uppercase text-stone-muted hover:text-gold transition-colors"
            >
              {link.label}
            </button>
          ))}
          <button
            onClick={() => { setMenuOpen(false); onAdminClick() }}
            className="bg-dark text-cream px-5 py-3 text-[11px] tracking-[0.14em] uppercase rounded-sm"
          >
            Área Admin
          </button>
        </div>
      )}
    </header>
  )
}
