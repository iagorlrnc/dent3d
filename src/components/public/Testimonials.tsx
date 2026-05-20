import { useEffect, useState } from 'react'
import { testimonialQueries } from '@/lib/queries'
import type { Testimonial } from '@/types'

const FALLBACK: Testimonial[] = [
  { id:'1', patient_name:'Maria Fernanda', rating:5, text:'Fiz o clareamento e as lentes de contato. O resultado superou todas as minhas expectativas! A equipe é incrível.', status:'approved', created_at:'2025-03-01' },
  { id:'2', patient_name:'João Paulo',     rating:5, text:'O implante foi feito com muito cuidado. Nem senti dor! Estou extremamente satisfeito com o atendimento.', status:'approved', created_at:'2025-01-01' },
  { id:'3', patient_name:'Luciana Souza',  rating:5, text:'Ambiente acolhedor, profissionais competentes. Finalmente encontrei uma clínica onde me sinto à vontade.', status:'approved', created_at:'2025-02-01' },
]

export function Testimonials() {
  const [items, setItems] = useState<Testimonial[]>(FALLBACK)

  useEffect(() => {
    testimonialQueries.listApproved().then(({ data }) => {
      if (data && data.length > 0) setItems(data)
    })
  }, [])

  return (
    <section id="depoimentos" className="py-24 px-6 md:px-20 bg-gradient-to-b from-ivory to-cream relative">
      {/* Decorative dot background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-4 font-semibold font-sans">
            ✦ O que dizem nossos pacientes
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark">
            <em className="italic text-gold font-normal">Depoimentos</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {items.map(t => (
            <div 
              key={t.id} 
              className="bg-white/40 border border-white/70 backdrop-blur-md p-8 md:p-10 rounded-[32px] shadow-[0_10px_30px_rgba(74,123,111,0.01)] hover:border-gold/30 hover:bg-white/60 hover:shadow-md transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                {/* Minimalist Gold Rating Stars */}
                <div className="text-gold text-[12px] tracking-[4px] mb-6 select-none font-sans">
                  {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
                </div>
                
                {/* Quotation text */}
                <p className="font-display text-lg italic text-dark/95 leading-relaxed mb-8">
                  "{t.text}"
                </p>
              </div>

              {/* Patient Info */}
              <div className="flex items-center gap-4 mt-auto border-t border-teal-clinic/10 pt-6">
                {/* Patient Initial Monogram Circle */}
                <div className="w-10 h-10 rounded-full bg-teal-clinic/5 border border-teal-clinic/10 flex items-center justify-center font-display text-sm font-semibold text-teal-clinic uppercase select-none">
                  {t.patient_name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-semibold text-dark font-sans">{t.patient_name}</p>
                  <p className="text-[10px] text-stone-muted uppercase tracking-wider mt-0.5 font-sans font-light">
                    {new Date(t.created_at).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
