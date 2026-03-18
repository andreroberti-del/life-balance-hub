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
        <circle cx="110" cy="110" r={radius} fill="none" stroke="#EEEEE8" strokeWidth="12" />
        <circle
          cx="110"
          cy="110"
          r={radius}
          fill="none"
          stroke="#C6D63E"
          strokeWidth="12"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          className="transition-all duration-1000 ease-out"
        />
      </svg>
      <div className="absolute text-center">
        <p className="text-5xl font-black text-text">{current}</p>
        <p className="text-sm text-text3">de {total} dias</p>
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
          <div key={i} className="text-center text-xs text-text3 py-1">
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
                    ? 'bg-lime/30 text-lime-darker font-medium'
                    : day.status === 'missed'
                    ? 'bg-red-50 text-red-400'
                    : 'bg-bg2 text-text-light'
                }`}
                title={day.date}
              >
                {new Date(day.date + 'T12:00:00').getDate()}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-4 mt-3 text-xs text-text3">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-lime/30" />
          <span>Feito</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-red-50" />
          <span>Perdido</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded bg-bg2" />
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
        <h2 className="text-2xl font-bold text-text">Protocolo 120 Dias</h2>
        <p className="text-text2 mt-1">Acompanhe sua jornada de transformacao</p>
      </div>

      {/* Progress + Stats Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col items-center justify-center">
          <CircularProgress current={protocol.current_day} total={protocol.total_days} />
          <p className="text-sm text-text3 mt-4">
            {protocol.total_days - protocol.current_day} dias restantes
          </p>
        </div>

        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-amber-50 rounded-lg flex items-center justify-center">
                <Flame className="w-4 h-4 text-amber-500" />
              </div>
              <span className="text-sm text-text3">Aderencia</span>
            </div>
            <p className="text-3xl font-black text-text">{completionRate}%</p>
            <p className="text-xs text-text-light mt-1">
              {protocol.checkin_dates.length} de {protocol.current_day} dias
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-text3">Check-ins</span>
            </div>
            <p className="text-3xl font-black text-text">
              {protocol.checkin_dates.length}
            </p>
            <p className="text-xs text-text-light mt-1">realizados</p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <span className="text-sm text-text3">Inicio</span>
            </div>
            <p className="text-lg font-bold text-text">
              {new Date(protocol.start_date).toLocaleDateString('pt-BR')}
            </p>
            <p className="text-xs text-text-light mt-1">
              Fim: {new Date(protocol.end_date).toLocaleDateString('pt-BR')}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                <Clock className="w-4 h-4 text-purple-500" />
              </div>
              <span className="text-sm text-text3">Tempo restante</span>
            </div>
            <p className="text-lg font-bold text-text">
              {protocol.total_days - protocol.current_day} dias
            </p>
            <p className="text-xs text-text-light mt-1">
              {Math.round(
                ((protocol.total_days - protocol.current_day) / 7) * 10
              ) / 10}{' '}
              semanas
            </p>
          </div>
        </div>
      </div>

      {/* Calendar View */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-text mb-4">
          Calendario de Check-ins
        </h3>
        <CalendarGrid
          startDate={protocol.start_date}
          currentDay={protocol.current_day}
          checkinDates={protocol.checkin_dates}
        />
      </div>

      {/* BalanceTest Results */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-text mb-6">
          Resultado BalanceTest
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="text-center p-6 bg-red-50/50 rounded-2xl">
            <p className="text-sm text-text3 mb-2">Antes do Protocolo</p>
            <p className="text-5xl font-black text-red-500">
              {protocol.ratio_before ?? '12.3'}
            </p>
            <p className="text-sm text-text3 mt-2">Ratio Omega 6:3</p>
            <div className="mt-3 h-2 bg-red-100 rounded-full overflow-hidden">
              <div className="h-full bg-red-500 rounded-full" style={{ width: '82%' }} />
            </div>
            <p className="text-xs text-red-500 mt-1">Acima do ideal (&lt;3:1)</p>
          </div>

          <div className="text-center p-6 bg-lime/5 rounded-2xl">
            <p className="text-sm text-text3 mb-2">Estimativa Atual</p>
            {protocol.ratio_after ? (
              <>
                <p className="text-5xl font-black text-lime-darker">
                  {protocol.ratio_after}
                </p>
                <p className="text-sm text-text3 mt-2">Ratio Omega 6:3</p>
                <div className="mt-3 h-2 bg-lime/20 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-lime-darker rounded-full"
                    style={{ width: `${Math.min((protocol.ratio_after / 15) * 100, 100)}%` }}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-center gap-2">
                  <TrendingDown className="w-8 h-8 text-lime-darker" />
                  <p className="text-5xl font-black text-lime-darker">~4.2</p>
                </div>
                <p className="text-sm text-text3 mt-2">Ratio Omega 6:3 (estimado)</p>
                <div className="mt-3 h-2 bg-lime/20 rounded-full overflow-hidden">
                  <div className="h-full bg-lime-darker rounded-full" style={{ width: '28%' }} />
                </div>
                <p className="text-xs text-lime-darker mt-1">
                  Faca o BalanceTest para confirmar
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Streak Chart */}
      <div className="bg-white rounded-2xl p-6 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <h3 className="text-lg font-bold text-text mb-4">Evolucao do Streak</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={streakData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E2" />
              <XAxis
                dataKey="day"
                stroke="#8A9A90"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                interval={4}
              />
              <YAxis
                stroke="#8A9A90"
                fontSize={11}
                tickLine={false}
                axisLine={false}
                width={30}
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
              />
              <Line
                type="monotone"
                dataKey="streak"
                stroke="#C6D63E"
                strokeWidth={2.5}
                dot={false}
                activeDot={{ r: 5, fill: '#E7FE55', stroke: '#1A1F1C', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
