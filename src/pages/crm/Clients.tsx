import { useState } from 'react';
import {
  Search,
  UserCheck,


  TrendingUp,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  DollarSign,
  Calendar,
  Package,
  Activity,
  Filter,
} from 'lucide-react';

type ClientStatus = 'active' | 'inactive' | 'churned';

interface ClientActivity {
  text: string;
  date: string;
  type: 'purchase' | 'test' | 'contact' | 'checkin';
}

interface BalanceTestResult {
  date: string;
  ratio: number;
  type: string;
}

interface Client {
  id: string;
  name: string;
  phone: string;
  email: string;
  status: ClientStatus;
  products: string[];
  protocolDay: number;
  nextReorder: string;
  nextRetest: string;
  ltv: number;
  joinedAt: string;
  lastActivity: string;
  alerts: ('reorder' | 'retest' | 'inactive')[];
  activities: ClientActivity[];
  testResults: BalanceTestResult[];
}

const statusConfig: Record<ClientStatus, { label: string; color: string; bg: string }> = {
  active: { label: 'Ativo', color: '#22C55E', bg: '#F0FDF4' },
  inactive: { label: 'Inativo', color: '#F59E0B', bg: '#FFFBEB' },
  churned: { label: 'Churned', color: '#EF4444', bg: '#FEF2F2' },
};

const alertConfig: Record<string, { label: string; color: string }> = {
  reorder: { label: 'Recompra', color: '#F59E0B' },
  retest: { label: 'Re-teste', color: '#E7FE55' },
  inactive: { label: 'Inativo', color: '#EF4444' },
};

