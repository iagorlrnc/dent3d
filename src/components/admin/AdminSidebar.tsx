import {
  LayoutDashboard,
  Calendar,
  Stethoscope,
  Images,
  MessageSquare,
  Settings,
  LogOut,
  X,
  Users,
} from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export type AdminPage =
  | "dashboard"
  | "appointments"
  | "services"
  | "specialists"
  | "gallery"
  | "messages"
  | "settings"

interface SidebarProps {
  current: AdminPage
  onChange: (p: AdminPage) => void
  onClose: () => void
  mobileOpen?: boolean
}

const ITEMS: { id: AdminPage; label: string; Icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard", Icon: LayoutDashboard },
  { id: "appointments", label: "Agendamentos", Icon: Calendar },
  { id: "services", label: "Serviços", Icon: Stethoscope },
  { id: "specialists", label: "Especialistas", Icon: Users },
  { id: "gallery", label: "Galeria Antes/Depois", Icon: Images },
  { id: "messages", label: "Mensagens", Icon: MessageSquare },
  { id: "settings", label: "Configurações", Icon: Settings },
]

export function AdminSidebar({
  current,
  onChange,
  onClose,
  mobileOpen,
}: SidebarProps) {
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
          className="fixed inset-0 bg-dark/40 backdrop-blur-sm z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-screen w-64 bg-white/40 backdrop-blur-lg border-r border-white/60 z-40 flex flex-col
          transition-transform duration-300 ease-in-out
          ${mobileOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0 md:static md:h-auto
        `}
      >
        {/* Logo */}
        <div className="px-7 py-6 border-b border-gold/15 flex items-center justify-between">
          <div>
            <div className="font-display text-xl font-light text-dark">
              Sorrir<span className="text-gold">.</span>Clinic
            </div>
            <p className="text-[9px] tracking-[0.18em] uppercase text-stone-muted/70 mt-0.5 font-semibold">
              Painel Admin
            </p>
          </div>
          <button
            onClick={onClose}
            className="md:hidden text-stone-muted hover:text-teal-clinic"
          >
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-5 overflow-y-auto">
          {ITEMS.map(({ id, label, Icon }) => (
            <button
              key={id}
              onClick={() => {
                onChange(id)
                onClose()
              }}
              className={`
                w-full flex items-center gap-3 px-7 py-3.5 text-sm transition-all duration-300
                border-l-[3px] text-left font-medium
                ${
                  current === id
                    ? "text-teal-clinic border-teal-clinic bg-teal-clinic/5 font-semibold"
                    : "text-stone-muted/80 border-transparent hover:text-dark hover:bg-white/30"
                }
              `}
            >
              <Icon size={16} />
              {label}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-7 py-5 border-t border-gold/15 bg-white/10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-9 h-9 rounded-full bg-teal-clinic/10 border border-teal-clinic/20 flex items-center justify-center text-teal-clinic font-semibold text-sm">
              A
            </div>
            <div>
              <p className="text-xs text-dark font-semibold">Administrador</p>
              <p className="text-[10px] text-stone-muted/70">
                admin@sorrirclinic.com.br
              </p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2.5 text-[10px] tracking-[0.1em] uppercase font-semibold text-teal-clinic border border-teal-clinic/20 rounded-full hover:bg-teal-clinic hover:text-cream transition-all duration-300 shadow-sm"
          >
            <LogOut size={12} />
            Sair do Painel
          </button>
        </div>
      </aside>
    </>
  )
}
