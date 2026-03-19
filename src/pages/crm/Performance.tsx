import { useState } from 'react';
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import {
  Users,
  Target,
  UserCheck,
  DollarSign,
  TestTube2,
  TrendingUp,
  TrendingDown,



} from 'lucide-react';

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

const funnelData = [
  { stage: 'Novo', count: 45, color: '#E7FE55' },
  { stage: 'Contato', count: 38, color: '#D4F04E' },
  { stage: 'Conversa', count: 28, color: '#B8D93E' },
  { stage: 'Apresentacao', count: 20, color: '#9CC22E' },
  { stage: 'Decisao', count: 14, color: '#80AB1E' },
  { stage: 'Cliente', count: 10, color: '#22C55E' },
  { stage: 'Partner', count: 3, color: '#3B82F6' },
];

const leadsOverTime = [
  { month: 'Set', leads: 8 },
  { month: 'Out', leads: 12 },
  { month: 'Nov', leads: 15 },
  { month: 'Dez', leads: 10 },
  { month: 'Jan', leads: 18 },
  { month: 'Fev', leads: 22 },
  { month: 'Mar', leads: 28 },
];

const sourceData = [
  { source: 'Instagram', count: 35, color: '#E1306C' },
  { source: 'WhatsApp', count: 28, color: '#25D366' },
  { source: 'Indicacao', count: 20, color: '#8B5CF6' },
  { source: 'Website', count: 12, color: '#3B82F6' },
  { source: 'Eventos', count: 8, color: '#F59E0B' },
];

const activityFeed = [
  { text: 'Maria Silva avancou para Contato', time: '10 min atras', type: 'pipeline' as const },
  { text: 'Follow-up com Roberto concluido', time: '25 min atras', type: 'followup' as const },
  { text: 'BalanceTest de Camila: resultado 4.8:1', time: '1h atras', type: 'test' as const },
  { text: 'Novo lead: Larissa Gomes (Instagram)', time: '2h atras', type: 'lead' as const },
  { text: 'Beatriz Cardoso indicou novo lead', time: '3h atras', type: 'referral' as const },
  { text: 'Recompra processada: Rafael Nunes', time: '5h atras', type: 'purchase' as const },
  { text: 'Patricia concluiu apresentacao', time: '6h atras', type: 'pipeline' as const },
  { text: 'Re-teste agendado: Fernando Martins', time: '1d atras', type: 'test' as const },
];

const activityColors: Record<string, string> = {
  pipeline: '#E7FE55',
  followup: '#3B82F6',
  test: '#8B5CF6',
  lead: '#22C55E',
  referral: '#F59E0B',
  purchase: '#EC4899',
};

