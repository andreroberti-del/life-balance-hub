import { useEffect, useState } from 'react';
import {
  Users,
  Scale,
  Activity,
  Target,
  TrendingUp,
  TrendingDown,
  Trophy,
  Award,
  Medal,
  Crown,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCommunityMetrics } from '../lib/api';
import type { CommunityMetrics } from '../types';

const demoMetrics: CommunityMetrics = {
  total_members: 2847,
  total_kg_lost: 4521,
  avg_ratio_improvement: 32,
  active_protocols: 1203,
  total_checkins: 89432,
  members_trend: 12,
  kg_trend: 8,
  ratio_trend: 15,
};

const leaderboard = [
  { rank: 1, name: 'Maria S.', kgLost: 18.5, streak: 89, icon: Crown },
  { rank: 2, name: 'Carlos R.', kgLost: 15.2, streak: 76, icon: Trophy },
  { rank: 3, name: 'Ana L.', kgLost: 14.8, streak: 65, icon: Medal },
  { rank: 4, name: 'Pedro M.', kgLost: 12.3, streak: 54, icon: Award },
  { rank: 5, name: 'Julia F.', kgLost: 11.9, streak: 48, icon: Award },
  { rank: 6, name: 'Roberto A.', kgLost: 10.5, streak: 43, icon: Award },
  { rank: 7, name: 'Fernanda C.', kgLost: 9.8, streak: 38, icon: Award },
  { rank: 8, name: 'Lucas D.', kgLost: 9.2, streak: 35, icon: Award },
];

export default function CommunityPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [metrics, setMetrics] = useState<CommunityMetrics>(demoMetrics);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setMetrics(demoMetrics);
        setLoading(false);
        return;
      }
      try {
        const data = await getCommunityMetrics();
        setMetrics(data || demoMetrics);
      } catch {
        setMetrics(demoMetrics);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const TrendBadge = ({ value }: { value: number }) => (
    <div
      className={`flex items-center gap-1 text-xs font-medium ${
        value >= 0 ? 'text-green-400' : 'text-red-400'
      }`}
    >
      {value >= 0 ? (
        <TrendingUp className="w-3 h-3" />
      ) : (
        <TrendingDown className="w-3 h-3" />
      )}
      {Math.abs(value)}%
    </div>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Comunidade</h2>
        <p className="text-slate-400 mt-1">O poder do grupo na sua jornada</p>
      </div>

      {/* Hero Stat */}
      <div className="bg-gradient-to-br from-lime/10 via-dark3 to-dark3 rounded-2xl p-8 border border-lime/20 text-center">
        <p className="text-sm text-lime font-medium uppercase tracking-wider mb-2">
          Nossa comunidade ja perdeu
        </p>
        <p className="text-6xl md:text-7xl font-extrabold text-white">
          {metrics.total_kg_lost.toLocaleString('pt-BR')}
        </p>
        <p className="text-2xl text-lime font-semibold mt-1">quilos</p>
        <p className="text-slate-400 text-sm mt-3">
          juntos, estamos mais saudaveis a cada dia
        </p>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-blue-500/10 rounded-xl flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-400" />
            </div>
            <TrendBadge value={metrics.members_trend} />
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.total_members.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-slate-400 mt-1">Membros ativos</p>
        </div>

        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center">
              <Scale className="w-5 h-5 text-green-400" />
            </div>
            <TrendBadge value={metrics.kg_trend} />
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.total_kg_lost.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-slate-400 mt-1">Kg perdidos total</p>
        </div>

        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-lime/10 rounded-xl flex items-center justify-center">
              <Activity className="w-5 h-5 text-lime" />
            </div>
            <TrendBadge value={metrics.ratio_trend} />
          </div>
          <p className="text-3xl font-bold text-white">{metrics.avg_ratio_improvement}%</p>
          <p className="text-sm text-slate-400 mt-1">Melhoria ratio medio</p>
        </div>

        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 bg-purple-500/10 rounded-xl flex items-center justify-center">
              <Target className="w-5 h-5 text-purple-400" />
            </div>
          </div>
          <p className="text-3xl font-bold text-white">
            {metrics.active_protocols.toLocaleString('pt-BR')}
          </p>
          <p className="text-sm text-slate-400 mt-1">Protocolos ativos</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="bg-dark3 rounded-2xl border border-dark4/30 overflow-hidden">
        <div className="p-6 border-b border-dark4/30">
          <h3 className="text-lg font-semibold text-white">Ranking — Top Resultados</h3>
          <p className="text-sm text-slate-400 mt-1">
            Os membros com maiores transformacoes
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-slate-400 text-xs uppercase tracking-wider border-b border-dark4/30">
                <th className="text-left px-6 py-3 font-medium w-16">#</th>
                <th className="text-left px-6 py-3 font-medium">Membro</th>
                <th className="text-left px-6 py-3 font-medium">Kg Perdidos</th>
                <th className="text-left px-6 py-3 font-medium">Streak</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((entry) => {
                const RankIcon = entry.icon;
                const rankColors: Record<number, string> = {
                  1: 'text-yellow-400',
                  2: 'text-slate-300',
                  3: 'text-amber-600',
                };

                return (
                  <tr
                    key={entry.rank}
                    className={`border-t border-dark4/20 transition-colors hover:bg-dark4/20 ${
                      entry.rank <= 3 ? 'bg-dark4/10' : ''
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <RankIcon
                          className={`w-5 h-5 ${rankColors[entry.rank] || 'text-slate-500'}`}
                        />
                        <span
                          className={`font-bold ${
                            rankColors[entry.rank] || 'text-slate-400'
                          }`}
                        >
                          {entry.rank}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-dark4 flex items-center justify-center text-xs font-semibold text-slate-300">
                          {entry.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </div>
                        <span className="text-white font-medium">{entry.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-green-400 font-semibold">
                        -{entry.kgLost} kg
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <div className="w-2 h-2 rounded-full bg-lime" />
                        <span className="text-slate-300">{entry.streak} dias</span>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Total Check-ins */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30 text-center">
        <p className="text-sm text-slate-400 mb-2">Total de check-ins realizados</p>
        <p className="text-4xl font-bold text-white">
          {metrics.total_checkins.toLocaleString('pt-BR')}
        </p>
        <p className="text-sm text-slate-500 mt-1">e contando...</p>
      </div>
    </div>
  );
}
