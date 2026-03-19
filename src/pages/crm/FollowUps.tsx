import { useState } from 'react';
import { Bell, Phone, MessageCircle, Mail, Calendar, RefreshCw, TestTube2, CheckCircle2, Clock, AlertTriangle, ChevronDown, ChevronUp, Plus, X } from 'lucide-react';

type FollowUpType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'reorder' | 'retest';

interface FollowUp {
  id: string; contactName: string; contactPhone: string; type: FollowUpType;
  date: string; time: string; suggestedMessage: string; status: 'pending' | 'completed' | 'snoozed';
}

const typeConfig: Record<FollowUpType, { icon: typeof Phone; label: string; color: string }> = {
  call: { icon: Phone, label: 'Ligação', color: 'text-blue bg-blue-bg' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: 'text-green bg-green-bg' },
  email: { icon: Mail, label: 'E-mail', color: 'text-purple bg-purple-bg' },
  meeting: { icon: Calendar, label: 'Reunião', color: 'text-orange bg-orange-bg' },
  reorder: { icon: RefreshCw, label: 'Recompra', color: 'text-red bg-red-bg' },
  retest: { icon: TestTube2, label: 'Re-teste', color: 'text-blue bg-blue-bg' },
};

const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
const inTwoDays = new Date(Date.now() + 172800000).toISOString().split('T')[0];
const inThreeDays = new Date(Date.now() + 259200000).toISOString().split('T')[0];
const inFiveDays = new Date(Date.now() + 432000000).toISOString().split('T')[0];
const inSixDays = new Date(Date.now() + 518400000).toISOString().split('T')[0];

