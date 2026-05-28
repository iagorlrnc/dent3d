import { useState, useEffect } from 'react'
import { Header }            from '@/components/public/Header'
import { Hero }              from '@/components/public/Hero'
import { Services }          from '@/components/public/Services'
import { BeforeAfterSection } from '@/components/public/BeforeAfterSlider'
import { Team }              from '@/components/public/Team'
import { Contact }           from '@/components/public/Contact'
import { Footer }            from '@/components/public/Footer'
import { ToastContainer }    from '@/components/ui/Toast'
import { useToast }          from '@/hooks/useToast'
import { settingsQueries }   from '@/lib/queries'
import type { ClinicSettings } from '@/types'

interface PublicSiteProps {
  onAdminEnter: () => void
}

export function PublicSite({ onAdminEnter }: PublicSiteProps) {
  const [settings, setSettings] = useState<Partial<ClinicSettings> | null>(null)
  const { toasts, addToast, removeToast } = useToast()

  useEffect(() => {
    settingsQueries.get().then(({ data }) => {
      if (data) setSettings(data)
    })
  }, [])

  return (
    <>
      <Header 
        onAdminClick={onAdminEnter} 
        clinicName={settings?.clinic_name}
      />

      <main>
        <Hero
          onBook={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
          onResults={() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <Services />
        <BeforeAfterSection />
        <Team />
        <Contact
          settings={settings}
          onSuccess={m => addToast(m, 'success')}
          onError={m => addToast(m, 'error')}
        />
      </main>

      <Footer 
        clinicName={settings?.clinic_name}
        cro={settings?.cro}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
