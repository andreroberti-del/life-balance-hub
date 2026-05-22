import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { DollarSign, TrendingUp, Brain, Pill, GraduationCap, Dumbbell, Activity, Users, Sparkles } from 'lucide-react';
import { useEngagementTimeseries, useAdminOverview } from '../../hooks/useAdmin';
import { AdminPage } from './AdminLayout';

function formatCents(cents: number) {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(cents / 100);
}

export function AdminRevenue() {
  const { data: o, loading } = useAdminOverview();
  if (loading || !o) return <AdminPage title="Receita">Carregando...</AdminPage>;

  const ltv = o.users.total > 0 ? o.revenue.total_cents / o.users.total : 0;
  const arpu = o.subscriptions.premium_active > 0 ? o.revenue.mrr_cents / o.subscriptions.premium_active : 0;
  const conversion = o.users.total > 0 ? (o.subscriptions.premium_active / o.users.total) * 100 : 0;

  return (
    <AdminPage title="Receita" subtitle="MRR, LTV, ARPU, conversão">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-emerald-100">
          <div className="flex items-center gap-2 mb-3">
            <DollarSign className="w-4 h-4 text-emerald-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">MRR</span>
          </div>
          <p className="text-4xl font-bold text-violet-950">{formatCents(o.revenue.mrr_cents)}</p>
          <p className="text-xs text-emerald-600 font-bold mt-1">Receita mensal recorrente</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-violet-100">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">ARR</span>
          </div>
          <p className="text-4xl font-bold text-violet-950">{formatCents(o.revenue.mrr_cents * 12)}</p>
          <p className="text-xs text-gray-500 mt-1">MRR × 12</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-amber-100">
          <div className="flex items-center gap-2 mb-3">
            <Users className="w-4 h-4 text-amber-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">ARPU</span>
          </div>
          <p className="text-4xl font-bold text-violet-950">{formatCents(arpu)}</p>
          <p className="text-xs text-gray-500 mt-1">Receita média por usuário premium</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-rose-100">
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-rose-600" />
            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500">Conversão</span>
          </div>
          <p className="text-4xl font-bold text-violet-950">{conversion.toFixed(1)}%</p>
          <p className="text-xs text-gray-500 mt-1">Premium / Total</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-violet-100">
        <h2 className="text-lg font-bold text-violet-950 mb-2">Distribuição de assinaturas</h2>
        <p className="text-xs text-gray-500 mb-6">Total de {o.users.total} usuários</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Free', value: o.subscriptions.free_active, color: 'bg-gray-200', text: 'text-gray-700' },
            { label: 'Premium', value: o.subscriptions.premium_active, color: 'bg-violet-500', text: 'text-violet-700' },
            { label: 'Trial', value: o.subscriptions.trial_active, color: 'bg-amber-500', text: 'text-amber-700' },
          ].map((s) => (
            <div key={s.label}>
              <div className="flex items-center justify-between mb-2">
                <span className={`text-xs font-bold uppercase tracking-wider ${s.text}`}>{s.label}</span>
                <span className="text-lg font-bold text-violet-950">{s.value}</span>
              </div>
              <div className="h-2 bg-violet-50 rounded-full overflow-hidden">
                <div className={`h-full ${s.color}`} style={{ width: `${o.users.total > 0 ? (s.value / o.users.total) * 100 : 0}%` }} />
              </div>
            </div>
          ))}
        </div>
        <div className="mt-6 p-4 bg-amber-50 border border-amber-200 rounded-xl">
          <p className="text-sm font-bold text-amber-900">💰 Pra ativar: integre Stripe ou pagamento manual</p>
          <p className="text-xs text-amber-800 mt-1">Hoje todos usuários estão em 'free'. Quando ligar Stripe + webhook, MRR/LTV preenchem automaticamente.</p>
        </div>
      </div>
    </AdminPage>
  );
}

