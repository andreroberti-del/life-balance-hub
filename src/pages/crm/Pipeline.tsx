import { useState } from 'react';
import {
  Plus,
  Phone,
  MessageCircle,
  ChevronRight,
  ChevronLeft,
  Users,
  TrendingUp,
  Clock,
  Target,
  X,
  Instagram,
  Globe,
  UserPlus,
} from 'lucide-react';

type LeadStage = 'novo' | 'contato' | 'conversa' | 'apresentacao' | 'decisao' | 'cliente' | 'partner';

interface Lead {
  id: string;
  name: string;
  phone: string;
  source: 'instagram' | 'whatsapp' | 'referral' | 'website' | 'evento';
  stage: LeadStage;
  daysInStage: number;
  nextFollowUp: string | null;
  createdAt: string;
  notes?: string;
}

const stages: { key: LeadStage; label: string; color: string }[] = [
  { key: 'novo', label: 'Novo', color: '#E7FE55' },
  { key: 'contato', label: 'Contato', color: '#E7FE55' },
  { key: 'conversa', label: 'Conversa', color: '#E7FE55' },
  { key: 'apresentacao', label: 'Apresentacao', color: '#E7FE55' },
  { key: 'decisao', label: 'Decisao', color: '#E7FE55' },
  { key: 'cliente', label: 'Cliente', color: '#22C55E' },
  { key: 'partner', label: 'Partner', color: '#3B82F6' },
];

const sourceIcons: Record<string, typeof Instagram> = {
  instagram: Instagram,
  whatsapp: MessageCircle,
  referral: UserPlus,
  website: Globe,
  evento: Users,
};

const sourceColors: Record<string, string> = {
  instagram: '#E1306C',
  whatsapp: '#25D366',
  referral: '#8B5CF6',
  website: '#3B82F6',
  evento: '#F59E0B',
};

const initialLeads: Lead[] = [
  { id: '1', name: 'Maria Silva', phone: '(11) 99999-1234', source: 'instagram', stage: 'novo', daysInStage: 1, nextFollowUp: '2024-03-20', createdAt: '2024-03-19' },
  { id: '2', name: 'Joao Oliveira', phone: '(21) 98888-5678', source: 'whatsapp', stage: 'novo', daysInStage: 3, nextFollowUp: '2024-03-21', createdAt: '2024-03-16' },
  { id: '3', name: 'Ana Costa', phone: '(31) 97777-9012', source: 'referral', stage: 'contato', daysInStage: 2, nextFollowUp: '2024-03-22', createdAt: '2024-03-15' },
  { id: '4', name: 'Carlos Santos', phone: '(41) 96666-3456', source: 'instagram', stage: 'contato', daysInStage: 5, nextFollowUp: null, createdAt: '2024-03-12' },
  { id: '5', name: 'Fernanda Lima', phone: '(51) 95555-7890', source: 'website', stage: 'conversa', daysInStage: 4, nextFollowUp: '2024-03-23', createdAt: '2024-03-10' },
  { id: '6', name: 'Roberto Almeida', phone: '(61) 94444-2345', source: 'whatsapp', stage: 'conversa', daysInStage: 7, nextFollowUp: '2024-03-20', createdAt: '2024-03-08' },
  { id: '7', name: 'Patricia Souza', phone: '(71) 93333-6789', source: 'evento', stage: 'apresentacao', daysInStage: 3, nextFollowUp: '2024-03-24', createdAt: '2024-03-14' },
  { id: '8', name: 'Lucas Ferreira', phone: '(81) 92222-0123', source: 'referral', stage: 'apresentacao', daysInStage: 6, nextFollowUp: '2024-03-21', createdAt: '2024-03-09' },
  { id: '9', name: 'Juliana Ribeiro', phone: '(91) 91111-4567', source: 'instagram', stage: 'decisao', daysInStage: 2, nextFollowUp: '2024-03-25', createdAt: '2024-03-17' },
  { id: '10', name: 'Marcos Pereira', phone: '(11) 90000-8901', source: 'whatsapp', stage: 'decisao', daysInStage: 8, nextFollowUp: '2024-03-20', createdAt: '2024-03-07' },
  { id: '11', name: 'Camila Mendes', phone: '(21) 98765-4321', source: 'instagram', stage: 'cliente', daysInStage: 15, nextFollowUp: '2024-04-05', createdAt: '2024-02-20' },
  { id: '12', name: 'Rafael Nunes', phone: '(31) 91234-5678', source: 'referral', stage: 'cliente', daysInStage: 30, nextFollowUp: '2024-04-10', createdAt: '2024-02-05' },
  { id: '13', name: 'Beatriz Cardoso', phone: '(41) 99876-5432', source: 'evento', stage: 'partner', daysInStage: 45, nextFollowUp: null, createdAt: '2024-01-20' },
  { id: '14', name: 'Eduardo Rocha', phone: '(51) 98765-1234', source: 'whatsapp', stage: 'conversa', daysInStage: 1, nextFollowUp: '2024-03-21', createdAt: '2024-03-18' },
  { id: '15', name: 'Larissa Gomes', phone: '(61) 97654-3210', source: 'instagram', stage: 'novo', daysInStage: 0, nextFollowUp: '2024-03-20', createdAt: '2024-03-19' },
];