const initialFollowUps: FollowUp[] = [
  { id: '1', contactName: 'Maria Silva', contactPhone: '(11) 99999-1234', type: 'whatsapp', date: today, time: '09:00', suggestedMessage: 'Oi Maria! Como você está se sentindo com o protocolo?', status: 'pending' },
  { id: '2', contactName: 'Roberto Almeida', contactPhone: '(61) 94444-2345', type: 'call', date: today, time: '10:30', suggestedMessage: 'Ligar para agendar apresentação do BalanceTest.', status: 'pending' },
  { id: '3', contactName: 'Juliana Ribeiro', contactPhone: '(91) 91111-4567', type: 'meeting', date: today, time: '14:00', suggestedMessage: 'Apresentação do plano de negócios Zinzino.', status: 'pending' },
  { id: '4', contactName: 'Marcos Pereira', contactPhone: '(11) 90000-8901', type: 'whatsapp', date: today, time: '16:00', suggestedMessage: 'Marcos, posso esclarecer alguma dúvida?', status: 'pending' },
  { id: '5', contactName: 'Ana Costa', contactPhone: '(31) 97777-9012', type: 'call', date: yesterday, time: '11:00', suggestedMessage: 'Ana aguarda retorno sobre valores do kit.', status: 'pending' },
  { id: '6', contactName: 'Carlos Santos', contactPhone: '(41) 96666-3456', type: 'whatsapp', date: twoDaysAgo, time: '15:00', suggestedMessage: 'URGENTE: Carlos não respondeu há 2 dias.', status: 'pending' },
  { id: '7', contactName: 'Camila Mendes', contactPhone: '(21) 98765-4321', type: 'reorder', date: tomorrow, time: '10:00', suggestedMessage: 'Camila, seu kit está acabando!', status: 'pending' },
  { id: '8', contactName: 'Rafael Nunes', contactPhone: '(31) 91234-5678', type: 'retest', date: inTwoDays, time: '09:00', suggestedMessage: 'Rafael, está na hora do seu re-teste!', status: 'pending' },
  { id: '9', contactName: 'Fernanda Lima', contactPhone: '(51) 95555-7890', type: 'whatsapp', date: inThreeDays, time: '11:00', suggestedMessage: 'Fernanda, como está a experiência?', status: 'pending' },
  { id: '10', contactName: 'Patrícia Souza', contactPhone: '(71) 93333-6789', type: 'email', date: inFiveDays, time: '14:00', suggestedMessage: 'Enviar material sobre BalanceOil.', status: 'pending' },
  { id: '11', contactName: 'Lucas Ferreira', contactPhone: '(81) 92222-0123', type: 'call', date: inSixDays, time: '16:00', suggestedMessage: 'Conversar sobre resultados do teste.', status: 'pending' },
];

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [filter, setFilter] = useState<FollowUpType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({ contactName: '', contactPhone: '', type: 'whatsapp' as FollowUpType, date: today, time: '09:00', suggestedMessage: '' });
  const [expandedSections, setExpandedSections] = useState({ overdue: true, today: true, upcoming: true });

  const complete = (id: string) => setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'completed' as const } : f));
  const snooze = (id: string) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id !== id) return f;
      const nextDay = new Date(f.date); nextDay.setDate(nextDay.getDate() + 1);
      return { ...f, date: nextDay.toISOString().split('T')[0], status: 'snoozed' as const };
    }));
  };
  const addFollowUp = () => {
    if (!newFollowUp.contactName.trim()) return;
    setFollowUps(prev => [...prev, { ...newFollowUp, id: String(Date.now()), status: 'pending' }]);
    setNewFollowUp({ contactName: '', contactPhone: '', type: 'whatsapp', date: today, time: '09:00', suggestedMessage: '' });
    setShowAddForm(false);
  };

  const filtered = followUps.filter(f => f.status !== 'completed' && (filter === 'all' || f.type === filter));
  const overdue = filtered.filter(f => f.date < today).sort((a, b) => a.date.localeCompare(b.date));
  const todayItems = filtered.filter(f => f.date === today).sort((a, b) => a.time.localeCompare(b.time));
  const upcoming = filtered.filter(f => f.date > today).sort((a, b) => a.date.localeCompare(b.date));
  const toggleSection = (key: 'overdue' | 'today' | 'upcoming') => setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));

  const renderCard = (followUp: FollowUp, isOverdue = false) => {
    const config = typeConfig[followUp.type];
    const TypeIcon = config.icon;
    return (
      <div key={followUp.id} className={`bg-card rounded-2xl p-5 border shadow-card ${isOverdue ? 'border-l-[3px] border-l-red border-border' : 'border-border'}`}>
        <div className="flex items-start justify-between gap-3 flex-wrap">
          <div className="flex items-start gap-3 flex-1 min-w-[200px]">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${config.color}`}>
              <TypeIcon className="w-[18px] h-[18px]" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <p className="text-[15px] font-bold text-text">{followUp.contactName}</p>
                <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-md ${config.color}`}>{config.label}</span>
              </div>
              <p className="text-xs text-text4 mb-2">{followUp.contactPhone}</p>
              <p className="text-[13px] text-text3 leading-relaxed">{followUp.suggestedMessage}</p>
              <div className={`flex items-center gap-2 mt-2 text-[11px] ${isOverdue ? 'text-red font-semibold' : 'text-text4'}`}>
                <Clock className="w-[11px] h-[11px]" />
                {isOverdue ? (
                  <span>Atrasado {Math.ceil((new Date(today).getTime() - new Date(followUp.date).getTime()) / 86400000)} dia(s)</span>
                ) : (
                  <span>{followUp.time} — {new Date(followUp.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                )}
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-shrink-0">
            <button onClick={() => complete(followUp.id)} title="Concluir" className="w-10 h-10 rounded-xl bg-accent flex items-center justify-center hover:opacity-90">
              <CheckCircle2 className="w-4 h-4 text-white" />
            </button>
            <button onClick={() => snooze(followUp.id)} title="Adiar" className="w-10 h-10 rounded-xl bg-bg border border-border flex items-center justify-center hover:bg-dark3">
              <Clock className="w-4 h-4 text-text4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Follow-ups</h2>
          <p className="text-sm text-text4 mt-1">Acompanhe e não perca nenhum contato</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-card hover:opacity-90">
          <Plus className="w-4 h-4" /> Novo Follow-up
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Atrasados', value: overdue.length, cls: 'text-red' },
          { label: 'Hoje', value: todayItems.length, cls: 'text-accent' },
          { label: 'Próximos 7 dias', value: upcoming.length, cls: 'text-blue' },
          { label: 'Concluídos', value: followUps.filter(f => f.status === 'completed').length, cls: 'text-green' },
        ].map(stat => (
          <div key={stat.label} className="bg-card rounded-2xl p-4 border border-border shadow-card text-center">
            <p className={`text-3xl font-extrabold ${stat.cls}`}>{stat.value}</p>
            <p className="text-xs text-text4 mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[{ key: 'all' as const, label: 'Todos' }, ...Object.entries(typeConfig).map(([key, val]) => ({ key: key as FollowUpType | 'all', label: val.label }))].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key as FollowUpType | 'all')}
            className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${filter === f.key ? 'bg-accent text-white' : 'bg-card border border-border text-text3 hover:bg-dark3'}`}>
            {f.label}
          </button>
        ))}
      </div>

      {/* Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddForm(false)}>
          <div className="bg-card rounded-3xl p-6 border border-border shadow-card-hover w-full max-w-[440px] mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text">Novo Follow-up</h3>
              <button onClick={() => setShowAddForm(false)} className="text-text4 hover:text-text3 p-1"><X className="w-[18px] h-[18px]" /></button>
            </div>
            <div className="flex flex-col gap-3">
              <input value={newFollowUp.contactName} onChange={e => setNewFollowUp(p => ({ ...p, contactName: e.target.value }))} placeholder="Nome do contato" className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <input value={newFollowUp.contactPhone} onChange={e => setNewFollowUp(p => ({ ...p, contactPhone: e.target.value }))} placeholder="Telefone" className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <div className="flex gap-3">
                <select value={newFollowUp.type} onChange={e => setNewFollowUp(p => ({ ...p, type: e.target.value as FollowUpType }))} className="flex-1 px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent">
                  {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <input type="time" value={newFollowUp.time} onChange={e => setNewFollowUp(p => ({ ...p, time: e.target.value }))} className="w-[120px] px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              </div>
              <input type="date" value={newFollowUp.date} onChange={e => setNewFollowUp(p => ({ ...p, date: e.target.value }))} className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <textarea value={newFollowUp.suggestedMessage} onChange={e => setNewFollowUp(p => ({ ...p, suggestedMessage: e.target.value }))} placeholder="Mensagem sugerida" rows={3} className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent resize-y font-[inherit]" />
              <button onClick={addFollowUp} className="w-full py-3.5 rounded-2xl bg-accent text-white text-sm font-bold shadow-card hover:opacity-90 mt-1">Adicionar Follow-up</button>
            </div>
          </div>
        </div>
      )}

      {/* Sections */}
      {overdue.length > 0 && (
        <div>
          <button onClick={() => toggleSection('overdue')} className="flex items-center gap-2 pb-3 w-full">
            <AlertTriangle className="w-4 h-4 text-red" /><span className="text-sm font-bold text-red">Atrasados ({overdue.length})</span>
            {expandedSections.overdue ? <ChevronUp className="w-3.5 h-3.5 text-red" /> : <ChevronDown className="w-3.5 h-3.5 text-red" />}
          </button>
          {expandedSections.overdue && <div className="flex flex-col gap-2.5">{overdue.map(f => renderCard(f, true))}</div>}
        </div>
      )}

      <div>
        <button onClick={() => toggleSection('today')} className="flex items-center gap-2 pb-3 w-full">
          <Bell className="w-4 h-4 text-text" /><span className="text-sm font-bold text-text">Hoje ({todayItems.length})</span>
          {expandedSections.today ? <ChevronUp className="w-3.5 h-3.5 text-text4" /> : <ChevronDown className="w-3.5 h-3.5 text-text4" />}
        </button>
        {expandedSections.today && (
          <div className="flex flex-col gap-2.5">
            {todayItems.length > 0 ? todayItems.map(f => renderCard(f)) : <div className="bg-card rounded-2xl p-8 border border-border text-center text-text4 text-sm">Nenhum follow-up para hoje</div>}
          </div>
        )}
      </div>

      <div>
        <button onClick={() => toggleSection('upcoming')} className="flex items-center gap-2 pb-3 w-full">
          <Calendar className="w-4 h-4 text-blue" /><span className="text-sm font-bold text-blue">Próximos 7 Dias ({upcoming.length})</span>
          {expandedSections.upcoming ? <ChevronUp className="w-3.5 h-3.5 text-blue" /> : <ChevronDown className="w-3.5 h-3.5 text-blue" />}
        </button>
        {expandedSections.upcoming && (
          <div className="flex flex-col gap-2.5">
            {upcoming.length > 0 ? upcoming.map(f => renderCard(f)) : <div className="bg-card rounded-2xl p-8 border border-border text-center text-text4 text-sm">Nenhum follow-up agendado</div>}
          </div>
        )}
      </div>
    </div>
  );
}
