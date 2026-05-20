import { useState } from 'react'
import { contactQueries, settingsQueries } from '@/lib/queries'
import { useEffect } from 'react'
import type { ClinicSettings } from '@/types'
import { Input, Select, Textarea } from '@/components/ui/Input'

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
    { icon: '📍', title: 'Endereço',              text: settings.address ?? '' },
    { icon: '📞', title: 'Telefone & WhatsApp',   text: `${settings.phone} / ${settings.whatsapp}` },
    { icon: '🕐', title: 'Horário de Atendimento', text: settings.hours ?? '' },
    { icon: '✉️', title: 'E-mail',                 text: settings.email ?? '' },
  ]

  return (
    <section id="contato" className="py-24 px-6 md:px-20 bg-dark">
      <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-20 items-start">
        {/* Info */}
        <div>
          <span className="text-[11px] tracking-[0.25em] uppercase text-gold block mb-4">✦ Entre em contato</span>
          <h2 className="font-display text-5xl md:text-6xl font-light text-cream leading-tight mb-10">
            Agende <em className="italic text-gold">sua consulta</em>
          </h2>
          {infoItems.map(item => (
            <div key={item.title} className="flex gap-4 mb-7">
              <div className="w-11 h-11 flex-shrink-0 rounded-sm bg-gold/10 border border-gold/20 flex items-center justify-center text-lg">
                {item.icon}
              </div>
              <div>
                <h4 className="text-[10px] tracking-[0.12em] uppercase text-gold mb-1">{item.title}</h4>
                <p className="text-sm text-cream/60 leading-relaxed">{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-white/5 border border-gold/15 rounded-sm p-10">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <Input
              label="Nome *"
              placeholder="Seu nome completo"
              value={form.name}
              onChange={e => set('name', e.target.value)}
              className="bg-white/5 border-white/10 text-cream placeholder:text-cream/20 focus:border-gold"
            />
            <Input
              label="Telefone *"
              placeholder="(00) 9 0000-0000"
              value={form.phone}
              onChange={e => set('phone', e.target.value)}
              className="bg-white/5 border-white/10 text-cream placeholder:text-cream/20 focus:border-gold"
            />
          </div>
          <div className="mb-4">
            <Input
              label="E-mail *"
              type="email"
              placeholder="seu@email.com"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              className="bg-white/5 border-white/10 text-cream placeholder:text-cream/20 focus:border-gold"
            />
          </div>
          <div className="mb-4">
            <Select
              label="Serviço de interesse"
              options={SERVICE_OPTIONS}
              value={form.service}
              onChange={e => set('service', e.target.value)}
              className="bg-white/5 border-white/10 text-cream focus:border-gold"
            />
          </div>
          <div className="mb-6">
            <Textarea
              label="Mensagem *"
              placeholder="Descreva como podemos ajudar..."
              value={form.message}
              onChange={e => set('message', e.target.value)}
              className="bg-white/5 border-white/10 text-cream placeholder:text-cream/20 focus:border-gold"
            />
          </div>
          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="w-full bg-gold text-dark py-4 text-[11px] tracking-[0.15em] uppercase rounded-sm font-medium hover:bg-cream transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? 'Enviando...' : 'Enviar Mensagem →'}
          </button>
        </div>
      </div>
    </section>
  )
}
