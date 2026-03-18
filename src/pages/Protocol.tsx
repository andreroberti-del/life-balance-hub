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
  Flame,
  Calendar,
  TrendingDown,
  CheckCircle2,
  Clock,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getProtocolDay } from '../lib/api';
import type { ProtocolDay } from '../types';

const demoProtocol: ProtocolDay = {
  current_day: 54,
  total_days: 120,
  start_date: new Date(Date.now() - 54 * 86400000).toISOString(),
  end_date: new Date(Date.now() + 66 * 86400000).toISOString(),
  ratio_before: 12.3,
  ratio_after: null,
  checkin_dates: Array.from({ length: 48 }, (_, i) => {
    const d = new Date(Date.now() - (53 - i) * 86400000);
    // skip some days for realism
    if (i % 7 === 3 || i % 11 === 5) return '';
    return d.toISOString().split('T')[0];
  }).filter(Boolean),
};

function CircularProgress({
  current,
  total,
}: {
  current: number;
  total: number;
}) {
  const percentage = (current / total) * 100;
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width="220" height="220" className="-rotate-90">
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#374762"
          strokeWidth="12"
        />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#d4e157"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-4xl font-extrabold text-white">{current}</p>
        <p className="text-sm text-slate-400">de {total} dias</p>
      </div>
    </div>
  );
}

