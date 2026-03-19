import { useState } from 'react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { Users, Target, UserCheck, DollarSign, TestTube2, TrendingUp, TrendingDown } from 'lucide-react';

const funnelData = [
  { stage: 'Novo', count: 45, color: 'hsl(252,60%,62%)' },
  { stage: 'Contato', count: 38, color: 'hsl(252,65%,72%)' },
  { stage: 'Conversa', count: 28, color: 'hsl(211,90%,61%)' },
  { stage: 'Apresentação', count: 20, color: 'hsl(36,100%,57%)' },
  { stage: 'Decisão', count: 14, color: 'hsl(45,100%,56%)' },
  { stage: 'Cliente', count: 10, color: 'hsl(122,39%,49%)' },
  { stage: 'Partner', count: 3, color: 'hsl(291,47%,51%)' },
];

const leadsOverTime = [
  { month: 'Set', leads: 8 }, { month: 'Out', leads: 12 }, { month: 'Nov', leads: 15 },
  { month: 'Dez', leads: 10 }, { month: 'Jan', leads: 18 }, { month: 'Fev', leads: 22 }, { month: 'Mar', leads: 28 },
];

const sourceData = [
  { source: 'Instagram', count: 35, color: '#E1306C' }, { source: 'WhatsApp', count: 28, color: '#25D366' },
  { source: 'Indicação', count: 20, color: '#8B5CF6' }, { source: 'Website', count: 12, color: '#3B82F6' }, { source: 'Eventos', count: 8, color: '#F59E0B' },
];

const activityFeed = [
  { text: 'Maria Silva avançou para Contato', time: '10 min atrás', type: 'pipeline' },
  { text: 'Follow-up com Roberto concluído', time: '25 min atrás', type: 'followup' },
  { text: 'BalanceTest de Camila: resultado 4.8:1', time: '1h atrás', type: 'test' },
  { text: 'Novo lead: Larissa Gomes (Instagram)', time: '2h atrás', type: 'lead' },
  { text: 'Beatriz Cardoso indicou novo lead', time: '3h atrás', type: 'referral' },
  { text: 'Recompra processada: Rafael Nunes', time: '5h atrás', type: 'purchase' },
  { text: 'Patrícia concluiu apresentação', time: '6h atrás', type: 'pipeline' },
  { text: 'Re-teste agendado: Fernando Martins', time: '1d atrás', type: 'test' },
];

const activityColors: Record<string, string> = { pipeline: 'bg-accent', followup: 'bg-blue', test: 'bg-purple', lead: 'bg-green', referral: 'bg-orange', purchase: 'bg-red' };

