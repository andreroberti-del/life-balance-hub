import { motion } from 'framer-motion';
import { Users, DollarSign, TrendingUp, Brain, Sparkles, Activity, Pill, GraduationCap, Shield, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useAdminOverview, useEngagementTimeseries } from '../../hooks/useAdmin';
import { AdminPage } from './AdminLayout';

function formatCents(cents: number, currency = 'BRL') {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency }).format(cents / 100);
}

function KpiCard({ icon: Icon, label, value, sub, accent }: {
  icon: typeof Users; label: string; value: string | number; sub?: string;
  accent?: 'violet' | 'emerald' | 'amber' | 'rose';
}) {
  const colors = {
    violet: { bg: 'bg-violet-50', icon: 'text-violet-500', border: 'border-violet-100' },
    emerald: { bg: 'bg-emerald-50', icon: 'text-emerald-600', border: 'border-emerald-100' },
    amber: { bg: 'bg-amber-50', icon: 'text-amber-600', border: 'border-amber-100' },
    rose: { bg: 'bg-rose-50', icon: 'text-rose-600', border: 'border-rose-100' },
  }[accent ?? 'violet'];

  return (
    <div className={`bg-white rounded-2xl p-5 border ${colors.border} shadow-sm`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">{label}</span>
        <div className={`w-9 h-9 rounded-xl ${colors.bg} flex items-center justify-center`}>
          <Icon className={`w-4 h-4 ${colors.icon}`} />
        </div>
      </div>
      <div className="text-3xl font-bold text-violet-950 tracking-tight">{value}</div>
      {sub && <p className="text-xs text-gray-500 mt-1">{sub}</p>}
    </div>
  );
}

export function AdminOverview() {
  const { data, loading, error, refetch } = useAdminOverview();
  const { data: ts } = useEngagementTimeseries(30);

  if (loading) {
    return (
      <AdminPage title="Visão Geral" subtitle="Carregando...">
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-28 bg-white rounded-2xl border border-violet-100 animate-pulse" />
          ))}
        </div>
      </AdminPage>
    );
  }

  if (error || !data) {
    return (
      <AdminPage title="Visão Geral">
        <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6">
          <p className="text-rose-900 font-bold">Erro carregando dados</p>
          <p className="text-rose-700 text-sm">{error}</p>
        </div>
      </AdminPage>
    );
  }

  return (
    <AdminPage
      title="Visão Geral"
      subtitle={`Atualizado em ${new Date(data.generated_at).toLocaleString('pt-BR')}`}
      actions={
        <button
          onClick={refetch}
          className="flex items-center gap-2 px-4 py-2 bg-white border border-violet-200 rounded-xl text-sm font-bold text-violet-700 hover:bg-violet-50"
        >
          <RefreshCw className="w-4 h-4" />
          Atualizar
        </button>
      }
    >
      {/* Section: USERS */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Usuários</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Total" value={data.users.total} sub="Todos os cadastrados" accent="violet" />
          <KpiCard icon={TrendingUp} label="DAU" value={data.users.dau} sub={`/${data.users.mau} MAU = ${data.users.mau > 0 ? Math.round((data.users.dau / data.users.mau) * 100) : 0}%`} accent="emerald" />
          <KpiCard icon={Users} label="Novos hoje" value={`+${data.users.new_today}`} sub={`+${data.users.new_week} semana, +${data.users.new_month} mês`} accent="amber" />
          <KpiCard icon={Sparkles} label="WAU" value={data.users.wau} sub={`MAU: ${data.users.mau}`} accent="violet" />
        </div>
      </div>

      {/* Section: REVENUE */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Receita</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={DollarSign} label="MRR" value={formatCents(data.revenue.mrr_cents)} sub="Recorrente mensal" accent="emerald" />
          <KpiCard icon={DollarSign} label="Receita 30d" value={formatCents(data.revenue.last_30d_cents)} sub="Pagamentos completados" accent="emerald" />
          <KpiCard icon={DollarSign} label="Receita total" value={formatCents(data.revenue.total_cents)} sub="Desde o início" accent="emerald" />
          <KpiCard icon={Users} label="Assinaturas" value={data.subscriptions.premium_active} sub={`${data.subscriptions.free_active} free · ${data.subscriptions.trial_active} trial`} accent="amber" />
        </div>
      </div>

      {/* Section: GROWTH */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Crescimento · Família M7</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={Users} label="Indicações totais" value={data.growth.referrals_total} sub={`${data.growth.referrals_active} ativas`} accent="violet" />
          <KpiCard icon={Sparkles} label="Premium grátis (3 ativos)" value={data.growth.family_premium_rewards} sub="Conquistas Família M7" accent="amber" />
          <KpiCard icon={Shield} label="Distribuidores" value={data.growth.distributors_approved} sub={`${data.growth.distributors_in_review} em análise`} accent="rose" />
          <KpiCard icon={TrendingUp} label="Taxa conversão" value={`${data.growth.referrals_total > 0 ? Math.round((data.growth.referrals_active / data.growth.referrals_total) * 100) : 0}%`} sub="ativas / total" accent="emerald" />
        </div>
      </div>

      {/* Section: ENGAGEMENT */}
      <div className="mb-8">
        <h2 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-3">Engajamento hoje</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <KpiCard icon={GraduationCap} label="Lições completadas" value={data.engagement.lessons_completed_today} accent="violet" />
          <KpiCard icon={Pill} label="Scans alimentares" value={data.engagement.scans_today} accent="rose" />
          <KpiCard icon={Brain} label="Chamadas IA hoje" value={data.engagement.ai_calls_today} sub={`${data.engagement.ai_calls_30d} nos últimos 30d`} accent="amber" />
          <KpiCard icon={Activity} label="DAU" value={data.users.dau} sub={`${data.users.mau > 0 ? Math.round((data.users.dau / data.users.mau) * 100) : 0}% MAU`} accent="emerald" />
        </div>
      </div>

      {/* Chart: Engagement timeseries */}
      <motion.div
        initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 border border-violet-100 shadow-sm"
      >
        <h2 className="text-lg font-bold text-violet-950 mb-1">Atividade · últimos 30 dias</h2>
        <p className="text-xs text-gray-500 mb-5">Usuários ativos e signups por dia</p>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={ts}>
            <defs>
              <linearGradient id="colorActive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#668DFF" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#668DFF" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorSignups" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} />
            <YAxis stroke="#9CA3AF" fontSize={11} />
            <Tooltip
              contentStyle={{ borderRadius: 12, border: '1px solid #DCE3FF', fontSize: 12 }}
              labelFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
            />
            <Area type="monotone" dataKey="active_users" stroke="#668DFF" fillOpacity={1} fill="url(#colorActive)" strokeWidth={2.5} name="Usuários ativos" />
            <Area type="monotone" dataKey="signups" stroke="#FBBF24" fillOpacity={1} fill="url(#colorSignups)" strokeWidth={2.5} name="Signups" />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </AdminPage>
  );
}