const initialClients: Client[] = [
  {
    id: '1', name: 'Camila Mendes', phone: '(21) 98765-4321', email: 'camila@email.com',
    status: 'active', products: ['BalanceOil', 'Zinobiotic', 'Xtend'], protocolDay: 87,
    nextReorder: '2024-04-05', nextRetest: '2024-06-15', ltv: 2840, joinedAt: '2023-09-15',
    lastActivity: '2024-03-18', alerts: ['reorder'],
    activities: [
      { text: 'Check-in diario realizado', date: '2024-03-18', type: 'checkin' },
      { text: 'Compra mensal processada', date: '2024-03-01', type: 'purchase' },
      { text: 'Resultado BalanceTest recebido', date: '2024-02-20', type: 'test' },
    ],
    testResults: [
      { date: '2024-02-20', ratio: 4.8, type: 'Re-teste' },
      { date: '2023-10-15', ratio: 8.2, type: 'Primeiro teste' },
    ],
  },
  {
    id: '2', name: 'Rafael Nunes', phone: '(31) 91234-5678', email: 'rafael@email.com',
    status: 'active', products: ['BalanceOil', 'Xtend+'], protocolDay: 112,
    nextReorder: '2024-03-25', nextRetest: '2024-03-22', ltv: 3420, joinedAt: '2023-07-10',
    lastActivity: '2024-03-17', alerts: ['retest', 'reorder'],
    activities: [
      { text: 'Agendamento re-teste confirmado', date: '2024-03-17', type: 'test' },
      { text: 'Ligacao de acompanhamento', date: '2024-03-10', type: 'contact' },
      { text: 'Compra mensal processada', date: '2024-02-25', type: 'purchase' },
    ],
    testResults: [
      { date: '2023-11-10', ratio: 5.5, type: 'Re-teste' },
      { date: '2023-07-20', ratio: 10.1, type: 'Primeiro teste' },
    ],
  },
  {
    id: '3', name: 'Beatriz Cardoso', phone: '(41) 99876-5432', email: 'beatriz@email.com',
    status: 'active', products: ['BalanceOil', 'Zinobiotic', 'Xtend', 'Viva+'], protocolDay: 180,
    nextReorder: '2024-04-10', nextRetest: '2024-05-01', ltv: 5680, joinedAt: '2023-04-05',
    lastActivity: '2024-03-19', alerts: [],
    activities: [
      { text: 'Indicou novo lead: Patricia Souza', date: '2024-03-19', type: 'contact' },
      { text: 'Compra trimestral processada', date: '2024-03-05', type: 'purchase' },
      { text: 'Re-teste Omega concluido', date: '2024-02-01', type: 'test' },
    ],
    testResults: [
      { date: '2024-02-01', ratio: 3.2, type: 'Re-teste 2' },
      { date: '2023-08-15', ratio: 5.8, type: 'Re-teste 1' },
      { date: '2023-04-20', ratio: 11.3, type: 'Primeiro teste' },
    ],
  },
  {
    id: '4', name: 'Fernando Martins', phone: '(51) 97777-8888', email: 'fernando@email.com',
    status: 'active', products: ['BalanceOil'], protocolDay: 45,
    nextReorder: '2024-04-15', nextRetest: '2024-07-10', ltv: 980, joinedAt: '2024-01-20',
    lastActivity: '2024-03-16', alerts: [],
    activities: [
      { text: 'Check-in semanal realizado', date: '2024-03-16', type: 'checkin' },
      { text: 'Primeiro mes concluido', date: '2024-02-20', type: 'checkin' },
    ],
    testResults: [
      { date: '2024-01-25', ratio: 9.7, type: 'Primeiro teste' },
    ],
  },
  {
    id: '5', name: 'Lucia Tavares', phone: '(61) 95555-6666', email: 'lucia@email.com',
    status: 'inactive', products: ['BalanceOil', 'Zinobiotic'], protocolDay: 120,
    nextReorder: '2024-02-15', nextRetest: '2024-03-01', ltv: 1560, joinedAt: '2023-10-01',
    lastActivity: '2024-02-10', alerts: ['inactive', 'reorder', 'retest'],
    activities: [
      { text: 'Ultimo contato por WhatsApp', date: '2024-02-10', type: 'contact' },
      { text: 'Nao renovou assinatura', date: '2024-02-01', type: 'purchase' },
    ],
    testResults: [
      { date: '2023-12-01', ratio: 6.1, type: 'Re-teste' },
      { date: '2023-10-10', ratio: 9.4, type: 'Primeiro teste' },
    ],
  },
  {
    id: '6', name: 'Gustavo Reis', phone: '(71) 93333-2222', email: 'gustavo@email.com',
    status: 'churned', products: ['BalanceOil'], protocolDay: 0,
    nextReorder: '-', nextRetest: '-', ltv: 490, joinedAt: '2023-11-15',
    lastActivity: '2024-01-05', alerts: [],
    activities: [
      { text: 'Cancelamento solicitado', date: '2024-01-05', type: 'contact' },
      { text: 'Reclamacao sobre sabor', date: '2023-12-20', type: 'contact' },
    ],
    testResults: [
      { date: '2023-11-20', ratio: 12.5, type: 'Primeiro teste' },
    ],
  },
  {
    id: '7', name: 'Isabela Franco', phone: '(81) 91111-0000', email: 'isabela@email.com',
    status: 'active', products: ['BalanceOil', 'Xtend', 'Skin Serum'], protocolDay: 60,
    nextReorder: '2024-04-01', nextRetest: '2024-06-01', ltv: 2100, joinedAt: '2024-01-05',
    lastActivity: '2024-03-19', alerts: [],
    activities: [
      { text: 'Postou resultado no Instagram', date: '2024-03-19', type: 'contact' },
      { text: 'Adicionou Skin Serum ao pedido', date: '2024-03-10', type: 'purchase' },
    ],
    testResults: [
      { date: '2024-01-10', ratio: 7.3, type: 'Primeiro teste' },
    ],
  },
];

