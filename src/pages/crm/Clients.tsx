import { useState } from 'react';
import { Search, UserCheck, TrendingUp, AlertCircle, ChevronDown, ChevronUp, DollarSign, Calendar, Package, Activity, Filter } from 'lucide-react';

type ClientStatus = 'active' | 'inactive' | 'churned';

interface Client {
  id: string; name: string; phone: string; email: string; status: ClientStatus;
  products: string[]; protocolDay: number; nextReorder: string; nextRetest: string;
  ltv: number; joinedAt: string; lastActivity: string; alerts: ('reorder' | 'retest' | 'inactive')[];
  activities: { text: string; date: string; type: string }[];
  testResults: { date: string; ratio: number; type: string }[];
}

const statusConfig: Record<ClientStatus, { label: string; cls: string }> = {
  active: { label: 'Ativo', cls: 'text-green bg-green-bg' },
  inactive: { label: 'Inativo', cls: 'text-orange bg-orange-bg' },
  churned: { label: 'Churned', cls: 'text-red bg-red-bg' },
};

const alertConfig: Record<string, { label: string; color: string }> = {
  reorder: { label: 'Recompra', color: 'bg-orange' }, retest: { label: 'Re-teste', color: 'bg-accent' }, inactive: { label: 'Inativo', color: 'bg-red' },
};

const initialClients: Client[] = [
  { id: '1', name: 'Camila Mendes', phone: '(21) 98765-4321', email: 'camila@email.com', status: 'active', products: ['BalanceOil', 'Zinobiotic', 'Xtend'], protocolDay: 87, nextReorder: '2024-04-05', nextRetest: '2024-06-15', ltv: 2840, joinedAt: '2023-09-15', lastActivity: '2024-03-18', alerts: ['reorder'], activities: [{ text: 'Check-in diário realizado', date: '2024-03-18', type: 'checkin' }, { text: 'Compra mensal processada', date: '2024-03-01', type: 'purchase' }], testResults: [{ date: '2024-02-20', ratio: 4.8, type: 'Re-teste' }, { date: '2023-10-15', ratio: 8.2, type: 'Primeiro teste' }] },
  { id: '2', name: 'Rafael Nunes', phone: '(31) 91234-5678', email: 'rafael@email.com', status: 'active', products: ['BalanceOil', 'Xtend+'], protocolDay: 112, nextReorder: '2024-03-25', nextRetest: '2024-03-22', ltv: 3420, joinedAt: '2023-07-10', lastActivity: '2024-03-17', alerts: ['retest', 'reorder'], activities: [{ text: 'Re-teste agendado', date: '2024-03-17', type: 'test' }], testResults: [{ date: '2023-11-10', ratio: 5.5, type: 'Re-teste' }, { date: '2023-07-20', ratio: 10.1, type: 'Primeiro teste' }] },
  { id: '3', name: 'Beatriz Cardoso', phone: '(41) 99876-5432', email: 'beatriz@email.com', status: 'active', products: ['BalanceOil', 'Zinobiotic', 'Xtend', 'Viva+'], protocolDay: 180, nextReorder: '2024-04-10', nextRetest: '2024-05-01', ltv: 5680, joinedAt: '2023-04-05', lastActivity: '2024-03-19', alerts: [], activities: [{ text: 'Indicou novo lead', date: '2024-03-19', type: 'contact' }], testResults: [{ date: '2024-02-01', ratio: 3.2, type: 'Re-teste 2' }, { date: '2023-08-15', ratio: 5.8, type: 'Re-teste 1' }, { date: '2023-04-20', ratio: 11.3, type: 'Primeiro teste' }] },
  { id: '4', name: 'Fernando Martins', phone: '(51) 97777-8888', email: 'fernando@email.com', status: 'active', products: ['BalanceOil'], protocolDay: 45, nextReorder: '2024-04-15', nextRetest: '2024-07-10', ltv: 980, joinedAt: '2024-01-20', lastActivity: '2024-03-16', alerts: [], activities: [{ text: 'Check-in semanal', date: '2024-03-16', type: 'checkin' }], testResults: [{ date: '2024-01-25', ratio: 9.7, type: 'Primeiro teste' }] },
  { id: '5', name: 'Lúcia Tavares', phone: '(61) 95555-6666', email: 'lucia@email.com', status: 'inactive', products: ['BalanceOil', 'Zinobiotic'], protocolDay: 120, nextReorder: '2024-02-15', nextRetest: '2024-03-01', ltv: 1560, joinedAt: '2023-10-01', lastActivity: '2024-02-10', alerts: ['inactive', 'reorder', 'retest'], activities: [{ text: 'Último contato por WhatsApp', date: '2024-02-10', type: 'contact' }], testResults: [{ date: '2023-12-01', ratio: 6.1, type: 'Re-teste' }, { date: '2023-10-10', ratio: 9.4, type: 'Primeiro teste' }] },
  { id: '6', name: 'Gustavo Reis', phone: '(71) 93333-2222', email: 'gustavo@email.com', status: 'churned', products: ['BalanceOil'], protocolDay: 0, nextReorder: '-', nextRetest: '-', ltv: 490, joinedAt: '2023-11-15', lastActivity: '2024-01-05', alerts: [], activities: [{ text: 'Cancelamento solicitado', date: '2024-01-05', type: 'contact' }], testResults: [{ date: '2023-11-20', ratio: 12.5, type: 'Primeiro teste' }] },
  { id: '7', name: 'Isabela Franco', phone: '(81) 91111-0000', email: 'isabela@email.com', status: 'active', products: ['BalanceOil', 'Xtend', 'Skin Serum'], protocolDay: 60, nextReorder: '2024-04-01', nextRetest: '2024-06-01', ltv: 2100, joinedAt: '2024-01-05', lastActivity: '2024-03-19', alerts: [], activities: [{ text: 'Postou resultado no Instagram', date: '2024-03-19', type: 'contact' }], testResults: [{ date: '2024-01-10', ratio: 7.3, type: 'Primeiro teste' }] },
];

