import { useEffect, useState } from 'react'
import { serviceQueries } from '@/lib/queries'
import type { Service } from '@/types'

const FALLBACK: Service[] = [
  { id:'1', name:'Clareamento Dental',  description:'Técnica profissional para um sorriso até 8 tons mais branco.', price_from:450,  unit:null,         icon:'✨', active:true, order_index:1, created_at:'' },
  { id:'2', name:'Lentes de Contato',   description:'Facetas ultra-finas de porcelana com mínimo desgaste dental.', price_from:1200, unit:'por dente',  icon:'💎', active:true, order_index:2, created_at:'' },
  { id:'3', name:'Implante Dentário',   description:'Substituição permanente com implante em titânio de alta durabilidade.', price_from:2500, unit:null, icon:'🦴', active:true, order_index:3, created_at:'' },
  { id:'4', name:'Ortodontia',          description:'Aparelhos fixos ou alinhadores invisíveis para alinhamento dental.', price_from:180, unit:'por mês', icon:'😁', active:true, order_index:4, created_at:'' },
  { id:'5', name:'Periodontia',         description:'Tratamento especializado das gengivas e estruturas de suporte.', price_from:200, unit:null, icon:'🔬', active:true, order_index:5, created_at:'' },
  { id:'6', name:'Prevenção',           description:'Limpeza, flúor e orientações para um sorriso sempre saudável.', price_from:150, unit:null, icon:'🛡️', active:true, order_index:6, created_at:'' },
]

export function Services() {
  const [services, setServices] = useState<Service[]>(FALLBACK)

  useEffect(() => {
    serviceQueries.listActive().then(({ data }) => {
      if (data && data.length > 0) setServices(data)
    })
  }, [])

  return (
    <section id="servicos" className="py-24 px-6 md:px-20 bg-ivory">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">✦ O que oferecemos</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark leading-tight">
            Tratamentos <em className="italic text-gold">completos</em>
          </h2>
          <p className="text-stone-muted font-light mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Do preventivo ao estético, cuidamos de cada detalhe para preservar a saúde e beleza do seu sorriso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0.5">
          {services.map(service => (
            <div
              key={service.id}
              className="group bg-cream p-10 relative overflow-hidden hover:bg-white transition-all duration-300 cursor-default"
            >
              {/* Hover accent */}
              <div className="absolute bottom-0 left-0 right-0 h-[3px] bg-gold scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />

              <div className="w-12 h-12 rounded-full bg-gold-light flex items-center justify-center text-xl mb-6">
                {service.icon}
              </div>
              <h3 className="font-display text-2xl font-light text-dark mb-3">
                {service.name}
              </h3>
              <p className="text-sm text-stone-muted leading-relaxed font-light mb-6">
                {service.description}
              </p>
              <p className="text-[11px] tracking-[0.1em] uppercase text-gold font-medium">
                A partir de R$ {service.price_from.toLocaleString('pt-BR')}
                {service.unit ? ` / ${service.unit}` : ''}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