const cardStyle: React.CSSProperties = {
  background: '#fff',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
};

export default function Pipeline() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newLead, setNewLead] = useState({ name: '', phone: '', source: 'instagram' as Lead['source'] });
  const [loading, setLoading] = useState(false);

  // Simulate loading
  useState(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(t);
  });

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
    const lead: Lead = {
      id: String(Date.now()),
      name: newLead.name,
      phone: newLead.phone,
      source: newLead.source,
      stage: 'novo',
      daysInStage: 0,
      nextFollowUp: null,
      createdAt: new Date().toISOString().split('T')[0],
    };
    setLeads(prev => [...prev, lead]);
    setNewLead({ name: '', phone: '', source: 'instagram' });
    setShowAddForm(false);
  };

  const totalLeads = leads.length;
  const clientCount = leads.filter(l => l.stage === 'cliente' || l.stage === 'partner').length;
  const conversionRate = totalLeads > 0 ? ((clientCount / totalLeads) * 100).toFixed(1) : '0';
  const avgDays = leads.length > 0
    ? Math.round(leads.reduce((sum, l) => sum + l.daysInStage, 0) / leads.length)
    : 0;

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid #E8E8E2', borderTopColor: '#E7FE55',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: '#8A9A90', fontSize: '14px' }}>Carregando pipeline...</p>
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
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: '#1A1F1C', margin: 0 }}>Pipeline de Leads</h2>
          <p style={{ color: '#8A9A90', fontSize: '14px', marginTop: '4px' }}>Gerencie seus leads do inicio ao fechamento</p>
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
          Novo Lead
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        {[
          { label: 'Total Leads', value: totalLeads, icon: Users, iconBg: '#EEF2FF', iconColor: '#6366F1' },
          { label: 'Taxa de Conversao', value: `${conversionRate}%`, icon: Target, iconBg: '#F0FDF4', iconColor: '#22C55E' },
          { label: 'Media Dias p/ Converter', value: avgDays, icon: Clock, iconBg: '#FFFBEB', iconColor: '#F59E0B' },
          { label: 'Leads Ativos', value: leads.filter(l => !['cliente', 'partner'].includes(l.stage)).length, icon: TrendingUp, iconBg: '#FEFCE8', iconColor: '#84CC16' },
        ].map((stat) => (
          <div key={stat.label} style={cardStyle}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: stat.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <stat.icon style={{ width: '18px', height: '18px', color: stat.iconColor }} />
              </div>
              <div>
                <p style={{ fontSize: '24px', fontWeight: 800, color: '#1A1F1C', lineHeight: 1, margin: 0 }}>{stat.value}</p>
                <p style={{ fontSize: '12px', color: '#8A9A90', marginTop: '2px' }}>{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Lead Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowAddForm(false)}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '440px', margin: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: '#1A1F1C', margin: 0 }}>Novo Lead</h3>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8A9A90', padding: '4px' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#4A5A50', display: 'block', marginBottom: '6px' }}>Nome</label>
                <input
                  value={newLead.name}
                  onChange={e => setNewLead(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nome do lead"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid #E8E8E2', fontSize: '14px', outline: 'none',
                    background: '#F5F5F0', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#4A5A50', display: 'block', marginBottom: '6px' }}>Telefone</label>
                <input
                  value={newLead.phone}
                  onChange={e => setNewLead(prev => ({ ...prev, phone: e.target.value }))}
                  placeholder="(00) 00000-0000"
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid #E8E8E2', fontSize: '14px', outline: 'none',
                    background: '#F5F5F0', boxSizing: 'border-box',
                  }}
                />
              </div>
              <div>
                <label style={{ fontSize: '13px', fontWeight: 600, color: '#4A5A50', display: 'block', marginBottom: '6px' }}>Fonte</label>
                <select
                  value={newLead.source}
                  onChange={e => setNewLead(prev => ({ ...prev, source: e.target.value as Lead['source'] }))}
                  style={{
                    width: '100%', padding: '12px 16px', borderRadius: '12px',
                    border: '1px solid #E8E8E2', fontSize: '14px', outline: 'none',
                    background: '#F5F5F0', boxSizing: 'border-box',
                  }}
                >
                  <option value="instagram">Instagram</option>
                  <option value="whatsapp">WhatsApp</option>
                  <option value="referral">Indicacao</option>
                  <option value="website">Website</option>
                  <option value="evento">Evento</option>
                </select>
              </div>
              <button
                onClick={addLead}
                style={{
                  width: '100%', padding: '14px', borderRadius: '14px',
                  background: '#E7FE55', color: '#0F1511', border: 'none',
                  fontSize: '14px', fontWeight: 700, cursor: 'pointer',
                  boxShadow: '0 2px 8px rgba(231,254,85,0.3)', marginTop: '8px',
                }}
              >
                Adicionar Lead
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Kanban Board */}
      <div style={{ overflowX: 'auto', paddingBottom: '8px' }}>
        <div style={{ display: 'flex', gap: '16px', minWidth: 'fit-content' }}>
          {stages.map((stage) => {
            const stageLeads = leads.filter(l => l.stage === stage.key);
            const stageIdx = stages.findIndex(s => s.key === stage.key);
            return (
              <div key={stage.key} style={{ width: '280px', minWidth: '280px', flexShrink: 0 }}>
                {/* Column Header */}
                <div style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  marginBottom: '12px', padding: '0 4px',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <div style={{
                      width: '8px', height: '8px', borderRadius: '50%',
                      background: stage.color,
                    }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#1A1F1C', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                      {stage.label}
                    </span>
                  </div>
                  <span style={{
                    fontSize: '12px', fontWeight: 700, color: '#8A9A90',
                    background: '#F5F5F0', borderRadius: '8px', padding: '2px 10px',
                  }}>
                    {stageLeads.length}
                  </span>
                </div>

                {/* Column Body */}
                <div style={{
                  display: 'flex', flexDirection: 'column', gap: '10px',
                  background: '#F5F5F0', borderRadius: '16px', padding: '12px',
                  minHeight: '300px',
                }}>
                  {stageLeads.map((lead) => {
                    const SourceIcon = sourceIcons[lead.source] || Globe;
                    return (
                      <div key={lead.id} style={{
                        background: '#fff', borderRadius: '14px', padding: '16px',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
                        transition: 'box-shadow 0.2s',
                        cursor: 'default',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', marginBottom: '10px' }}>
                          <div>
                            <p style={{ fontSize: '14px', fontWeight: 700, color: '#1A1F1C', margin: 0 }}>{lead.name}</p>
                            <p style={{ fontSize: '12px', color: '#8A9A90', marginTop: '2px' }}>{lead.phone}</p>
                          </div>
                          <div style={{
                            display: 'flex', alignItems: 'center', gap: '4px',
                            background: `${sourceColors[lead.source]}15`,
                            color: sourceColors[lead.source],
                            padding: '3px 8px', borderRadius: '8px', fontSize: '10px', fontWeight: 600,
                          }}>
                            <SourceIcon style={{ width: '10px', height: '10px' }} />
                            {lead.source}
                          </div>
                        </div>

                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '11px', color: '#8A9A90', marginBottom: '12px' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                            <Clock style={{ width: '10px', height: '10px' }} />
                            {lead.daysInStage}d no estagio
                          </span>
                          {lead.nextFollowUp && (
                            <span style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
                              <Phone style={{ width: '10px', height: '10px' }} />
                              {new Date(lead.nextFollowUp).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}
                            </span>
                          )}
                        </div>

                        {/* Move Buttons */}
                        <div style={{ display: 'flex', gap: '6px' }}>
                          {stageIdx > 0 && (
                            <button
                              onClick={() => moveLead(lead.id, 'back')}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '4px', padding: '8px', borderRadius: '10px',
                                border: '1px solid #E8E8E2', background: '#fff',
                                fontSize: '11px', color: '#8A9A90', cursor: 'pointer',
                                fontWeight: 500,
                              }}
                            >
                              <ChevronLeft style={{ width: '12px', height: '12px' }} />
                              Voltar
                            </button>
                          )}
                          {stageIdx < stages.length - 1 && (
                            <button
                              onClick={() => moveLead(lead.id, 'forward')}
                              style={{
                                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                                gap: '4px', padding: '8px', borderRadius: '10px',
                                border: 'none',
                                background: stage.key === 'decisao' ? '#22C55E' : '#E7FE55',
                                fontSize: '11px',
                                color: stage.key === 'decisao' ? '#fff' : '#0F1511',
                                cursor: 'pointer', fontWeight: 600,
                              }}
                            >
                              Avancar
                              <ChevronRight style={{ width: '12px', height: '12px' }} />
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {stageLeads.length === 0 && (
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      padding: '40px 16px', color: '#C0C8C3', fontSize: '13px',
                    }}>
                      Nenhum lead
                    </div>
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
