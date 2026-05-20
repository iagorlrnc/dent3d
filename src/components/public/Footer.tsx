export function Footer() {
  return (
    <footer className="bg-cream border-t border-teal-clinic/10 px-6 md:px-20 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="font-display text-2xl font-light text-dark tracking-wide">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>
        <p className="text-[11px] tracking-widest text-stone-muted font-sans uppercase">
          © {new Date().getFullYear()} Sorrir Clinic — Todos os direitos reservados
        </p>
        <p className="text-[11px] tracking-widest text-stone-muted font-sans uppercase font-semibold">
          CRO-SP 12345
        </p>
      </div>
    </footer>
  )
}
