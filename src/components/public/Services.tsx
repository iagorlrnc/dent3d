import { useEffect, useState } from 'react'
import { serviceQueries } from '@/lib/queries'
import type { Service } from '@/types'
import { Sparkles, Gem, Activity, Smile, Microscope, Shield } from 'lucide-react'

const FALLBACK: Service[] = [
  { id:'1', name:'Clareamento Dental',  description:'Técnica profissional para um sorriso até 8 tons mais branco.', price_from:450,  unit:null,         icon:'✨', active:true, order_index:1, created_at:'' },
  { id:'2', name:'Lentes de Contato',   description:'Facetas ultra-finas de porcelana com mínimo desgaste dental.', price_from:1200, unit:'por dente',  icon:'💎', active:true, order_index:2, created_at:'' },
  { id:'3', name:'Implante Dentário',   description:'Substituição permanente com implante em titânio de alta durabilidade.', price_from:2500, unit:null, icon:'🦴', active:true, order_index:3, created_at:'' },
  { id:'4', name:'Ortodontia',          description:'Aparelhos fixos ou alinhadores invisíveis para alinhamento dental.', price_from:180, unit:'por mês', icon:'😁', active:true, order_index:4, created_at:'' },
  { id:'5', name:'Periodontia',         description:'Tratamento especializado das gengivas e estruturas de suporte.', price_from:200, unit:null, icon:'🔬', active:true, order_index:5, created_at:'' },
  { id:'6', name:'Prevenção',           description:'Limpeza, flúor e orientações para um sorriso sempre saudável.', price_from:150, unit:null, icon:'🛡️', active:true, order_index:6, created_at:'' },
]

function getServiceIcon(iconStr: string) {
  switch (iconStr) {
    case '✨': return <Sparkles className="w-5 h-5 text-teal-clinic" />
    case '💎': return <Gem className="w-5 h-5 text-teal-clinic" />
    case '🦴': return <Activity className="w-5 h-5 text-teal-clinic" />
    case '😁': return <Smile className="w-5 h-5 text-teal-clinic" />
    case '🔬': return <Microscope className="w-5 h-5 text-teal-clinic" />
    case '🛡️': return <Shield className="w-5 h-5 text-teal-clinic" />
    default: return <Sparkles className="w-5 h-5 text-teal-clinic" />
  }
}

export function Services() {
  const [services, setServices] = useState<Service[]>(FALLBACK)

  useEffect(() => {
    serviceQueries.listActive().then(({ data }) => {
      if (data && data.length > 0) setServices(data)
    })
  }, [])

  return (
    <section id="servicos" className="py-24 px-6 md:px-20 bg-gradient-to-b from-ivory to-cream relative">
      {/* Decorative dot background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-4 font-semibold font-sans">
            ✦ O que oferecemos
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark leading-tight">
            Tratamentos <em className="italic text-gold font-normal">completos</em>
          </h2>
          <p className="text-stone-muted font-light mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Do preventivo ao estético, cuidamos de cada detalhe com precisão digital para esculpir o seu melhor sorriso.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(service => (
            <div
              key={service.id}
              className="group bg-white/40 border border-white/70 backdrop-blur-md p-8 md:p-10 rounded-[32px] hover:bg-white/70 hover:border-gold/30 hover:-translate-y-1 shadow-[0_4px_20px_rgba(74,123,111,0.02)] hover:shadow-[0_15px_30px_rgba(74,123,111,0.06)] transition-all duration-300 cursor-default relative overflow-hidden flex flex-col justify-between"
            >
              {/* Subtle light glow behind icon inside card */}
              <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-light/5 rounded-full blur-2xl group-hover:bg-gold-light/10 transition-colors duration-500" />
              
              <div>
                <div className="w-12 h-12 rounded-[18px] bg-teal-clinic/5 border border-teal-clinic/10 flex items-center justify-center mb-8 group-hover:bg-teal-clinic/10 transition-colors duration-300">
                  {getServiceIcon(service.icon)}
                </div>
                <h3 className="font-display text-2xl font-light text-dark mb-4 group-hover:text-teal-clinic transition-colors duration-300">
                  {service.name}
                </h3>
                <p className="text-sm text-stone-muted leading-relaxed font-light mb-8">
                  {service.description}
                </p>
              </div>

              <div className="flex items-center justify-between mt-auto">
                <span className="text-[10px] tracking-[0.12em] uppercase text-gold font-semibold font-sans">
                  A partir de R$ {service.price_from.toLocaleString('pt-BR')}
                  {service.unit ? ` / ${service.unit}` : ''}
                </span>
                <span className="w-5 h-5 rounded-full bg-teal-clinic/5 flex items-center justify-center text-[10px] text-teal-clinic opacity-0 group-hover:opacity-100 transition-opacity duration-300 font-sans">
                  ➔
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
