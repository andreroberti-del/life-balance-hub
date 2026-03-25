import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { Scale, Moon, Ruler, Users, TrendingUp, TrendingDown, Droplets, Plus, Flame } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCheckIns, getUserStreak, getCommunityMetrics } from '../lib/api';
import type { CheckIn, CommunityMetrics, UserStreak } from '../types';

/* ── Demo data ── */
const demoCheckins: Partial<CheckIn>[] = Array.from({ length: 30 }, (_, i) => ({
  date: new Date(Date.now() - (29 - i) * 86400000).toISOString().split('T')[0],
  weight: 82 - i * 0.15 + Math.random() * 0.5,
  sleep_quality: Math.floor(3 + Math.random() * 2),
  water_liters: 1.5 + Math.random() * 1.5,
  waist: 90 - i * 0.1 + Math.random() * 0.3,
}));
const demoCommunity: CommunityMetrics = {
  total_members: 2847, total_kg_lost: 4521, avg_ratio_improvement: 32,
  active_protocols: 1203, total_checkins: 89432, members_trend: 12, kg_trend: 8, ratio_trend: 15,
};
const demoStreak: UserStreak = { current_streak: 12, longest_streak: 23, total_checkins: 54 };

const recentCheckins = [
  { type: 'Peso', date: '18 Mar 2026', value: '80.2 kg', notes: 'Manhã em jejum', icon: Scale, color: 'bg-accent-bg text-accent' },
  { type: 'Sono', date: '17 Mar 2026', value: '4/5', notes: '7h30 dormidas', icon: Moon, color: 'bg-blue-bg text-blue' },
  { type: 'Cintura', date: '16 Mar 2026', value: '87.5 cm', notes: 'Medição manhã', icon: Ruler, color: 'bg-purple-bg text-purple' },
  { type: 'Água', date: '15 Mar 2026', value: '2.8 L', notes: 'Meta atingida', icon: Droplets, color: 'bg-green-bg text-green' },
];

