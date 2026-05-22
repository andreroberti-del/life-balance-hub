import { ReactNode } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, Users, DollarSign, TrendingUp, Activity, Settings, ChevronLeft, Shield, Brain as BrainIcon } from 'lucide-react';
import { useIsAdmin } from '../../hooks/useAdmin';
import { PageSkeleton } from '../ui/skeleton';

const NAV = [
  { to: '/admin', icon: LayoutDashboard, label: 'Visão Geral', end: true },
  { to: '/admin/users', icon: Users, label: 'Usuários' },
  { to: '/admin/revenue', icon: DollarSign, label: 'Receita' },
  { to: '/admin/engagement', icon: Activity, label: 'Engajamento' },
  { to: '/admin/growth', icon: TrendingUp, label: 'Crescimento' },
  { to: '/admin/ai-usage', icon: BrainIcon, label: 'IA & Custos' },
  { to: '/admin/settings', icon: Settings, label: 'Configurações' },
];

export function AdminLayout() {
  const { isAdmin, loading } = useIsAdmin();
  const navigate = useNavigate();

  if (loading) return <PageSkeleton />;
  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-violet-50 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-red-100 flex items-center justify-center">
            <Shield className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-violet-950 mb-2">Acesso negado</h1>
          <p className="text-gray-600 mb-6">Esta área é restrita a administradores M7.</p>
          <button onClick={() => navigate('/')} className="px-6 py-3 bg-violet-500 text-white font-bold rounded-xl">Voltar pro app</button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-violet-950 text-white flex flex-col fixed h-screen">
        <div className="p-6 border-b border-violet-800/40">
          <div className="flex items-center gap-2 mb-1">
            <Shield className="w-4 h-4 text-amber-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-amber-300">M7 Control Center</span>
          </div>
          <p className="text-lg font-bold tracking-tight">Super Admin</p>
        </div>
        <nav className="flex-1 py-4 space-y-1 px-3">
          {NAV.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm ${
                  isActive
                    ? 'bg-violet-500 text-white font-bold shadow-md shadow-violet-500/30'
                    : 'text-violet-200 hover:bg-violet-900/40 hover:text-white'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <button
          onClick={() => navigate('/')}
          className="m-3 px-3 py-2 rounded-xl bg-violet-900/40 hover:bg-violet-900/60 text-violet-200 hover:text-white text-sm flex items-center gap-2 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          Voltar ao app
        </button>
      </aside>

      {/* Main */}
      <main className="flex-1 ml-64 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}

export function AdminPage({ title, subtitle, children, actions }: {
  title: string; subtitle?: string; children: ReactNode; actions?: ReactNode;
}) {
  return (
    <div className="px-10 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-violet-950 tracking-tight">{title}</h1>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        {actions}
      </div>
      {children}
    </div>
  );
}
