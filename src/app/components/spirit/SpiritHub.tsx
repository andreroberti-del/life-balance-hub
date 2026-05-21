import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, BookOpen, Sparkles, CheckCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { useDevotionals, useGratitude, Devotional } from '../../hooks/useMindSpirit';
import { ZenoMascot } from '../zeno/ZenoMascot';

const categoryColor: Record<string, string> = {
  descanso: 'bg-blue-100 text-blue-700',
  proposito: 'bg-violet-100 text-violet-700',
  familia: 'bg-rose-100 text-rose-700',
  gratidao: 'bg-amber-100 text-amber-700',
  silencio: 'bg-slate-100 text-slate-700',
};

export function SpiritHub() {
  const { devotionals, readMap, loading, markAsRead } = useDevotionals();
  const { today: todayGratitude, history: gratitudeHistory, submit: submitGratitude } = useGratitude();

  const [expanded, setExpanded] = useState<string | null>(null);
  const [reflection, setReflection] = useState<Record<string, string>>({});
  const [item1, setItem1] = useState(todayGratitude?.item_1 ?? '');
  const [item2, setItem2] = useState(todayGratitude?.item_2 ?? '');
  const [item3, setItem3] = useState(todayGratitude?.item_3 ?? '');
  const [gratitudeReflection, setGratitudeReflection] = useState(todayGratitude?.reflection ?? '');
  const [gratitudeSubmitted, setGratitudeSubmitted] = useState(!!todayGratitude);

  const handleReflection = async (dev: Devotional) => {
    await markAsRead(dev.id, reflection[dev.id]);
    setExpanded(null);
  };

  const handleGratitudeSubmit = async () => {
    if (!item1.trim()) return;
    await submitGratitude(item1, item2, item3, gratitudeReflection);
    setGratitudeSubmitted(true);
  };

  const completedDevotionals = devotionals.filter((d) => readMap.has(d.id)).length;

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
          className="relative overflow-hidden bg-violet-500 rounded-3xl p-8 md:p-10 mb-8 shadow-xl shadow-violet-500/20"
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />
          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="flex items-center gap-5">
              <ZenoMascot pose="meditation" size="lg" className="hidden md:block flex-shrink-0" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Heart className="w-5 h-5 text-white/80" />
                  <p className="text-white/80 text-sm font-medium uppercase tracking-wider">Saúde Espiritual</p>
                </div>
                <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">Spirit</h1>
                <p className="text-white/85 text-base max-w-xl">
                  Cresça por fora sem se perder por dentro. Devocional diário, gratidão prática,
                  propósito acima do número.
                </p>
              </div>
            </div>
            <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[220px]">
              <p className="text-xs text-white/80 font-bold uppercase tracking-wider mb-2">Sua jornada</p>
              <p className="text-3xl font-bold text-white mb-1">
                {completedDevotionals}<span className="text-base text-white/60">/{devotionals.length} devocionais</span>
              </p>
              <p className="text-xs text-white/70">
                {gratitudeHistory.length} dias de gratidão
              </p>
            </div>
          </div>
        </motion.div>

        {/* GRID */}
        <div className="grid grid-cols-12 gap-6">

          {/* DEVOTIONALS */}
          <div className="col-span-12 lg:col-span-7">
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-violet-950">Devocional do dia</h2>
                  <p className="text-sm text-gray-500">5-10 minutos. Leitura, oração, ação.</p>
                </div>
                <BookOpen className="w-6 h-6 text-violet-500" />
              </div>

              {loading ? (
                <p className="text-sm text-gray-500 text-center py-8">Carregando...</p>
              ) : (
                <div className="space-y-3">
                  {devotionals.map((d) => {
                    const isRead = readMap.has(d.id);
                    const isOpen = expanded === d.id;
                    const cat = d.category ? categoryColor[d.category] : 'bg-violet-100 text-violet-700';
                    return (
                      <div
                        key={d.id}
                        className={`rounded-2xl border-2 transition-all ${
                          isRead ? 'bg-emerald-50 border-emerald-200' : 'bg-violet-50 border-violet-100'
                        }`}
                      >
                        <button
                          onClick={() => setExpanded(isOpen ? null : d.id)}
                          className="w-full p-5 flex items-start gap-4 text-left"
                        >
                          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${
                            isRead ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'
                          }`}>
                            {isRead ? <CheckCircle className="w-6 h-6" /> : <BookOpen className="w-6 h-6" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <p className="font-bold text-violet-950">{d.title_pt}</p>
                              {d.category && (
                                <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${cat}`}>
                                  {d.category}
                                </span>
                              )}
                            </div>
                            {d.scripture_reference && (
                              <p className="text-xs text-violet-600 italic">{d.scripture_reference}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">
                              {d.estimated_minutes} min · +{d.xp_reward} XP {isRead && '· lido'}
                            </p>
                          </div>
                          {isOpen ? <ChevronUp className="w-5 h-5 text-violet-500 flex-shrink-0" /> : <ChevronDown className="w-5 h-5 text-violet-500 flex-shrink-0" />}
                        </button>

                        {isOpen && (
                          <div className="px-5 pb-5 pt-1 space-y-4">
                            {d.scripture_quote && (
                              <blockquote className="border-l-4 border-violet-400 pl-4 italic text-violet-900">
                                "{d.scripture_quote}"
                                <footer className="text-xs text-violet-600 mt-1 not-italic">— {d.scripture_reference}</footer>
                              </blockquote>
                            )}
                            <div>
                              <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">Reflexão</p>
                              <p className="text-sm text-violet-950 leading-relaxed">{d.reflection_pt}</p>
                            </div>
                            {d.prayer_pt && (
                              <div className="p-4 bg-violet-100 rounded-2xl">
                                <p className="text-xs font-bold uppercase tracking-wider text-violet-700 mb-2">Oração</p>
                                <p className="text-sm text-violet-900 italic">{d.prayer_pt}</p>
                              </div>
                            )}
                            {d.action_pt && (
                              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200">
                                <p className="text-xs font-bold uppercase tracking-wider text-emerald-700 mb-2">Ação prática hoje</p>
                                <p className="text-sm text-emerald-900">{d.action_pt}</p>
                              </div>
                            )}
                            {!isRead && (
                              <>
                                <div>
                                  <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-2">Sua reflexão (opcional)</p>
                                  <textarea
                                    value={reflection[d.id] ?? ''}
                                    onChange={(e) => setReflection({ ...reflection, [d.id]: e.target.value })}
                                    rows={3}
                                    placeholder="O que ficou em você?"
                                    className="w-full p-3 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-sm text-violet-950"
                                  />
                                </div>
                                <button
                                  onClick={() => handleReflection(d)}
                                  className="w-full py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all"
                                >
                                  Marcar como lido (+{d.xp_reward} XP)
                                </button>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* GRATITUDE */}
          <div className="col-span-12 lg:col-span-5 space-y-6">
            <div className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg">
              <div className="flex items-center gap-3 mb-4">
                <Heart className="w-6 h-6 text-violet-500" />
                <h2 className="text-xl font-bold text-violet-950">Diário de gratidão</h2>
              </div>
              <p className="text-sm text-gray-500 mb-5">
                3 coisas hoje. Sem repetir as últimas. Veja como sua mente se transforma.
              </p>

              <div className="space-y-3 mb-4">
                {[
                  { label: '1', value: item1, setter: setItem1, placeholder: 'Algo simples, concreto, específico...' },
                  { label: '2', value: item2, setter: setItem2, placeholder: 'Pode ser uma pessoa, momento, sentimento...' },
                  { label: '3', value: item3, setter: setItem3, placeholder: 'O que você notou que poderia ter perdido?' },
                ].map((row) => (
                  <div key={row.label} className="flex gap-3">
                    <div className="w-10 h-10 rounded-xl bg-violet-100 flex items-center justify-center flex-shrink-0">
                      <span className="text-violet-700 font-bold">{row.label}</span>
                    </div>
                    <input
                      type="text"
                      value={row.value}
                      onChange={(e) => !gratitudeSubmitted && row.setter(e.target.value)}
                      disabled={gratitudeSubmitted}
                      placeholder={row.placeholder}
                      className="flex-1 px-4 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 placeholder:text-gray-400 disabled:bg-violet-50/50"
                    />
                  </div>
                ))}
              </div>

              <textarea
                value={gratitudeReflection}
                onChange={(e) => !gratitudeSubmitted && setGratitudeReflection(e.target.value)}
                disabled={gratitudeSubmitted}
                rows={2}
                placeholder="Reflexão opcional..."
                className="w-full p-3 rounded-xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-sm text-violet-950 mb-4 disabled:bg-violet-50/50"
              />

              {gratitudeSubmitted ? (
                <button
                  onClick={() => setGratitudeSubmitted(false)}
                  className="w-full py-3 bg-violet-100 text-violet-700 font-bold rounded-2xl hover:bg-violet-200 transition-all"
                >
                  Editar gratidão de hoje
                </button>
              ) : (
                <button
                  onClick={handleGratitudeSubmit}
                  disabled={!item1.trim()}
                  className="w-full py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Heart className="w-5 h-5" /> Registrar (+15 XP)
                </button>
              )}
            </div>

            <div className="relative overflow-hidden bg-violet-500 rounded-3xl p-6 shadow-lg shadow-violet-500/20">
              <div className="absolute -right-10 -top-10 w-32 h-32 bg-white/10 rounded-full blur-2xl" />
              <div className="relative">
                <Sparkles className="w-7 h-7 text-yellow-300 mb-3" />
                <h3 className="text-lg font-bold text-white mb-2">Por que gratidão funciona</h3>
                <p className="text-sm text-white/85">
                  Não é placebo. Ressonância magnética mostra mudança no córtex pré-frontal medial
                  em 8 semanas de prática diária. Sua mente literalmente refaz o caminho neural
                  do viés de ameaça pro viés de abundância.
                </p>
              </div>
            </div>

            {gratitudeHistory.length > 0 && (
              <div className="bg-white rounded-3xl p-6 border border-violet-100 shadow-lg">
                <h3 className="text-lg font-bold text-violet-950 mb-3">Últimos registros</h3>
                <div className="space-y-3">
                  {gratitudeHistory.slice(0, 4).map((g) => (
                    <div key={g.id} className="p-3 bg-violet-50 rounded-xl">
                      <p className="text-xs font-bold text-violet-700 mb-1">
                        {new Date(g.entry_date).toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'short' })}
                      </p>
                      <p className="text-sm text-violet-950 line-clamp-2">{g.item_1}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
