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
        `flex items-center gap-3.5 px-4 py-3 rounded-xl text-[15px] font-medium tracking-[-0.01em] transition-all ${
          isActive
            ? 'bg-surface-purple text-white shadow-[0_2px_12px_hsla(252,40%,55%,0.3)]'
            : 'text-text3 hover:bg-dark3 hover:text-text'
        }`
      }
    >
      <Icon className="w-[20px] h-[20px] flex-shrink-0" strokeWidth={1.7} />
      {label}
    </NavLink>
  );
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;
  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed top-0 left-0 w-76 h-screen bg-card border-r border-border flex flex-col z-50 lg:hidden animate-in slide-in-from-left duration-200">
        {/* Header */}
        <div className="flex items-center justify-between h-[72px] px-5 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className="w-10 h-10 bg-surface-purple rounded-xl flex items-center justify-center shadow-[0_2px_12px_hsla(252,40%,55%,0.25)]">
              <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
            </div>
            <span className="text-base font-bold text-text tracking-[-0.02em]">Life Balance</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark3 text-text4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-4 py-5 overflow-y-auto">
          {sections.map((section, idx) => (
            <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
              {idx > 0 && (
                <div className="mb-5 mx-2">
                  <div className="h-px bg-border" />
                </div>
              )}
              {section.label && (
                <p className="text-[11px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
                  {section.label}
                </p>
              )}
              <div className="flex flex-col gap-1.5">
                {section.items.map((item) => (
                  <NavItem key={item.to} {...item} onClick={onClose} end={item.to === '/'} />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border px-4 py-4">
          <div className="flex flex-col gap-1.5">
            {bottomItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </div>
          <div className="mt-4 p-4 bg-accent-bg rounded-xl border border-border">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-text4 uppercase tracking-[0.08em] font-semibold">Protocolo 120</span>
              <span className="text-sm text-accent font-bold">45%</span>
            </div>
            <div className="h-2 bg-dark3 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-accent rounded-full" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
