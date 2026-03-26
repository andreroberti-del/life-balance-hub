import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, BarChart3, ScanLine, Database, Users, Target,
  UserCircle, Settings, Leaf, Kanban, Bell, UserCheck, TestTube2, BarChart2,
  PanelLeftClose, PanelLeft, Lock, ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

interface NavSection {
  label?: string;
  items: { to: string; icon: LucideIcon; label: string }[];
}

const mainSection: NavSection = {
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
};

const crmSection: NavSection = {
  label: 'CRM',
  items: [
    { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline' },
    { to: '/crm/followups', icon: Bell, label: 'Follow-ups' },
    { to: '/crm/clients', icon: UserCheck, label: 'Clientes' },
    { to: '/crm/tests', icon: TestTube2, label: 'Testes' },
    { to: '/crm/performance', icon: BarChart2, label: 'Performance' },
  ],
};

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
        `group flex items-center gap-3 rounded-xl transition-all duration-200 ${
          expanded ? 'px-4 py-2.5' : 'justify-center p-3'
        } ${
          isActive
            ? 'bg-accent text-white font-medium shadow-[var(--shadow-card)]'
            : 'text-text3 hover:bg-bg2 hover:text-text2'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.6} />
      {expanded && (
        <span className="text-[13.5px] tracking-[-0.01em]">{label}</span>
      )}
    </NavLink>
  );
}

export default function Sidebar({ expanded, onToggle }: SidebarProps) {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _auth = useAuth();
  const isDistributor = false;
  const navigate = useNavigate();

  return (
    <aside
      className={`hidden lg:flex h-screen flex-col bg-card border-r border-border transition-all duration-300 ${
        expanded ? 'w-[240px]' : 'w-[68px]'
      }`}
    >
      {/* Header */}
      <div className={`flex items-center h-[64px] border-b border-border ${expanded ? 'px-5 justify-between' : 'justify-center'}`}>
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center flex-shrink-0">
            <Leaf className="w-[18px] h-[18px] text-white" strokeWidth={2} />
          </div>
          {expanded && (
            <span className="text-[15px] font-semibold text-text tracking-[-0.02em]">
              Life Balance
            </span>
          )}
        </div>
        {expanded && (
          <button onClick={onToggle} className="p-2 rounded-lg text-text4 hover:text-text3 hover:bg-bg2 transition-colors">
            <PanelLeftClose className="w-4 h-4" />
          </button>
        )}
      </div>

      {!expanded && (
        <div className="flex justify-center pt-4 pb-2">
          <button onClick={onToggle} className="p-2 rounded-lg text-text4 hover:text-text3 hover:bg-bg2 transition-colors">
            <PanelLeft className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Nav */}
      <nav className={`flex-1 overflow-y-auto py-5 ${expanded ? 'px-4' : 'px-2'}`}>
        {/* Main section */}
        <div>
          {mainSection.label && expanded && (
            <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
              {mainSection.label}
            </p>
          )}
          <div className="flex flex-col gap-1">
            {mainSection.items.map((item) => (
              <SidebarLink key={item.to} {...item} expanded={expanded} end={item.to === '/'} />
            ))}
          </div>
        </div>

        {/* CRM section */}
        <div className="mt-8">
          <div className={`mb-5 ${expanded ? 'mx-2' : 'mx-1'}`}><div className="h-px bg-border" /></div>
          {isDistributor ? (
            <>
              {expanded && (
                <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
                  {crmSection.label}
                </p>
              )}
              <div className="flex flex-col gap-1">
                {crmSection.items.map((item) => (
                  <SidebarLink key={item.to} {...item} expanded={expanded} />
                ))}
              </div>
            </>
          ) : (
            <button
              onClick={() => navigate('/distributor-upgrade')}
              title={!expanded ? 'CRM Distribuidor' : undefined}
              className={`w-full flex items-center gap-3 rounded-xl border border-dashed border-border text-text4 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all duration-200 ${
                expanded ? 'px-4 py-3' : 'justify-center p-3'
              }`}
            >
              <Lock className="w-[18px] h-[18px] flex-shrink-0" strokeWidth={1.6} />
              {expanded && (
                <div className="flex-1 text-left">
                  <p className="text-[12.5px] font-medium leading-tight">CRM Distribuidor</p>
                  <p className="text-[10.5px] text-text4 mt-0.5">Ativar acesso</p>
                </div>
              )}
              {expanded && <ArrowRight className="w-3.5 h-3.5 flex-shrink-0" />}
            </button>
          )}
        </div>
      </nav>

      {/* Bottom */}
      <div className={`border-t border-border py-4 ${expanded ? 'px-4' : 'px-2'}`}>
        <div className="flex flex-col gap-1">
          {bottomItems.map((item) => (
            <SidebarLink key={item.to} {...item} expanded={expanded} />
          ))}
        </div>
      </div>
    </aside>
  );
}
