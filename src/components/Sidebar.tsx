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
  ChevronsLeft,
  ChevronsRight,
  type LucideIcon,
} from 'lucide-react';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

const wellnessItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard', short: 'Home' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in', short: 'Check' },
  { to: '/data', icon: BarChart3, label: 'Dados', short: 'Data' },
  { to: '/scanner', icon: ScanLine, label: 'Scanner', short: 'Scan' },
  { to: '/omega', icon: Database, label: 'Omega Database', short: 'Omega' },
  { to: '/community', icon: Users, label: 'Comunidade', short: 'Social' },
  { to: '/protocol', icon: Target, label: 'Protocolo 120', short: 'Proto' },
];

const crmItems = [
  { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline', short: 'Pipe' },
  { to: '/crm/followups', icon: Bell, label: 'Follow-ups', short: 'Follow' },
  { to: '/crm/clients', icon: UserCheck, label: 'Clientes', short: 'Client' },
  { to: '/crm/tests', icon: TestTube2, label: 'Testes', short: 'Tests' },
  { to: '/crm/performance', icon: BarChart2, label: 'Performance', short: 'Perf' },
];

const bottomItems = [
  { to: '/profile', icon: UserCircle, label: 'Perfil', short: 'Perfil' },
  { to: '/settings', icon: Settings, label: 'Configurações', short: 'Config' },
];

function SidebarNavItem({ to, icon: Icon, label, short, expanded, end }: {
  to: string;
  icon: LucideIcon;
  label: string;
  short: string;
  expanded: boolean;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      className={({ isActive }) =>
        `group relative flex items-center rounded-2xl transition-all duration-200 ${
          expanded
            ? 'gap-3 px-4 py-2.5'
            : 'flex-col justify-center w-full py-2'
        } ${
          isActive
            ? 'bg-lime text-dark shadow-[0_4px_12px_rgba(212,225,87,0.25)]'
            : 'text-[rgba(255,255,255,0.35)] hover:text-[rgba(255,255,255,0.7)] hover:bg-[rgba(255,255,255,0.06)]'
        }`
      }
    >
      <Icon className={expanded ? 'w-[18px] h-[18px]' : 'w-[20px] h-[20px]'} strokeWidth={1.8} />
      {expanded ? (
        <span className="text-[13px] font-medium whitespace-nowrap">{label}</span>
      ) : (
        <span className="text-[9px] font-medium mt-0.5 leading-tight">{short}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  return (
    <aside
      className={`hidden lg:flex h-screen bg-dark2 border-r border-border flex-col transition-all duration-300 ease-in-out ${
        expanded ? 'w-[220px] min-w-[220px]' : 'w-[72px] min-w-[72px]'
      }`}
    >
      {/* Logo + Toggle */}
      <div className={`flex items-center pt-5 pb-4 ${expanded ? 'px-5 justify-between' : 'px-0 justify-center flex-col gap-3'}`}>
        <div className={`flex items-center ${expanded ? 'gap-3' : 'justify-center'}`}>
          <div className="w-10 h-10 bg-lime rounded-xl flex items-center justify-center shadow-[0_4px_12px_rgba(212,225,87,0.25)] flex-shrink-0">
            <Leaf className="w-5 h-5 text-dark" strokeWidth={2.2} />
          </div>
          {expanded && (
            <div className="overflow-hidden">
              <h1 className="text-sm font-bold text-text leading-tight whitespace-nowrap">Life Balance</h1>
              <p className="text-[9px] text-text4 tracking-[1.5px] uppercase">Hub</p>
            </div>
          )}
        </div>
        <button
          onClick={onToggle}
          className={`w-7 h-7 rounded-lg bg-dark3 border border-border flex items-center justify-center text-text4 hover:text-text3 hover:bg-dark4 transition-colors flex-shrink-0 ${
            expanded ? '' : ''
          }`}
        >
          {expanded ? <ChevronsLeft className="w-3.5 h-3.5" /> : <ChevronsRight className="w-3.5 h-3.5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className={`flex-1 overflow-y-auto ${expanded ? 'px-3' : 'px-2'}`}>
        {/* Wellness Section */}
        <div className="flex flex-col gap-0.5">
          {wellnessItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} expanded={expanded} end={item.to === '/'} />
          ))}
        </div>

        {/* Separator */}
        <div className={`my-3 ${expanded ? 'mx-2' : 'mx-3'}`}>
          <div className="h-px bg-border" />
          {expanded && (
            <p className="text-[9px] font-bold text-text4 uppercase tracking-[2px] mt-2.5 ml-2">CRM</p>
          )}
        </div>

        {/* CRM Section */}
        <div className="flex flex-col gap-0.5">
          {crmItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} expanded={expanded} />
          ))}
        </div>
      </nav>

      {/* Bottom */}
      <div className={`${expanded ? 'px-3' : 'px-2'} pb-3 pt-2 border-t border-border`}>
        <div className="flex flex-col gap-0.5">
          {bottomItems.map((item) => (
            <SidebarNavItem key={item.to} {...item} expanded={expanded} />
          ))}
        </div>

        {/* Protocol indicator */}
        <div className={`mt-3 rounded-xl bg-dark border border-border overflow-hidden ${expanded ? 'p-3' : 'p-2 text-center'}`}>
          {expanded ? (
            <>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[9px] text-text4 uppercase tracking-[1.5px] font-semibold">Protocolo 120</span>
                <span className="text-[11px] text-lime font-bold">45%</span>
              </div>
              <div className="h-1 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
                <div className="w-[45%] h-full bg-lime rounded-full shadow-[0_0_6px_rgba(212,225,87,0.3)]" />
              </div>
            </>
          ) : (
            <span className="text-[11px] font-bold text-lime">54</span>
          )}
        </div>
      </div>
    </aside>
  );
}
