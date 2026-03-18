import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
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
  Droplets,
  Ruler,
  AlertTriangle,
  Download,
  Calendar,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { getCheckIns } from '../lib/api';
import type { CheckIn } from '../types';

const tabs = [
  { id: 'weight', label: 'Peso', icon: Scale },
  { id: 'sleep', label: 'Sono', icon: Moon },
  { id: 'water', label: 'Agua', icon: Droplets },
  { id: 'waist', label: 'Cintura', icon: Ruler },
];

const dateRanges = [
  { id: '7', label: '7 dias' },
  { id: '30', label: '30 dias' },
  { id: '90', label: '90 dias' },
  { id: 'all', label: 'Todos' },
];

function generateDemoData(days: number): Partial<CheckIn>[] {
  return Array.from({ length: days }, (_, i) => ({
    date: new Date(Date.now() - (days - 1 - i) * 86400000).toISOString().split('T')[0],
    weight: 85 - i * 0.08 + Math.random() * 0.6 - 0.3,
    sleep_quality: Math.floor(2 + Math.random() * 3) + 1,
    water_liters: 1.2 + Math.random() * 1.8,
    waist: 92 - i * 0.05 + Math.random() * 0.4 - 0.2,
  }));
}

export default function DataPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('weight');
  const [dateRange, setDateRange] = useState('30');
  const [loading, setLoading] = useState(true);
  const [checkins, setCheckins] = useState<Partial<CheckIn>[]>([]);

  useEffect(() => {
    async function loadData() {
      const days = dateRange === 'all' ? 120 : parseInt(dateRange);
      if (!user) {
        setCheckins(generateDemoData(days));
        setLoading(false);
        return;
      }
      try {
        const data = await getCheckIns(user.id, days);
        setCheckins(data.length > 0 ? data : generateDemoData(days));
      } catch {
        setCheckins(generateDemoData(days));
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [user, dateRange]);

  if (loading) return <LoadingSpinner />;

  const chartData = [...checkins].reverse().map((c) => ({
    date: c.date
      ? new Date(c.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })
      : '',
    weight: Number((c.weight ?? 0).toFixed(1)),
    sleep: c.sleep_quality ?? 0,
    water: Number((c.water_liters ?? 0).toFixed(1)),
    waist: Number((c.waist ?? 0).toFixed(1)),
  }));

  // Risk indicators
  const latestWeight = checkins[0]?.weight ?? 85;
  const latestWaist = checkins[0]?.waist ?? 92;
  const height = 1.75; // Default
  const imc = latestWeight / (height * height);
  const cvRisk = latestWaist > 94 ? 'Elevado' : latestWaist > 80 ? 'Moderado' : 'Normal';
  const imcCategory =
    imc >= 30 ? 'Obesidade' : imc >= 25 ? 'Sobrepeso' : imc >= 18.5 ? 'Normal' : 'Abaixo';

  const tooltipStyle = {
    backgroundColor: '#2d3a4e',
    border: '1px solid #374762',
    borderRadius: '12px',
    color: '#e2e8f0',
    fontSize: '13px',
  };

  const renderChart = () => {
    const interval = Math.max(1, Math.floor(chartData.length / 8));

    switch (activeTab) {
      case 'weight':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="weightGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d4e157" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#d4e157" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={45} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
              <Area type="monotone" dataKey="weight" stroke="#d4e157" strokeWidth={2.5} fill="url(#weightGrad)" dot={false} activeDot={{ r: 5, fill: '#d4e157' }} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'sleep':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="sleep" fill="#d4e157" radius={[4, 4, 0, 0]} barSize={chartData.length > 60 ? 4 : 12} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'water':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={[0, 4]} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
              <Bar dataKey="water" fill="#38bdf8" radius={[4, 4, 0, 0]} barSize={chartData.length > 60 ? 4 : 12} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'waist':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374762" strokeOpacity={0.3} />
              <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="#64748b" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={45} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: '#94a3b8' }} />
              <Line type="monotone" dataKey="waist" stroke="#fb923c" strokeWidth={2.5} dot={false} activeDot={{ r: 5, fill: '#fb923c' }} />
            </LineChart>
          </ResponsiveContainer>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white">Dados & Analiticos</h2>
          <p className="text-slate-400 mt-1">Acompanhe sua evolucao</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-dark3 border border-dark4/50 rounded-xl text-sm text-slate-300 hover:bg-dark4/50 transition-colors w-fit">
          <Download className="w-4 h-4" />
          Exportar Dados
        </button>
      </div>

      {/* Tabs & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-1 bg-dark3 rounded-xl p-1 border border-dark4/30">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-lime/15 text-lime'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-dark3 rounded-xl p-1 border border-dark4/30">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                dateRange === range.id
                  ? 'bg-lime/15 text-lime'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Calendar className="w-3 h-3 sm:hidden" />
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
        {renderChart()}
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">IMC</span>
          </div>
          <p className="text-3xl font-bold text-white">{imc.toFixed(1)}</p>
          <p
            className={`text-sm mt-1 ${
              imc >= 25 ? 'text-orange-400' : 'text-green-400'
            }`}
          >
            {imcCategory}
          </p>
          <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                imc >= 30
                  ? 'bg-red-500'
                  : imc >= 25
                  ? 'bg-orange-400'
                  : 'bg-green-400'
              }`}
              style={{ width: `${Math.min((imc / 40) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center gap-2 mb-3">
            {cvRisk !== 'Normal' && <AlertTriangle className="w-4 h-4 text-orange-400" />}
            <span className="text-sm text-slate-400">Risco Cardiovascular</span>
          </div>
          <p className="text-3xl font-bold text-white">{cvRisk}</p>
          <p className="text-sm text-slate-400 mt-1">
            Cintura: {latestWaist.toFixed(1)} cm
          </p>
          <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                cvRisk === 'Elevado'
                  ? 'bg-red-500'
                  : cvRisk === 'Moderado'
                  ? 'bg-orange-400'
                  : 'bg-green-400'
              }`}
              style={{
                width:
                  cvRisk === 'Elevado'
                    ? '85%'
                    : cvRisk === 'Moderado'
                    ? '55%'
                    : '30%',
              }}
            />
          </div>
        </div>

        <div className="bg-dark3 rounded-2xl p-6 border border-dark4/30">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-slate-400" />
            <span className="text-sm text-slate-400">Idade Metabolica</span>
          </div>
          <p className="text-3xl font-bold text-white">38</p>
          <p className="text-sm text-slate-400 mt-1">anos (estimado)</p>
          <div className="mt-3 h-2 bg-dark4 rounded-full overflow-hidden">
            <div className="h-full bg-lime rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
