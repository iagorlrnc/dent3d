const TEAM = [
  { 
    name: 'Dra. Ana Ribeiro', 
    specialty: 'Implantodontista', 
    image: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&fit=crop&q=80',
    crm: 'CRO/SP 12345'
  },
  { 
    name: 'Dr. Carlos Mendes', 
    specialty: 'Ortodontista', 
    image: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=400&fit=crop&q=80',
    crm: 'CRO/SP 67890'
  },
  { 
    name: 'Dra. Patrícia Lima', 
    specialty: 'Estética Dental', 
    image: 'https://images.unsplash.com/photo-1594824813573-246434e33963?w=400&fit=crop&q=80',
    crm: 'CRO/SP 54321'
  },
  { 
    name: 'Dr. Rafael Costa', 
    specialty: 'Periodontista', 
    image: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=400&fit=crop&q=80',
    crm: 'CRO/SP 09876'
  },
]

export function Team() {
  return (
    <section id="equipe" className="py-24 px-6 md:px-20 bg-gradient-to-b from-cream to-ivory relative">
      {/* Decorative dot background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="text-center mb-20">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-4 font-semibold font-sans">
            ✦ Nossos especialistas
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark">
            A <em className="italic text-gold font-normal">equipe</em>
          </h2>
          <p className="text-stone-muted font-light mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Profissionais dedicados, com formação de excelência internacional e o compromisso de cuidar da sua saúde com máxima precisão.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {TEAM.map(member => (
            <div key={member.name} className="text-center group">
              <div className="w-full aspect-[3/4] rounded-[32px] overflow-hidden mb-6 relative bg-ivory shadow-[0_10px_30px_rgba(74,123,111,0.02)] border border-white/60 hover:border-gold/30 hover:shadow-lg transition-all duration-500">
                <img 
                  src={member.image} 
                  alt={member.name} 
                  className="w-full h-full object-cover transition-transform duration-750 ease-out group-hover:scale-105" 
                />
                {/* Overlay shading on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Floating CRO/CRM registry badge */}
                <div className="absolute bottom-5 left-5 bg-white/80 backdrop-blur-md border border-gold/20 px-3.5 py-1.5 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-3 group-hover:translate-y-0">
                  <span className="text-[9px] tracking-wider uppercase text-stone-muted font-sans font-semibold">
                    {member.crm}
                  </span>
                </div>
              </div>

              <h4 className="font-display text-2xl font-light text-dark mb-1.5 group-hover:text-teal-clinic transition-colors duration-300">
                {member.name}
              </h4>
              <p className="text-[10px] tracking-[0.15em] uppercase text-gold font-semibold font-sans">
                {member.specialty}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
