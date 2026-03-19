import { useState } from 'react';
import {
  Plus, Phone, MessageCircle, ChevronRight, ChevronLeft, Users, TrendingUp, Clock, Target, X, Instagram, Globe, UserPlus,
} from 'lucide-react';

type LeadStage = 'novo' | 'contato' | 'conversa' | 'apresentacao' | 'decisao' | 'cliente' | 'partner';

interface Lead {
  id: string; name: string; phone: string;
  source: 'instagram' | 'whatsapp' | 'referral' | 'website' | 'evento';
  stage: LeadStage; daysInStage: number; nextFollowUp: string | null; createdAt: string;
}

const stages: { key: LeadStage; label: string; color: string }[] = [
  { key: 'novo', label: 'Novo', color: 'bg-accent' },
  { key: 'contato', label: 'Contato', color: 'bg-accent-light' },
  { key: 'conversa', label: 'Conversa', color: 'bg-blue' },
  { key: 'apresentacao', label: 'Apresentação', color: 'bg-orange' },
  { key: 'decisao', label: 'Decisão', color: 'bg-amber' },
  { key: 'cliente', label: 'Cliente', color: 'bg-green' },
  { key: 'partner', label: 'Partner', color: 'bg-purple' },
];

const sourceIcons: Record<string, typeof Instagram> = { instagram: Instagram, whatsapp: MessageCircle, referral: UserPlus, website: Globe, evento: Users };
const sourceColors: Record<string, string> = { instagram: '#E1306C', whatsapp: '#25D366', referral: '#8B5CF6', website: '#3B82F6', evento: '#F59E0B' };

