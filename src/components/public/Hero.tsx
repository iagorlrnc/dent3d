import { MouthModel3D } from './MouthModel3D'

interface HeroProps {
  onBook: () => void
  onResults: () => void
}

export function Hero({ onBook, onResults }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen md:h-screen grid md:grid-cols-2 overflow-hidden">
      {/* Left */}
      <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 bg-gradient-to-br from-ivory to-cream overflow-hidden">
        {/* Fine grid overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.07] pointer-events-none" />
        
        {/* Soft pulsing ambient glow */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gold-light/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

        {/* Content wrapper to stay above absolute elements */}
        <div className="relative z-10">
          {/* Modern Badge */}
          <div 
            className="inline-flex items-center gap-2 bg-white/60 backdrop-blur-sm border border-gold/20 px-3.5 py-1.5 rounded-full mb-7 max-w-max shadow-sm hover:border-gold/40 transition-colors"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
            <span className="text-[10px] tracking-[0.2em] uppercase text-gold font-sans font-medium">
              Odontologia de Excelência desde 2010
            </span>
          </div>

          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-dark mb-8" >
            Seu sorriso,<br />
            nossa <span className="relative inline-block font-normal text-gold italic font-display">
              arte
              <span className="absolute bottom-1 left-0 w-full h-[2px] bg-gold/30 rounded-full" />
            </span>
          </h1>

          <p className="text-base text-stone-muted leading-relaxed max-w-md mb-11 font-light" >
            Tratamentos modernos, tecnologia avançada e cuidado humanizado para transformar e preservar a saúde do seu sorriso com total delicadeza.
          </p>

          <div className="flex flex-wrap gap-4 mb-16" >
            <button
              onClick={onBook}
              className="relative group bg-gold hover:bg-dark text-dark hover:text-gold px-10 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 font-sans shadow-sm hover:shadow-md hover:shadow-gold/10 hover:-translate-y-0.5 active:translate-y-0"
            >
              Agendar Consulta
            </button>
            <button
              onClick={onResults}
              className="border border-dark/10 hover:border-gold text-dark hover:text-gold px-9 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold bg-white/40 hover:bg-white/70 transition-all duration-300 font-sans backdrop-blur-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              Ver Resultados
            </button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-lg" >
            {[
              { num: '2k+', label: 'Pacientes', desc: 'atendidos' },
              { num: '15+', label: 'Anos de', desc: 'experiência' },
              { num: '98%', label: 'Satisfação', desc: 'dos pacientes' },
            ].map(s => (
              <div
                key={s.label}
                className="group/stat flex flex-col p-4 rounded-2xl bg-white/30 backdrop-blur-[3px] border border-gold/15 hover:border-gold/45 hover:bg-white/60 transition-all duration-300 hover:shadow-sm"
              >
                <div className="font-display text-3xl font-light text-dark group-hover/stat:text-gold transition-colors duration-300">
                  {s.num.replace(/\d+/, m => m)
                    .split(/(k\+|\+|%)/)
                    .map((part, j) =>
                      /[k+%]/.test(part)
                        ? <span key={j} className="text-gold font-normal">{part}</span>
                        : part
                    )}
                </div>
                <div className="text-[10px] tracking-[0.03em] uppercase text-stone-muted mt-1 leading-tight font-sans">
                  <span className="font-medium text-dark/80">{s.label}</span>
                  <br />
                  <span className="opacity-75">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Right - hero visual */}
      <div className="relative overflow-hidden bg-dark min-h-[400px] md:min-h-0 flex items-center justify-center group min-w-0 min-h-0">
        <div className="absolute inset-0 bg-gradient-to-br from-dark-mid to-dark opacity-90 transition-opacity duration-700 group-hover:opacity-80" />

        {/* WebGL 3D Model */}
        <div className="relative z-10 w-full h-full flex items-center justify-center min-w-0 min-h-0 overflow-hidden">
          <MouthModel3D />
        </div>

        {/* Gold accent line */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-gold to-transparent opacity-40 transition-opacity duration-500 group-hover:opacity-80 z-20" />

        {/* Badge */}
        <div className="absolute top-8 left-8 bg-cream/95 px-6 py-4 rounded-sm border-l-[3px] border-gold shadow-xl z-20 transition-transform duration-500 group-hover:translate-y-2 pointer-events-none">
          <p className="text-[10px] tracking-[0.15em] uppercase text-stone-muted">Tecnologia</p>
          <h3 className="font-display text-2xl font-light text-dark mt-0.5">3D & Digital</h3>
        </div>
      </div>
    </section>
  )
}
