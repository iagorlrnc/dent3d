const TEAM = [
  { name: 'Dra. Ana Ribeiro',   specialty: 'Implantodontista',   emoji: '👩‍⚕️', bg: 'from-gold-light to-gold/60' },
  { name: 'Dr. Carlos Mendes',  specialty: 'Ortodontista',        emoji: '👨‍⚕️', bg: 'from-blue-200 to-blue-400/60' },
  { name: 'Dra. Patrícia Lima', specialty: 'Estética Dental',     emoji: '👩‍⚕️', bg: 'from-green-200 to-green-400/60' },
  { name: 'Dr. Rafael Costa',   specialty: 'Periodontista',       emoji: '👨‍⚕️', bg: 'from-rose-200 to-rose-400/60' },
]

export function Team() {
  return (
    <section id="equipe" className="py-24 px-6 md:px-20 bg-cream">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <span className="text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">✦ Nossos especialistas</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark">
            A <em className="italic text-gold">equipe</em>
          </h2>
          <p className="text-stone-muted font-light mt-4 max-w-lg mx-auto text-sm leading-relaxed">
            Profissionais dedicados, com formação de excelência e compromisso com o seu bem-estar.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-7">
          {TEAM.map(member => (
            <div key={member.name} className="text-center group">
              <div
                className={`w-full aspect-[3/4] rounded-sm bg-gradient-to-b ${member.bg} flex items-end justify-center overflow-hidden mb-5 relative`}
              >
                <span className="text-[80px] translate-y-3 group-hover:translate-y-0 transition-transform duration-500">
                  {member.emoji}
                </span>
                <div className="absolute inset-0 bg-gradient-to-t from-dark/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <h4 className="font-display text-xl font-light text-dark mb-1">{member.name}</h4>
              <p className="text-[11px] tracking-[0.1em] uppercase text-gold">{member.specialty}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
