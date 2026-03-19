import { useState } from 'react';
import {
  TestTube2,
  Clock,
  CheckCircle2,
  Send,
  Package,
  AlertTriangle,
  Plus,
  X,
  Phone,
  TrendingDown,
  Calendar,
  BarChart3,
} from 'lucide-react';

type TestStatus = 'enviado' | 'recebido' | 'em_analise' | 'pronto';

interface BalanceTest {
  id: string;
  clientName: string;
  clientPhone: string;
  testType: 'primeiro' | 'reteste';
  status: TestStatus;
  dateSent: string;
  dateReceived?: string;
  dateResult?: string;
  daysWaiting: number;
  result?: {
    ratio: number;
    previousRatio?: number;
  };
}

interface RetestAlert {
  clientName: string;
  clientPhone: string;
  lastTestDate: string;
  daysSince: number;
  lastRatio: number;
}

const statusConfig: Record<TestStatus, { label: string; color: string; bg: string; icon: typeof Send }> = {
  enviado: { label: 'Enviado', color: '#3B82F6', bg: '#EFF6FF', icon: Send },
  recebido: { label: 'Recebido', color: '#F59E0B', bg: '#FFFBEB', icon: Package },
  em_analise: { label: 'Em Analise', color: '#8B5CF6', bg: '#F5F3FF', icon: Clock },
  pronto: { label: 'Pronto', color: '#22C55E', bg: '#F0FDF4', icon: CheckCircle2 },
};

const initialTests: BalanceTest[] = [
  { id: '1', clientName: 'Maria Silva', clientPhone: '(11) 99999-1234', testType: 'primeiro', status: 'enviado', dateSent: '2024-03-18', daysWaiting: 1 },
  { id: '2', clientName: 'Joao Oliveira', clientPhone: '(21) 98888-5678', testType: 'primeiro', status: 'enviado', dateSent: '2024-03-15', daysWaiting: 4 },
  { id: '3', clientName: 'Fernanda Lima', clientPhone: '(51) 95555-7890', testType: 'reteste', status: 'recebido', dateSent: '2024-03-10', dateReceived: '2024-03-16', daysWaiting: 9 },
  { id: '4', clientName: 'Eduardo Rocha', clientPhone: '(51) 98765-1234', testType: 'primeiro', status: 'recebido', dateSent: '2024-03-08', dateReceived: '2024-03-14', daysWaiting: 11 },
  { id: '5', clientName: 'Roberto Almeida', clientPhone: '(61) 94444-2345', testType: 'reteste', status: 'em_analise', dateSent: '2024-03-05', dateReceived: '2024-03-10', daysWaiting: 14 },
  { id: '6', clientName: 'Patricia Souza', clientPhone: '(71) 93333-6789', testType: 'primeiro', status: 'em_analise', dateSent: '2024-03-01', dateReceived: '2024-03-07', daysWaiting: 18 },
  { id: '7', clientName: 'Camila Mendes', clientPhone: '(21) 98765-4321', testType: 'reteste', status: 'pronto', dateSent: '2024-02-15', dateReceived: '2024-02-20', dateResult: '2024-03-05', daysWaiting: 0, result: { ratio: 4.8, previousRatio: 8.2 } },
  { id: '8', clientName: 'Rafael Nunes', clientPhone: '(31) 91234-5678', testType: 'reteste', status: 'pronto', dateSent: '2024-02-10', dateReceived: '2024-02-16', dateResult: '2024-03-01', daysWaiting: 0, result: { ratio: 5.5, previousRatio: 10.1 } },
  { id: '9', clientName: 'Beatriz Cardoso', clientPhone: '(41) 99876-5432', testType: 'reteste', status: 'pronto', dateSent: '2024-01-20', dateReceived: '2024-01-26', dateResult: '2024-02-10', daysWaiting: 0, result: { ratio: 3.2, previousRatio: 5.8 } },
  { id: '10', clientName: 'Fernando Martins', clientPhone: '(51) 97777-8888', testType: 'primeiro', status: 'pronto', dateSent: '2024-01-15', dateReceived: '2024-01-22', dateResult: '2024-02-05', daysWaiting: 0, result: { ratio: 9.7 } },
];

const retestAlerts: RetestAlert[] = [
  { clientName: 'Lucia Tavares', clientPhone: '(61) 95555-6666', lastTestDate: '2023-10-01', daysSince: 170, lastRatio: 6.1 },
  { clientName: 'Gustavo Reis', clientPhone: '(71) 93333-2222', lastTestDate: '2023-11-20', daysSince: 120, lastRatio: 12.5 },
  { clientName: 'Beatriz Cardoso', clientPhone: '(41) 99876-5432', lastTestDate: '2024-02-01', daysSince: 47, lastRatio: 3.2 },
];

