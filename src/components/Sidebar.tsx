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
  Leaf,
  Kanban,
  Bell,
  UserCheck,
  TestTube2,
  BarChart2,
  PanelLeftClose,
  PanelLeft,
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
  to,
  icon: Icon,
  label,
  expanded,
  end,
}: {
  to: string;
  icon: LucideIcon;
  label: string;
  expanded: boolean;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      title={!expanded ? label : undefined}
      className={({ isActive }) =>
        `group relative flex items-center gap-3.5 rounded-xl transition-all duration-200 ${
          expanded ? 'px-4 py-3' : 'justify-center p-3'
        } ${
          isActive
            ? 'bg-surface-purple text-white shadow-[0_2px_12px_hsla(252,40%,55%,0.3)]'
            : 'text-text3 hover:bg-dark3 hover:text-text'
        }`
      }
    >
      <Icon className="w-[20px] h-[20px] flex-shrink-0" strokeWidth={1.7} />
      {expanded && (
        <span className="text-[15px] font-medium tracking-[-0.01em]">{label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex h-screen flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${
        expanded ? 'w-64' : 'w-[72px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center h-[72px] border-b border-border ${expanded ? 'px-5 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 bg-surface-purple rounded-xl flex items-center justify-center shadow-[0_2px_12px_hsla(252,40%,55%,0.25)] flex-shrink-0">
            <Leaf className="w-5 h-5 text-white" strokeWidth={2} />
          </div>
          {expanded && (
            <span className="text-base font-bold text-text whitespace-nowrap tracking-[-0.02em]">
              Life Balance
            </span>
          )}
        </div>
        {expanded && (
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-text4 hover:text-text3 hover:bg-dark3 transition-colors"
          >
            <PanelLeftClose className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>

      {/* Collapsed toggle */}
      {!expanded && (
        <div className="flex justify-center pt-4 pb-2">
          <button
            onClick={onToggle}
            className="p-2 rounded-lg text-text4 hover:text-text3 hover:bg-dark3 transition-colors"
          >
            <PanelLeft className="w-[18px] h-[18px]" />
          </button>
        </div>
      )}

      {/* Nav sections */}
      <nav className={`flex-1 overflow-y-auto py-5 ${expanded ? 'px-4' : 'px-2.5'}`}>
        {sections.map((section, idx) => (
          <div key={idx} className={idx > 0 ? 'mt-6' : ''}>
            {idx > 0 && (
              <div className={`mb-5 ${expanded ? 'mx-2' : 'mx-1'}`}>
                <div className="h-px bg-border" />
              </div>
            )}
            {section.label && expanded && (
              <p className="text-[11px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1.5">
              {section.items.map((item) => (
                <SidebarLink
                  key={item.to}
                  {...item}
                  expanded={expanded}
                  end={item.to === '/'}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      {/* Bottom */}
      <div className={`border-t border-border py-4 ${expanded ? 'px-4' : 'px-2.5'}`}>
        <div className="flex flex-col gap-1.5">
          {bottomItems.map((item) => (
            <SidebarLink key={item.to} {...item} expanded={expanded} />
          ))}
        </div>

        {expanded && (
          <div className="mt-4 p-4 rounded-xl bg-accent-bg border border-border">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[11px] text-text4 uppercase tracking-[0.08em] font-semibold">
                Protocolo 120
              </span>
              <span className="text-sm text-accent font-bold">45%</span>
            </div>
            <div className="h-2 bg-dark3 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-accent rounded-full transition-all duration-500" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
