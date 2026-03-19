import { useState } from 'react';
import { TestTube2, Clock, CheckCircle2, Send, Package, AlertTriangle, Plus, X, Phone, TrendingDown, Calendar, BarChart3 } from 'lucide-react';

type TestStatus = 'enviado' | 'recebido' | 'em_analise' | 'pronto';

interface BalanceTest {
  id: string; clientName: string; clientPhone: string; testType: 'primeiro' | 'reteste';
  status: TestStatus; dateSent: string; dateReceived?: string; dateResult?: string; daysWaiting: number;
  result?: { ratio: number; previousRatio?: number };
}

const statusConfig: Record<TestStatus, { label: string; cls: string; icon: typeof Send }> = {
  enviado: { label: 'Enviado', cls: 'text-blue bg-blue-bg', icon: Send },
  recebido: { label: 'Recebido', cls: 'text-orange bg-orange-bg', icon: Package },
  em_analise: { label: 'Em Análise', cls: 'text-purple bg-purple-bg', icon: Clock },
  pronto: { label: 'Pronto', cls: 'text-green bg-green-bg', icon: CheckCircle2 },
};

const initialTests: BalanceTest[] = [
  { id: '1', clientName: 'Maria Silva', clientPhone: '(11) 99999-1234', testType: 'primeiro', status: 'enviado', dateSent: '2024-03-18', daysWaiting: 1 },
  { id: '2', clientName: 'João Oliveira', clientPhone: '(21) 98888-5678', testType: 'primeiro', status: 'enviado', dateSent: '2024-03-15', daysWaiting: 4 },
  { id: '3', clientName: 'Fernanda Lima', clientPhone: '(51) 95555-7890', testType: 'reteste', status: 'recebido', dateSent: '2024-03-10', dateReceived: '2024-03-16', daysWaiting: 9 },
  { id: '4', clientName: 'Eduardo Rocha', clientPhone: '(51) 98765-1234', testType: 'primeiro', status: 'recebido', dateSent: '2024-03-08', dateReceived: '2024-03-14', daysWaiting: 11 },
  { id: '5', clientName: 'Roberto Almeida', clientPhone: '(61) 94444-2345', testType: 'reteste', status: 'em_analise', dateSent: '2024-03-05', dateReceived: '2024-03-10', daysWaiting: 14 },
  { id: '6', clientName: 'Patrícia Souza', clientPhone: '(71) 93333-6789', testType: 'primeiro', status: 'em_analise', dateSent: '2024-03-01', dateReceived: '2024-03-07', daysWaiting: 18 },
  { id: '7', clientName: 'Camila Mendes', clientPhone: '(21) 98765-4321', testType: 'reteste', status: 'pronto', dateSent: '2024-02-15', dateReceived: '2024-02-20', dateResult: '2024-03-05', daysWaiting: 0, result: { ratio: 4.8, previousRatio: 8.2 } },
  { id: '8', clientName: 'Rafael Nunes', clientPhone: '(31) 91234-5678', testType: 'reteste', status: 'pronto', dateSent: '2024-02-10', dateReceived: '2024-02-16', dateResult: '2024-03-01', daysWaiting: 0, result: { ratio: 5.5, previousRatio: 10.1 } },
  { id: '9', clientName: 'Beatriz Cardoso', clientPhone: '(41) 99876-5432', testType: 'reteste', status: 'pronto', dateSent: '2024-01-20', dateReceived: '2024-01-26', dateResult: '2024-02-10', daysWaiting: 0, result: { ratio: 3.2, previousRatio: 5.8 } },
  { id: '10', clientName: 'Fernando Martins', clientPhone: '(51) 97777-8888', testType: 'primeiro', status: 'pronto', dateSent: '2024-01-15', dateReceived: '2024-01-22', dateResult: '2024-02-05', daysWaiting: 0, result: { ratio: 9.7 } },
];

const retestAlerts = [
  { clientName: 'Lúcia Tavares', clientPhone: '(61) 95555-6666', lastTestDate: '2023-10-01', daysSince: 170, lastRatio: 6.1 },
  { clientName: 'Gustavo Reis', clientPhone: '(71) 93333-2222', lastTestDate: '2023-11-20', daysSince: 120, lastRatio: 12.5 },
];

