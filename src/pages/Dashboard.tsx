import { useEffect, useState } from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar,
} from 'recharts';
import { Scale, Moon, Ruler, Users, TrendingUp, TrendingDown, Droplets, Plus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCheckIns, getUserStreak, getCommunityMetrics } from '../lib/api';
import type { CheckIn, CommunityMetrics, UserStreak } from '../types';

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
  { type: 'Peso', date: '18-03-2026', value: '80.2 kg', notes: 'Manhã em jejum', icon: Scale, color: 'bg-accent-bg text-accent' },
  { type: 'Sono', date: '17-03-2026', value: '4/5', notes: '7h30 dormidas', icon: Moon, color: 'bg-blue-bg text-blue' },
  { type: 'Cintura', date: '16-03-2026', value: '87.5 cm', notes: 'Medição manhã', icon: Ruler, color: 'bg-purple-bg text-purple' },
  { type: 'Água', date: '15-03-2026', value: '2.8 L', notes: 'Meta atingida', icon: Droplets, color: 'bg-green-bg text-green' },
];

const calorieData = [
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
  const omegaRatio = 4.2;

  const weightData = [...checkins].reverse().map((c) => ({
    date: c.date ? new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '',
    weight: Number((c.weight ?? 0).toFixed(1)),
  }));

  return (
    <div className="space-y-6 max-w-[1400px]">

      {/* Hero stats */}
      <div className="bg-accent rounded-2xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/50 text-xs font-medium">Total de check-ins</p>
          <p className="text-white text-2xl font-bold mt-1">{streak.total_checkins} <span className="text-sm font-normal text-white/40">check-ins</span></p>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-center">
            <p className="text-white/50 text-[10px] font-medium">Ratio Ômega</p>
            <p className="text-white text-lg font-semibold">{omegaRatio}:1</p>
          </div>
          <div className="text-center">
            <p className="text-white/50 text-[10px] font-medium">Streak</p>
            <p className="text-white text-lg font-semibold">{streak.current_streak} dias</p>
          </div>
          <button className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white rounded-lg px-4 py-2.5 text-sm font-medium transition-all">
            <Plus className="w-4 h-4" /> Check-in
          </button>
        </div>
      </div>

      {/* Metrics + Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quick Stats */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <h3 className="text-xs font-semibold text-text3 uppercase tracking-wide mb-4">Métricas Rápidas</h3>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Peso', value: latestWeight.toFixed(1), unit: 'kg', icon: Scale, trend: '-2.3%', color: 'text-accent', bg: 'bg-accent-bg' },
              { label: 'Cintura', value: latestWaist.toFixed(1), unit: 'cm', icon: Ruler, trend: '-1.8%', color: 'text-purple', bg: 'bg-purple-bg' },
              { label: 'Sono', value: latestSleep, unit: '/5', icon: Moon, trend: '+5%', color: 'text-blue', bg: 'bg-blue-bg' },
              { label: 'Água', value: '2.5', unit: 'L', icon: Droplets, trend: '+8%', color: 'text-green', bg: 'bg-green-bg' },
            ].map((m) => (
              <div key={m.label} className="rounded-xl bg-bg p-3">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-6 h-6 ${m.bg} rounded-md flex items-center justify-center`}>
                    <m.icon className={`w-3 h-3 ${m.color}`} strokeWidth={2} />
                  </div>
                  <span className="text-[10px] text-text4 uppercase tracking-wide font-medium">{m.label}</span>
                </div>
                <p className="text-base font-bold text-text">{m.value}<span className="text-xs font-normal text-text4 ml-0.5">{m.unit}</span></p>
                <span className="text-[10px] text-green font-medium">{m.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Chart */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-xs font-semibold text-text3 uppercase tracking-wide">Evolução do Peso</h3>
              <p className="text-[10px] text-text4 mt-0.5">Últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-1 bg-green-bg text-green text-[10px] font-medium px-2 py-1 rounded-md">
              <TrendingDown className="w-3 h-3" /> -2.3 kg
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(220,14%,20%)" stopOpacity={0.1} />
                    <stop offset="100%" stopColor="hsl(220,14%,20%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,93%)" />
                <XAxis dataKey="date" stroke="hsl(220,6%,68%)" fontSize={9} tickLine={false} axisLine={false} interval={Math.floor(weightData.length / 5)} />
                <YAxis stroke="hsl(220,6%,68%)" fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={30} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(220,10%,91%)', borderRadius: '8px', color: 'hsl(220,14%,12%)', fontSize: '12px' }} />
                <Area type="monotone" dataKey="weight" stroke="hsl(220,14%,20%)" strokeWidth={2} fill="url(#wg)" dot={false} activeDot={{ r: 3, fill: 'hsl(220,14%,20%)', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart */}
        <div className="bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-text3 uppercase tracking-wide">Progresso por Área</h3>
            <span className="text-[10px] text-text4 font-medium">scores</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,10%,93%)" />
                <XAxis dataKey="name" stroke="hsl(220,6%,68%)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(220,6%,68%)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(220,10%,91%)', borderRadius: '8px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="hsl(220,14%,20%)" radius={[6, 6, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Table + Community */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Check-ins */}
        <div className="lg:col-span-3 bg-card rounded-2xl p-5 border border-border">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xs font-semibold text-text3 uppercase tracking-wide">Check-ins Recentes</h3>
            <a href="/checkin" className="text-[11px] text-accent font-medium hover:underline">Ver Todos</a>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border">
                <th className="text-[10px] text-text4 uppercase tracking-wider font-medium pb-3">Tipo</th>
                <th className="text-[10px] text-text4 uppercase tracking-wider font-medium pb-3">Data</th>
                <th className="text-[10px] text-text4 uppercase tracking-wider font-medium pb-3">Valor</th>
                <th className="text-[10px] text-text4 uppercase tracking-wider font-medium pb-3">Notas</th>
              </tr>
            </thead>
            <tbody>
              {recentCheckins.map((item, i) => (
                <tr key={i} className="border-b border-border-light last:border-0">
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center`}>
                        <item.icon className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-sm font-medium text-text">{item.type}</span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-text3">{item.date}</td>
                  <td className="py-3 text-sm font-medium text-text">{item.value}</td>
                  <td className="py-3 text-sm text-text4">{item.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Community */}
        <div className="lg:col-span-2 bg-card rounded-2xl p-5 border border-border">
          <h3 className="text-[10px] font-semibold text-text4 uppercase tracking-wider mb-4">Comunidade</h3>
          <div className="space-y-4">
            {[
              { label: 'Membros', value: community.total_members, icon: Users, color: 'bg-accent-bg text-accent' },
              { label: 'Kg perdidos', value: community.total_kg_lost, icon: Scale, color: 'bg-green-bg text-green' },
              { label: 'Melhoria ratio', value: `${community.avg_ratio_improvement}%`, icon: TrendingUp, color: 'bg-blue-bg text-blue' },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm text-text3">{item.label}</span>
                </div>
                <span className="text-sm font-semibold text-text">
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
