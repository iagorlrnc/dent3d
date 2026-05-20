interface FooterProps {
  clinicName?: string
  cro?: string
}

export function Footer({ clinicName = 'Sorrir Clinic', cro = 'CRO-SP 12345' }: FooterProps) {
  const formatLogo = (name: string) => {
    const parts = name.split(/\s+/)
    if (parts.length > 1) {
      return (
        <>
          {parts[0]}
          <span className="text-gold">.</span>
          {parts.slice(1).join(' ')}
        </>
      )
    }
    return <>{name}</>
  }

  return (
    <footer className="bg-cream border-t border-teal-clinic/10 px-6 md:px-20 py-12 relative overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
        <div className="font-display text-2xl font-light text-dark tracking-wide">
          {formatLogo(clinicName)}
        </div>
        <p className="text-[11px] tracking-widest text-stone-muted font-sans uppercase">
          © {new Date().getFullYear()} {clinicName} — Todos os direitos reservados
        </p>
        <p className="text-[11px] tracking-widest text-stone-muted font-sans uppercase font-semibold">
          {cro}
        </p>
      </div>
    </footer>
  )
}