export default function Performance() {
  const maxFunnel = Math.max(...funnelData.map(d => d.count));

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Performance</h2>
        <p className="text-sm text-text4 mt-1">Visão geral do seu desempenho como Partner</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Total Leads', value: '103', trend: '+18%', icon: Users, cls: 'text-accent bg-accent-bg' },
          { label: 'Conversão', value: '22.3%', trend: '+3.2%', icon: Target, cls: 'text-green bg-green-bg' },
          { label: 'Clientes Ativos', value: '23', trend: '+4', icon: UserCheck, cls: 'text-blue bg-blue-bg' },
          { label: 'Receita (est.)', value: 'R$ 8.4K', trend: '+12%', icon: DollarSign, cls: 'text-purple bg-purple-bg' },
          { label: 'Testes Mês', value: '7', trend: '+2', icon: TestTube2, cls: 'text-orange bg-orange-bg' },
        ].map(kpi => (
          <div key={kpi.label} className="bg-card rounded-3xl p-5 border border-border shadow-card">
            <div className="flex items-start justify-between mb-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${kpi.cls}`}><kpi.icon className="w-[18px] h-[18px]" /></div>
              <div className="flex items-center gap-1 text-xs font-semibold text-green bg-green-bg px-2 py-0.5 rounded-lg">
                <TrendingUp className="w-[11px] h-[11px]" />{kpi.trend}
              </div>
            </div>
            <p className="text-2xl font-extrabold text-text leading-none">{kpi.value}</p>
            <p className="text-xs text-text4 mt-1">{kpi.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Funnel */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-text mb-1">Funil do Pipeline</h3>
          <p className="text-xs text-text4 mb-5">Distribuição de leads por estágio</p>
          <div className="space-y-2.5">
            {funnelData.map(item => (
              <div key={item.stage} className="flex items-center gap-3">
                <span className="w-[90px] text-[13px] font-semibold text-text3 text-right flex-shrink-0">{item.stage}</span>
                <div className="flex-1 bg-bg rounded-lg h-8 overflow-hidden border border-border-light">
                  <div className="h-full rounded-lg flex items-center pl-3 min-w-[40px] transition-all duration-500" style={{ width: `${(item.count / maxFunnel) * 100}%`, background: item.color }}>
                    <span className="text-xs font-bold text-white">{item.count}</span>
                  </div>
                </div>
                <span className="w-10 text-[11px] text-text4 text-right">{((item.count / funnelData[0].count) * 100).toFixed(0)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Leads Over Time */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-text mb-1">Leads ao Longo do Tempo</h3>
          <p className="text-xs text-text4 mb-5">Novos leads por mês</p>
          <div className="h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={leadsOverTime}>
                <defs>
                  <linearGradient id="lg" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="hsl(252,60%,62%)" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="hsl(252,60%,62%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,15%,90%)" />
                <XAxis dataKey="month" stroke="hsl(240,12%,72%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(240,12%,72%)" fontSize={12} tickLine={false} axisLine={false} width={30} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(240,15%,88%)', borderRadius: '12px', fontSize: '13px' }} />
                <Area type="monotone" dataKey="leads" stroke="hsl(252,60%,62%)" strokeWidth={2.5} fill="url(#lg)" dot={false} activeDot={{ r: 5, fill: 'hsl(252,60%,62%)', stroke: '#fff', strokeWidth: 2 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* Follow-up Ring */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-text mb-1">Taxa de Follow-up</h3>
          <p className="text-xs text-text4 mb-5">Conclusão este mês</p>
          <div className="flex items-center justify-center py-4">
            <div className="relative w-[160px] h-[160px]">
              <svg viewBox="0 0 120 120" className="w-full h-full">
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(240,15%,90%)" strokeWidth="12" />
                <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(252,60%,62%)" strokeWidth="12" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 50 * 0.87} ${2 * Math.PI * 50 * 0.13}`} transform="rotate(-90 60 60)" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <p className="text-3xl font-extrabold text-text leading-none">87%</p>
                <p className="text-[11px] text-text4 mt-1">Concluídos</p>
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-6">
            {[{ label: 'Concluídos', value: 42, cls: 'text-green' }, { label: 'Pendentes', value: 6, cls: 'text-orange' }, { label: 'Atrasados', value: 2, cls: 'text-red' }].map(item => (
              <div key={item.label} className="text-center">
                <p className="text-xl font-extrabold text-text">{item.value}</p>
                <p className={`text-[11px] font-semibold ${item.cls}`}>{item.label}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Sources */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-text mb-1">Principais Fontes</h3>
          <p className="text-xs text-text4 mb-5">De onde vêm seus leads</p>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(240,15%,90%)" horizontal={false} />
                <XAxis type="number" stroke="hsl(240,12%,72%)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="source" stroke="hsl(240,12%,72%)" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid hsl(240,15%,88%)', borderRadius: '12px', fontSize: '13px' }} />
                <Bar dataKey="count" radius={[0, 8, 8, 0]} barSize={24}>
                  {sourceData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Activity Feed */}
        <div className="bg-card rounded-3xl p-6 border border-border shadow-card">
          <h3 className="text-base font-bold text-text mb-1">Atividade Recente</h3>
          <p className="text-xs text-text4 mb-5">Últimas ações no CRM</p>
          <div className="space-y-3.5">
            {activityFeed.map((item, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className={`w-2.5 h-2.5 rounded-full mt-1.5 flex-shrink-0 ${activityColors[item.type]}`} />
                <div>
                  <p className="text-[13px] text-text leading-snug">{item.text}</p>
                  <p className="text-[11px] text-text4 mt-0.5">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
