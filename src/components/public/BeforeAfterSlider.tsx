import { useEffect, useRef, useState, useCallback } from 'react'
import { beforeAfterQueries } from '@/lib/queries'
import type { BeforeAfter } from '@/types'

// Fallback cases when Supabase has no data
const FALLBACK_CASES: BeforeAfter[] = [
  {
    id: '1', title: 'Clareamento', category: 'Clareamento', active: true, order_index: 1, created_at: '',
    before_url: '', after_url: '',
  },
  {
    id: '2', title: 'Lentes', category: 'Lentes', active: true, order_index: 2, created_at: '',
    before_url: '', after_url: '',
  },
  {
    id: '3', title: 'Ortodontia', category: 'Ortodontia', active: true, order_index: 3, created_at: '',
    before_url: '', after_url: '',
  },
]

const PLACEHOLDER_BEFORE = [
  { bg: 'from-[#6B5A3E] to-[#4A3A28]', emoji: '😬', label: 'Dentes amarelados' },
  { bg: 'from-[#7A6355] to-[#5A4A35]', emoji: '🙁', label: 'Diastema e irregularidades' },
  { bg: 'from-[#9B8B75] to-[#7B6B55]', emoji: '😬', label: 'Má oclusão dental' },
]
const PLACEHOLDER_AFTER = [
  { bg: 'from-[#F8F6EE] to-[#EEE8D8]', emoji: '😁', label: 'Sorriso clareado' },
  { bg: 'from-[#FAFAF8] to-[#F0ECE0]', emoji: '😄', label: 'Lentes de porcelana' },
  { bg: 'from-[#F8F6F0] to-[#EDE8DC]', emoji: '😁', label: 'Pós-ortodontia' },
]

interface SliderProps {
  beforeUrl: string
  afterUrl: string
  beforePlaceholder: { bg: string; emoji: string; label: string }
  afterPlaceholder:  { bg: string; emoji: string; label: string }
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
      className="relative w-full aspect-video rounded-sm overflow-hidden cursor-ew-resize select-none shadow-2xl"
      onMouseDown={onMouseDown}
      onTouchStart={onTouchStart}
    >
      {/* AFTER (full) */}
      <div className="absolute inset-0">
        {afterUrl ? (
          <img src={afterUrl} alt="Depois" className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${afterPlaceholder.bg} flex flex-col items-center justify-center gap-4`}>
            <span className="text-7xl">{afterPlaceholder.emoji}</span>
            <p className="font-display text-xl text-dark/50 italic">{afterPlaceholder.label}</p>
          </div>
        )}
      </div>

      {/* BEFORE (clipped) */}
      <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
        {beforeUrl ? (
          <img src={beforeUrl} alt="Antes" className="w-full h-full object-cover" draggable={false} />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${beforePlaceholder.bg} flex flex-col items-center justify-center gap-4`}>
            <span className="text-7xl">{beforePlaceholder.emoji}</span>
            <p className="font-display text-xl text-cream/50 italic">{beforePlaceholder.label}</p>
          </div>
        )}
      </div>

      {/* Handle */}
      <div
        className="absolute top-0 bottom-0 w-[3px] bg-gold shadow-[0_0_20px_rgba(201,169,110,0.7)] z-10 pointer-events-none"
        style={{ left: `${pos}%`, transform: 'translateX(-50%)' }}
      >
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-gold flex items-center justify-center shadow-lg text-dark font-bold text-sm">
          ⇔
        </div>
      </div>

      {/* Labels */}
      <span className="absolute top-4 left-4 z-10 bg-dark/75 text-cream text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm backdrop-blur-sm">
        Antes
      </span>
      <span className="absolute top-4 right-4 z-10 bg-dark/75 text-cream text-[10px] tracking-[0.15em] uppercase px-3 py-1.5 rounded-sm backdrop-blur-sm">
        Depois
      </span>
    </div>
  )
}

export function BeforeAfterSection() {
  const [cases, setCases] = useState<BeforeAfter[]>(FALLBACK_CASES)
  const [activeIdx, setActiveIdx] = useState(0)

  useEffect(() => {
    beforeAfterQueries.listActive().then(({ data }) => {
      if (data && data.length > 0) setCases(data)
    })
  }, [])

  const active = cases[activeIdx] ?? cases[0]
  const idx = Math.min(activeIdx, PLACEHOLDER_BEFORE.length - 1)

  return (
    <section id="resultados" className="py-24 px-6 md:px-20 bg-dark">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <span className="text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">✦ Transformações reais</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream leading-tight">
            Antes & <em className="italic text-gold">Depois</em>
          </h2>
          <p className="text-cream/40 font-light mt-4 text-sm">
            Arraste o controle deslizante para ver as transformações reais dos nossos pacientes.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-0 mb-8 border-b border-gold/20">
          {cases.map((c, i) => (
            <button
              key={c.id}
              onClick={() => setActiveIdx(i)}
              className={`px-6 py-3 text-[11px] tracking-[0.12em] uppercase transition-all border-b-2 -mb-px font-sans ${
                i === activeIdx
                  ? 'text-gold border-gold'
                  : 'text-cream/30 border-transparent hover:text-cream/60'
              }`}
            >
              {c.category || c.title}
            </button>
          ))}
        </div>

        <Slider
          key={active.id}
          beforeUrl={active.before_url}
          afterUrl={active.after_url}
          beforePlaceholder={PLACEHOLDER_BEFORE[idx]}
          afterPlaceholder={PLACEHOLDER_AFTER[idx]}
        />
      </div>
    </section>
  )
}
