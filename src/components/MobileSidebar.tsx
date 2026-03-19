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
  Kanban,
  Bell,
  UserCheck,
  TestTube2,
  BarChart2,
  type LucideIcon,
} from 'lucide-react';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const wellnessItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { to: '/data', icon: BarChart3, label: 'Dados' },
  { to: '/scanner', icon: ScanLine, label: 'Scanner' },
  { to: '/omega', icon: Database, label: 'Omega' },
  { to: '/community', icon: Users, label: 'Comunidade' },
  { to: '/protocol', icon: Target, label: 'Protocolo 120' },
];

const crmItems = [
  { to: '/crm/pipeline', icon: Kanban, label: 'Pipeline' },
  { to: '/crm/followups', icon: Bell, label: 'Follow-ups' },
  { to: '/crm/clients', icon: UserCheck, label: 'Clientes' },
  { to: '/crm/tests', icon: TestTube2, label: 'Testes' },
  { to: '/crm/performance', icon: BarChart2, label: 'Performance' },
];

const bottomItems = [
  { to: '/profile', icon: UserCircle, label: 'Perfil' },
  { to: '/settings', icon: Settings, label: 'Configurações' },
];

function NavItem({ to, icon: Icon, label, onClick, end }: {
  to: string;
  icon: LucideIcon;
  label: string;
  onClick: () => void;
  end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all ${
          isActive
            ? 'bg-lime text-dark font-semibold shadow-[0_4px_16px_rgba(212,225,87,0.25)]'
            : 'text-[rgba(255,255,255,0.4)] hover:bg-[rgba(255,255,255,0.06)] hover:text-text'
        }`
      }
    >
      <Icon className="w-5 h-5 flex-shrink-0" strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden"
        onClick={onClose}
      />
      <aside className="fixed top-0 left-0 w-[280px] h-screen bg-dark2 border-r border-border flex flex-col z-50 lg:hidden">
        {/* Header */}
        <div className="px-5 pt-6 pb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 bg-lime rounded-2xl flex items-center justify-center shadow-[0_4px_16px_rgba(212,225,87,0.3)]">
              <Leaf className="w-5 h-5 text-dark" strokeWidth={2} />
            </div>
            <div>
              <h1 className="text-base font-bold text-text">Life Balance</h1>
              <p className="text-[10px] text-text4 tracking-[2px] uppercase">Wellness Hub</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-dark3 text-text4">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 overflow-y-auto">
          <div className="flex flex-col gap-1">
            {wellnessItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} end={item.to === '/'} />
            ))}
          </div>

          <div className="mx-3 my-3">
            <div className="h-px bg-border" />
            <p className="text-[10px] font-bold text-text4 uppercase tracking-[2px] mt-3">CRM</p>
          </div>

          <div className="flex flex-col gap-1">
            {crmItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </div>

          <div className="mx-3 my-3"><div className="h-px bg-border" /></div>

          <div className="flex flex-col gap-1">
            {bottomItems.map((item) => (
              <NavItem key={item.to} {...item} onClick={onClose} />
            ))}
          </div>
        </nav>

        {/* Protocol */}
        <div className="p-4">
          <div className="p-4 bg-dark rounded-2xl border border-border">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] text-text4 uppercase tracking-[2px] font-semibold">Protocolo 120</p>
              <span className="text-lime text-xs font-bold">45%</span>
            </div>
            <div className="h-1.5 bg-[rgba(255,255,255,0.08)] rounded-full overflow-hidden">
              <div className="w-[45%] h-full bg-lime rounded-full shadow-[0_0_8px_rgba(212,225,87,0.3)]" />
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
