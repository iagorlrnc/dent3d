import { useEffect, useState } from 'react'
import { serviceQueries } from '@/lib/queries'
import type { Service } from '@/types'
import { Smile } from 'lucide-react'

function getServiceImage(name: string): string {
  const normName = name.toLowerCase()
  if (normName.includes('clareamento')) {
    return 'https://images.unsplash.com/photo-1629909613654-28e377c37b09?w=600&auto=format&fit=crop&q=80'
  }
  if (normName.includes('lente') || normName.includes('faceta') || normName.includes('estética') || normName.includes('estet') || normName.includes('resina')) {
    return 'https://images.unsplash.com/photo-1579684389782-64d84b5e901d?w=600&auto=format&fit=crop&q=80'
  }
  if (normName.includes('implante') || normName.includes('protese') || normName.includes('prótese') || normName.includes('titânio')) {
    return 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?w=600&auto=format&fit=crop&q=80'
  }
  if (normName.includes('orto') || normName.includes('aparelho') || normName.includes('alinhador') || normName.includes('invis')) {
    return 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
  }
  if (normName.includes('perio') || normName.includes('gengiva')) {
    return 'https://images.unsplash.com/photo-1629909615184-74f495363b67?w=600&auto=format&fit=crop&q=80'
  }
  if (normName.includes('preven') || normName.includes('limpeza') || normName.includes('flúor') || normName.includes('higien')) {
    return 'https://images.unsplash.com/photo-1512223792601-592a9809eed4?w=600&auto=format&fit=crop&q=80'
  }

  return 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?w=600&auto=format&fit=crop&q=80'
}

export function Services() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchServices() {
      try {
        const { data } = await serviceQueries.listActive()
        setServices(data ?? [])
      } catch (e) {
        console.error(e)
      } finally {
        setLoading(false)
      }
    }
    fetchServices()
  }, [])

  if (loading) {
    return (
      <section id="servicos" className="py-24 px-6 md:px-20 bg-gradient-to-b from-ivory to-cream relative flex items-center justify-center min-h-[400px]">
        <div className="flex flex-col items-center gap-3 text-stone-muted">
          <div className="w-8 h-8 rounded-full border-2 border-teal-clinic border-t-transparent animate-spin" />
          <span className="text-xs font-sans tracking-widest uppercase">Carregando serviços...</span>
        </div>
      </section>
    )
  }

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

        {services.length === 0 ? (
          <div className="max-w-md mx-auto text-center p-12 bg-white/40 border border-white/70 rounded-[32px] backdrop-blur-md shadow-sm">
            <Smile className="w-10 h-10 text-gold mx-auto mb-4 animate-pulse" />
            <p className="text-dark font-light text-base mb-2">Nenhum serviço disponível</p>
            <p className="text-stone-muted text-xs font-light">Estamos atualizando nossa grade de tratamentos. Por favor, volte mais tarde ou entre em contato pelo nosso WhatsApp para tirar dúvidas!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <div
                key={service.id}
                className="perspective-1000 w-full h-[380px] md:h-[400px] group cursor-pointer"
              >
                <div className="relative w-full h-full transition-transform duration-700 preserve-3d group-hover:rotate-y-180">
                  {/* Front Face (Photo Card) */}
                  <div className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden backface-hidden shadow-[0_4px_20px_rgba(74,123,111,0.02)] border border-white/70 bg-ivory">
                    <img
                      src={service.image_url || getServiceImage(service.name)}
                      alt={service.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                    {/* Elegant overlay gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-dark/90 via-dark/30 to-transparent" />
                    
                    {/* Bottom luxury text overlay */}
                    <div className="absolute bottom-0 left-0 right-0 p-8 z-10 flex flex-col items-start">
                      <h3 className="font-display text-3xl font-light text-cream mb-2 leading-tight">
                        {service.name}
                      </h3>
                      <span className="text-[9px] tracking-[0.2em] uppercase text-gold font-semibold font-sans flex items-center gap-1.5">
                        Passe o mouse para ver detalhes <span className="text-xs">✦</span>
                      </span>
                    </div>
                  </div>

                  {/* Back Face (Specifications & Details Card) */}
                  <div className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden backface-hidden rotate-y-180 bg-white/60 border border-white/80 backdrop-blur-md p-8 md:p-10 shadow-[0_15px_30px_rgba(74,123,111,0.06)] flex flex-col justify-between">
                    {/* Subtle light glow inside back card */}
                    <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal-light/5 rounded-full blur-2xl transition-colors duration-500" />
                    
                    <div>
                      <h3 className="font-display text-2xl font-light text-dark mb-4">
                        {service.name}
                      </h3>
                      <p className="text-sm text-stone-muted leading-relaxed font-light mb-8">
                        {service.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="text-[10px] tracking-[0.12em] uppercase text-gold font-semibold font-sans">
                        Agende sua avaliação
                      </span>
                      <span className="w-5 h-5 rounded-full bg-teal-clinic/5 flex items-center justify-center text-[10px] text-teal-clinic font-sans">
                        ➔
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
