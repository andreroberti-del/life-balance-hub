import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, BarChart3, ScanLine, Database, Users, Target,
  UserCircle, Settings, Leaf, Kanban, Bell, UserCheck, TestTube2, BarChart2,
  PanelLeftClose, PanelLeft,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

interface NavSection {
  label?: string;
  items: { to: string; icon: LucideIcon; label: string }[];
}

const sections: NavSection[] = [
  {
    label: 'Principal',
    items: [
      { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
      { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
      { to: '/data', icon: BarChart3, label: 'Dados' },
      { to: '/scanner', icon: ScanLine, label: 'Scanner' },
      { to: '/omega', icon: Database, label: 'Omega Database' },
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

function SidebarLink({
  to, icon: Icon, label, expanded, end,
}: {
  to: string; icon: LucideIcon; label: string; expanded: boolean; end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={!expanded ? label : undefined}
      className={({ isActive }) =>
        `group flex items-center gap-3 rounded-lg transition-all duration-150 ${
          expanded ? 'px-3 py-2.5' : 'justify-center p-2.5'
        } ${
          isActive
            ? 'bg-accent text-white'
            : 'text-text3 hover:bg-bg hover:text-text'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.8} />
      {expanded && (
        <span className="text-[14px] font-medium">{label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex h-screen flex-col bg-card border-r border-border transition-all duration-300 ${
        expanded ? 'w-60' : 'w-16'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center h-16 border-b border-border ${expanded ? 'px-4 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center flex-shrink-0">
            <Leaf className="w-4 h-4 text-white" strokeWidth={2} />
          </div>
          {expanded && (
            <span className="text-sm font-semibold text-text tracking-[-0.01em]">
              Life Balance
            </span>
          )}
        </div>
        {expanded && (
          <button onClick={onToggle} className="p-1.5 rounded-md text-text4 hover:text-text3 hover:bg-bg transition-colors">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {!expanded && (
        <div className="flex justify-center pt-3 pb-1">
          <button onClick={onToggle} className="p-1.5 rounded-md text-text4 hover:text-text3 hover:bg-bg transition-colors">
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto py-4 ${expanded ? 'px-3' : 'px-2'}`}>
        {sections.map((section, idx) => (
          <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
            {idx > 0 && <div className={`mb-4 ${expanded ? 'mx-1' : 'mx-0.5'}`}><div className="h-px bg-border" /></div>}
            {section.label && expanded && (
              <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.08em] mb-2 px-3">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {section.items.map((item) => (
                <SidebarLink key={item.to} {...item} expanded={expanded} end={item.to === '/'} />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-border py-3 ${expanded ? 'px-3' : 'px-2'}`}>
        <div className="flex flex-col gap-0.5">
          {bottomItems.map((item) => (
            <SidebarLink key={item.to} {...item} expanded={expanded} />
          ))}
        </div>
      </div>
    </aside>
  );
}