export default function Performance() {
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #E8E8E2', borderTopColor: '#E7FE55',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#8A9A90', fontSize: '14px' }}>Carregando performance...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const maxFunnel = Math.max(...funnelData.map(d => d.count));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1F1C', margin: 0 }}>Performance</h2>
        <p style={{ color: '#8A9A90', fontSize: '14px', marginTop: '4px' }}>Visao geral do seu desempenho como Partner</p>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Leads', value: '103', trend: '+18%', trendUp: true, icon: Users, iconColor: '#6366F1', iconBg: '#EEF2FF' },
          { label: 'Taxa de Conversao', value: '22.3%', trend: '+3.2%', trendUp: true, icon: Target, iconColor: '#22C55E', iconBg: '#F0FDF4' },
          { label: 'Clientes Ativos', value: '23', trend: '+4', trendUp: true, icon: UserCheck, iconColor: '#06B6D4', iconBg: '#ECFEFF' },
          { label: 'Receita Mensal (est.)', value: 'R$ 8.4K', trend: '+12%', trendUp: true, icon: DollarSign, iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
          { label: 'Testes Este Mes', value: '7', trend: '+2', trendUp: true, icon: TestTube2, iconColor: '#F59E0B', iconBg: '#FFFBEB' },
        ].map(kpi => (
          <div key={kpi.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '12px' }}>
              <div style={{
                width: '42px', height: '42px', borderRadius: '14px',
                background: kpi.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <kpi.icon style={{ width: '18px', height: '18px', color: kpi.iconColor }} />
              </div>
              <div style={{
                display: 'flex', alignItems: 'center', gap: '3px', fontSize: '12px', fontWeight: 600,
                color: kpi.trendUp ? '#22C55E' : '#EF4444',
                background: kpi.trendUp ? '#F0FDF4' : '#FEF2F2',
                padding: '3px 8px', borderRadius: '8px',
              }}>
                {kpi.trendUp ? <TrendingUp style={{ width: '11px', height: '11px' }} /> : <TrendingDown style={{ width: '11px', height: '11px' }} />}
                {kpi.trend}
              </div>
            </div>
            <p style={{ fontSize: '28px', fontWeight: 800, color: '#1A1F1C', margin: '0 0 2px', lineHeight: 1 }}>{kpi.value}</p>
            <p style={{ fontSize: '12px', color: '#8A9A90', margin: 0 }}>{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(380px, 1fr))', gap: '20px' }}>
        {/* Pipeline Funnel */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', margin: '0 0 4px' }}>Funil do Pipeline</h3>
          <p style={{ fontSize: '12px', color: '#8A9A90', margin: '0 0 20px' }}>Distribuicao de leads por estagio</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {funnelData.map(item => (
              <div key={item.stage} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ width: '90px', fontSize: '13px', fontWeight: 600, color: '#4A5A50', textAlign: 'right', flexShrink: 0 }}>
                  {item.stage}
                </span>
                <div style={{ flex: 1, background: '#F5F5F0', borderRadius: '8px', height: '32px', overflow: 'hidden' }}>
                  <div style={{
                    width: `${(item.count / maxFunnel) * 100}%`,
                    height: '100%',
                    background: item.color,
                    borderRadius: '8px',
                    display: 'flex', alignItems: 'center', paddingLeft: '12px',
                    transition: 'width 0.6s ease',
                    minWidth: '40px',
                  }}>
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#0F1511' }}>{item.count}</span>
                  </div>
                </div>
                <span style={{ width: '40px', fontSize: '11px', color: '#8A9A90', textAlign: 'right' }}>
                  {((item.count / funnelData[0].count) * 100).toFixed(0)}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Over Time */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', margin: '0 0 4px' }}>Leads ao Longo do Tempo</h3>
          <p style={{ fontSize: '12px', color: '#8A9A90', margin: '0 0 20px' }}>Novos leads por mes</p>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsOverTime}>
                <defs>
                  <linearGradient id="leadsGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#E7FE55" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#E7FE55" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E2" />
                <XAxis dataKey="month" stroke="#8A9A90" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#8A9A90" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff', border: '1px solid #E8E8E2', borderRadius: '12px',
                    color: '#1A1F1C', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Area type="monotone" dataKey="leads" stroke="#C6D63E" strokeWidth={2.5} fill="url(#leadsGradient)" dot={false} activeDot={{ r: 5, fill: '#E7FE55', stroke: '#1A1F1C', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {/* Follow-up Completion */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', margin: '0 0 4px' }}>Taxa de Follow-up</h3>
          <p style={{ fontSize: '12px', color: '#8A9A90', margin: '0 0 20px' }}>Conclusao de follow-ups este mes</p>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
            <div style={{ position: 'relative', width: '160px', height: '160px' }}>
              <svg viewBox="0 0 120 120" style={{ width: '100%', height: '100%' }}>
                <circle cx="60" cy="60" r="50" fill="none" stroke="#F5F5F0" strokeWidth="12" />
                <circle
                  cx="60" cy="60" r="50" fill="none" stroke="#E7FE55" strokeWidth="12"
                  strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.87} ${2 * Math.PI * 50 * 0.13}`}
                  transform="rotate(-90 60 60)"
                />
              </svg>
              <div style={{
                position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
              }}>
                <p style={{ fontSize: '32px', fontWeight: 800, color: '#1A1F1C', margin: 0, lineHeight: 1 }}>87%</p>
                <p style={{ fontSize: '11px', color: '#8A9A90', margin: '4px 0 0' }}>Concluidos</p>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px' }}>
            {[
              { label: 'Concluidos', value: 42, color: '#22C55E' },
              { label: 'Pendentes', value: 6, color: '#F59E0B' },
              { label: 'Atrasados', value: 2, color: '#EF4444' },
            ].map(item => (
              <div key={item.label} style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#1A1F1C', margin: 0 }}>{item.value}</p>
                <p style={{ fontSize: '11px', color: item.color, fontWeight: 600, margin: '2px 0 0' }}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Top Sources */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', margin: '0 0 4px' }}>Principais Fontes</h3>
          <p style={{ fontSize: '12px', color: '#8A9A90', margin: '0 0 20px' }}>De onde vem seus leads</p>
          <div style={{ height: '280px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E2" horizontal={false} />
                <XAxis type="number" stroke="#8A9A90" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="source" stroke="#8A9A90" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff', border: '1px solid #E8E8E2', borderRadius: '12px',
                    color: '#1A1F1C', fontSize: '13px', boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  }}
                />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {sourceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div style={cardStyle}>
          <h3 style={{ fontSize: '16px', fontWeight: 700, color: '#1A1F1C', margin: '0 0 4px' }}>Atividade Recente</h3>
          <p style={{ fontSize: '12px', color: '#8A9A90', margin: '0 0 20px' }}>Ultimas acoes no CRM</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {activityFeed.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '12px' }}>
                <div style={{
                  width: '10px', height: '10px', borderRadius: '50%', marginTop: '5px',
                  background: activityColors[item.type], flexShrink: 0,
                  boxShadow: `0 0 0 3px ${activityColors[item.type]}20`,
                }} />
                <div style={{ flex: 1 }}>
                  <p style={{ fontSize: '13px', color: '#1A1F1C', margin: 0, lineHeight: 1.4 }}>{item.text}</p>
                  <p style={{ fontSize: '11px', color: '#8A9A90', margin: '2px 0 0' }}>{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
