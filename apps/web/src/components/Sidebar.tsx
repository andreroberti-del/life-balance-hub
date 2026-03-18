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
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar({ open, onClose }: SidebarProps) {
  return (
    <>
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 h-full w-64 bg-dark z-50
          border-r border-dark4/50
          flex flex-col
          transition-transform duration-300 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex items-center justify-between p-6 border-b border-dark4/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-lime/20 rounded-xl flex items-center justify-center">
              <Leaf className="w-6 h-6 text-lime" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-white">Life Balance</h1>
              <p className="text-xs text-slate-400">Wellness Hub</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="lg:hidden p-1 rounded-lg hover:bg-dark3 text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-lime/15 text-lime border-l-2 border-lime'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-dark3/50'
                }`
              }
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-dark4/30">
          <div className="px-4 py-3 bg-dark3/50 rounded-xl">
            <p className="text-xs text-slate-400">Protocolo 120 Dias</p>
            <div className="mt-2 h-1.5 bg-dark4 rounded-full overflow-hidden">
              <div
                className="h-full bg-lime rounded-full"
                style={{ width: '45%' }}
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">Dia 54 de 120</p>
          </div>
        </div>
      </aside>
    </>
  );
}
