import { MouthModel3D } from './MouthModel3D'

interface HeroProps {
  onBook: () => void
  onResults: () => void
}

export function Hero({ onBook, onResults }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen grid md:grid-cols-2 pt-20">
      {/* Left */}
      <div className="flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 bg-gradient-to-br from-ivory to-cream">
        <p className="text-[11px] tracking-[0.25em] uppercase text-gold mb-7 font-sans animate-fade-up">
          ✦ Odontologia de Excelência desde 2010
        </p>
        <h1
          className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-dark mb-8 animate-fade-up"
          style={{ animationDelay: '0.1s' }}
        >
          Seu sorriso,<br />nossa <em className="italic text-gold not-italic">arte</em>
        </h1>
        <p
          className="text-base text-stone-muted leading-relaxed max-w-md mb-11 font-light animate-fade-up"
          style={{ animationDelay: '0.2s' }}
        >
          Tratamentos modernos, tecnologia avançada e cuidado humanizado para transformar e preservar a saúde do seu sorriso.
        </p>
        <div
          className="flex flex-wrap gap-4 mb-14 animate-fade-up"
          style={{ animationDelay: '0.3s' }}
        >
          <button
            onClick={onBook}
            className="bg-gold text-dark px-10 py-4 rounded-sm text-[11px] tracking-[0.14em] uppercase font-medium hover:bg-dark hover:text-gold transition-all font-sans"
          >
            Agendar Consulta
          </button>
          <button
            onClick={onResults}
            className="border border-stone-muted/40 text-dark px-9 py-4 rounded-sm text-[11px] tracking-[0.14em] uppercase hover:border-gold hover:text-gold transition-all font-sans"
          >
            Ver Resultados
          </button>
        </div>

        {/* Stats */}
        <div
          className="flex gap-0 animate-fade-up"
          style={{ animationDelay: '0.4s' }}
        >
          {[
            { num: '2k+', label: 'Pacientes atendidos' },
            { num: '15+', label: 'Anos de experiência' },
            { num: '98%', label: 'Satisfação' },
          ].map((s, i) => (
            <div
              key={s.label}
              className={`pr-8 mr-8 ${i < 2 ? 'border-r border-gold/30' : ''}`}
            >
              <div className="font-display text-4xl font-light text-dark">
                {s.num.replace(/\d+/, m => m)
                  .split(/(k\+|\+|%)/)
                  .map((part, j) =>
                    /[k+%]/.test(part)
                      ? <span key={j} className="text-gold">{part}</span>
                      : part
                  )}
              </div>
              <div className="text-[11px] tracking-[0.1em] uppercase text-stone-muted mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Right - hero visual */}
      <div className="relative overflow-hidden bg-dark min-h-[400px] md:min-h-0 flex items-center justify-center group">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-mid to-dark opacity-90 transition-opacity duration-700 group-hover:opacity-80" />
        
        {/* WebGL 3D Model */}
        <div className="relative z-10 w-full h-full flex items-center justify-center">
          <MouthModel3D />
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-80 z-20" />
        
        {/* Badge */}
        <div className="absolute bottom-8 left-8 bg-cream/95 px-6 py-4 rounded-sm border-l-[3px] border-gold shadow-xl z-20 transition-transform duration-500 group-hover:-translate-y-2 pointer-events-none">
          <p className="text-[10px] tracking-[0.15em] uppercase text-stone-muted">Tecnologia</p>
          <h3 className="font-display text-2xl font-light text-dark mt-0.5">3D & Digital</h3>
        </div>
      </div>
    </section>
  )
}