export function AdminEngagement() {
  const { data: ts, loading } = useEngagementTimeseries(30);
  if (loading) return <AdminPage title="Engajamento">Carregando...</AdminPage>;

  return (
    <AdminPage title="Engajamento" subtitle="Atividade dos usuários nos últimos 30 dias">
      <div className="bg-white rounded-2xl p-6 border border-violet-100 mb-6">
        <h2 className="text-lg font-bold text-violet-950 mb-1">XP ganhos por dia</h2>
        <p className="text-xs text-gray-500 mb-5">Volume total de XP gerado pela base</p>
        <ResponsiveContainer width="100%" height={260}>
          <AreaChart data={ts}>
            <defs>
              <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#FBBF24" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#FBBF24" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} />
            <YAxis stroke="#9CA3AF" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE3FF', fontSize: 12 }} />
            <Area type="monotone" dataKey="xp_earned" stroke="#FBBF24" fillOpacity={1} fill="url(#xpGrad)" strokeWidth={2.5} name="XP ganhos" />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-violet-100">
        <h2 className="text-lg font-bold text-violet-950 mb-1">Atividade detalhada por categoria</h2>
        <p className="text-xs text-gray-500 mb-5">Comportamento da base por feature</p>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ts}>
            <CartesianGrid strokeDasharray="3 3" stroke="#EDE9FE" vertical={false} />
            <XAxis dataKey="date" stroke="#9CA3AF" fontSize={11} tickFormatter={(d) => new Date(d).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} />
            <YAxis stroke="#9CA3AF" fontSize={11} />
            <Tooltip contentStyle={{ borderRadius: 12, border: '1px solid #DCE3FF', fontSize: 12 }} />
            <Legend wrapperStyle={{ fontSize: 11 }} />
            <Bar dataKey="lessons_completed" fill="#668DFF" name="Lições" stackId="a" />
            <Bar dataKey="workouts" fill="#10B981" name="Treinos" stackId="a" />
            <Bar dataKey="scans" fill="#F43F5E" name="Scans" stackId="a" />
            <Bar dataKey="ai_calls" fill="#8B5CF6" name="IA" stackId="a" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </AdminPage>
  );
}

