import { MouthModel3D } from './MouthModel3D'

interface HeroProps {
  onBook: () => void
  onResults: () => void
}

export function Hero({ onBook, onResults }: HeroProps) {
  return (
    <section id="hero" className="min-h-screen md:h-screen grid md:grid-cols-2 overflow-hidden bg-gradient-to-br from-cream via-ivory to-teal-light/10 relative">
      {/* Decorative dot background on the left */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.05] pointer-events-none" />

      {/* Left Column - Content */}
      <div className="relative flex flex-col justify-center px-8 md:px-16 lg:px-20 py-20 z-10 overflow-hidden">
        {/* Soft glowing ambient light for balance */}
        <div className="absolute top-1/4 left-1/4 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gold-light/10 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[8000ms]" />

        {/* Content Wrapper */}
        <div className="relative z-10">


          {/* Luxury Typography Title */}
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light leading-[1.05] text-dark mb-8">
            <span className="relative inline-block font-display italic text-gold font-normal">
              Odontologia
            </span>
          </h1>

          {/* Description */}
          <p className="text-base text-stone-muted leading-relaxed max-w-md mb-11 font-light">
            Combinamos tecnologia 3D de última geração, profissionais de excelência e um toque de arte para desenhar a versão mais saudável e radiante do seu sorriso.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-wrap gap-4 mb-16">
            <button
              onClick={onBook}
              className="relative overflow-hidden bg-teal-clinic hover:bg-dark text-cream px-10 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold transition-all duration-300 font-sans shadow-md hover:shadow-lg hover:shadow-teal-clinic/20 hover:-translate-y-0.5 active:translate-y-0"
            >
              Agendar Consulta
            </button>
            <button
              onClick={onResults}
              className="border border-teal-clinic/20 hover:border-teal-clinic text-teal-clinic px-9 py-4 rounded-full text-[11px] tracking-[0.14em] uppercase font-semibold bg-white/40 hover:bg-white/75 transition-all duration-300 font-sans backdrop-blur-sm shadow-sm hover:-translate-y-0.5 active:translate-y-0"
            >
              Ver Resultados
            </button>
          </div>

          {/* Glassmorphic Stats Section */}
          <div className="grid grid-cols-3 gap-4 md:gap-6 max-w-lg">
            {[
              { num: '2k+', label: 'Pacientes', desc: 'felizes' },
              { num: '15+', label: 'Anos de', desc: 'experiência' },
              { num: '98%', label: 'Taxa de', desc: 'satisfação' },
            ].map(s => (
              <div
                key={s.label}
                className="group/stat flex flex-col p-4 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 hover:border-teal-clinic/20 hover:bg-white/80 transition-all duration-300 shadow-sm hover:shadow-md"
              >
                <div className="font-display text-3xl font-light text-dark group-hover/stat:text-teal-clinic transition-colors duration-300">
                  {s.num.replace(/\d+/, m => m)
                    .split(/(k\+|\+|%)/)
                    .map((part, j) =>
                      /[k+%]/.test(part)
                        ? <span key={j} className="text-gold font-normal">{part}</span>
                        : part
                    )}
                </div>
                <div className="text-[10px] tracking-[0.03em] uppercase text-stone-muted mt-1 leading-tight font-sans">
                  <span className="font-semibold text-dark/80">{s.label}</span>
                  <br />
                  <span className="opacity-75">{s.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column - WebGL 3D Model Floating Pod */}
      <div className="relative flex items-center justify-center min-h-[500px] md:min-h-0 min-w-0 p-8 md:p-12 lg:p-16 overflow-hidden">
        {/* Soft glowing ambient light behind the pod */}
        <div className="absolute w-[80%] h-[80%] bg-teal-light/20 rounded-full blur-[100px] pointer-events-none animate-pulse duration-[6000ms]" />

        {/* Concentric rings to suggest technology and alignment */}
        <div className="absolute w-72 h-72 rounded-full border border-gold/10 pointer-events-none z-0 scale-90" />
        <div className="absolute w-96 h-96 rounded-full border border-gold/5 pointer-events-none z-0 scale-110" />

        {/* Floating Glassmorphic Capsule containing the 3D mouth model */}
        <div className="relative w-full aspect-[4/3] md:h-[80%] max-h-[550px] bg-white/30 border border-white/60 backdrop-blur-xl shadow-[0_20px_50px_rgba(201,169,110,0.1)] rounded-3xl overflow-hidden flex items-center justify-center group transition-all duration-500 hover:shadow-[0_20px_50px_rgba(74,123,111,0.15)] hover:border-gold/30">
          {/* WebGL 3D Model */}
          <div className="relative z-10 w-full h-full flex items-center justify-center min-w-0 min-h-0 overflow-hidden">
            <MouthModel3D />
          </div>

          {/* Subtle bottom shine inside the pod */}
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-gold/30 to-transparent opacity-60 z-20" />

          {/* Top-left Info Badge */}
          <div className="absolute top-6 left-6 bg-white/70 border border-gold/20 px-4 py-2.5 rounded-2xl shadow-sm z-20 pointer-events-none backdrop-blur-sm transition-transform duration-500 group-hover:translate-y-1">
            <p className="text-[8px] tracking-[0.15em] uppercase text-stone-muted font-semibold font-sans">Precisão</p>
            <h3 className="font-display text-sm md:text-base font-light text-dark mt-0.5">Diagnóstico Digital</h3>
          </div>

          {/* Technical holographic/interactive badge */}
          <div className="absolute bottom-6 right-6 bg-white/70 border border-gold/20 px-4 py-2.5 rounded-2xl shadow-sm z-20 pointer-events-none backdrop-blur-sm transition-transform duration-500 group-hover:-translate-y-1">
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-clinic animate-ping" />
              <span className="text-[8px] tracking-[0.15em] uppercase text-stone-muted font-semibold font-sans">Interativo</span>
            </div>
            <h3 className="font-display text-sm md:text-base font-light text-dark mt-0.5">Simulador 3D</h3>
          </div>
        </div>
      </div>
    </section>
  )
}