const cardStyle: React.CSSProperties = {
  background: '#2d3a4e',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function Clients() {
  const [clients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  });

  const filtered = clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = clients.filter(c => c.status === 'active').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;
  const churnedCount = clients.filter(c => c.status === 'churned').length;
  const totalLtv = clients.reduce((sum, c) => sum + c.ltv, 0);

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#E7FE55',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Carregando clientes...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Clientes</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>Gerencie sua carteira de clientes ativos</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Clientes Ativos', value: activeCount, icon: UserCheck, iconColor: '#22C55E', iconBg: '#F0FDF4' },
          { label: 'Inativos', value: inactiveCount, icon: AlertCircle, iconColor: '#F59E0B', iconBg: '#FFFBEB' },
          { label: 'Churned', value: churnedCount, icon: TrendingUp, iconColor: '#EF4444', iconBg: '#FEF2F2' },
          { label: 'LTV Total', value: `R$ ${totalLtv.toLocaleString('pt-BR')}`, icon: DollarSign, iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon style={{ width: '18px', height: '18px', color: stat.iconColor }} />
              </div>
              <div>
                <p style={{ fontSize: '22px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', lineHeight: 1, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
        <div style={{ position: 'relative', flex: 1, minWidth: '240px' }}>
          <Search style={{ position: 'absolute', left: '14px', top: '50%', transform: 'translateY(-50%)', width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)' }} />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Buscar por nome..."
            style={{
              width: '100%', padding: '12px 16px 12px 42px', borderRadius: '14px',
              border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none',
              background: '#2d3a4e', boxSizing: 'border-box',
            }}
          />
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <Filter style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.5)' }} />
          {[
            { key: 'all' as const, label: 'Todos' },
            { key: 'active' as const, label: 'Ativos' },
            { key: 'inactive' as const, label: 'Inativos' },
            { key: 'churned' as const, label: 'Churned' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              style={{
                padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
                cursor: 'pointer',
                background: statusFilter === f.key ? '#E7FE55' : '#2d3a4e',
                color: statusFilter === f.key ? '#0F1511' : 'rgba(255,255,255,0.5)',
                border: statusFilter === f.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(client => {
          const isExpanded = expandedClient === client.id;
          const sConfig = statusConfig[client.status];
          return (
            <div key={client.id} style={{ ...cardStyle, padding: 0, overflow: 'hidden' }}>
              {/* Main Row */}
              <button
                onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                style={{
                  width: '100%', padding: '20px 24px', background: 'none', border: 'none',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px',
                  textAlign: 'left',
                }}
              >
                {/* Avatar */}
                <div style={{
                  width: '44px', height: '44px', borderRadius: '14px',
                  background: sConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0, fontSize: '16px', fontWeight: 700, color: sConfig.color,
                }}>
                  {client.name.charAt(0)}
                </div>

                {/* Info Grid */}
                <div style={{ flex: 1, display: 'grid', gridTemplateColumns: 'minmax(140px, 1.5fr) minmax(120px, 1fr) repeat(4, minmax(80px, 1fr))', gap: '12px', alignItems: 'center' }}>
                  {/* Name + Products */}
                  <div>
                    <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{client.name}</p>
                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>{client.products.join(', ')}</p>
                  </div>

                  {/* Status */}
                  <div>
                    <span style={{
                      fontSize: '11px', fontWeight: 600, color: sConfig.color,
                      background: sConfig.bg, padding: '4px 10px', borderRadius: '8px',
                    }}>
                      {sConfig.label}
                    </span>
                    {client.alerts.length > 0 && (
                      <div style={{ display: 'flex', gap: '4px', marginTop: '4px' }}>
                        {client.alerts.map(a => (
                          <span key={a} style={{
                            width: '8px', height: '8px', borderRadius: '50%',
                            background: alertConfig[a].color, display: 'inline-block',
                          }} title={alertConfig[a].label} />
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Protocol Day */}
                  <div className="hidden md:block">
                    <p style={{ fontSize: '16px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{client.protocolDay > 0 ? `Dia ${client.protocolDay}` : '-'}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>Protocolo</p>
                  </div>

                  {/* Next Reorder */}
                  <div className="hidden lg:block">
                    <p style={{ fontSize: '13px', fontWeight: 600, color: client.alerts.includes('reorder') ? '#F59E0B' : 'rgba(255,255,255,0.9)', margin: 0 }}>
                      {client.nextReorder !== '-' ? new Date(client.nextReorder).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-'}
                    </p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>Recompra</p>
                  </div>

                  {/* Next Re-test */}
                  <div className="hidden lg:block">
                    <p style={{ fontSize: '13px', fontWeight: 600, color: client.alerts.includes('retest') ? '#84CC16' : 'rgba(255,255,255,0.9)', margin: 0 }}>
                      {client.nextRetest !== '-' ? new Date(client.nextRetest).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) : '-'}
                    </p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>Re-teste</p>
                  </div>

                  {/* LTV */}
                  <div className="hidden md:block">
                    <p style={{ fontSize: '16px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', margin: 0 }}>R$ {client.ltv.toLocaleString('pt-BR')}</p>
                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>LTV</p>
                  </div>
                </div>

                {isExpanded ? <ChevronUp style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} /> : <ChevronDown style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)', flexShrink: 0 }} />}
              </button>

              {/* Expanded Details */}
              {isExpanded && (
                <div style={{ padding: '0 24px 24px', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', paddingTop: '20px' }}>
                    {/* Client Info */}
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Detalhes</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Calendar style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.5)' }} />
                          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Cliente desde:</span>
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{new Date(client.joinedAt).toLocaleDateString('pt-BR')}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                          <Package style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.5)' }} />
                          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Produtos:</span>
                          <span style={{ color: 'rgba(255,255,255,0.9)', fontWeight: 600 }}>{client.products.join(', ')}</span>
                        </div>
                        {client.alerts.length > 0 && (
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', marginTop: '4px' }}>
                            {client.alerts.map(a => (
                              <span key={a} style={{
                                fontSize: '11px', fontWeight: 600, padding: '4px 10px', borderRadius: '8px',
                                color: alertConfig[a].color, background: `${alertConfig[a].color}15`,
                              }}>
                                {alertConfig[a].label}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* BalanceTest Results */}
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Resultados BalanceTest</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {client.testResults.map((test, i) => (
                          <div key={i} style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                            padding: '10px 14px', background: '#1a2332', borderRadius: '12px',
                          }}>
                            <div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{test.type}</p>
                              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>{new Date(test.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{
                                fontSize: '18px', fontWeight: 800, margin: 0,
                                color: test.ratio <= 4 ? '#22C55E' : test.ratio <= 7 ? '#F59E0B' : '#EF4444',
                              }}>
                                {test.ratio}:1
                              </p>
                              {i < client.testResults.length - 1 && (
                                <p style={{ fontSize: '10px', color: '#22C55E', margin: 0, fontWeight: 600 }}>
                                  -{((client.testResults[i + 1].ratio - test.ratio) / client.testResults[i + 1].ratio * 100).toFixed(0)}%
                                </p>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Activity History */}
                    <div>
                      <h4 style={{ fontSize: '13px', fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '1px', margin: '0 0 12px' }}>Atividade Recente</h4>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {client.activities.map((activity, i) => (
                          <div key={i} style={{ display: 'flex', alignItems: 'start', gap: '10px' }}>
                            <div style={{
                              width: '8px', height: '8px', borderRadius: '50%', marginTop: '5px',
                              background: activity.type === 'purchase' ? '#8B5CF6' : activity.type === 'test' ? '#06B6D4' : activity.type === 'checkin' ? '#22C55E' : '#F59E0B',
                              flexShrink: 0,
                            }} />
                            <div>
                              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.9)', margin: 0 }}>{activity.text}</p>
                              <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>{new Date(activity.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
            <Activity style={{ width: '32px', height: '32px', color: 'rgba(255,255,255,0.3)', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
