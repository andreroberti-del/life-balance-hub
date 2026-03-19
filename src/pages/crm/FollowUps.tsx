import { useState } from 'react';
import {
  Bell,
  Phone,
  MessageCircle,
  Mail,
  Calendar,
  RefreshCw,
  TestTube2,
  CheckCircle2,
  Clock,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
} from 'lucide-react';

type FollowUpType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'reorder' | 'retest';
type FollowUpStatus = 'pending' | 'completed' | 'snoozed';

interface FollowUp {
  id: string;
  contactName: string;
  contactPhone: string;
  type: FollowUpType;
  date: string;
  time: string;
  suggestedMessage: string;
  status: FollowUpStatus;
  notes?: string;
}

const typeConfig: Record<FollowUpType, { icon: typeof Phone; label: string; color: string; bg: string }> = {
  call: { icon: Phone, label: 'Ligacao', color: '#3B82F6', bg: '#EFF6FF' },
  whatsapp: { icon: MessageCircle, label: 'WhatsApp', color: '#25D366', bg: '#F0FDF4' },
  email: { icon: Mail, label: 'E-mail', color: '#8B5CF6', bg: '#F5F3FF' },
  meeting: { icon: Calendar, label: 'Reuniao', color: '#F59E0B', bg: '#FFFBEB' },
  reorder: { icon: RefreshCw, label: 'Recompra', color: '#EC4899', bg: '#FDF2F8' },
  retest: { icon: TestTube2, label: 'Re-teste', color: '#06B6D4', bg: '#ECFEFF' },
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
  { id: '1', contactName: 'Maria Silva', contactPhone: '(11) 99999-1234', type: 'whatsapp', date: today, time: '09:00', suggestedMessage: 'Oi Maria! Como voce esta se sentindo com o protocolo? Lembre-se de tomar o BalanceOil em jejum.', status: 'pending' },
  { id: '2', contactName: 'Roberto Almeida', contactPhone: '(61) 94444-2345', type: 'call', date: today, time: '10:30', suggestedMessage: 'Ligar para agendar apresentacao do BalanceTest. Mostrar resultados de clientes similares.', status: 'pending' },
  { id: '3', contactName: 'Juliana Ribeiro', contactPhone: '(91) 91111-4567', type: 'meeting', date: today, time: '14:00', suggestedMessage: 'Apresentacao do plano de negocios Zinzino. Levar kit de demonstracao.', status: 'pending' },
  { id: '4', contactName: 'Marcos Pereira', contactPhone: '(11) 90000-8901', type: 'whatsapp', date: today, time: '16:00', suggestedMessage: 'Marcos, seu periodo de decisao esta avancando. Posso esclarecer alguma duvida?', status: 'pending' },
  { id: '5', contactName: 'Ana Costa', contactPhone: '(31) 97777-9012', type: 'call', date: yesterday, time: '11:00', suggestedMessage: 'Follow-up pendente! Ana aguarda retorno sobre valores do kit inicial.', status: 'pending' },
  { id: '6', contactName: 'Carlos Santos', contactPhone: '(41) 96666-3456', type: 'whatsapp', date: twoDaysAgo, time: '15:00', suggestedMessage: 'URGENTE: Carlos nao respondeu ha 2 dias. Enviar mensagem de valor.', status: 'pending' },
  { id: '7', contactName: 'Camila Mendes', contactPhone: '(21) 98765-4321', type: 'reorder', date: tomorrow, time: '10:00', suggestedMessage: 'Camila, seu kit esta acabando! Vamos garantir a continuidade do protocolo?', status: 'pending' },
  { id: '8', contactName: 'Rafael Nunes', contactPhone: '(31) 91234-5678', type: 'retest', date: inTwoDays, time: '09:00', suggestedMessage: 'Rafael, esta na hora do seu re-teste! Vamos ver como seu Omega melhorou.', status: 'pending' },
  { id: '9', contactName: 'Fernanda Lima', contactPhone: '(51) 95555-7890', type: 'whatsapp', date: inThreeDays, time: '11:00', suggestedMessage: 'Fernanda, como esta a experiencia com os produtos? Alguma duvida?', status: 'pending' },
  { id: '10', contactName: 'Patricia Souza', contactPhone: '(71) 93333-6789', type: 'email', date: inFiveDays, time: '14:00', suggestedMessage: 'Enviar material complementar sobre beneficios do BalanceOil.', status: 'pending' },
  { id: '11', contactName: 'Lucas Ferreira', contactPhone: '(81) 92222-0123', type: 'call', date: inSixDays, time: '16:00', suggestedMessage: 'Lucas, vamos conversar sobre os resultados do seu teste?', status: 'pending' },
];

