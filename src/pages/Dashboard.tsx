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
  CheckCircle2,
  Flame,
  Calendar,
  Droplets,
} from 'lucide-react';
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
  { text: 'Check-in diário registrado', time: '2h atrás', icon: CheckCircle2, color: 'bg-green-bg text-green' },
  { text: 'Produto escaneado: Omega Pure', time: '5h atrás', icon: Activity, color: 'bg-blue-bg text-blue' },
  { text: 'Streak de 12 dias alcançado!', time: '1d atrás', icon: Flame, color: 'bg-amber-bg text-amber' },
  { text: 'Novo membro na comunidade', time: '2d atrás', icon: Users, color: 'bg-purple-bg text-purple' },
];

export default function DashboardHome() {
  const { user } = useAuth();
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

  return (
    <div className="space-y-5 max-w-[1600px]">

      {/* ROW 1: Quick Stats — 6 compact cards in a row */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Peso */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-bg rounded-xl flex items-center justify-center">
              <Scale className="w-4 h-4 text-blue" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Peso</span>
          </div>
          <p className="text-2xl font-black text-text">{latestWeight.toFixed(1)}<span className="text-sm font-medium text-text4 ml-1">kg</span></p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green" />
            <span className="text-[11px] text-green font-semibold">2.3%</span>
          </div>
        </div>

        {/* Cintura */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-purple-bg rounded-xl flex items-center justify-center">
              <Ruler className="w-4 h-4 text-purple" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Cintura</span>
          </div>
          <p className="text-2xl font-black text-text">{latestWaist.toFixed(1)}<span className="text-sm font-medium text-text4 ml-1">cm</span></p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green" />
            <span className="text-[11px] text-green font-semibold">1.8%</span>
          </div>
        </div>

        {/* Sono */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-bg rounded-xl flex items-center justify-center">
              <Moon className="w-4 h-4 text-blue" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Sono</span>
          </div>
          <p className="text-2xl font-black text-text">{latestSleep}<span className="text-sm font-medium text-text4 ml-1">/5</span></p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green" />
            <span className="text-[11px] text-green font-semibold">5%</span>
          </div>
        </div>

        {/* Ratio Omega */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-lime-bg rounded-xl flex items-center justify-center">
              <Heart className="w-4 h-4 text-lime" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Ômega</span>
          </div>
          <p className="text-2xl font-black text-text">{omegaRatio}<span className="text-sm font-medium text-text4 ml-1">:1</span></p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingDown className="w-3 h-3 text-green" />
            <span className="text-[11px] text-green font-semibold">18%</span>
          </div>
        </div>

        {/* Streak */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-amber-bg rounded-xl flex items-center justify-center">
              <Flame className="w-4 h-4 text-amber" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Streak</span>
          </div>
          <p className="text-2xl font-black text-text">{streak.current_streak}<span className="text-sm font-medium text-text4 ml-1">dias</span></p>
          <div className="flex items-center gap-1 mt-1">
            <Calendar className="w-3 h-3 text-text4" />
            <span className="text-[11px] text-text4">{streak.total_checkins} total</span>
          </div>
        </div>

        {/* Water (bonus metric) */}
        <div className="bg-card rounded-2xl p-4 border border-border">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-blue-bg rounded-xl flex items-center justify-center">
              <Droplets className="w-4 h-4 text-blue" strokeWidth={1.8} />
            </div>
            <span className="text-[10px] text-text4 uppercase tracking-[1px] font-semibold">Água</span>
          </div>
          <p className="text-2xl font-black text-text">2.5<span className="text-sm font-medium text-text4 ml-1">L</span></p>
          <div className="flex items-center gap-1 mt-1">
            <TrendingUp className="w-3 h-3 text-green" />
            <span className="text-[11px] text-green font-semibold">8%</span>
          </div>
        </div>
      </div>

      {/* ROW 2: Chart + Community side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Weight Chart — takes 3 of 5 columns */}
        <div className="lg:col-span-3 bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h3 className="text-base font-bold text-text">Evolução do Peso</h3>
              <p className="text-xs text-text4 mt-0.5">Últimos 30 dias</p>
            </div>
            <div className="flex items-center gap-1.5 bg-green-bg text-green text-xs font-semibold px-3 py-1.5 rounded-xl">
              <TrendingDown className="w-3 h-3" />
              -2.3 kg
            </div>
          </div>

          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weightData}>
                <defs>
                  <linearGradient id="weightGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#d4e157" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#d4e157" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
                <XAxis
                  dataKey="date"
                  stroke="rgba(255,255,255,0.25)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  interval={Math.floor(weightData.length / 5)}
                />
                <YAxis
                  stroke="rgba(255,255,255,0.25)"
                  fontSize={10}
                  tickLine={false}
                  axisLine={false}
                  domain={['auto', 'auto']}
                  width={35}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#2d3a4e',
                    border: '1px solid rgba(255,255,255,0.1)',
                    borderRadius: '10px',
                    color: 'rgba(255,255,255,0.9)',
                    fontSize: '12px',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                  }}
                  labelStyle={{ color: 'rgba(255,255,255,0.5)' }}
                />
                <Area
                  type="monotone"
                  dataKey="weight"
                  stroke="#d4e157"
                  strokeWidth={2}
                  fill="url(#weightGradient)"
                  dot={false}
                  activeDot={{ r: 4, fill: '#d4e157', stroke: '#1a2332', strokeWidth: 2 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column — takes 2 of 5 columns */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Community Card */}
          <div className="bg-card rounded-2xl p-5 border border-border topo-pattern flex-1">
            <h3 className="text-[11px] font-semibold text-text4 uppercase tracking-[1.5px] mb-4">Comunidade</h3>
            <div className="space-y-3.5">
              {[
                { label: 'Membros', value: community.total_members, icon: Users, color: 'bg-blue-bg text-blue' },
                { label: 'Kg perdidos', value: community.total_kg_lost, icon: Scale, color: 'bg-green-bg text-green' },
                { label: 'Melhoria ratio', value: `${community.avg_ratio_improvement}%`, icon: TrendingUp, color: 'bg-lime-bg text-lime' },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center`}>
                      <item.icon className="w-3.5 h-3.5" />
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

          {/* Recent Activity */}
          <div className="bg-card rounded-2xl p-5 border border-border flex-1">
            <h3 className="text-[11px] font-semibold text-text4 uppercase tracking-[1.5px] mb-4">Atividade Recente</h3>
            <div className="space-y-3">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-start gap-2.5">
                  <div className={`w-7 h-7 ${item.color} rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5`}>
                    <item.icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm text-text leading-tight">{item.text}</p>
                    <p className="text-[10px] text-text4 mt-0.5">{item.time}</p>
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
