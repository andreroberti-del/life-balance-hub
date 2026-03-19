import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';
import {
  Scale,
  Moon,
  Ruler,
  Heart,
  Activity,
  Users,
  TrendingUp,
  TrendingDown,
  CheckCircle2,
  Flame,
  Calendar,
  Droplets,
  Plus,
} from 'lucide-react';
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
  { type: 'Peso', date: '18-03-2026', value: '80.2 kg', notes: 'Manhã em jejum', icon: Scale, color: 'bg-accent-bg text-accent' },
  { type: 'Sono', date: '17-03-2026', value: '4/5', notes: '7h30 dormidas', icon: Moon, color: 'bg-blue-bg text-blue' },
  { type: 'Cintura', date: '16-03-2026', value: '87.5 cm', notes: 'Medição manhã', icon: Ruler, color: 'bg-purple-bg text-purple' },
  { type: 'Água', date: '15-03-2026', value: '2.8 L', notes: 'Meta atingida', icon: Droplets, color: 'bg-green-bg text-green' },
];

const weeklySchedule = [
  { day: 'Seg', date: '17', items: [{ label: 'Omega 3', time: '08:00', color: 'bg-accent' }] },
  { day: 'Ter', date: '18', items: [{ label: 'Check-in', time: '07:30', color: 'bg-lime' }, { label: 'Exercício', time: '18:00', color: 'bg-blue' }] },
  { day: 'Qua', date: '19', items: [{ label: 'Omega 3', time: '08:00', color: 'bg-accent' }] },
  { day: 'Qui', date: '20', items: [{ label: 'Reteste', time: '10:00', color: 'bg-orange' }] },
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
    <div className="space-y-5 max-w-[1600px]">

      {/* ROW 1: Hero stats bar */}
      <div className="bg-surface-purple rounded-3xl p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <p className="text-white/60 text-sm">Total de check-ins</p>
          <p className="text-white text-3xl font-black">{streak.total_checkins} <span className="text-base font-medium text-white/50">check-ins</span></p>
        </div>
        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-white/60 text-xs">Ratio Ômega</p>
            <p className="text-white text-2xl font-bold">{omegaRatio}:1</p>
          </div>
          <div className="text-center">
            <p className="text-white/60 text-xs">Streak</p>
            <p className="text-white text-2xl font-bold">{streak.current_streak} dias</p>
          </div>
          <button className="flex items-center gap-2 bg-white/15 hover:bg-white/25 text-white rounded-2xl px-5 py-3 text-sm font-semibold transition-all">
            <Plus className="w-4 h-4" /> Check-in
          </button>
        </div>
      </div>

      {/* ROW 2: Three chart cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Quick Stats Donut-style */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text">Métricas Rápidas</h3>
            <span className="text-[10px] text-text4">Hoje</span>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Peso', value: latestWeight.toFixed(1), unit: 'kg', icon: Scale, trend: '-2.3%', color: 'text-accent', bg: 'bg-accent-bg' },
              { label: 'Cintura', value: latestWaist.toFixed(1), unit: 'cm', icon: Ruler, trend: '-1.8%', color: 'text-purple', bg: 'bg-purple-bg' },
              { label: 'Sono', value: latestSleep, unit: '/5', icon: Moon, trend: '+5%', color: 'text-blue', bg: 'bg-blue-bg' },
              { label: 'Água', value: '2.5', unit: 'L', icon: Droplets, trend: '+8%', color: 'text-green', bg: 'bg-green-bg' },
            ].map((m) => (
              <div key={m.label} className="rounded-2xl bg-bg p-3.5 border border-border-light">
                <div className="flex items-center gap-2 mb-2">
                  <div className={`w-7 h-7 ${m.bg} rounded-lg flex items-center justify-center`}>
                    <m.icon className={`w-3.5 h-3.5 ${m.color}`} strokeWidth={1.8} />
                  </div>
                  <span className="text-[10px] text-text4 uppercase tracking-wide font-semibold">{m.label}</span>
                </div>
                <p className="text-lg font-black text-text">{m.value}<span className="text-xs font-medium text-text4 ml-0.5">{m.unit}</span></p>
                <span className="text-[10px] text-green font-semibold">{m.trend}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Weight Chart — Area */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-text">Evolução do Peso</h3>
              <p className="text-[11px] text-text4 mt-0.5">Últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-bg text-green text-[11px] font-semibold px-2.5 py-1 rounded-xl">
              <TrendingDown className="w-3 h-3" /> -2.3 kg
            </div>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="wg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(252,60%,62%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(252,60%,62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,15%,90%)" />
                <XAxis dataKey="date" stroke="hsl(240,12%,72%)" fontSize={9} tickLine={false} axisLine={false} interval={Math.floor(weightData.length / 5)} />
                <YAxis stroke="hsl(240,12%,72%)" fontSize={9} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={30} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(240,15%,88%)', borderRadius: '12px', color: 'hsl(240,20%,20%)', fontSize: '12px', boxShadow: '0 4px 16px hsla(252,40%,40%,0.1)' }}
                />
                <Area type="monotone" dataKey="weight" stroke="hsl(252,60%,62%)" strokeWidth={2.5} fill="url(#wg)" dot={false} activeDot={{ r: 4, fill: 'hsl(252,60%,62%)', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Bar chart — Score overview */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-text">Progresso por Área</h3>
            <span className="text-[10px] text-accent font-semibold">scores</span>
          </div>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,15%,90%)" />
                <XAxis dataKey="name" stroke="hsl(240,12%,72%)" fontSize={10} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(240,12%,72%)" fontSize={9} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(240,15%,88%)', borderRadius: '12px', fontSize: '12px' }} />
                <Bar dataKey="value" fill="hsl(252,60%,62%)" radius={[8, 8, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ROW 3: Table + Schedule */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Recent Check-ins Table */}
        <div className="lg:col-span-3 bg-card rounded-3xl p-6 border border-border shadow-card">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-bold text-text">Check-ins Recentes</h3>
            <a href="/checkin" className="text-[11px] text-accent font-semibold hover:underline">Ver Todos</a>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-[10px] text-text4 uppercase tracking-wider font-semibold pb-3">Tipo</th>
                  <th className="text-[10px] text-text4 uppercase tracking-wider font-semibold pb-3">Data</th>
                  <th className="text-[10px] text-text4 uppercase tracking-wider font-semibold pb-3">Valor</th>
                  <th className="text-[10px] text-text4 uppercase tracking-wider font-semibold pb-3">Notas</th>
                </tr>
              </thead>
              <tbody>
                {recentCheckins.map((item, i) => (
                  <tr key={i} className="border-b border-border-light last:border-0">
                    <td className="py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className={`w-8 h-8 ${item.color} rounded-xl flex items-center justify-center`}>
                          <item.icon className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-semibold text-text">{item.type}</span>
                      </div>
                    </td>
                    <td className="py-3.5 text-sm text-text3">{item.date}</td>
                    <td className="py-3.5 text-sm font-semibold text-text">{item.value}</td>
                    <td className="py-3.5 text-sm text-text4">{item.notes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Schedule + Community */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Schedule */}
          <div className="bg-card rounded-3xl p-5 border border-border shadow-card flex-1">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-text">Agenda</h3>
              <span className="text-[10px] text-text4">Março</span>
            </div>
            <div className="space-y-3">
              {weeklySchedule.map((day) => (
                <div key={day.day} className="flex items-start gap-3">
                  <div className="text-center w-10 flex-shrink-0">
                    <p className="text-[10px] text-text4 font-medium">{day.day}</p>
                    <p className="text-base font-bold text-text">{day.date}</p>
                  </div>
                  <div className="flex-1 space-y-1.5">
                    {day.items.map((item, j) => (
                      <div key={j} className={`${item.color} rounded-xl px-3 py-2 flex items-center justify-between`}>
                        <span className="text-xs font-semibold text-white">{item.label}</span>
                        <span className="text-[10px] text-white/70">{item.time}</span>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Community mini */}
          <div className="bg-card rounded-3xl p-5 border border-border shadow-card topo-pattern">
            <h3 className="text-[11px] font-semibold text-text4 uppercase tracking-[1.5px] mb-3">Comunidade</h3>
            <div className="space-y-3">
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
                  <span className="text-sm font-bold text-text">
                    {typeof item.value === 'number' ? item.value.toLocaleString('pt-BR') : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
