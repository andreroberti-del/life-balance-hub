import { useEffect, useState } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
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
  Calendar,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import MetricCard from '../components/MetricCard';
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
  total_members: 2847,
  total_kg_lost: 4521,
  avg_ratio_improvement: 32,
  active_protocols: 1203,
  total_checkins: 89432,
  members_trend: 12,
  kg_trend: 8,
  ratio_trend: 15,
};

const demoStreak: UserStreak = {
  current_streak: 12,
  longest_streak: 23,
  total_checkins: 54,
};

const recentActivity = [
  { text: 'Check-in diario registrado', time: '2h atras', icon: CheckCircle2, color: 'bg-green-50 text-green-600' },
  { text: 'Produto escaneado: Omega Pure', time: '5h atras', icon: Activity, color: 'bg-blue-50 text-blue-600' },
  { text: 'Streak de 12 dias alcancado!', time: '1d atras', icon: Flame, color: 'bg-amber-50 text-amber-600' },
  { text: 'Novo membro na comunidade', time: '2d atras', icon: Users, color: 'bg-purple-50 text-purple-600' },
];

export default function DashboardHome() {
  const { profile, user } = useAuth();
  const [checkins, setCheckins] = useState<Partial<CheckIn>[]>([]);
  const [streak, setStreak] = useState<UserStreak>(demoStreak);
  const [community, setCommunity] = useState<CommunityMetrics>(demoCommunity);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setCheckins(demoCheckins);
        setLoading(false);
        return;
      }
      try {
        const [cks, str, com] = await Promise.all([
          getCheckIns(user.id, 30),
          getUserStreak(user.id),
          getCommunityMetrics(),
        ]);
        setCheckins(cks.length > 0 ? cks : demoCheckins as CheckIn[]);
        setStreak(str.total_checkins > 0 ? str : demoStreak);
        setCommunity(com || demoCommunity);
      } catch {
        setCheckins(demoCheckins);
      } finally {
        setLoading(false);
      }
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

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bom dia';
    if (hour < 18) return 'Boa tarde';
    return 'Boa noite';
  };

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">
            {greeting()}, {profile?.name?.split(' ')[0] || 'Usuario'}
          </h2>
          <p className="text-text2 mt-1">
            Dia <span className="text-text font-bold">54</span> do Protocolo 120 — Continue assim!
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <p className="text-xl font-black text-text leading-none">{streak.current_streak}</p>
              <p className="text-[10px] text-text3 uppercase tracking-wider">dias seguidos</p>
            </div>
          </div>
          <div className="flex items-center gap-2.5 bg-white rounded-2xl px-4 py-3 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="w-8 h-8 bg-lime/20 rounded-lg flex items-center justify-center">
              <Calendar className="w-4 h-4 text-lime-darker" />
            </div>
            <div>
              <p className="text-xl font-black text-text leading-none">{streak.total_checkins}</p>
              <p className="text-[10px] text-text3 uppercase tracking-wider">check-ins</p>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <MetricCard
          title="Peso"
          value={latestWeight.toFixed(1)}
          unit="kg"
          trend={-2.3}
          icon={Scale}
          iconBg="bg-blue-50 text-blue-500"
        />
        <MetricCard
          title="Cintura"
          value={latestWaist.toFixed(1)}
          unit="cm"
          trend={-1.8}
          icon={Ruler}
          iconBg="bg-purple-50 text-purple-500"
        />
        <MetricCard
          title="Sono"
          value={latestSleep}
          unit="/5"
          trend={5}
          icon={Moon}
          iconBg="bg-indigo-50 text-indigo-500"
        />
        <MetricCard
          title="Ratio Omega"
          value={omegaRatio}
          unit=":1"
          trend={-18}
          icon={Heart}
          iconBg="bg-lime/15 text-lime-darker"
        />
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weight Chart */}
        <div className="xl:col-span-2 bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-bold text-text">Evolucao do Peso</h3>
              <p className="text-sm text-text3">Ultimos 30 dias</p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-50 text-green-600 text-sm font-semibold px-3 py-1.5 rounded-full">
              <TrendingDown className="w-3.5 h-3.5" />
              -2.3 kg
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E7FE55" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#E7FE55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E2" />
                <XAxis
                  dataKey="date"
                  stroke="#8A9A90"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(weightData.length / 6)}
                />
                <YAxis
                  stroke="#8A9A90"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #E8E8E2',
                    borderRadius: '12px',
                    color: '#1A1F1C',
                    fontSize: '13px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                  labelStyle={{ color: '#8A9A90' }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#C6D63E"
                  strokeWidth={2.5}
                  fill="url(#weightGradient)"
                  dot={false}
                  activeDot={{ r: 5, fill: '#E7FE55', stroke: '#1A1F1C', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-5">
          {/* Community - Dark Card */}
          <div className="bg-dark rounded-2xl p-5">
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">Comunidade</h3>
            <div className="space-y-3.5">
              {[
                { label: 'Membros', value: community.total_members, icon: Users, color: 'bg-blue-500/20 text-blue-400' },
                { label: 'Kg perdidos', value: community.total_kg_lost, icon: Scale, color: 'bg-green-500/20 text-green-400' },
                { label: 'Melhoria ratio', value: `${community.avg_ratio_improvement}%`, icon: TrendingUp, color: 'bg-lime/20 text-lime' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-4 h-4" />
                    </div>
                    <span className="text-sm text-white/50">{item.label}</span>
                  </div>
                  <span className="text-lg font-bold text-white">
                    {typeof item.value === 'number' ? item.value.toLocaleString('pt-BR') : item.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <h3 className="text-sm font-semibold text-text2 uppercase tracking-wider mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className={`w-8 h-8 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text leading-tight">{item.text}</p>
                    <p className="text-[11px] text-text3 mt-0.5">{item.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
