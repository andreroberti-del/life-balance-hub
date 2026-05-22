import { useState } from 'react';
import { Search, ChevronRight, Crown, Shield, Sparkles } from 'lucide-react';
import { useAdminUsers, AdminUserRow } from '../../hooks/useAdmin';
import { AdminPage } from './AdminLayout';

const PLAN_COLORS: Record<string, string> = {
  free: 'bg-gray-100 text-gray-700',
  premium: 'bg-violet-100 text-violet-700',
  premium_lifetime: 'bg-amber-100 text-amber-700',
  trial: 'bg-blue-100 text-blue-700',
  distributor: 'bg-emerald-100 text-emerald-700',
};

const ROLE_COLORS: Record<string, string> = {
  super_admin: 'bg-red-100 text-red-700',
  admin: 'bg-orange-100 text-orange-700',
  analyst: 'bg-blue-100 text-blue-700',
  support: 'bg-emerald-100 text-emerald-700',
};

export function AdminUsers() {
  const [search, setSearch] = useState('');
  const [plan, setPlan] = useState<string | null>(null);
  const [offset, setOffset] = useState(0);
  const limit = 50;

  const { data, loading } = useAdminUsers({ search: search || undefined, plan, offset, limit });

  return (
    <AdminPage title="Usuários" subtitle={data ? `${data.total} usuários totais` : 'Carregando…'}>
      <div className="bg-white rounded-2xl border border-violet-100 shadow-sm">
        {/* Filters */}
        <div className="p-4 border-b border-violet-100 flex items-center gap-3 flex-wrap">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setOffset(0); }}
              placeholder="Buscar por nome ou email..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-sm text-violet-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
            />
          </div>
          <select
            value={plan ?? ''}
            onChange={(e) => { setPlan(e.target.value || null); setOffset(0); }}
            className="px-4 py-2.5 rounded-xl bg-violet-50 border border-violet-100 text-sm text-violet-950 focus:outline-none focus:ring-2 focus:ring-violet-400"
          >
            <option value="">Todos os planos</option>
            <option value="free">Free</option>
            <option value="premium">Premium</option>
            <option value="premium_lifetime">Premium Lifetime</option>
            <option value="trial">Trial</option>
          </select>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-violet-50/50 text-[10px] font-bold uppercase tracking-wider text-gray-500">
              <tr>
                <th className="text-left p-4">Usuário</th>
                <th className="text-left p-4">Plano</th>
                <th className="text-left p-4">Nível / XP</th>
                <th className="text-left p-4">Indicações</th>
                <th className="text-left p-4">Cadastro</th>
                <th className="text-left p-4">Último ativo</th>
                <th className="text-left p-4">Role</th>
                <th className="w-12 p-4"></th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr><td colSpan={8} className="p-12 text-center text-gray-400">Carregando...</td></tr>
              )}
              {!loading && (data?.rows ?? []).length === 0 && (
                <tr><td colSpan={8} className="p-12 text-center text-gray-400">Nenhum usuário encontrado.</td></tr>
              )}
              {(data?.rows ?? []).map((u: AdminUserRow) => (
                <tr key={u.id} className="border-t border-violet-50 hover:bg-violet-50/30 cursor-pointer transition-colors">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center font-bold text-xs">
                        {(u.display_name || u.email).slice(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-violet-950">{u.display_name || '—'}</p>
                        <p className="text-xs text-gray-500">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${PLAN_COLORS[u.plan] ?? PLAN_COLORS.free}`}>
                      {u.plan}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      <div>
                        <p className="font-bold text-violet-950">Nv {u.current_level ?? 1}</p>
                        <p className="text-xs text-gray-500">{(u.total_xp ?? 0).toLocaleString()} XP</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <p className="font-bold text-violet-950">{u.active_referrals ?? 0} ativos</p>
                    <p className="text-xs font-mono text-gray-500">{u.referral_code}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-700">{new Date(u.created_at).toLocaleDateString('pt-BR')}</p>
                  </td>
                  <td className="p-4">
                    <p className="text-xs text-gray-700">
                      {u.last_active_at ? new Date(u.last_active_at).toLocaleDateString('pt-BR') : '—'}
                    </p>
                  </td>
                  <td className="p-4">
                    {u.admin_role ? (
                      <span className={`px-2 py-1 rounded-full text-[9px] font-bold uppercase tracking-wider flex items-center gap-1 w-fit ${ROLE_COLORS[u.admin_role]}`}>
                        {u.admin_role === 'super_admin' ? <Crown className="w-3 h-3" /> : <Shield className="w-3 h-3" />}
                        {u.admin_role.replace('_', ' ')}
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="p-4">
                    <ChevronRight className="w-4 h-4 text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {data && data.total > limit && (
          <div className="p-4 border-t border-violet-100 flex items-center justify-between text-sm">
            <p className="text-gray-500">
              {offset + 1} – {Math.min(offset + limit, data.total)} de {data.total}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setOffset(Math.max(0, offset - limit))}
                disabled={offset === 0}
                className="px-3 py-1.5 rounded-lg bg-violet-50 text-violet-700 font-bold disabled:opacity-30"
              >
                Anterior
              </button>
              <button
                onClick={() => setOffset(offset + limit)}
                disabled={offset + limit >= data.total}
                className="px-3 py-1.5 rounded-lg bg-violet-500 text-white font-bold disabled:opacity-30"
              >
                Próxima
              </button>
            </div>
          </div>
        )}
      </div>
    </AdminPage>
  );
}
