import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  ClipboardCheck,
  BarChart3,
  ScanLine,
  Database,
  Users,
  Target,
  UserCircle,
  Settings,
  X,
  Leaf,
} from 'lucide-react';

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

const navItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { to: '/data', icon: BarChart3, label: 'Dados' },
  { to: '/scanner', icon: ScanLine, label: 'Scanner' },
  { to: '/omega', icon: Database, label: 'Omega Database' },
  { to: '/community', icon: Users, label: 'Comunidade' },
  { to: '/protocol', icon: Target, label: 'Protocolo 120' },
  { to: '/profile', icon: UserCircle, label: 'Perfil' },
  { to: '/settings', icon: Settings, label: 'Configuracoes' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-[240px] bg-white z-50
          border-r border-gray-100
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center shadow-sm">
              <Leaf className="w-5 h-5 text-dark" />
            </div>
            <div>
              <h1 className="text-base font-bold text-text">Life Balance</h1>
              <p className="text-[10px] text-text3 tracking-wide uppercase">Wellness Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 text-text3"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-lime text-dark shadow-sm'
                    : 'text-text2 hover:text-text hover:bg-gray-50'
                }`
              }
            >
              <item.icon className="w-[18px] h-[18px] flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        {/* Protocol Progress */}
        <div className="px-4 pb-5">
          <div className="px-4 py-3.5 bg-dark rounded-2xl">
            <p className="text-[11px] text-white/50 uppercase tracking-wider font-medium">Protocolo 120 Dias</p>
            <div className="mt-2.5 h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime rounded-full transition-all duration-500"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-[11px] text-white/40 mt-1.5">Dia 54 de 120</p>
          </div>
        </div>
      </aside>
    </>
  );
}
