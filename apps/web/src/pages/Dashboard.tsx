import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  Scale,
  Moon,
  Droplets,
  Ruler,
  Flame,
  Activity,
  Users,
  TrendingUp,
  Calendar,
  CheckCircle2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import MetricCard from '../components/MetricCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCheckIns, getUserStreak, getCommunityMetrics } from '../lib/api';
import type { CheckIn, CommunityMetrics, UserStreak } from '../types';

// Demo data for when Supabase has no data
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
  { type: 'checkin', text: 'Check-in diario registrado', time: '2h atras', icon: CheckCircle2 },
  { type: 'scan', text: 'Produto escaneado: Omega Pure', time: '5h atras', icon: Activity },
  { type: 'streak', text: 'Streak de 12 dias alcancado!', time: '1d atras', icon: Flame },
  { type: 'community', text: 'Novo membro entrou na comunidade', time: '2d atras', icon: Users },
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

  const weightData = [...checkins]
    .reverse()
    .map((c) => ({
      date: c.date
        ? new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
        : '',
      weight: Number((c.weight ?? 0).toFixed(1)),
    }));

  const weightSparkline = [...checkins].reverse().map((c) => c.weight ?? 0);
  const sleepSparkline = [...checkins].reverse().map((c) => c.sleep_quality ?? 0);
  const waterSparkline = [...checkins].reverse().map((c) => c.water_liters ?? 0);
  const waistSparkline = [...checkins].reverse().map((c) => c.waist ?? 0);

  return (
    <div className="space-y-6">
      {/* Welcome Card */}
      <div className="bg-gradient-to-r from-dark3 to-dark3/60 rounded-2xl p-6 border border-dark4/30">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Ola, {profile?.name?.split(' ')[0] || 'Usuario'}!
            </h2>
            <p className="text-slate-400 mt-1">
              Dia <span className="text-lime font-semibold">54</span> do Protocolo 120
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-orange-400" />
              <div>
                <p className="text-2xl font-bold text-white">{streak.current_streak}</p>
                <p className="text-xs text-slate-400">dias seguidos</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-lime" />
              <div>
                <p className="text-2xl font-bold text-white">{streak.total_checkins}</p>
                <p className="text-xs text-slate-400">check-ins</p>
              </div>
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
          sparklineData={weightSparkline}
        />
        <MetricCard
          title="Cintura"
          value={latestWaist.toFixed(1)}
          unit="cm"
          trend={-1.8}
          icon={Ruler}
          sparklineData={waistSparkline}
        />
        <MetricCard
          title="Sono"
          value={latestSleep}
          unit="/5"
          trend={5}
          icon={Moon}
          sparklineData={sleepSparkline}
        />
        <MetricCard
          title="Ratio Omega"
          value={omegaRatio}
          unit=":1"
          trend={-18}
          icon={Droplets}
          sparklineData={waterSparkline}
        />
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Weight Chart */}
        <div className="xl:col-span-2 bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-semibold text-white">Evolucao do Peso</h3>
              <p className="text-sm text-slate-400">Ultimos 30 dias</p>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="w-4 h-4 text-green-400" />
              <span className="text-green-400">-2.3 kg</span>
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
                <XAxis
                  dataKey="date"
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(weightData.length / 6)}
                />
                <YAxis
                  stroke="#64748b"
                  fontSize={11}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  width={40}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d3a4e',
                    border: '1px solid #374762',
                    borderRadius: '12px',
                    color: '#e2e8f0',
                    fontSize: '13px',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#d4e157"
                  strokeWidth={2.5}
                  dot={false}
                  activeDot={{ r: 5, fill: '#d4e157', stroke: '#1a2332', strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="space-y-6">
          {/* Community Stats */}
          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <h3 className="text-lg font-semibold text-white mb-4">Comunidade</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-500/10 rounded-lg flex items-center justify-center">
                    <Users className="w-4 h-4 text-blue-400" />
                  </div>
                  <span className="text-sm text-slate-400">Membros</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {community.total_members.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-500/10 rounded-lg flex items-center justify-center">
                    <Scale className="w-4 h-4 text-green-400" />
                  </div>
                  <span className="text-sm text-slate-400">Kg perdidos</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {community.total_kg_lost.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-lime/10 rounded-lg flex items-center justify-center">
                    <Activity className="w-4 h-4 text-lime" />
                  </div>
                  <span className="text-sm text-slate-400">Melhoria ratio</span>
                </div>
                <span className="text-lg font-bold text-white">
                  {community.avg_ratio_improvement}%
                </span>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <h3 className="text-lg font-semibold text-white mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-dark4/50 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                    <item.icon className="w-4 h-4 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-slate-300 leading-tight">{item.text}</p>
                    <p className="text-xs text-slate-500 mt-0.5">{item.time}</p>
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
