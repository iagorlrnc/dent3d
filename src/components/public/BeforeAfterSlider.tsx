import { useEffect, useRef, useState, useCallback } from 'react'
import { beforeAfterQueries } from '@/lib/queries'
import type { BeforeAfter } from '@/types'
import { Smile } from 'lucide-react'


const PLACEHOLDER_BEFORE = [
  { bg: 'from-stone-800 to-stone-900', label: 'Pigmentação e Irregularidades de Cor' },
  { bg: 'from-stone-800 to-stone-900', label: 'Diastemas e Desalinhamento Leve' },
  { bg: 'from-stone-800 to-stone-900', label: 'Sobremordida e Desgastes Dentais' },
]
const PLACEHOLDER_AFTER = [
  { bg: 'from-ivory to-cream', label: 'Sorriso Naturalmente Clareado' },
  { bg: 'from-ivory to-cream', label: 'Facetas de Porcelana Planejadas em 3D' },
  { bg: 'from-ivory to-cream', label: 'Ortodontia Digital e Alinhamento Perfeito' },
]

interface SliderProps {
  beforeUrl: string
  afterUrl: string
  beforePlaceholder: { bg: string; label: string }
  afterPlaceholder:  { bg: string; label: string }
}

function Slider({ beforeUrl, afterUrl, beforePlaceholder, afterPlaceholder }: SliderProps) {
  const wrapperRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState(50) // percent
  const dragging = useRef(false)

  const updatePos = useCallback((clientX: number) => {
    if (!wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    const pct = Math.min(Math.max(((clientX - rect.left) / rect.width) * 100, 2), 98)
    setPos(pct)
  }, [])

  const onMouseDown = (e: React.MouseEvent) => { dragging.current = true; updatePos(e.clientX) }
  const onTouchStart = (e: React.TouchEvent) => { dragging.current = true; updatePos(e.touches[0].clientX) }

  useEffect(() => {
    const up = () => { dragging.current = false }
    const move = (e: MouseEvent) => { if (dragging.current) updatePos(e.clientX) }
    const touch = (e: TouchEvent) => { if (dragging.current) updatePos(e.touches[0].clientX) }
    window.addEventListener('mouseup', up)
    window.addEventListener('mousemove', move)
    window.addEventListener('touchend', up)
    window.addEventListener('touchmove', touch, { passive: true })
    return () => {
      window.removeEventListener('mouseup', up)
      window.removeEventListener('mousemove', move)
      window.removeEventListener('touchend', up)
      window.removeEventListener('touchmove', touch)
    }
  }, [updatePos])

  return (
    <div
      ref={wrapperRef}
      className="relative w-full aspect-video rounded-[32px] overflow-hidden cursor-ew-resize select-none shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* AFTER (full) */}
      <div className="absolute inset-0">
        {afterUrl ? (
          <img src={afterUrl} alt="Depois" className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${afterPlaceholder.bg} flex flex-col items-center justify-center p-8`}>
            <div className="w-10 h-10 rounded-full border border-teal-clinic/30 flex items-center justify-center mb-4">
              <span className="text-[10px] text-teal-clinic font-semibold tracking-wider">✦</span>
            </div>
            <p className="font-display text-lg md:text-xl text-dark font-light tracking-wide text-center">{afterPlaceholder.label}</p>
            <p className="text-[9px] tracking-[0.2em] text-stone-muted uppercase mt-2 font-sans">Resultado Planejado</p>
          </div>
        )}
      </div>

      {/* BEFORE (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeUrl ? (
          <img src={beforeUrl} alt="Antes" className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${beforePlaceholder.bg} flex flex-col items-center justify-center p-8`}>
            <div className="w-10 h-10 rounded-full border border-gold/20 flex items-center justify-center mb-4">
              <span className="text-[10px] text-gold font-semibold tracking-wider">✦</span>
            </div>
            <p className="font-display text-lg md:text-xl text-cream/70 font-light tracking-wide text-center">{beforePlaceholder.label}</p>
            <p className="text-[9px] tracking-[0.2em] text-cream/30 uppercase mt-2 font-sans">Condição Inicial</p>
          </div>
        )}
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-gold z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-gold flex items-center justify-center shadow-lg text-dark font-sans font-bold text-sm pointer-events-auto border-2 border-[#1C332F] hover:scale-105 transition-transform duration-200">
          ⇄
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-6 left-6 z-10 bg-black/40 text-cream text-[8px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        Antes
      </span>
      <span className="absolute top-6 right-6 z-10 bg-black/40 text-cream text-[8px] tracking-[0.2em] uppercase px-4 py-2 rounded-full border border-white/10 backdrop-blur-md">
        Depois
      </span>
    </div>
  )
}

export function BeforeAfterSection() {
  const [cases, setCases] = useState<BeforeAfter[]>([])
  const [loading, setLoading] = useState(true)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    async function fetchCases() {
      try {
        const { data } = await beforeAfterQueries.listActive()
        setCases(data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchCases()
  }, [])

  if (loading) {
    return (
      <section id="resultados" className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#1C332F] to-[#122320] relative overflow-hidden flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-cream/70">
          <div className="w-8 h-8 rounded-full border-2 border-gold border-t-transparent animate-spin" />
          <span className="text-xs font-sans tracking-widest uppercase">Carregando casos...</span>
        </div>
      </section>
    )
  }

  const hasCases = cases.length > 0
  const active = hasCases ? (cases[activeIdx] ?? cases[0]) : null
  const idx = hasCases ? Math.min(activeIdx, PLACEHOLDER_BEFORE.length - 1) : 0

  return (
    <section id="resultados" className="py-24 px-6 md:px-20 bg-gradient-to-b from-[#1C332F] to-[#122320] relative overflow-hidden">
      {/* Subtle background glow element */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[60%] bg-teal-light/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto relative z-10">
        <div className="text-center mb-16">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-4 font-semibold font-sans">
            ✦ Transformações reais
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream leading-tight">
            Antes & <em className="italic text-gold font-normal">Depois</em>
          </h2>
          <p className="text-cream/50 font-light mt-4 text-sm max-w-md mx-auto leading-relaxed">
            Arraste o controle deslizante central para visualizar com precisão a transformação estética de nossos sorrisos.
          </p>
        </div>

        {!hasCases ? (
          <div className="max-w-md mx-auto text-center p-12 bg-white/5 border border-white/10 rounded-[32px] backdrop-blur-md shadow-inner">
            <Smile className="w-10 h-10 text-gold mx-auto mb-4 animate-pulse" />
            <p className="text-cream font-light text-base mb-2">Nenhum caso clínico disponível</p>
            <p className="text-cream/50 text-xs font-light">Estamos preparando nossa galeria com novos casos reais de transformações estéticas e funcionais. Fique atento!</p>
          </div>
        ) : (
          <>
            {/* Tabs - Glassmorphic capsule */}
            <div className="flex bg-white/5 border border-white/10 rounded-full p-1.5 gap-1 max-w-max mx-auto mb-12 shadow-inner">
              {cases.map((c, i) => (
                <button
                  key={c.id}
                  onClick={() => setActiveIdx(i)}
                  className={`px-6 py-2.5 text-[10px] tracking-[0.15em] uppercase transition-all duration-300 font-sans font-semibold rounded-full ${
                    i === activeIdx
                      ? 'text-[#1C332F] bg-gold shadow-md'
                      : 'text-cream/55 hover:text-cream/80 hover:bg-white/5'
                  }`}
                >
                  {c.category || c.title}
                </button>
              ))}
            </div>

            <div className="max-w-4xl mx-auto">
              {active && (
                <Slider
                  key={active.id}
                  beforeUrl={active.before_url}
                  afterUrl={active.after_url}
                  beforePlaceholder={PLACEHOLDER_BEFORE[idx]}
                  afterPlaceholder={PLACEHOLDER_AFTER[idx]}
                />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
