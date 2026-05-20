import {
  LayoutDashboard, Calendar, Users, Stethoscope,
  Images, MessageSquare, Settings, LogOut, X,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export type AdminPage =
  | 'dashboard'
  | 'appointments'
  | 'patients'
  | 'services'
  | 'gallery'
  | 'testimonials'
  | 'messages'
  | 'settings'

interface SidebarProps {
  current: AdminPage
  onChange: (p: AdminPage) => void
  onClose: () => void
  mobileOpen?: boolean
}

const ITEMS: { id: AdminPage; label: string; Icon: React.ElementType }[] = [
  { id: 'dashboard',    label: 'Dashboard',      Icon: LayoutDashboard },
  { id: 'appointments', label: 'Agendamentos',    Icon: Calendar },
  { id: 'patients',     label: 'Pacientes',       Icon: Users },
  { id: 'services',     label: 'Serviços',        Icon: Stethoscope },
  { id: 'gallery',      label: 'Galeria Antes/Depois', Icon: Images },
  { id: 'testimonials', label: 'Depoimentos',     Icon: MessageSquare },
  { id: 'messages',     label: 'Mensagens',       Icon: MessageSquare },
  { id: 'settings',     label: 'Configurações',   Icon: Settings },
]

export function AdminSidebar({ current, onChange, onClose, mobileOpen }: SidebarProps) {
  const { signOut } = useAuth()

  const handleLogout = async () => {
    await signOut()
    onClose()
  }

  return (
    <>
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-dark/60 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-dark z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0 md:static md:h-auto
        `}
      >
        {/* Logo */}
        <div className="px-7 py-6 border-b border-gold/10 flex items-center justify-between">
          <div>
            <div className="font-display text-xl font-light text-cream">
              Sorrir<span className="text-gold">.</span>Clinic
            </div>
            <p className="text-[9px] tracking-[0.18em] uppercase text-cream/30 mt-0.5">
              Painel Admin
            </p>
          </div>
          <button onClick={onClose} className="md:hidden text-cream/40 hover:text-cream">
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 overflow-y-auto">
          {ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => { onChange(id); onClose() }}
              className={`
                w-full flex items-center gap-3 px-7 py-3.5 text-sm transition-all
                border-l-[3px] text-left
                ${current === id
                  ? 'text-gold border-gold bg-gold/8'
                  : 'text-cream/45 border-transparent hover:text-cream/80 hover:bg-white/4'
                }
              `}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gold/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-gold flex items-center justify-center text-dark font-semibold text-sm">
              A
            </div>
            <div>
              <p className="text-xs text-cream font-medium">Administrador</p>
              <p className="text-[10px] text-cream/35">admin@sorrirclinic.com.br</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.1em] uppercase text-cream/35 border border-cream/10 rounded-sm hover:text-gold hover:border-gold/30 transition-all"
          >
            <LogOut size={12} />
            Sair do Painel
          </button>
        </div>
      </aside>
    </>
  )
}
