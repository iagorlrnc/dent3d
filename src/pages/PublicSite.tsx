import { useState } from 'react'
import { Header }            from '@/components/public/Header'
import { Hero }              from '@/components/public/Hero'
import { Services }          from '@/components/public/Services'
import { BeforeAfterSection } from '@/components/public/BeforeAfterSlider'
import { Team }              from '@/components/public/Team'
import { Testimonials }      from '@/components/public/Testimonials'
import { Contact }           from '@/components/public/Contact'
import { Footer }            from '@/components/public/Footer'
import { LoginModal }        from '@/components/public/LoginModal'
import { ToastContainer }    from '@/components/ui/Toast'
import { useToast }          from '@/hooks/useToast'

interface PublicSiteProps {
  onAdminEnter: () => void
}

export function PublicSite({ onAdminEnter }: PublicSiteProps) {
  const [loginOpen, setLoginOpen] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  return (
    <>
      <Header onAdminClick={() => setLoginOpen(true)} />

      <main>
        <Hero
          onBook={() => document.getElementById('contato')?.scrollIntoView({ behavior: 'smooth' })}
          onResults={() => document.getElementById('resultados')?.scrollIntoView({ behavior: 'smooth' })}
        />
        <Services />
        <BeforeAfterSection />
        <Team />
        <Testimonials />
        <Contact
          onSuccess={m => addToast(m, 'success')}
          onError={m => addToast(m, 'error')}
        />
      </main>

      <Footer />

      <LoginModal
        open={loginOpen}
        onClose={() => setLoginOpen(false)}
        onSuccess={() => { setLoginOpen(false); onAdminEnter() }}
      />

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </>
  )
}
