import { useState } from "react"
import { Menu } from "lucide-react"
import { AdminSidebar, type AdminPage } from "@/components/admin/AdminSidebar"
import { Dashboard } from "@/components/admin/Dashboard"
import { Appointments } from "@/components/admin/Appointments"
import { Services } from "@/components/admin/Services"
import { Specialists } from "@/components/admin/Specialists"
import { Gallery } from "@/components/admin/Gallery"
import { Testimonials } from "@/components/admin/Testimonials"
import { Messages } from "@/components/admin/Messages"
import { SettingsPanel } from "@/components/admin/SettingsPanel"
import { ToastContainer } from "@/components/ui/Toast"
import { useToast } from "@/hooks/useToast"

interface AdminPanelProps {
  onExit: () => void
}

export function AdminPanel({ onExit }: AdminPanelProps) {
  const [page, setPage] = useState<AdminPage>("dashboard")
  const [mobileOpen, setMobileOpen] = useState(false)
  const { toasts, addToast, removeToast } = useToast()

  const pageProps = {
    onSuccess: (m: string) => addToast(m, "success"),
    onError: (m: string) => addToast(m, "error"),
  }

  const renderPage = () => {
    switch (page) {
      case "dashboard":
        return <Dashboard />
      case "appointments":
        return <Appointments {...pageProps} />
      case "services":
        return <Services {...pageProps} />
      case "specialists":
        return <Specialists {...pageProps} />
      case "gallery":
        return <Gallery {...pageProps} />
      case "testimonials":
        return <Testimonials {...pageProps} />
      case "messages":
        return <Messages {...pageProps} />
      case "settings":
        return <SettingsPanel {...pageProps} />
    }
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-cream via-ivory to-teal-light/15 overflow-hidden relative">
      {/* Background Decorators */}
      <div className="absolute inset-0 bg-[radial-gradient(#C9A96E_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.03] pointer-events-none" />
      <div className="absolute top-1/4 left-1/3 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gold-light/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[10000ms]" />
      <div className="absolute bottom-1/4 right-1/4 translate-x-1/2 translate-y-1/2 w-96 h-96 bg-teal-light/10 rounded-full blur-[120px] pointer-events-none animate-pulse duration-[8000ms]" />

      {/* Sidebar */}
      <AdminSidebar
        current={page}
        onChange={setPage}
        onClose={() => {
          setMobileOpen(false)
        }}
        mobileOpen={mobileOpen}
      />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {/* Mobile topbar */}
        <div className="md:hidden flex items-center justify-between px-5 py-4 bg-white/40 border-b border-white/60 backdrop-blur-md">
          <button onClick={() => setMobileOpen(true)} className="text-dark">
            <Menu size={22} />
          </button>
          <div className="font-display text-lg text-dark">
            Sorrir<span className="text-gold">.</span>Clinic
          </div>
          <button
            onClick={onExit}
            className="text-xs tracking-widest uppercase text-stone-muted hover:text-gold transition-colors font-semibold"
          >
            Sair
          </button>
        </div>

        {/* Desktop topbar */}
        <div className="hidden md:flex items-center justify-between px-8 py-4 bg-white/40 border-b border-white/60 backdrop-blur-md">
          <div className="text-xs tracking-widest uppercase text-stone-muted font-semibold">
            Painel Administrativo
          </div>
          <button
            onClick={onExit}
            className="text-xs tracking-widest uppercase text-stone-muted hover:text-teal-clinic transition-colors font-semibold flex items-center gap-1"
          >
            ← Voltar ao site
          </button>
        </div>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="px-6 md:px-10 py-8 max-w-6xl mx-auto">
            {renderPage()}
          </div>
        </main>
      </div>

      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  )
}