export default function Clients() {
  const [clients] = useState<Client[]>(initialClients);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<ClientStatus | 'all'>('all');
  const [expandedClient, setExpandedClient] = useState<string | null>(null);

  const filtered = clients.filter(c => {
    if (statusFilter !== 'all' && c.status !== statusFilter) return false;
    if (search && !c.name.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const activeCount = clients.filter(c => c.status === 'active').length;
  const inactiveCount = clients.filter(c => c.status === 'inactive').length;
  const churnedCount = clients.filter(c => c.status === 'churned').length;
  const totalLtv = clients.reduce((sum, c) => sum + c.ltv, 0);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-2xl font-bold text-text">Clientes</h2>
        <p className="text-sm text-text4 mt-1">Gerencie sua carteira de clientes ativos</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Ativos', value: activeCount, icon: UserCheck, cls: 'text-green bg-green-bg' },
          { label: 'Inativos', value: inactiveCount, icon: AlertCircle, cls: 'text-orange bg-orange-bg' },
          { label: 'Churned', value: churnedCount, icon: TrendingUp, cls: 'text-red bg-red-bg' },
          { label: 'LTV Total', value: `R$ ${totalLtv.toLocaleString('pt-BR')}`, icon: DollarSign, cls: 'text-accent bg-accent-bg' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-3xl p-5 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.cls}`}>
                <stat.icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-xl font-extrabold text-text leading-none">{stat.value}</p>
                <p className="text-xs text-text4 mt-0.5">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Search & Filter */}
      <div className="flex gap-3 flex-wrap items-center">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-text4" />
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar por nome..."
            className="w-full pl-10 pr-4 py-3 rounded-2xl border border-border bg-card text-sm text-text outline-none focus:border-accent shadow-card" />
        </div>
        <div className="flex gap-2 items-center">
          <Filter className="w-3.5 h-3.5 text-text4" />
          {[
            { key: 'all' as const, label: 'Todos' }, { key: 'active' as const, label: 'Ativos' },
            { key: 'inactive' as const, label: 'Inativos' }, { key: 'churned' as const, label: 'Churned' },
          ].map(f => (
            <button key={f.key} onClick={() => setStatusFilter(f.key)}
              className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${statusFilter === f.key ? 'bg-accent text-white' : 'bg-card border border-border text-text3 hover:bg-dark3'}`}>
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Client List */}
      <div className="flex flex-col gap-3">
        {filtered.map(client => {
          const isExpanded = expandedClient === client.id;
          const sConfig = statusConfig[client.status];
          return (
            <div key={client.id} className="bg-card rounded-3xl border border-border shadow-card overflow-hidden">
              <button onClick={() => setExpandedClient(isExpanded ? null : client.id)}
                className="w-full px-6 py-5 flex items-center gap-4 text-left">
                <div className={`w-11 h-11 rounded-2xl flex items-center justify-center flex-shrink-0 text-base font-bold ${sConfig.cls}`}>
                  {client.name.charAt(0)}
                </div>
                <div className="flex-1 grid grid-cols-[minmax(140px,1.5fr)_minmax(100px,1fr)_repeat(2,minmax(80px,1fr))] gap-3 items-center">
                  <div>
                    <p className="text-[15px] font-bold text-text">{client.name}</p>
                    <p className="text-[11px] text-text4 mt-0.5 truncate">{client.products.join(', ')}</p>
                  </div>
                  <div>
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-lg ${sConfig.cls}`}>{sConfig.label}</span>
                    {client.alerts.length > 0 && (
                      <div className="flex gap-1 mt-1">{client.alerts.map(a => <span key={a} className={`w-2 h-2 rounded-full ${alertConfig[a].color}`} title={alertConfig[a].label} />)}</div>
                    )}
                  </div>
                  <div className="hidden md:block">
                    <p className="text-base font-extrabold text-text">{client.protocolDay > 0 ? `Dia ${client.protocolDay}` : '-'}</p>
                    <p className="text-[10px] text-text4">Protocolo</p>
                  </div>
                  <div className="hidden md:block">
                    <p className="text-base font-extrabold text-text">R$ {client.ltv.toLocaleString('pt-BR')}</p>
                    <p className="text-[10px] text-text4">LTV</p>
                  </div>
                </div>
                {isExpanded ? <ChevronUp className="w-4 h-4 text-text4 flex-shrink-0" /> : <ChevronDown className="w-4 h-4 text-text4 flex-shrink-0" />}
              </button>

              {isExpanded && (
                <div className="px-6 pb-6 border-t border-border">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5 pt-5">
                    <div>
                      <h4 className="text-xs font-bold text-text4 uppercase tracking-wider mb-3">Detalhes</h4>
                      <div className="space-y-2.5 text-[13px]">
                        <div className="flex items-center gap-2"><Calendar className="w-3.5 h-3.5 text-text4" /><span className="text-text4">Desde:</span><span className="text-text font-semibold">{new Date(client.joinedAt).toLocaleDateString('pt-BR')}</span></div>
                        <div className="flex items-center gap-2"><Package className="w-3.5 h-3.5 text-text4" /><span className="text-text4">Produtos:</span><span className="text-text font-semibold">{client.products.join(', ')}</span></div>
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text4 uppercase tracking-wider mb-3">BalanceTest</h4>
                      <div className="space-y-2">
                        {client.testResults.map((test, i) => (
                          <div key={i} className="flex items-center justify-between px-3 py-2.5 bg-bg rounded-xl border border-border-light">
                            <div>
                              <p className="text-[13px] font-semibold text-text">{test.type}</p>
                              <p className="text-[11px] text-text4">{new Date(test.date).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <p className={`text-lg font-extrabold ${test.ratio <= 4 ? 'text-green' : test.ratio <= 7 ? 'text-orange' : 'text-red'}`}>{test.ratio}:1</p>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-text4 uppercase tracking-wider mb-3">Atividade Recente</h4>
                      <div className="space-y-2.5">
                        {client.activities.map((a, i) => (
                          <div key={i} className="flex items-start gap-2.5">
                            <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${a.type === 'purchase' ? 'bg-purple' : a.type === 'test' ? 'bg-blue' : a.type === 'checkin' ? 'bg-green' : 'bg-orange'}`} />
                            <div>
                              <p className="text-[13px] text-text">{a.text}</p>
                              <p className="text-[11px] text-text4">{new Date(a.date).toLocaleDateString('pt-BR')}</p>
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
          <div className="bg-card rounded-3xl p-12 border border-border text-center">
            <Activity className="w-8 h-8 text-text4 mx-auto mb-3" />
            <p className="text-text4 text-sm">Nenhum cliente encontrado</p>
          </div>
        )}
      </div>
    </div>
  );
}
