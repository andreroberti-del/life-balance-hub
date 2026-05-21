import { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronRight, FlaskConical, Award, AlertTriangle, CheckCircle, ShieldCheck, Activity, ArrowDown, X } from 'lucide-react';
import { useOmegaProducts, useBiomarkers, useOmegaStudies, diagnoseOmega, OmegaProduct, OmegaDiagnosis } from '../../hooks/useOmega';

const verdictStyle: Record<string, { bg: string; text: string; label: string; icon: typeof CheckCircle }> = {
  excellent: { bg: 'bg-emerald-500', text: 'text-emerald-50', label: 'Excelente', icon: Award },
  good: { bg: 'bg-violet-500', text: 'text-violet-50', label: 'Bom', icon: CheckCircle },
  moderate: { bg: 'bg-amber-500', text: 'text-amber-50', label: 'Moderado', icon: ShieldCheck },
  poor: { bg: 'bg-red-500', text: 'text-red-50', label: 'Baixo', icon: AlertTriangle },
  unknown: { bg: 'bg-gray-400', text: 'text-white', label: 'Sem dados', icon: AlertTriangle },
};

export function OmegaAudit() {
  const { products, loading: loadingProducts } = useOmegaProducts();
  const { biomarkers } = useBiomarkers();
  const { studies } = useOmegaStudies(4);
  const [search, setSearch] = useState('');
  const [diagnosis, setDiagnosis] = useState<OmegaDiagnosis | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<OmegaProduct | null>(null);

  const filtered = products.filter((p) =>
    !search ||
    p.brand.toLowerCase().includes(search.toLowerCase()) ||
    p.product_name.toLowerCase().includes(search.toLowerCase())
  );

  const handleDiagnose = async (product: OmegaProduct) => {
    setSelectedProduct(product);
    setDiagnosing(true);
    const result = await diagnoseOmega(product.slug);
    setDiagnosis(result);
    setDiagnosing(false);
  };

  const benchmark = products.find((p) => p.is_benchmark);

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
                <FlaskConical className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Omega Audit Method</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Seu ômega 3 funciona?
              </h1>
              <p className="text-white/85 text-base max-w-xl">
                Auditamos {products.length} marcas comparando dose, forma química, oxidação e absorção contra
                o benchmark <span className="font-bold text-yellow-300">{benchmark?.brand ?? 'BalanceOil'}</span>.
                Encontre seu produto e veja o diagnóstico.
              </p>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <div className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Base de dados</div>
              <div className="space-y-1 text-sm text-white">
                <div>{products.length} <span className="text-white/70">marcas</span></div>
                <div>{biomarkers.length} <span className="text-white/70">biomarcadores</span></div>
                <div>{studies.length}+ <span className="text-white/70">estudos científicos</span></div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* SEARCH + PRODUCTS GRID */}
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-12 lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-xl font-bold text-violet-950">Marcas auditadas</h2>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar marca ou produto..."
                  className="px-4 py-2 rounded-xl border border-violet-200 text-sm text-violet-950 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-violet-400"
                />
              </div>
              {loadingProducts ? (
                <p className="text-sm text-gray-500 text-center py-8">Carregando marcas...</p>
              ) : (
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filtered.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => handleDiagnose(p)}
                      className={`w-full text-left p-4 rounded-2xl border-2 transition-all hover:border-violet-300 hover:shadow-md ${
                        p.is_benchmark ? 'bg-violet-50 border-violet-300' : 'bg-white border-violet-100'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          p.is_benchmark ? 'bg-yellow-400' : 'bg-violet-100'
                        }`}>
                          {p.is_benchmark
                            ? <Award className="w-6 h-6 text-violet-950" strokeWidth={2.5} />
                            : <FlaskConical className="w-6 h-6 text-violet-500" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5">
                            <p className="font-bold text-violet-950 truncate">{p.brand}</p>
                            {p.is_benchmark && (
                              <span className="px-2 py-0.5 bg-yellow-400 text-violet-950 rounded-full text-[10px] font-bold uppercase tracking-wider">
                                Benchmark
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 truncate">{p.product_name}</p>
                          <div className="flex items-center gap-3 mt-1.5 text-xs text-gray-500">
                            <span><strong>{p.total_omega3_mg}mg</strong> EPA+DHA</span>
                            <span>·</span>
                            <span className="capitalize">{p.chemical_form.replace('_', ' ')}</span>
                            {p.oxidation_grade && (
                              <>
                                <span>·</span>
                                <span className={
                                  p.oxidation_grade === 'excellent' ? 'text-emerald-600 font-semibold' :
                                  p.oxidation_grade === 'poor' ? 'text-red-600 font-semibold' :
                                  ''
                                }>oxidação {p.oxidation_grade}</span>
                              </>
                            )}
                          </div>
                        </div>
                        <ChevronRight className="w-5 h-5 text-violet-400 flex-shrink-0" />
                      </div>
                    </button>
                  ))}
                  {filtered.length === 0 && (
                    <p className="text-sm text-gray-500 text-center py-6">Nenhum produto encontrado.</p>
                  )}
                </div>
              )}
            </div>

            {/* Studies */}
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <h2 className="text-xl font-bold text-violet-950 mb-5">Ciência por trás do método</h2>
              <div className="space-y-3">
                {studies.map((s) => (
                  <div key={s.id} className="p-4 bg-violet-50 rounded-2xl border border-violet-100">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <p className="font-bold text-violet-950 text-sm leading-snug">{s.study_title}</p>
                      <span className="px-2 py-0.5 bg-white text-violet-700 rounded-full text-[10px] font-bold flex-shrink-0">
                        {s.year}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500 mb-2">{s.population}</p>
                    <p className="text-xs text-gray-700 leading-relaxed">{s.summary_pt}</p>
                    {s.sample_size && (
                      <div className="flex items-center gap-2 mt-2 text-[10px] text-gray-500 font-semibold uppercase tracking-wider">
                        <span>n={s.sample_size.toLocaleString()}</span>
                        {s.confidence_grade && <><span>·</span><span>Confiança {s.confidence_grade}</span></>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
              <h2 className="text-lg font-bold text-violet-950 mb-4">Marcadores que importam</h2>
              <div className="space-y-3">
                {biomarkers.map((b) => (
                  <div key={b.marker_code} className="p-3 bg-violet-50 rounded-xl border border-violet-100">
                    <div className="flex items-center justify-between mb-1">
                      <p className="font-bold text-violet-950 text-sm">{b.name_pt}</p>
                      <Activity className="w-4 h-4 text-violet-500" />
                    </div>
                    <p className="text-xs text-gray-600 mb-2">{b.what_is_pt}</p>
                    {b.optimal_range_pt && (
                      <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-semibold">
                        <CheckCircle className="w-3 h-3" />
                        <span>{b.optimal_range_pt}</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="relative overflow-hidden bg-violet-500 rounded-3xl p-6 shadow-lg shadow-violet-500/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <FlaskConical className="w-8 h-8 text-yellow-300 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Como funciona o OAM</h3>
                <ol className="space-y-2 text-sm text-white/90 list-decimal pl-5">
                  <li>Baseline: mede seu ômega 3 index hoje</li>
                  <li>Protocolo de 120 dias com benchmark</li>
                  <li>Reteste: prova que seu corpo mudou</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* DIAGNOSIS MODAL */}
        {(diagnosis || diagnosing) && (
          <div className="fixed inset-0 bg-violet-950/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="bg-white rounded-3xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
            >
              {diagnosing ? (
                <div className="p-12 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-violet-100 flex items-center justify-center animate-pulse">
                    <FlaskConical className="w-8 h-8 text-violet-500" />
                  </div>
                  <p className="text-violet-950 font-bold">Analisando produto...</p>
                </div>
              ) : diagnosis && (() => {
                const v = verdictStyle[diagnosis.verdict];
                const VerdictIcon = v.icon;
                return (
                  <>
                    <div className={`${v.bg} rounded-t-3xl p-8 relative`}>
                      <button
                        onClick={() => setDiagnosis(null)}
                        className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur flex items-center justify-center hover:bg-white/30 transition-colors"
                      >
                        <X className="w-4 h-4 text-white" />
                      </button>
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-14 h-14 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center">
                          <VerdictIcon className="w-7 h-7 text-white" strokeWidth={2.5} />
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white/80 uppercase tracking-wider mb-1">{diagnosis.brand}</p>
                          <h2 className="text-2xl font-bold text-white">{diagnosis.product_name}</h2>
                        </div>
                      </div>
                      <div className="flex items-center gap-6">
                        <div>
                          <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Veredito</p>
                          <p className="text-2xl font-bold text-white">{v.label}</p>
                        </div>
                        <div className="h-12 w-px bg-white/30" />
                        <div>
                          <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-1">Score</p>
                          <p className="text-2xl font-bold text-white">{diagnosis.score}<span className="text-base text-white/60">/100</span></p>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 space-y-5">
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">Diagnóstico</p>
                        <p className="text-violet-950 text-sm leading-relaxed">{diagnosis.diagnosis_pt}</p>
                      </div>

                      {diagnosis.recommendations.verdict_description_pt && (
                        <div className={`p-4 rounded-2xl ${
                          diagnosis.verdict === 'poor' ? 'bg-red-50 border border-red-200' :
                          diagnosis.verdict === 'moderate' ? 'bg-amber-50 border border-amber-200' :
                          'bg-emerald-50 border border-emerald-200'
                        }`}>
                          <p className="text-sm font-bold text-violet-950">{diagnosis.recommendations.verdict_description_pt}</p>
                        </div>
                      )}

                      <div className="grid grid-cols-3 gap-3">
                        <div className="p-4 bg-violet-50 rounded-xl text-center">
                          <p className="text-xs font-bold text-gray-500 uppercase mb-1">Seu produto</p>
                          <p className="text-2xl font-bold text-violet-950">{diagnosis.total_omega3_mg}<span className="text-sm text-gray-400">mg</span></p>
                        </div>
                        <div className="flex items-center justify-center">
                          <ArrowDown className="w-6 h-6 text-violet-400 rotate-[-90deg]" />
                          <p className="text-xs font-bold text-violet-500 ml-1">{diagnosis.gap_mg > 0 ? `−${diagnosis.gap_mg}mg` : 'OK'}</p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-xl text-center border border-yellow-200">
                          <p className="text-xs font-bold text-yellow-700 uppercase mb-1">Benchmark</p>
                          <p className="text-2xl font-bold text-violet-950">{diagnosis.benchmark_total_mg}<span className="text-sm text-gray-400">mg</span></p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        {diagnosis.recommendations.oxidation_warning && (
                          <div className="flex items-start gap-3 p-3 bg-red-50 rounded-xl border border-red-200">
                            <AlertTriangle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-red-900 text-sm">Atenção à oxidação</p>
                              <p className="text-xs text-red-700">Esse produto tem oxidação alta. Pode causar inflamação em vez de reduzi-la.</p>
                            </div>
                          </div>
                        )}
                        {diagnosis.recommendations.low_absorption && (
                          <div className="flex items-start gap-3 p-3 bg-amber-50 rounded-xl border border-amber-200">
                            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                            <div>
                              <p className="font-bold text-amber-900 text-sm">Baixa absorção</p>
                              <p className="text-xs text-amber-700">A forma química desse produto tem absorção reduzida.</p>
                            </div>
                          </div>
                        )}
                        {diagnosis.recommendations.consider_protocol_120 && (
                          <div className="flex items-start gap-3 p-4 bg-violet-500 rounded-xl text-white">
                            <Award className="w-5 h-5 flex-shrink-0 mt-0.5 text-yellow-300" />
                            <div>
                              <p className="font-bold text-sm">Recomendamos o protocolo OAM de 120 dias</p>
                              <p className="text-xs text-white/85 mt-1">Faça baseline com BalanceTest, otimize 120 dias, e reteste pra ver mudança real nos biomarcadores.</p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
}
