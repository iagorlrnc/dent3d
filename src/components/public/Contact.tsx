import { useState, useEffect } from 'react'
import { contactQueries, settingsQueries } from '@/lib/queries'
import type { ClinicSettings } from '@/types'
import { Input, Select, Textarea } from '@/components/ui/Input'
import { MapPin, Phone, Clock, Mail } from 'lucide-react'

const SERVICE_OPTIONS = [
  { value: '', label: 'Selecione um serviço' },
  { value: 'Clareamento Dental', label: 'Clareamento Dental' },
  { value: 'Lentes de Contato',  label: 'Lentes de Contato' },
  { value: 'Implante Dentário',  label: 'Implante Dentário' },
  { value: 'Ortodontia',         label: 'Ortodontia' },
  { value: 'Periodontia',        label: 'Periodontia' },
  { value: 'Prevenção',          label: 'Prevenção' },
  { value: 'Outro',              label: 'Outro' },
]

const DEFAULT_SETTINGS: Partial<ClinicSettings> = {
  phone: '(11) 9 9999-9999',
  whatsapp: '(11) 9 9999-9999',
  email: 'contato@sorrirclinic.com.br',
  address: 'Rua das Flores, 1250 — Sala 301, Centro, São Paulo — SP',
  hours: 'Segunda a Sexta: 8h às 18h | Sábados: 8h às 13h',
}

interface ContactProps {
  onSuccess: (msg: string) => void
  onError: (msg: string) => void
}

export function Contact({ onSuccess, onError }: ContactProps) {
  const [settings, setSettings] = useState<Partial<ClinicSettings>>(DEFAULT_SETTINGS)
  const [form, setForm] = useState({ name: '', phone: '', email: '', service: '', message: '' })
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    settingsQueries.get().then(({ data }) => { if (data) setSettings(data) })
  }, [])

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSubmit = async () => {
    if (!form.name || !form.phone || !form.email || !form.message) {
      onError('Preencha todos os campos obrigatórios.')
      return
    }
    setSubmitting(true)
    const { error } = await contactQueries.create({
      name: form.name,
      phone: form.phone,
      email: form.email,
      service: form.service || null,
      message: form.message,
    })
    setSubmitting(false)
    if (error) { onError('Erro ao enviar mensagem. Tente novamente.'); return }
    setForm({ name: '', phone: '', email: '', service: '', message: '' })
    onSuccess('Mensagem enviada! Entraremos em contato em breve.')
  }

  const infoItems = [
    { icon: <MapPin className="w-5 h-5 text-teal-clinic" />, title: 'Endereço',              text: settings.address ?? '' },
    { icon: <Phone className="w-5 h-5 text-teal-clinic" />,  title: 'Telefone & WhatsApp',   text: `${settings.phone} / ${settings.whatsapp}` },
    { icon: <Clock className="w-5 h-5 text-teal-clinic" />,  title: 'Horário de Atendimento', text: settings.hours ?? '' },
    { icon: <Mail className="w-5 h-5 text-teal-clinic" />,   title: 'E-mail',                 text: settings.email ?? '' },
  ]

  return (
    <section id="contato" className="py-24 px-6 md:px-20 bg-gradient-to-b from-cream to-ivory relative overflow-hidden">
      {/* Decorative dot background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />

      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-16 md:gap-20 items-start relative z-10">
        {/* Info */}
        <div className="flex flex-col justify-center h-full">
          <span className="text-[10px] tracking-[0.25em] uppercase text-gold block mb-4 font-semibold font-sans">
            ✦ Entre em contato
          </span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-dark leading-tight mb-12">
            Agende <em className="italic text-gold font-normal">sua consulta</em>
          </h2>
          
          <div className="flex flex-col gap-8">
            {infoItems.map(item => (
              <div key={item.title} className="flex gap-5 items-start">
                <div className="w-12 h-12 rounded-[18px] bg-teal-clinic/5 border border-teal-clinic/10 flex items-center justify-center flex-shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div className="pt-1">
                  <h4 className="text-[10px] tracking-[0.12em] uppercase text-gold font-semibold mb-1 font-sans">{item.title}</h4>
                  <p className="text-sm text-stone-muted leading-relaxed font-light">{item.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white/40 border border-white/70 backdrop-blur-md rounded-[32px] p-8 md:p-10 shadow-lg relative overflow-hidden">
          {/* Faint background ambient glow */}
          <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-teal-light/5 rounded-full blur-2xl pointer-events-none" />
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Nome *"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="bg-white border-white/60 text-dark placeholder:text-stone-300 focus:border-gold rounded-2xl shadow-sm"
            />
            <Input
              label="Telefone *"
              placeholder="(00) 9 0000-0000"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              className="bg-white border-white/60 text-dark placeholder:text-stone-300 focus:border-gold rounded-2xl shadow-sm"
            />
          </div>
          <div className="mb-4">
            <Input
              label="E-mail *"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="bg-white border-white/60 text-dark placeholder:text-stone-300 focus:border-gold rounded-2xl shadow-sm"
            />
          </div>
          <div className="mb-4">
            <Select
              label="Serviço de interesse"
              options={SERVICE_OPTIONS}
              value={form.service}
              onChange={e => set('service', e.target.value)}
              className="bg-white border-white/60 text-dark focus:border-gold rounded-2xl shadow-sm"
            />
          </div>
          <div className="mb-6">
            <Textarea
              label="Mensagem *"
              placeholder="Descreva como podemos ajudar..."
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className="bg-white border-white/60 text-dark placeholder:text-stone-300 focus:border-gold rounded-2xl shadow-sm"
            />
          </div>
          
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-teal-clinic hover:bg-dark text-cream py-4 text-[11px] tracking-[0.15em] uppercase rounded-full font-semibold transition-all duration-300 shadow-md hover:shadow-lg hover:shadow-teal-clinic/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Mensagem →'}
          </button>
        </div>
      </div>
    </section>
  )
}