const initialLeads: Lead[] = [
  { id: '1', name: 'Maria Silva', phone: '(11) 99999-1234', source: 'instagram', stage: 'novo', daysInStage: 1, nextFollowUp: '2024-03-20', createdAt: '2024-03-19' },
  { id: '2', name: 'João Oliveira', phone: '(21) 98888-5678', source: 'whatsapp', stage: 'novo', daysInStage: 3, nextFollowUp: '2024-03-21', createdAt: '2024-03-16' },
  { id: '3', name: 'Ana Costa', phone: '(31) 97777-9012', source: 'referral', stage: 'contato', daysInStage: 2, nextFollowUp: '2024-03-22', createdAt: '2024-03-15' },
  { id: '4', name: 'Carlos Santos', phone: '(41) 96666-3456', source: 'instagram', stage: 'contato', daysInStage: 5, nextFollowUp: null, createdAt: '2024-03-12' },
  { id: '5', name: 'Fernanda Lima', phone: '(51) 95555-7890', source: 'website', stage: 'conversa', daysInStage: 4, nextFollowUp: '2024-03-23', createdAt: '2024-03-10' },
  { id: '6', name: 'Roberto Almeida', phone: '(61) 94444-2345', source: 'whatsapp', stage: 'conversa', daysInStage: 7, nextFollowUp: '2024-03-20', createdAt: '2024-03-08' },
  { id: '7', name: 'Patrícia Souza', phone: '(71) 93333-6789', source: 'evento', stage: 'apresentacao', daysInStage: 3, nextFollowUp: '2024-03-24', createdAt: '2024-03-14' },
  { id: '8', name: 'Lucas Ferreira', phone: '(81) 92222-0123', source: 'referral', stage: 'apresentacao', daysInStage: 6, nextFollowUp: '2024-03-21', createdAt: '2024-03-09' },
  { id: '9', name: 'Juliana Ribeiro', phone: '(91) 91111-4567', source: 'instagram', stage: 'decisao', daysInStage: 2, nextFollowUp: '2024-03-25', createdAt: '2024-03-17' },
  { id: '10', name: 'Marcos Pereira', phone: '(11) 90000-8901', source: 'whatsapp', stage: 'decisao', daysInStage: 8, nextFollowUp: '2024-03-20', createdAt: '2024-03-07' },
  { id: '11', name: 'Camila Mendes', phone: '(21) 98765-4321', source: 'instagram', stage: 'cliente', daysInStage: 15, nextFollowUp: '2024-04-05', createdAt: '2024-02-20' },
  { id: '12', name: 'Rafael Nunes', phone: '(31) 91234-5678', source: 'referral', stage: 'cliente', daysInStage: 30, nextFollowUp: '2024-04-10', createdAt: '2024-02-05' },
  { id: '13', name: 'Beatriz Cardoso', phone: '(41) 99876-5432', source: 'evento', stage: 'partner', daysInStage: 45, nextFollowUp: null, createdAt: '2024-01-20' },
  { id: '14', name: 'Eduardo Rocha', phone: '(51) 98765-1234', source: 'whatsapp', stage: 'conversa', daysInStage: 1, nextFollowUp: '2024-03-21', createdAt: '2024-03-18' },
  { id: '15', name: 'Larissa Gomes', phone: '(61) 97654-3210', source: 'instagram', stage: 'novo', daysInStage: 0, nextFollowUp: '2024-03-20', createdAt: '2024-03-19' },
];

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', source: 'instagram' as Lead['source'] });

  const moveLead = (leadId: string, direction: 'forward' | 'back') => {
    setLeads(prev => prev.map(lead => {
      if (lead.id !== leadId) return lead;
      const currentIdx = stages.findIndex(s => s.key === lead.stage);
      const newIdx = direction === 'forward' ? currentIdx + 1 : currentIdx - 1;
      if (newIdx < 0 || newIdx >= stages.length) return lead;
      return { ...lead, stage: stages[newIdx].key, daysInStage: 0 };
    }));
  };

  const addLead = () => {
    if (!newLead.name.trim()) return;
    setLeads(prev => [...prev, {
      id: String(Date.now()), name: newLead.name, phone: newLead.phone, source: newLead.source,
      stage: 'novo', daysInStage: 0, nextFollowUp: null, createdAt: new Date().toISOString().split('T')[0],
    }]);
    setNewLead({ name: '', phone: '', source: 'instagram' });
    setShowAddForm(false);
  };

  const totalLeads = leads.length;
  const clientCount = leads.filter(l => l.stage === 'cliente' || l.stage === 'partner').length;
  const conversionRate = totalLeads > 0 ? ((clientCount / totalLeads) * 100).toFixed(1) : '0';
  const avgDays = leads.length > 0 ? Math.round(leads.reduce((sum, l) => sum + l.daysInStage, 0) / leads.length) : 0;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text">Pipeline de Leads</h2>
          <p className="text-sm text-text4 mt-1">Gerencie seus leads do início ao fechamento</p>
        </div>
        <button onClick={() => setShowAddForm(true)} className="flex items-center gap-2 bg-accent text-white px-5 py-3 rounded-2xl text-sm font-semibold shadow-card hover:opacity-90 transition-opacity">
          <Plus className="w-4 h-4" /> Novo Lead
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {[
          { label: 'Total Leads', value: totalLeads, icon: Users, color: 'text-accent bg-accent-bg' },
          { label: 'Taxa Conversão', value: `${conversionRate}%`, icon: Target, color: 'text-green bg-green-bg' },
          { label: 'Média Dias', value: avgDays, icon: Clock, color: 'text-orange bg-orange-bg' },
          { label: 'Leads Ativos', value: leads.filter(l => !['cliente', 'partner'].includes(l.stage)).length, icon: TrendingUp, color: 'text-blue bg-blue-bg' },
        ].map((stat) => (
          <div key={stat.label} className="bg-card rounded-3xl p-5 border border-border shadow-card">
            <div className="flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon className="w-[18px] h-[18px]" />
              </div>
              <div>
                <p className="text-2xl font-extrabold text-text leading-none">{stat.value}</p>
                <p className="text-xs text-text4 mt-0.5">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center z-50" onClick={() => setShowAddForm(false)}>
          <div className="bg-card rounded-3xl p-6 border border-border shadow-card-hover w-full max-w-[440px] mx-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-text">Novo Lead</h3>
              <button onClick={() => setShowAddForm(false)} className="text-text4 hover:text-text3 p-1"><X className="w-[18px] h-[18px]" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <input value={newLead.name} onChange={e => setNewLead(p => ({ ...p, name: e.target.value }))} placeholder="Nome do lead"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <input value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} placeholder="(00) 00000-0000"
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent" />
              <select value={newLead.source} onChange={e => setNewLead(p => ({ ...p, source: e.target.value as Lead['source'] }))}
                className="w-full px-4 py-3 rounded-xl border border-border bg-bg text-sm text-text outline-none focus:border-accent">
                <option value="instagram">Instagram</option><option value="whatsapp">WhatsApp</option>
                <option value="referral">Indicação</option><option value="website">Website</option><option value="evento">Evento</option>
              </select>
              <button onClick={addLead} className="w-full py-3.5 rounded-2xl bg-accent text-white text-sm font-bold shadow-card hover:opacity-90 mt-1">
                Adicionar Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div className="overflow-x-auto pb-2">
        <div className="flex gap-4 min-w-fit">
          {stages.map((stage) => {
            const stageLeads = leads.filter(l => l.stage === stage.key);
            const stageIdx = stages.findIndex(s => s.key === stage.key);
            return (
              <div key={stage.key} className="w-[280px] min-w-[280px] flex-shrink-0">
                {/* Column Header */}
                <div className="flex items-center justify-between mb-3 px-1">
                  <div className="flex items-center gap-2">
                    <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                    <span className="text-xs font-bold text-text uppercase tracking-wide">{stage.label}</span>
                  </div>
                  <span className="text-xs font-bold text-text4 bg-bg rounded-lg px-2.5 py-0.5">{stageLeads.length}</span>
                </div>

                {/* Column Body */}
                <div className="flex flex-col gap-2.5 bg-bg rounded-2xl p-3 min-h-[300px] border border-border-light">
                  {stageLeads.map((lead) => {
                    const SourceIcon = sourceIcons[lead.source] || Globe;
                    return (
                      <div key={lead.id} className="bg-card rounded-2xl p-4 border border-border shadow-card hover:shadow-card-hover transition-shadow">
                        <div className="flex items-start justify-between mb-2.5">
                          <div>
                            <p className="text-sm font-bold text-text">{lead.name}</p>
                            <p className="text-xs text-text4 mt-0.5">{lead.phone}</p>
                          </div>
                          <div className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-lg" style={{ background: `${sourceColors[lead.source]}15`, color: sourceColors[lead.source] }}>
                            <SourceIcon className="w-2.5 h-2.5" />{lead.source}
                          </div>
                        </div>

                        <div className="flex items-center gap-3 text-[11px] text-text4 mb-3">
                          <span className="flex items-center gap-1"><Clock className="w-2.5 h-2.5" />{lead.daysInStage}d</span>
                          {lead.nextFollowUp && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-2.5 h-2.5" />
                              {new Date(lead.nextFollowUp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          )}
                        </div>

                        <div className="flex gap-1.5">
                          {stageIdx > 0 && (
                            <button onClick={() => moveLead(lead.id, 'back')}
                              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl border border-border bg-bg text-[11px] text-text4 font-medium hover:bg-dark3 transition-colors">
                              <ChevronLeft className="w-3 h-3" /> Voltar
                            </button>
                          )}
                          {stageIdx < stages.length - 1 && (
                            <button onClick={() => moveLead(lead.id, 'forward')}
                              className="flex-1 flex items-center justify-center gap-1 py-2 rounded-xl bg-accent text-white text-[11px] font-semibold hover:opacity-90 transition-opacity">
                              Avançar <ChevronRight className="w-3 h-3" />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                  {stageLeads.length === 0 && (
                    <div className="flex items-center justify-center py-10 text-text4 text-sm">→ Arraste aqui</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
