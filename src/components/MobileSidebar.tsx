import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, BarChart3, ScanLine, Database, Users, Target,
  UserCircle, Settings, X, Leaf, Kanban, Bell, UserCheck, TestTube2, BarChart2,
  type LucideIcon,
} from 'lucide-react';

interface MobileSidebarProps { open: boolean; onClose: () => void; }

const sections = [
  {
    label: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
      { to: '/data', icon: BarChart3, label: 'Dados' },
      { to: '/scanner', icon: ScanLine, label: 'Scanner' },
      { to: '/omega', icon: Database, label: 'Omega' },
      { to: '/community', icon: Users, label: 'Comunidade' },
      { to: '/protocol', icon: Target, label: 'Protocolo 120' },
    ],
  },
  {
    label: 'CRM',
    items: [
      { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline' },
      { to: '/crm/followups', icon: Bell, label: 'Follow-ups' },
      { to: '/crm/clients', icon: UserCheck, label: 'Clientes' },
      { to: '/crm/tests', icon: TestTube2, label: 'Testes' },
      { to: '/crm/performance', icon: BarChart2, label: 'Performance' },
    ],
  },
];

const bottomItems = [
  { to: '/profile', icon: UserCircle, label: 'Perfil' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

function NavItem({ to, icon: Icon, label, onClick, end }: {
  to: string; icon: LucideIcon; label: string; onClick: () => void; end?: boolean;
}) {
  return (
    <NavLink to={to} end={end} onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-[14px] font-medium transition-all ${
          isActive ? 'bg-accent text-white' : 'text-text3 hover:bg-bg hover:text-text'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed top-0 left-0 w-72 h-screen bg-card border-r border-border flex flex-col z-50 lg:hidden animate-in slide-in-from-left duration-200">
        <div className="flex items-center justify-between h-16 px-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
              <Leaf className="w-4 h-4 text-white" strokeWidth={2} />
            </div>
            <span className="text-sm font-semibold text-text">Life Balance</span>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-md hover:bg-bg text-text4">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-4 overflow-y-auto">
          {sections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
              {idx > 0 && <div className="mb-4 mx-1"><div className="h-px bg-border" /></div>}
              {section.label && (
                <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.08em] mb-2 px-3">
                  {section.label}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {section.items.map((item) => (
                  <NavItem key={item.to} {...item} onClick={onClose} end={item.to === '/'} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        <div className="border-t border-border px-3 py-3">
          <div className="flex flex-col gap-0.5">
            {bottomItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