export function AdminGrowth() {
  const { data: o, loading } = useAdminOverview();
  if (loading || !o) return <AdminPage title="Crescimento">Carregando...</AdminPage>;

  return (
    <AdminPage title="Crescimento" subtitle="Família M7, indicações, distribuidores">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-violet-100">
          <Users className="w-5 h-5 text-violet-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.growth.referrals_total}</p>
          <p className="text-xs text-gray-500 mt-1">Indicações totais</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-emerald-100">
          <TrendingUp className="w-5 h-5 text-emerald-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.growth.referrals_active}</p>
          <p className="text-xs text-gray-500 mt-1">Ativas (convertidas Premium)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-amber-100">
          <Sparkles className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.growth.family_premium_rewards}</p>
          <p className="text-xs text-gray-500 mt-1">Famílias M7 (3 ativos)</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-rose-100">
          <Users className="w-5 h-5 text-rose-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.growth.distributors_approved}</p>
          <p className="text-xs text-gray-500 mt-1">Distribuidores aprovados ({o.growth.distributors_in_review} análise)</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-violet-500 to-violet-700 rounded-2xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-2">Viral coefficient</h2>
        <p className="text-white/85 mb-6 max-w-2xl">
          Cada usuário traz em média{' '}
          <strong>{o.users.total > 0 ? (o.growth.referrals_total / o.users.total).toFixed(2) : '0.00'}</strong>{' '}
          indicações. Quando atinge 1.0, você cresce sozinho.
        </p>
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white/15 backdrop-blur rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">K-factor</p>
            <p className="text-3xl font-bold mt-1">{o.users.total > 0 ? (o.growth.referrals_total / o.users.total).toFixed(2) : '0.00'}</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Conversão</p>
            <p className="text-3xl font-bold mt-1">{o.growth.referrals_total > 0 ? Math.round((o.growth.referrals_active / o.growth.referrals_total) * 100) : 0}%</p>
          </div>
          <div className="bg-white/15 backdrop-blur rounded-xl p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider opacity-70">Rewards conquistados</p>
            <p className="text-3xl font-bold mt-1">{o.growth.family_premium_rewards}</p>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

export function AdminAIUsage() {
  const { data: o, loading } = useAdminOverview();
  if (loading || !o) return <AdminPage title="IA & Custos">Carregando...</AdminPage>;

  // Estimativa: cada call ~$0.005 (Gemini Flash) ou $0.05 (Sonnet)
  const estCostUSD30d = o.engagement.ai_calls_30d * 0.005;

  return (
    <AdminPage title="IA & Custos" subtitle="Quota free Gemini · uso e estimativa de custo">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-2xl p-6 border border-amber-100">
          <Brain className="w-5 h-5 text-amber-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.engagement.ai_calls_today}</p>
          <p className="text-xs text-gray-500 mt-1">Chamadas hoje (limite 1000)</p>
          <div className="mt-3 h-1.5 bg-amber-50 rounded-full overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: `${Math.min(100, (o.engagement.ai_calls_today / 1000) * 100)}%` }} />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-violet-100">
          <Brain className="w-5 h-5 text-violet-500 mb-2" />
          <p className="text-3xl font-bold text-violet-950">{o.engagement.ai_calls_30d.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">Últimos 30 dias</p>
        </div>
        <div className="bg-white rounded-2xl p-6 border border-emerald-100">
          <DollarSign className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-violet-950">${estCostUSD30d.toFixed(2)}</p>
          <p className="text-xs text-gray-500 mt-1">Custo estimado 30d (se fosse pago)</p>
        </div>
        <div className="bg-emerald-50 border-emerald-200 rounded-2xl p-6 border-2">
          <Sparkles className="w-5 h-5 text-emerald-600 mb-2" />
          <p className="text-3xl font-bold text-emerald-900">$0.00</p>
          <p className="text-xs text-emerald-700 font-bold mt-1">Pago hoje (Gemini Free)</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 border border-violet-100">
        <h2 className="text-lg font-bold text-violet-950 mb-2">Limites configurados</h2>
        <p className="text-xs text-gray-500 mb-5">Pra ajustar: UPDATE ai_quota_config em SQL</p>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between p-3 bg-violet-50 rounded-xl">
            <span className="text-gray-600">Global por dia</span>
            <span className="font-bold text-violet-950">1.000</span>
          </div>
          <div className="flex justify-between p-3 bg-violet-50 rounded-xl">
            <span className="text-gray-600">Por usuário/dia</span>
            <span className="font-bold text-violet-950">50</span>
          </div>
          <div className="flex justify-between p-3 bg-violet-50 rounded-xl">
            <span className="text-gray-600">zeno-coach/dia</span>
            <span className="font-bold text-violet-950">500</span>
          </div>
          <div className="flex justify-between p-3 bg-violet-50 rounded-xl">
            <span className="text-gray-600">scan-food/dia</span>
            <span className="font-bold text-violet-950">200</span>
          </div>
        </div>
      </div>
    </AdminPage>
  );
}

export function AdminSettings() {
  return (
    <AdminPage title="Configurações" subtitle="Painel super admin">
      <div className="bg-white rounded-2xl p-6 border border-violet-100 max-w-2xl">
        <h2 className="text-lg font-bold text-violet-950 mb-2">Permissões</h2>
        <p className="text-sm text-gray-500 mb-5">Pra promover outro usuário a admin, use SQL:</p>
        <pre className="bg-violet-950 text-violet-100 p-4 rounded-xl text-xs overflow-x-auto">
{`SELECT admin_set_role(
  '<USER_ID>'::uuid,
  'admin'  -- ou 'super_admin', 'analyst', 'support', ou NULL pra revogar
);`}
        </pre>
      </div>
    </AdminPage>
  );
}
