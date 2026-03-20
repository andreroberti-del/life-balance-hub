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
        `group flex items-center gap-3 rounded-xl transition-all duration-200 ${
          expanded ? 'px-3 py-2.5' : 'justify-center p-2.5'
        } ${
          isActive
            ? 'bg-surface-purple text-white shadow-md'
            : 'text-text3 hover:bg-dark3 hover:text-text'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
      {expanded && (
        <span className="text-sm font-medium truncate">{label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex h-screen flex-col bg-card border-r border-border transition-all duration-300 ease-in-out ${
        expanded ? 'w-60' : 'w-[68px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center h-16 border-b border-border ${expanded ? 'px-4 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-surface-purple rounded-xl flex items-center justify-center shadow-md flex-shrink-0">
            <Leaf className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
          {expanded && (
            <span className="text-sm font-bold text-text whitespace-nowrap">
              Life Balance
            </span>
          )}
        </div>
        {expanded && (
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-text4 hover:text-text3 hover:bg-dark3 transition-colors"
          >
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Collapsed toggle */}
      {!expanded && (
        <div className="flex justify-center pt-3 pb-1">
          <button
            onClick={onToggle}
            className="p-1.5 rounded-lg text-text4 hover:text-text3 hover:bg-dark3 transition-colors"
          >
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav sections */}
      <nav className={`flex-1 overflow-y-auto py-3 ${expanded ? 'px-3' : 'px-2'}`}>
        {sections.map((section, idx) => (
          <div key={idx}>
            {idx > 0 && (
              <div className={`my-3 ${expanded ? 'mx-1' : 'mx-1'}`}>
                <div className="h-px bg-border" />
              </div>
            )}
            {section.label && expanded && (
              <p className="text-[10px] font-semibold text-text4 uppercase tracking-widest mb-2 px-3">
                {section.label}
              </p>
            )}
            <div className="flex flex-col gap-1">
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
      <div className={`border-t border-border py-3 ${expanded ? 'px-3' : 'px-2'}`}>
        <div className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <SidebarLink key={item.to} {...item} expanded={expanded} />
          ))}
        </div>

        {expanded && (
          <div className="mt-3 p-3 rounded-xl bg-accent-bg border border-border">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] text-text4 uppercase tracking-widest font-semibold">
                Protocolo 120
              </span>
              <span className="text-xs text-accent font-bold">45%</span>
            </div>
            <div className="h-1.5 bg-dark3 rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-accent rounded-full" />
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
