import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, ClipboardCheck, BarChart3, ScanLine, Database, Users, Target,
  UserCircle, Settings, Leaf, Kanban, Bell, UserCheck, TestTube2, BarChart2,
  X, Lock, ArrowRight, type LucideIcon,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

const mainItems = [
  { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin', icon: ClipboardCheck, label: 'Check-in' },
  { to: '/data', icon: BarChart3, label: 'Dados' },
  { to: '/scanner', icon: ScanLine, label: 'Scanner' },
  { to: '/omega', icon: Database, label: 'Omega Database' },
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

function MobileLink({ to, icon: Icon, label, onClose, end }: {
  to: string; icon: LucideIcon; label: string; onClose: () => void; end?: boolean;
}) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
          isActive
            ? 'bg-accent text-white font-medium'
            : 'text-text3 hover:bg-bg2 hover:text-text2'
        }`
      }
    >
      <Icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
      <span className="text-[14px]">{label}</span>
    </NavLink>
  );
}

export default function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const { isDistributor } = useAuth();
  const navigate = useNavigate();

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      <aside className="fixed inset-y-0 left-0 w-[280px] bg-card z-50 lg:hidden flex flex-col shadow-[var(--shadow-lg)]">
        <div className="flex items-center justify-between h-[64px] px-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-accent rounded-xl flex items-center justify-center">
              <Leaf className="w-[18px] h-[18px] text-white" strokeWidth={2} />
            </div>
            <span className="text-[15px] font-semibold text-text">Life Balance</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-text4 hover:text-text3 hover:bg-bg2">
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-5 px-4">
          {/* Main */}
          <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
            Principal
          </p>
          <div className="flex flex-col gap-1">
            {mainItems.map((item) => (
              <MobileLink key={item.to} {...item} onClose={onClose} end={item.to === '/'} />
            ))}
          </div>

          {/* CRM */}
          <div className="mt-8">
            <div className="mb-5 mx-2"><div className="h-px bg-border" /></div>
            <p className="text-[10px] font-semibold text-text4 uppercase tracking-[0.1em] mb-3 px-4">
              CRM
            </p>
            {isDistributor ? (
              <div className="flex flex-col gap-1">
                {crmItems.map((item) => (
                  <MobileLink key={item.to} {...item} onClose={onClose} />
                ))}
              </div>
            ) : (
              <button
                onClick={() => { onClose(); navigate('/distributor-upgrade'); }}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-dashed border-border text-text4 hover:border-accent/40 hover:text-accent hover:bg-accent/5 transition-all"
              >
                <Lock className="w-[18px] h-[18px]" strokeWidth={1.6} />
                <div className="flex-1 text-left">
                  <p className="text-[13px] font-medium leading-tight">CRM Distribuidor</p>
                  <p className="text-[11px] text-text4 mt-0.5">Ativar acesso</p>
                </div>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </nav>

        <div className="border-t border-border py-4 px-4">
          <div className="flex flex-col gap-1">
            {bottomItems.map((item) => (
              <MobileLink key={item.to} {...item} onClose={onClose} />
            ))}
          </div>
        </div>
      </aside>
    </>
  );
}
