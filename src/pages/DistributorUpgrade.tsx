import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Kanban, Bell, UserCheck, TestTube2, BarChart2,
  Lock, ArrowRight, CheckCircle2, Sparkles,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { updateProfile } from '../lib/api';

const features = [
  {
    icon: Kanban,
    title: 'Pipeline de Leads',
    desc: 'Gerencie seus contatos em um Kanban visual com etapas do funil Zinzino.',
  },
  {
    icon: Bell,
    title: 'Follow-ups Inteligentes',
    desc: 'Nunca perca um acompanhamento. Lembretes automáticos para cada lead.',
  },
  {
    icon: UserCheck,
    title: 'Gestão de Clientes',
    desc: 'Acompanhe o ciclo de vida de cada cliente, recompras e renovações.',
  },
  {
    icon: TestTube2,
    title: 'Rastreamento de Testes',
    desc: 'Monitore os BalanceTests enviados e resultados de cada cliente.',
  },
  {
    icon: BarChart2,
    title: 'Métricas de Performance',
    desc: 'Visualize sua taxa de conversão, LTV e volume de negócios.',
  },
];

export default function DistributorUpgrade() {
  const { user, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [activated, setActivated] = useState(false);

  const handleActivate = async () => {
    if (!user) return;
    setLoading(true);
    const updated = await updateProfile(user.id, { role: 'distributor' });
    if (updated) {
      await refreshProfile();
      setActivated(true);
      setTimeout(() => navigate('/crm/pipeline'), 1500);
    }
    setLoading(false);
  };

  if (activated) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-xl font-semibold text-text">Acesso ativado!</h2>
        <p className="text-text3 text-sm">Redirecionando para o CRM...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 bg-accent/10 text-accent text-xs font-semibold px-3 py-1.5 rounded-full mb-5">
          <Sparkles className="w-3.5 h-3.5" />
          Exclusivo para Distribuidores Zinzino
        </div>
        <h1 className="text-3xl font-bold text-text tracking-tight mb-3">
          Mini CRM para<br />Distribuidores
        </h1>
        <p className="text-text3 text-base leading-relaxed">
          Todas as ferramentas para gerir seus leads, acompanhar clientes e
          crescer sua rede Zinzino em um só lugar.
        </p>
      </div>

      {/* Features */}
      <div className="grid gap-3 mb-10">
        {features.map(({ icon: Icon, title, desc }) => (
          <div
            key={title}
            className="flex items-start gap-4 bg-card border border-border rounded-xl p-4"
          >
            <div className="w-9 h-9 bg-accent/10 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
              <Icon className="w-4.5 h-4.5 text-accent" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-sm font-semibold text-text">{title}</p>
              <p className="text-xs text-text3 mt-0.5 leading-relaxed">{desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* CTA */}
      <div className="bg-accent/5 border border-accent/20 rounded-2xl p-6 text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lock className="w-4 h-4 text-accent" />
          <p className="text-sm font-semibold text-text">Acesso exclusivo para distribuidores</p>
        </div>
        <p className="text-xs text-text3 mb-5">
          Já é distribuidor Zinzino? Ative seu acesso ao CRM agora.
        </p>
        <button
          onClick={handleActivate}
          disabled={loading}
          className="inline-flex items-center gap-2 bg-accent text-white text-sm font-semibold px-6 py-3 rounded-xl hover:bg-accent/90 transition-colors disabled:opacity-60"
        >
          {loading ? 'Ativando...' : 'Ativar Acesso ao CRM'}
          {!loading && <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}
