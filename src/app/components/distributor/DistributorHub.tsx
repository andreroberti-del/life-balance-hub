import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, CheckCircle, Lock, Award, FileText, GraduationCap, Pill, Crown, ChevronRight } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';

interface DistributorCriterion {
  criterion_code: string;
  name_pt: string;
  description_pt: string;
  required: boolean;
  display_order: number;
}

interface EligibilityResult {
  is_eligible: boolean;
  status: string;
  premium_90d_met: boolean;
  oam_complete_met: boolean;
  treinamento_met: boolean;
  termo_met: boolean;
  nivel_minimo_met: boolean;
  missing_pt: string[];
}

const criterionIcon: Record<string, typeof CheckCircle> = {
  premium_90d: Award,
  oam_complete: Pill,
  treinamento_mind7: GraduationCap,
  termo_assinado: FileText,
  nivel_minimo: Crown,
};

export function DistributorHub() {
  const { user } = useAuth();
  const [criteria, setCriteria] = useState<DistributorCriterion[]>([]);
  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: crits }, { data: elig }] = await Promise.all([
        supabase.from('distributor_criteria').select('*').order('display_order'),
        user?.id
          ? supabase.rpc('check_distributor_eligibility', { p_user_id: user.id })
          : Promise.resolve({ data: null }),
      ]);
      setCriteria((crits ?? []) as DistributorCriterion[]);
      setEligibility(elig?.[0] ?? null);
      setLoading(false);
    })();
  }, [user?.id]);

  const isMet = (code: string): boolean => {
    if (!eligibility) return false;
    const map: Record<string, boolean> = {
      premium_90d: eligibility.premium_90d_met,
      oam_complete: eligibility.oam_complete_met,
      treinamento_mind7: eligibility.treinamento_met,
      termo_assinado: eligibility.termo_met,
      nivel_minimo: eligibility.nivel_minimo_met,
    };
    return map[code] ?? false;
  };

  const requiredMet = criteria.filter((c) => c.required && isMet(c.criterion_code)).length;
  const requiredTotal = criteria.filter((c) => c.required).length;

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Programa Distribuidor</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Distribuidor Aprovado M7
              </h1>
              <p className="text-white/85 text-base max-w-xl">
                Quando você completa o método, atinge resultado mensurável e domina a comunicação,
                você se torna elegível para representar a M7 com link de parceria oficial.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Seu progresso</div>
              <div className="text-4xl font-bold text-white mb-2">
                {requiredMet}<span className="text-lg text-white/60">/{requiredTotal}</span>
              </div>
              <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                <div
                  className="h-full bg-yellow-300 rounded-full transition-all duration-700"
                  style={{ width: `${requiredTotal > 0 ? (requiredMet / requiredTotal) * 100 : 0}%` }}
                />
              </div>
              <p className="text-xs text-white/70 mt-2">
                {eligibility?.is_eligible ? 'Pronto pra aplicar' : 'Critérios pendentes'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* STATUS */}
        {eligibility && (
          <div className="mb-8">
            {eligibility.status === 'approved' && (
              <div className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center">
                    <Award className="w-7 h-7 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-1">Você é um Distribuidor M7</p>
                    <p className="text-2xl font-bold text-emerald-900">Aprovado</p>
                  </div>
                </div>
              </div>
            )}
            {eligibility.status === 'in_review' && (
              <div className="bg-amber-50 border-2 border-amber-200 rounded-3xl p-6">
                <p className="text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">Aplicação em análise</p>
                <p className="text-violet-950">Nosso time de compliance está revisando sua aplicação. Você será notificado.</p>
              </div>
            )}
          </div>
        )}

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">

            {/* Checklist */}
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <h2 className="text-2xl font-bold text-violet-950 mb-2">Critérios pra aprovação</h2>
              <p className="text-sm text-gray-500 mb-6">
                Aprovação é manual no início. Quando todos os obrigatórios estiverem completos, você pode aplicar.
              </p>

              {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Carregando critérios...</p>
              ) : (
                <div className="space-y-3">
                  {criteria.map((c) => {
                    const met = isMet(c.criterion_code);
                    const Icon = criterionIcon[c.criterion_code] ?? CheckCircle;
                    return (
                      <div
                        key={c.criterion_code}
                        className={`p-5 rounded-2xl border-2 transition-all ${
                          met
                            ? 'bg-emerald-50 border-emerald-200'
                            : 'bg-violet-50 border-violet-100'
                        }`}
                      >
                        <div className="flex items-start gap-4">
                          <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            met ? 'bg-emerald-500' : 'bg-violet-200'
                          }`}>
                            {met
                              ? <CheckCircle className="w-6 h-6 text-white" strokeWidth={2} />
                              : <Icon className={`w-6 h-6 ${met ? 'text-white' : 'text-violet-500'}`} strokeWidth={2} />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-violet-950">{c.name_pt}</p>
                              {c.required && (
                                <span className="px-2 py-0.5 bg-violet-500 text-white rounded-full text-[10px] font-bold uppercase">
                                  Obrigatório
                                </span>
                              )}
                              {met && (
                                <span className="px-2 py-0.5 bg-emerald-500 text-white rounded-full text-[10px] font-bold uppercase">
                                  Completo
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{c.description_pt}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* CTA */}
              {eligibility?.is_eligible && eligibility.status !== 'approved' && eligibility.status !== 'in_review' && (
                <button
                  className="w-full mt-6 py-4 bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                >
                  Submeter aplicação <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <h3 className="text-lg font-bold text-violet-950 mb-4">O que muda quando aprovado</h3>
              <ul className="space-y-3 text-sm text-gray-700">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Campo <strong className="text-violet-950">Link da Zinzino</strong> ativo no perfil</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Dashboard de downline e comissões desbloqueado</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Link de compartilhamento <strong>partner_id-aware</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span>Área educativa exclusiva sobre gestão de network</span>
                </li>
              </ul>
            </div>

            <div className="relative overflow-hidden bg-violet-500 rounded-3xl p-6 shadow-lg shadow-violet-500/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <Lock className="w-7 h-7 text-yellow-300 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Por que aprovação manual</h3>
                <p className="text-sm text-white/85">
                  M7 protege a comunidade de promessas vazias. Pra representar a marca, você precisa
                  ter feito a jornada primeiro. Aprovação manual é a forma de garantir qualidade.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