export default function TestTracking() {
  const [tests, setTests] = useState<BalanceTest[]>(initialTests);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTest, setNewTest] = useState({ clientName: '', clientPhone: '', testType: 'primeiro' as 'primeiro' | 'reteste' });
  const [statusFilter, setStatusFilter] = useState<TestStatus | 'all'>('all');

  const addTest = () => {
    if (!newTest.clientName.trim()) return;
    setTests(prev => [...prev, { id: String(Date.now()), ...newTest, status: 'enviado' as const, dateSent: new Date().toISOString().split('T')[0], daysWaiting: 0 }]);
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
  const pendingTests = tests.filter(t => t.status !== 'pronto').length;
  const avgWait = pendingTests > 0 ? Math.round(tests.filter(t => t.status !== 'pronto').reduce((s, t) => s + t.daysWaiting, 0) / pendingTests) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Testes BalanceTest</h2>
          <p className="text-sm text-text4 mt-1">Acompanhe todos os testes de Omega-6:3</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-card hover:opacity-90">
          <Plus className="w-4 h-4" /> Novo Teste
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Testes', value: tests.length, icon: TestTube2, cls: 'text-purple bg-purple-bg' },
          { label: 'Tempo Médio', value: `${avgWait}d`, icon: Clock, cls: 'text-orange bg-orange-bg' },
          { label: 'Este Mês', value: tests.filter(t => { const d = new Date(t.dateSent); const n = new Date(); return d.getMonth() === n.getMonth() && d.getFullYear() === n.getFullYear(); }).length, icon: Calendar, cls: 'text-blue bg-blue-bg' },
          { label: 'Pendentes', value: pendingTests, icon: BarChart3, cls: 'text-accent bg-accent-bg' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-3xl p-5 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.cls}`}><stat.icon className="w-[18px] h-[18px]" /></div>
              <div>
                <p className="text-2xl font-extrabold text-text leading-none">{stat.value}</p>
                <p className="text-xs text-text4 mt-0.5">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Retest Alerts */}
      {retestAlerts.length > 0 && (
        <div className="bg-card rounded-3xl p-5 border border-border border-l-[3px] border-l-orange shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="w-4 h-4 text-orange" />
            <span className="text-sm font-bold text-text">Alertas de Re-teste ({retestAlerts.length})</span>
          </div>
          <div className="space-y-2.5">
            {retestAlerts.map((alert, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3 bg-orange-bg rounded-xl flex-wrap gap-2">
                <div>
                  <p className="text-sm font-semibold text-text">{alert.clientName}</p>
                  <p className="text-xs text-text4">Ratio: {alert.lastRatio}:1 — {alert.daysSince} dias atrás</p>
                </div>
                <a href={`https://wa.me/55${alert.clientPhone.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-accent text-white text-xs font-semibold no-underline hover:opacity-90">
                  <Phone className="w-3 h-3" /> Contatar
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Status Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: 'all' as const, label: 'Todos' }, ...Object.entries(statusConfig).map(([key, val]) => ({ key: key as TestStatus, label: val.label }))].map(f => (
          <button key={f.key} onClick={() => setStatusFilter(f.key as TestStatus | 'all')}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${statusFilter === f.key ? 'bg-accent text-white' : 'bg-card border border-border text-text3 hover:bg-dark3'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddForm(false)}>
          <div className="bg-card rounded-3xl p-6 border border-border shadow-card-hover w-full max-w-[440px] mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text">Novo Teste</h3>
              <button onClick={() => setShowAddForm(false)} className="text-text4 hover:text-text3 p-1"><X className="w-[18px] h-[18px]" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={newTest.clientName} onChange={e => setNewTest(p => ({ ...p, clientName: e.target.value }))} placeholder="Nome do cliente" className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <input value={newTest.clientPhone} onChange={e => setNewTest(p => ({ ...p, clientPhone: e.target.value }))} placeholder="Telefone" className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <select value={newTest.testType} onChange={e => setNewTest(p => ({ ...p, testType: e.target.value as 'primeiro' | 'reteste' }))} className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent">
                <option value="primeiro">Primeiro Teste</option><option value="reteste">Re-teste</option>
              </select>
              <button onClick={addTest} className="w-full py-3.5 rounded-2xl bg-accent text-white text-sm font-bold shadow-card hover:opacity-90 mt-1">Registrar Teste</button>
            </div>
          </div>
        </div>
      )}

      {/* Test Cards */}
      <div className="flex flex-col gap-3">
        {filtered.map(test => {
          const sConfig = statusConfig[test.status];
          const StatusIcon = sConfig.icon;
          return (
            <div key={test.id} className="bg-card rounded-2xl p-5 border border-border shadow-card">
              <div className="flex items-center justify-between gap-4 flex-wrap">
                <div className="flex items-center gap-3.5 flex-1 min-w-[200px]">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${sConfig.cls}`}>
                    <StatusIcon className="w-[18px] h-[18px]" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-[15px] font-bold text-text">{test.clientName}</p>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${sConfig.cls}`}>{sConfig.label}</span>
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${test.testType === 'primeiro' ? 'text-blue bg-blue-bg' : 'text-purple bg-purple-bg'}`}>
                        {test.testType === 'primeiro' ? '1º Teste' : 'Re-teste'}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-text4">
                      <span>Enviado: {new Date(test.dateSent).toLocaleDateString('pt-BR')}</span>
                      {test.status !== 'pronto' && <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{test.daysWaiting}d aguardando</span>}
                    </div>
                  </div>
                </div>

                {test.status === 'pronto' && test.result && (
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <p className={`text-2xl font-extrabold ${test.result.ratio <= 4 ? 'text-green' : test.result.ratio <= 7 ? 'text-orange' : 'text-red'}`}>{test.result.ratio}:1</p>
                      <p className="text-[10px] text-text4">Ratio atual</p>
                    </div>
                    {test.result.previousRatio && (
                      <div className="text-center">
                        <div className="flex items-center gap-1"><TrendingDown className="w-3.5 h-3.5 text-green" /><span className="text-base font-bold text-green">-{((test.result.previousRatio - test.result.ratio) / test.result.previousRatio * 100).toFixed(0)}%</span></div>
                        <p className="text-[10px] text-text4">vs {test.result.previousRatio}:1</p>
                      </div>
                    )}
                  </div>
                )}

                {test.status !== 'pronto' && (
                  <button onClick={() => moveTest(test.id)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-semibold hover:opacity-90">
                    <CheckCircle2 className="w-3 h-3" /> Avançar
                  </button>
                )}
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="bg-card rounded-3xl p-12 border border-border text-center">
            <TestTube2 className="w-8 h-8 text-text4 mx-auto mb-3" /><p className="text-text4 text-sm">Nenhum teste encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