function CalendarGrid({
  startDate,
  currentDay,
  checkinDates,
}: {
  startDate: string;
  currentDay: number;
  checkinDates: string[];
}) {
  const start = new Date(startDate);
  const checkinSet = new Set(checkinDates);

  const weeks: { date: string; status: 'done' | 'missed' | 'future' }[][] = [];
  let currentWeek: { date: string; status: 'done' | 'missed' | 'future' }[] = [];

  for (let i = 0; i < 120; i++) {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];

    let status: 'done' | 'missed' | 'future';
    if (i >= currentDay) {
      status = 'future';
    } else if (checkinSet.has(dateStr)) {
      status = 'done';
    } else {
      status = 'missed';
    }

    currentWeek.push({ date: dateStr, status });

    if (currentWeek.length === 7) {
      weeks.push(currentWeek);
      currentWeek = [];
    }
  }
  if (currentWeek.length > 0) weeks.push(currentWeek);

  return (
    <div className="space-y-1">
      <div className="grid grid-cols-7 gap-1 mb-1">
        {['S', 'T', 'Q', 'Q', 'S', 'S', 'D'].map((d, i) => (
          <div key={i} className="text-center text-xs text-slate-500 py-1">
            {d}
          </div>
        ))}
      </div>
      <div className="space-y-1">
        {weeks.map((week, wi) => (
          <div key={wi} className="grid grid-cols-7 gap-1">
            {week.map((day, di) => (
              <div
                key={di}
                className={`aspect-square rounded-md flex items-center justify-center text-xs ${
                  day.status === 'done'
                    ? 'bg-lime/30 text-lime'
                    : day.status === 'missed'
                    ? 'bg-red-500/15 text-red-400/60'
                    : 'bg-dark4/30 text-slate-600'
                }`}
                title={day.date}
              >
                {new Date(day.date + 'T12:00:00').getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-lime/30" />
          <span>Feito</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-500/15" />
          <span>Perdido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-dark4/30" />
          <span>Futuro</span>
        </div>
      </div>
    </div>
  );
}

export default function ProtocolPage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [protocol, setProtocol] = useState<ProtocolDay>(demoProtocol);

  useEffect(() => {
    async function loadData() {
      if (!user) {
        setProtocol(demoProtocol);
        setLoading(false);
        return;
      }
      try {
        const data = await getProtocolDay(user.id);
        setProtocol(data || demoProtocol);
      } catch {
        setProtocol(demoProtocol);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user]);

  if (loading) return <LoadingSpinner />;

  const completionRate = Math.round(
    (protocol.checkin_dates.length / protocol.current_day) * 100
  );

  // Streak chart data
  const streakData = Array.from({ length: Math.min(protocol.current_day, 30) }, (_, i) => {
    const dayNum = protocol.current_day - 29 + i;
    if (dayNum < 1) return null;
    return {
      day: `Dia ${dayNum}`,
      streak: Math.floor(3 + Math.random() * 10 + i * 0.3),
    };
  }).filter(Boolean);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-white">Protocolo 120 Dias</h2>
        <p className="text-slate-400 mt-1">Acompanhe sua jornada de transformacao</p>
      </div>

      {/* Progress + Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Circular Progress */}
        <div className="bg-dark3 rounded-2xl p-8 border border-dark4/30 flex flex-col items-center justify-center">
          <CircularProgress
            current={protocol.current_day}
            total={protocol.total_days}
          />
          <p className="text-sm text-slate-400 mt-4">
            {protocol.total_days - protocol.current_day} dias restantes
          </p>
        </div>

        {/* Stats Cards */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <div className="flex items-center gap-2 mb-3">
              <Flame className="w-5 h-5 text-orange-400" />
              <span className="text-sm text-slate-400">Aderencia</span>
            </div>
            <p className="text-3xl font-bold text-white">{completionRate}%</p>
            <p className="text-xs text-slate-500 mt-1">
              {protocol.checkin_dates.length} de {protocol.current_day} dias
            </p>
          </div>

          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <div className="flex items-center gap-2 mb-3">
              <CheckCircle2 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-slate-400">Check-ins</span>
            </div>
            <p className="text-3xl font-bold text-white">
              {protocol.checkin_dates.length}
            </p>
            <p className="text-xs text-slate-500 mt-1">realizados</p>
          </div>

          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <div className="flex items-center gap-2 mb-3">
              <Calendar className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-slate-400">Inicio</span>
            </div>
            <p className="text-lg font-bold text-white">
              {new Date(protocol.start_date).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-xs text-slate-500 mt-1">
              Fim: {new Date(protocol.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
            <div className="flex items-center gap-2 mb-3">
              <Clock className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-slate-400">Tempo restante</span>
            </div>
            <p className="text-lg font-bold text-white">
              {protocol.total_days - protocol.current_day} dias
            </p>
            <p className="text-xs text-slate-500 mt-1">
              {Math.round(
                ((protocol.total_days - protocol.current_day) / 7) * 10
              ) / 10}{' '}
              semanas
            </p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <h3 className="text-lg font-semibold text-white mb-4">
          Calendario de Check-ins
        </h3>
        <CalendarGrid
          startDate={protocol.start_date}
          currentDay={protocol.current_day}
          checkinDates={protocol.checkin_dates}
        />
      </div>

      {/* BalanceTest Results */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <h3 className="text-lg font-semibold text-white mb-6">
          Resultado BalanceTest
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center p-6 bg-dark2/50 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Antes do Protocolo</p>
            <p className="text-5xl font-extrabold text-red-400">
              {protocol.ratio_before ?? '12.3'}
            </p>
            <p className="text-sm text-slate-500 mt-2">Ratio Omega 6:3</p>
            <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '82%' }} />
            </div>
            <p className="text-xs text-red-400 mt-1">Acima do ideal (&lt;3:1)</p>
          </div>

          <div className="text-center p-6 bg-dark2/50 rounded-2xl">
            <p className="text-sm text-slate-400 mb-2">Estimativa Atual</p>
            {protocol.ratio_after ? (
              <>
                <p className="text-5xl font-extrabold text-lime">
                  {protocol.ratio_after}
                </p>
                <p className="text-sm text-slate-500 mt-2">Ratio Omega 6:3</p>
                <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime rounded-full"
                    style={{ width: `${Math.min((protocol.ratio_after / 15) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-8 h-8 text-lime" />
                  <p className="text-5xl font-extrabold text-lime">~4.2</p>
                </div>
                <p className="text-sm text-slate-500 mt-2">Ratio Omega 6:3 (estimado)</p>
                <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
                  <div className="h-full bg-lime rounded-full" style={{ width: '28%' }} />
                </div>
                <p className="text-xs text-lime mt-1">
                  Faca o BalanceTest para confirmar
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Streak Chart */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        <h3 className="text-lg font-semibold text-white mb-4">Evolucao do Streak</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
              <XAxis
                dataKey="day"
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                stroke="#64748b"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#2d3a4e',
                  border: '1px solid #374762',
                  borderRadius: '12px',
                  color: '#e2e8f0',
                  fontSize: '13px',
                }}
              />
              <Line
                type="monotone"
                dataKey="streak"
                stroke="#d4e157"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#d4e157' }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
