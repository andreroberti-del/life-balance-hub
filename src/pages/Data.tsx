import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  AreaChart,
  Area,
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
  { id: 'waist', label: 'Cintura', icon: Ruler },
  { id: 'sleep', label: 'Sono', icon: Moon },
  { id: 'water', label: 'Agua', icon: Droplets },
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

  const latestWeight = checkins[0]?.weight ?? 85;
  const latestWaist = checkins[0]?.waist ?? 92;
  const height = 1.75;
  const imc = latestWeight / (height * height);
  const cvRisk = latestWaist > 94 ? 'Elevado' : latestWaist > 80 ? 'Moderado' : 'Normal';
  const imcCategory =
    imc >= 30 ? 'Obesidade' : imc >= 25 ? 'Sobrepeso' : imc >= 18.5 ? 'Normal' : 'Abaixo';

  const tooltipStyle = {
    backgroundColor: '#2d3a4e',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: '12px',
    color: 'rgba(255,255,255,0.9)',
    fontSize: '13px',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
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
                  <stop offset="5%" stopColor="#E7FE55" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#E7FE55" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={45} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
              <Area type="monotone" dataKey="weight" stroke="#C6D63E" strokeWidth={2.5} fill="url(#weightGrad)" dot={false} activeDot={{ r: 5, fill: '#E7FE55', stroke: '#1a2332', strokeWidth: 2 }} />
            </AreaChart>
          </ResponsiveContainer>
        );
      case 'sleep':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 5]} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
              <Bar dataKey="sleep" fill="#C6D63E" radius={[4, 4, 0, 0]} barSize={chartData.length > 60 ? 4 : 12} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'water':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} domain={[0, 4]} width={30} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
              <Bar dataKey="water" fill="#42a5f5" radius={[4, 4, 0, 0]} barSize={chartData.length > 60 ? 4 : 12} />
            </BarChart>
          </ResponsiveContainer>
        );
      case 'waist':
        return (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.06)" />
              <XAxis dataKey="date" stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} interval={interval} />
              <YAxis stroke="rgba(255,255,255,0.5)" fontSize={11} tickLine={false} axisLine={false} domain={['auto', 'auto']} width={45} />
              <Tooltip contentStyle={tooltipStyle} labelStyle={{ color: 'rgba(255,255,255,0.5)' }} />
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
          <h2 className="text-2xl font-bold text-text">Dados & Analiticos</h2>
          <p className="text-text2 mt-1">Acompanhe sua evolucao</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2.5 bg-dark3 border border-border rounded-xl text-sm text-text2 hover:bg-dark3 transition-colors w-fit">
          <Download className="w-4 h-4" />
          Exportar Dados
        </button>
      </div>

      {/* Tabs & Date Range */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex gap-1 bg-card rounded-xl p-1 border border-border">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'bg-lime text-dark'
                  : 'text-text3 hover:text-text2'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          ))}
        </div>

        <div className="flex gap-1 bg-card rounded-xl p-1 border border-border">
          {dateRanges.map((range) => (
            <button
              key={range.id}
              onClick={() => setDateRange(range.id)}
              className={`flex items-center gap-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                dateRange === range.id
                  ? 'bg-lime text-dark'
                  : 'text-text3 hover:text-text2'
              }`}
            >
              <Calendar className="w-3 h-3 sm:hidden" />
              {range.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-card rounded-2xl p-6 border border-border">
        {renderChart()}
      </div>

      {/* Risk Indicators */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Scale className="w-4 h-4 text-text3" />
            <span className="text-sm text-text3">IMC</span>
          </div>
          <p className="text-3xl font-black text-text">{imc.toFixed(1)}</p>
          <p className={`text-sm mt-1 ${imc >= 25 ? 'text-orange-500' : 'text-green-600'}`}>
            {imcCategory}
          </p>
          <div className="mt-3 h-2 bg-dark3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                imc >= 30 ? 'bg-red-500' : imc >= 25 ? 'bg-orange-400' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min((imc / 40) * 100, 100)}%` }}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-3">
            {cvRisk !== 'Normal' && <AlertTriangle className="w-4 h-4 text-orange-500" />}
            <span className="text-sm text-text3">Risco Cardiovascular</span>
          </div>
          <p className="text-3xl font-black text-text">{cvRisk}</p>
          <p className="text-sm text-text3 mt-1">
            Cintura: {latestWaist.toFixed(1)} cm
          </p>
          <div className="mt-3 h-2 bg-dark3 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full ${
                cvRisk === 'Elevado' ? 'bg-red-500' : cvRisk === 'Moderado' ? 'bg-orange-400' : 'bg-green-500'
              }`}
              style={{
                width: cvRisk === 'Elevado' ? '85%' : cvRisk === 'Moderado' ? '55%' : '30%',
              }}
            />
          </div>
        </div>

        <div className="bg-card rounded-2xl p-6 border border-border">
          <div className="flex items-center gap-2 mb-3">
            <Ruler className="w-4 h-4 text-text3" />
            <span className="text-sm text-text3">Idade Metabolica</span>
          </div>
          <p className="text-3xl font-black text-text">38</p>
          <p className="text-sm text-text3 mt-1">anos (estimado)</p>
          <div className="mt-3 h-2 bg-dark3 rounded-full overflow-hidden">
            <div className="h-full bg-lime-darker rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
