export function Footer() {
  return (
    <footer className="bg-dark-mid border-t border-gold/10 px-6 md:px-20 py-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="font-display text-xl font-light text-cream">
          Sorrir<span className="text-gold">.</span>Clinic
        </div>
        <p className="text-[11px] tracking-wide text-cream/25">
          © {new Date().getFullYear()} Sorrir Clinic — Todos os direitos reservados
        </p>
        <p className="text-[11px] tracking-wide text-cream/25">CRO-SP 12345</p>
      </div>
    </footer>
  )
}