const progressData = [
  { name: 'Peso', value: 80 },
  { name: 'Cintura', value: 88 },
  { name: 'Sono', value: 85 },
  { name: 'Água', value: 92 },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [checkins, setCheckins] = useState<Partial<CheckIn>[]>([]);
  const [streak, setStreak] = useState<UserStreak>(demoStreak);
  const [community, setCommunity] = useState<CommunityMetrics>(demoCommunity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) { setCheckins(demoCheckins); setLoading(false); return; }
      try {
        const [cks, str, com] = await Promise.all([getCheckIns(user.id, 30), getUserStreak(user.id), getCommunityMetrics()]);
        setCheckins(cks.length > 0 ? cks : demoCheckins as CheckIn[]);
        setStreak(str.total_checkins > 0 ? str : demoStreak);
        setCommunity(com || demoCommunity);
      } catch { setCheckins(demoCheckins); } finally { setLoading(false); }
    }
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const latestWeight = checkins[0]?.weight ?? 82;
  const latestWaist = checkins[0]?.waist ?? 90;
  const latestSleep = checkins[0]?.sleep_quality ?? 4;

  const weightData = [...checkins].reverse().map((c) => ({
    date: c.date ? new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '',
    weight: Number((c.weight ?? 0).toFixed(1)),
  }));

  return (
    <div className="space-y-8">

      {/* ── Hero row ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-accent rounded-2xl p-6 text-white flex flex-col justify-between min-h-[140px] shadow-[var(--shadow-card)]">
          <p className="text-white/60 text-xs font-medium tracking-wide uppercase">Total de check-ins</p>
          <div className="flex items-end justify-between mt-3">
            <p className="text-4xl font-bold tracking-tight leading-none">{streak.total_checkins}</p>
            <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 rounded-xl px-4 py-2 text-[13px] font-medium transition-all">
              <Plus className="w-4 h-4" /> Check-in
            </button>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between min-h-[140px] shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-orange-bg rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange" strokeWidth={1.8} />
            </div>
            <p className="text-xs font-medium text-text4 uppercase tracking-wide">Streak</p>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-text tracking-tight">{streak.current_streak} <span className="text-base font-normal text-text4">dias</span></p>
            <p className="text-xs text-text4 mt-1">Melhor: {streak.longest_streak} dias</p>
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border flex flex-col justify-between min-h-[140px] shadow-[var(--shadow-card)]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-green-bg rounded-lg flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-green" strokeWidth={1.8} />
            </div>
            <p className="text-xs font-medium text-text4 uppercase tracking-wide">Ratio Ômega</p>
          </div>
          <div className="mt-3">
            <p className="text-3xl font-bold text-text tracking-tight">4.2<span className="text-base font-normal text-text4">:1</span></p>
            <p className="text-xs text-green mt-1">↓ 1.3 desde início</p>
          </div>
        </div>
      </div>

      {/* ── Metrics grid ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Peso', value: latestWeight.toFixed(1), unit: 'kg', icon: Scale, trend: '-2.3%', trendColor: 'text-green', bg: 'bg-accent-bg', iconColor: 'text-accent' },
          { label: 'Cintura', value: latestWaist.toFixed(1), unit: 'cm', icon: Ruler, trend: '-1.8%', trendColor: 'text-green', bg: 'bg-purple-bg', iconColor: 'text-purple' },
          { label: 'Sono', value: latestSleep, unit: '/5', icon: Moon, trend: '+5%', trendColor: 'text-green', bg: 'bg-blue-bg', iconColor: 'text-blue' },
          { label: 'Água', value: '2.5', unit: 'L', icon: Droplets, trend: '+8%', trendColor: 'text-green', bg: 'bg-green-bg', iconColor: 'text-green' },
        ].map((m) => (
          <div key={m.label} className="bg-card rounded-2xl p-5 border border-border shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <div className="flex items-center gap-2.5 mb-4">
              <div className={`w-8 h-8 ${m.bg} rounded-lg flex items-center justify-center`}>
                <m.icon className={`w-4 h-4 ${m.iconColor}`} strokeWidth={1.8} />
              </div>
              <span className="text-xs text-text4 font-medium uppercase tracking-wide">{m.label}</span>
            </div>
            <p className="text-2xl font-bold text-text tracking-tight">
              {m.value}<span className="text-sm font-normal text-text4 ml-1">{m.unit}</span>
            </p>
            <span className={`text-xs ${m.trendColor} font-medium mt-1 inline-block`}>{m.trend}</span>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Weight chart */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-sm font-semibold text-text">Evolução do Peso</h3>
              <p className="text-xs text-text4 mt-0.5">Últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-bg text-green text-xs font-medium px-3 py-1.5 rounded-lg">
              <TrendingDown className="w-3.5 h-3.5" /> -2.3 kg
            </div>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(222,47%,31%)" stopOpacity={0.08} />
                    <stop offset="100%" stopColor="hsl(222,47%,31%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,92%)" vertical={false} />
                <XAxis dataKey="date" stroke="hsl(220,8%,65%)" fontSize={11} tickLine={false} axisLine={false} interval={Math.floor(weightData.length / 5)} />
                <YAxis stroke="hsl(220,8%,65%)" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={36} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0,0%,100%)',
                    border: '1px solid hsl(220,14%,90%)',
                    borderRadius: '12px',
                    color: 'hsl(220,20%,14%)',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px hsla(220,20%,20%,0.08)',
                    padding: '10px 14px',
                  }}
                />
                <Area type="monotone" dataKey="weight" stroke="hsl(222,47%,31%)" strokeWidth={2} fill="url(#wg)" dot={false} activeDot={{ r: 4, fill: 'hsl(222,47%,31%)', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-text">Progresso por Área</h3>
            <span className="text-xs text-text4 font-medium">Score %</span>
          </div>
          <div className="h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={progressData} barCategoryGap="30%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,14%,92%)" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(220,8%,65%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220,8%,65%)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(0,0%,100%)',
                    border: '1px solid hsl(220,14%,90%)',
                    borderRadius: '12px',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px hsla(220,20%,20%,0.08)',
                    padding: '10px 14px',
                  }}
                />
                <Bar dataKey="value" fill="hsl(222,47%,31%)" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Table + Community ── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Recent checkins */}
        <div className="lg:col-span-3 bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-sm font-semibold text-text">Check-ins Recentes</h3>
            <a href="/checkin" className="text-xs text-accent font-medium hover:underline">Ver Todos →</a>
          </div>
          <div className="space-y-0">
            {recentCheckins.map((item, i) => (
              <div key={i} className={`flex items-center gap-4 py-4 ${i < recentCheckins.length - 1 ? 'border-b border-border-light' : ''}`}>
                <div className={`w-9 h-9 ${item.color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                  <item.icon className="w-4 h-4" strokeWidth={1.8} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-text">{item.type}</p>
                  <p className="text-xs text-text4">{item.date}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-text">{item.value}</p>
                  <p className="text-xs text-text4">{item.notes}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Community */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-6 border border-border shadow-[var(--shadow-card)]">
          <h3 className="text-sm font-semibold text-text mb-6">Comunidade</h3>
          <div className="space-y-5">
            {[
              { label: 'Membros ativos', value: community.total_members, icon: Users, color: 'bg-accent-bg text-accent' },
              { label: 'Kg perdidos', value: community.total_kg_lost, icon: Scale, color: 'bg-green-bg text-green' },
              { label: 'Melhoria ratio', value: `${community.avg_ratio_improvement}%`, icon: TrendingUp, color: 'bg-blue-bg text-blue' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center`}>
                    <item.icon className="w-[18px] h-[18px]" strokeWidth={1.6} />
                  </div>
                  <span className="text-sm text-text3">{item.label}</span>
                </div>
                <span className="text-base font-bold text-text">
                  {typeof item.value === 'number' ? item.value.toLocaleString('pt-BR') : item.value}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
