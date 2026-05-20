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
    <section id="depoimentos" className="py-24 px-6 md:px-20 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">✦ O que dizem nossos pacientes</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark">
            <em className="italic text-gold">Depoimentos</em>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {items.map(t => (
            <div key={t.id} className="bg-white p-9 rounded-sm border-t-[3px] border-gold shadow-sm hover:shadow-lg transition-shadow">
              <div className="text-gold text-base tracking-[3px] mb-4">
                {'★'.repeat(t.rating)}{'☆'.repeat(5 - t.rating)}
              </div>
              <p className="font-display text-lg italic text-dark leading-relaxed mb-6">
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-gold-light flex items-center justify-center text-base">
                  😊
                </div>
                <div>
                  <p className="text-sm font-medium text-dark">{t.patient_name}</p>
                  <p className="text-xs text-stone-muted">
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