const cardStyle: React.CSSProperties = {
  background: '#2d3a4e',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function TestTracking() {
  const [tests, setTests] = useState<BalanceTest[]>(initialTests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTest, setNewTest] = useState({ clientName: '', clientPhone: '', testType: 'primeiro' as 'primeiro' | 'reteste' });
  const [statusFilter, setStatusFilter] = useState<TestStatus | 'all'>('all');
  const [loading, setLoading] = useState(false);

  useState(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  });

  const addTest = () => {
    if (!newTest.clientName.trim()) return;
    const test: BalanceTest = {
      id: String(Date.now()),
      clientName: newTest.clientName,
      clientPhone: newTest.clientPhone,
      testType: newTest.testType,
      status: 'enviado',
      dateSent: new Date().toISOString().split('T')[0],
      daysWaiting: 0,
    };
    setTests(prev => [...prev, test]);
    setNewTest({ clientName: '', clientPhone: '', testType: 'primeiro' });
    setShowAddForm(false);
  };

  const moveTest = (id: string) => {
    const order: TestStatus[] = ['enviado', 'recebido', 'em_analise', 'pronto'];
    setTests(prev => prev.map(t => {
      if (t.id !== id) return t;
      const idx = order.indexOf(t.status);
      if (idx >= order.length - 1) return t;
      return { ...t, status: order[idx + 1] };
    }));
  };

  const filtered = statusFilter === 'all' ? tests : tests.filter(t => t.status === statusFilter);
  const totalTests = tests.length;
  const pendingTests = tests.filter(t => t.status !== 'pronto').length;
  const avgWait = pendingTests > 0
    ? Math.round(tests.filter(t => t.status !== 'pronto').reduce((s, t) => s + t.daysWaiting, 0) / pendingTests)
    : 0;
  const thisMonth = tests.filter(t => {
    const d = new Date(t.dateSent);
    const now = new Date();
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  }).length;
  const overdueRetests = retestAlerts.filter(r => r.daysSince >= 120).length;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#E7FE55',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Carregando testes...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Testes BalanceTest</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>Acompanhe todos os testes de Omega-6:3</p>
        </div>
        <button
          onClick={() => setShowAddForm(true)}
          style={{
            display: 'flex', alignItems: 'center', gap: '8px',
            background: '#E7FE55', color: '#0F1511', border: 'none',
            padding: '12px 20px', borderRadius: '14px', fontSize: '14px',
            fontWeight: 600, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,254,85,0.3)',
          }}
        >
          <Plus style={{ width: '16px', height: '16px' }} />
          Novo Teste
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Testes', value: totalTests, icon: TestTube2, iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
          { label: 'Tempo Medio', value: `${avgWait}d`, icon: Clock, iconColor: '#F59E0B', iconBg: '#FFFBEB' },
          { label: 'Este Mes', value: thisMonth, icon: Calendar, iconColor: '#3B82F6', iconBg: '#EFF6FF' },
          { label: 'Pendentes', value: pendingTests, icon: BarChart3, iconColor: '#06B6D4', iconBg: '#ECFEFF' },
        ].map(stat => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '12px', background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <stat.icon style={{ width: '18px', height: '18px', color: stat.iconColor }} />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', lineHeight: 1, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Re-test Alerts */}
      {overdueRetests > 0 && (
        <div style={{ ...cardStyle, borderLeft: '3px solid #F59E0B', padding: '20px 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#F59E0B' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Alertas de Re-teste ({overdueRetests})</span>
            <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>Clientes com mais de 120 dias desde o ultimo teste</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {retestAlerts.filter(r => r.daysSince >= 120).map((alert, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                padding: '12px 16px', background: 'rgba(245,158,11,0.1)', borderRadius: '12px', flexWrap: 'wrap', gap: '8px',
              }}>
                <div>
                  <p style={{ fontSize: '14px', fontWeight: 600, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{alert.clientName}</p>
                  <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '2px 0 0' }}>
                    Ultimo teste: {new Date(alert.lastTestDate).toLocaleDateString('pt-BR')} — Ratio: {alert.lastRatio}:1 — {alert.daysSince} dias atras
                  </p>
                </div>
                <a
                  href={`https://wa.me/55${alert.clientPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: 'flex', alignItems: 'center', gap: '6px',
                    padding: '8px 16px', borderRadius: '10px',
                    background: '#E7FE55', color: '#0F1511', border: 'none',
                    fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                  }}
                >
                  <Phone style={{ width: '12px', height: '12px' }} />
                  Contatar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { key: 'all' as const, label: 'Todos' },
          ...Object.entries(statusConfig).map(([key, val]) => ({ key: key as TestStatus, label: val.label })),
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setStatusFilter(f.key as TestStatus | 'all')}
            style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: statusFilter === f.key ? '#E7FE55' : '#2d3a4e',
              color: statusFilter === f.key ? '#0F1511' : 'rgba(255,255,255,0.5)',
              border: statusFilter === f.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add Test Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowAddForm(false)}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '440px', margin: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Novo Teste</h3>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input value={newTest.clientName} onChange={e => setNewTest(p => ({ ...p, clientName: e.target.value }))} placeholder="Nome do cliente" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }} />
              <input value={newTest.clientPhone} onChange={e => setNewTest(p => ({ ...p, clientPhone: e.target.value }))} placeholder="Telefone" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }} />
              <select value={newTest.testType} onChange={e => setNewTest(p => ({ ...p, testType: e.target.value as 'primeiro' | 'reteste' }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }}>
                <option value="primeiro">Primeiro Teste</option>
                <option value="reteste">Re-teste</option>
              </select>
              <button onClick={addTest} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#E7FE55', color: '#0F1511', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,254,85,0.3)', marginTop: '4px' }}>
                Registrar Teste
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Test Cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(test => {
          const sConfig = statusConfig[test.status];
          const StatusIcon = sConfig.icon;
          return (
            <div key={test.id} style={{ ...cardStyle, padding: '20px 24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, minWidth: '200px' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '14px',
                    background: sConfig.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <StatusIcon style={{ width: '18px', height: '18px', color: sConfig.color }} />
                  </div>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '2px' }}>
                      <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{test.clientName}</p>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
                        color: sConfig.color, background: sConfig.bg,
                      }}>
                        {sConfig.label}
                      </span>
                      <span style={{
                        fontSize: '10px', fontWeight: 600, padding: '2px 8px', borderRadius: '6px',
                        color: test.testType === 'primeiro' ? '#3B82F6' : '#8B5CF6',
                        background: test.testType === 'primeiro' ? '#EFF6FF' : '#F5F3FF',
                      }}>
                        {test.testType === 'primeiro' ? '1o Teste' : 'Re-teste'}
                      </span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '12px', color: 'rgba(255,255,255,0.5)' }}>
                      <span>Enviado: {new Date(test.dateSent).toLocaleDateString('pt-BR')}</span>
                      {test.status !== 'pronto' && (
                        <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                          <Clock style={{ width: '10px', height: '10px' }} />
                          {test.daysWaiting}d aguardando
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Result (for Pronto tests) */}
                {test.status === 'pronto' && test.result && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'center' }}>
                      <p style={{
                        fontSize: '24px', fontWeight: 800, margin: 0,
                        color: test.result.ratio <= 4 ? '#22C55E' : test.result.ratio <= 7 ? '#F59E0B' : '#EF4444',
                      }}>
                        {test.result.ratio}:1
                      </p>
                      <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>Ratio atual</p>
                    </div>
                    {test.result.previousRatio && (
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                          <TrendingDown style={{ width: '14px', height: '14px', color: '#22C55E' }} />
                          <span style={{ fontSize: '16px', fontWeight: 700, color: '#22C55E' }}>
                            -{((test.result.previousRatio - test.result.ratio) / test.result.previousRatio * 100).toFixed(0)}%
                          </span>
                        </div>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: '1px 0 0' }}>vs anterior ({test.result.previousRatio}:1)</p>
                      </div>
                    )}
                    <a
                      href={`https://wa.me/55${test.clientPhone.replace(/\D/g, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        padding: '10px 16px', borderRadius: '12px',
                        background: '#E7FE55', color: '#0F1511', border: 'none',
                        fontSize: '12px', fontWeight: 600, cursor: 'pointer', textDecoration: 'none',
                      }}
                    >
                      <Phone style={{ width: '12px', height: '12px' }} />
                      Compartilhar
                    </a>
                  </div>
                )}

                {/* Advance button (for non-pronto tests) */}
                {test.status !== 'pronto' && (
                  <button
                    onClick={() => moveTest(test.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: '6px',
                      padding: '10px 16px', borderRadius: '12px',
                      background: '#E7FE55', color: '#0F1511', border: 'none',
                      fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                    }}
                  >
                    <CheckCircle2 style={{ width: '12px', height: '12px' }} />
                    Avancar
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <div style={{ ...cardStyle, padding: '48px', textAlign: 'center' }}>
            <TestTube2 style={{ width: '32px', height: '32px', color: 'rgba(255,255,255,0.3)', margin: '0 auto 12px' }} />
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', margin: 0 }}>Nenhum teste encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