const cardStyle: React.CSSProperties = {
  background: '#2d3a4e',
  borderRadius: '16px',
  padding: '24px',
  border: '1px solid rgba(255,255,255,0.08)',
};

export default function FollowUps() {
  const [followUps, setFollowUps] = useState<FollowUp[]>(initialFollowUps);
  const [filter, setFilter] = useState<FollowUpType | 'all'>('all');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newFollowUp, setNewFollowUp] = useState({ contactName: '', contactPhone: '', type: 'whatsapp' as FollowUpType, date: today, time: '09:00', suggestedMessage: '' });
  const [loading, setLoading] = useState(false);
  const [expandedSections, setExpandedSections] = useState({ overdue: true, today: true, upcoming: true });

  useState(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(t);
  });

  const complete = (id: string) => setFollowUps(prev => prev.map(f => f.id === id ? { ...f, status: 'completed' as const } : f));
  const snooze = (id: string) => {
    setFollowUps(prev => prev.map(f => {
      if (f.id !== id) return f;
      const nextDay = new Date(f.date);
      nextDay.setDate(nextDay.getDate() + 1);
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
  const upcoming = filtered.filter(f => f.date > today).sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time));

  const toggleSection = (key: 'overdue' | 'today' | 'upcoming') => {
    setExpandedSections(prev => ({ ...prev, [key]: !prev[key] }));
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px', height: '40px', border: '3px solid rgba(255,255,255,0.08)', borderTopColor: '#E7FE55',
            borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px',
          }} />
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>Carregando follow-ups...</p>
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  const renderFollowUpCard = (followUp: FollowUp, isOverdue = false) => {
    const config = typeConfig[followUp.type];
    const TypeIcon = config.icon;
    return (
      <div key={followUp.id} style={{
        ...cardStyle,
        padding: '16px 20px',
        borderLeft: isOverdue ? '3px solid #EF4444' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'start', justifyContent: 'space-between', gap: '12px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'start', gap: '14px', flex: 1, minWidth: '200px' }}>
            <div style={{
              width: '42px', height: '42px', borderRadius: '12px',
              background: config.bg, display: 'flex', alignItems: 'center', justifyContent: 'center',
              flexShrink: 0,
            }}>
              <TypeIcon style={{ width: '18px', height: '18px', color: config.color }} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <p style={{ fontSize: '15px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{followUp.contactName}</p>
                <span style={{
                  fontSize: '10px', fontWeight: 600, color: config.color,
                  background: config.bg, padding: '2px 8px', borderRadius: '6px',
                }}>
                  {config.label}
                </span>
              </div>
              <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', margin: '0 0 8px' }}>{followUp.contactPhone}</p>
              <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.5 }}>{followUp.suggestedMessage}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px', fontSize: '11px', color: isOverdue ? '#EF4444' : 'rgba(255,255,255,0.5)' }}>
                <Clock style={{ width: '11px', height: '11px' }} />
                {isOverdue ? (
                  <span style={{ fontWeight: 600 }}>
                    Atrasado {Math.ceil((new Date(today).getTime() - new Date(followUp.date).getTime()) / 86400000)} dia(s)
                  </span>
                ) : (
                  <span>{followUp.time} — {new Date(followUp.date).toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' })}</span>
                )}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <button
              onClick={() => complete(followUp.id)}
              title="Concluir"
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#E7FE55', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <CheckCircle2 style={{ width: '16px', height: '16px', color: '#0F1511' }} />
            </button>
            <button
              onClick={() => snooze(followUp.id)}
              title="Adiar"
              style={{
                width: '40px', height: '40px', borderRadius: '12px',
                background: '#1a2332', border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Clock style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.5)' }} />
            </button>
            {(followUp.type === 'call' || followUp.type === 'whatsapp') && (
              <a
                href={followUp.type === 'whatsapp'
                  ? `https://wa.me/55${followUp.contactPhone.replace(/\D/g, '')}`
                  : `tel:${followUp.contactPhone.replace(/\D/g, '')}`
                }
                target="_blank"
                rel="noopener noreferrer"
                title={followUp.type === 'whatsapp' ? 'Abrir WhatsApp' : 'Ligar'}
                style={{
                  width: '40px', height: '40px', borderRadius: '12px',
                  background: followUp.type === 'whatsapp' ? '#25D36615' : '#3B82F615',
                  border: 'none', cursor: 'pointer',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  textDecoration: 'none',
                }}
              >
                {followUp.type === 'whatsapp'
                  ? <MessageCircle style={{ width: '16px', height: '16px', color: '#25D366' }} />
                  : <Phone style={{ width: '16px', height: '16px', color: '#3B82F6' }} />
                }
              </a>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
        <div>
          <h2 style={{ fontSize: '24px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Follow-ups</h2>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '14px', marginTop: '4px' }}>Acompanhe e nao perca nenhum contato</p>
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
          Novo Follow-up
        </button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
        {[
          { label: 'Atrasados', value: overdue.length, color: '#EF4444', bg: '#FEF2F2' },
          { label: 'Hoje', value: todayItems.length, color: '#E7FE55', bg: '#FEFCE8' },
          { label: 'Proximos 7 dias', value: upcoming.length, color: '#3B82F6', bg: '#EFF6FF' },
          { label: 'Concluidos', value: followUps.filter(f => f.status === 'completed').length, color: '#22C55E', bg: '#F0FDF4' },
        ].map(stat => (
          <div key={stat.label} style={{ ...cardStyle, padding: '16px 20px', textAlign: 'center' }}>
            <p style={{ fontSize: '28px', fontWeight: 800, color: 'rgba(255,255,255,0.9)', margin: 0 }}>{stat.value}</p>
            <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '4px' }}>{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
        {[
          { key: 'all' as const, label: 'Todos' },
          ...Object.entries(typeConfig).map(([key, val]) => ({ key: key as FollowUpType | 'all', label: val.label })),
        ].map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key as FollowUpType | 'all')}
            style={{
              padding: '8px 16px', borderRadius: '10px', fontSize: '13px', fontWeight: 600,
              border: 'none', cursor: 'pointer',
              background: filter === f.key ? '#E7FE55' : '#2d3a4e',
              color: filter === f.key ? '#0F1511' : 'rgba(255,255,255,0.5)',
              border: filter === f.key ? 'none' : '1px solid rgba(255,255,255,0.08)',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Add Follow-up Modal */}
      {showAddForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.3)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100,
        }} onClick={() => setShowAddForm(false)}>
          <div style={{ ...cardStyle, width: '100%', maxWidth: '440px', margin: '16px' }} onClick={e => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
              <h3 style={{ fontSize: '18px', fontWeight: 700, color: 'rgba(255,255,255,0.9)', margin: 0 }}>Novo Follow-up</h3>
              <button onClick={() => setShowAddForm(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px' }}>
                <X style={{ width: '18px', height: '18px' }} />
              </button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <input value={newFollowUp.contactName} onChange={e => setNewFollowUp(p => ({ ...p, contactName: e.target.value }))} placeholder="Nome do contato" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }} />
              <input value={newFollowUp.contactPhone} onChange={e => setNewFollowUp(p => ({ ...p, contactPhone: e.target.value }))} placeholder="Telefone" style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }} />
              <div style={{ display: 'flex', gap: '12px' }}>
                <select value={newFollowUp.type} onChange={e => setNewFollowUp(p => ({ ...p, type: e.target.value as FollowUpType }))} style={{ flex: 1, padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332' }}>
                  {Object.entries(typeConfig).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
                <input type="time" value={newFollowUp.time} onChange={e => setNewFollowUp(p => ({ ...p, time: e.target.value }))} style={{ width: '120px', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332' }} />
              </div>
              <input type="date" value={newFollowUp.date} onChange={e => setNewFollowUp(p => ({ ...p, date: e.target.value }))} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', boxSizing: 'border-box' }} />
              <textarea value={newFollowUp.suggestedMessage} onChange={e => setNewFollowUp(p => ({ ...p, suggestedMessage: e.target.value }))} placeholder="Mensagem sugerida (opcional)" rows={3} style={{ width: '100%', padding: '12px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', fontSize: '14px', outline: 'none', background: '#1a2332', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }} />
              <button onClick={addFollowUp} style={{ width: '100%', padding: '14px', borderRadius: '14px', background: '#E7FE55', color: '#0F1511', border: 'none', fontSize: '14px', fontWeight: 700, cursor: 'pointer', boxShadow: '0 2px 8px rgba(231,254,85,0.3)', marginTop: '4px' }}>
                Adicionar Follow-up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Overdue Section */}
      {overdue.length > 0 && (
        <div>
          <button onClick={() => toggleSection('overdue')} style={{
            display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
            cursor: 'pointer', padding: '0 0 12px', width: '100%',
          }}>
            <AlertTriangle style={{ width: '16px', height: '16px', color: '#EF4444' }} />
            <span style={{ fontSize: '14px', fontWeight: 700, color: '#EF4444' }}>Atrasados ({overdue.length})</span>
            {expandedSections.overdue ? <ChevronUp style={{ width: '14px', height: '14px', color: '#EF4444' }} /> : <ChevronDown style={{ width: '14px', height: '14px', color: '#EF4444' }} />}
          </button>
          {expandedSections.overdue && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {overdue.map(f => renderFollowUpCard(f, true))}
            </div>
          )}
        </div>
      )}

      {/* Today Section */}
      <div>
        <button onClick={() => toggleSection('today')} style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          cursor: 'pointer', padding: '0 0 12px', width: '100%',
        }}>
          <Bell style={{ width: '16px', height: '16px', color: 'rgba(255,255,255,0.9)' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: 'rgba(255,255,255,0.9)' }}>Hoje ({todayItems.length})</span>
          {expandedSections.today ? <ChevronUp style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.5)' }} /> : <ChevronDown style={{ width: '14px', height: '14px', color: 'rgba(255,255,255,0.5)' }} />}
        </button>
        {expandedSections.today && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {todayItems.length > 0 ? todayItems.map(f => renderFollowUpCard(f)) : (
              <div style={{ ...cardStyle, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Nenhum follow-up para hoje
              </div>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Section */}
      <div>
        <button onClick={() => toggleSection('upcoming')} style={{
          display: 'flex', alignItems: 'center', gap: '8px', background: 'none', border: 'none',
          cursor: 'pointer', padding: '0 0 12px', width: '100%',
        }}>
          <Calendar style={{ width: '16px', height: '16px', color: '#3B82F6' }} />
          <span style={{ fontSize: '14px', fontWeight: 700, color: '#3B82F6' }}>Proximos 7 Dias ({upcoming.length})</span>
          {expandedSections.upcoming ? <ChevronUp style={{ width: '14px', height: '14px', color: '#3B82F6' }} /> : <ChevronDown style={{ width: '14px', height: '14px', color: '#3B82F6' }} />}
        </button>
        {expandedSections.upcoming && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {upcoming.length > 0 ? upcoming.map(f => renderFollowUpCard(f)) : (
              <div style={{ ...cardStyle, padding: '32px', textAlign: 'center', color: 'rgba(255,255,255,0.5)', fontSize: '14px' }}>
                Nenhum follow-up agendado
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
