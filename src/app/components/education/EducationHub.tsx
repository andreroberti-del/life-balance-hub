import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { GraduationCap, Clock, Zap, Sparkles, ChevronRight, CheckCircle, PlayCircle, Lock } from 'lucide-react';
import { useCourses } from '../../hooks/useEducation';
import { useLevels } from '../../hooks/useLevels';

const pillarLabel: Record<string, { pt: string; color: string }> = {
  fisica: { pt: 'Física', color: 'bg-emerald-100 text-emerald-700' },
  mental: { pt: 'Mental', color: 'bg-violet-100 text-violet-700' },
  espiritual: { pt: 'Espiritual', color: 'bg-amber-100 text-amber-700' },
  familiar: { pt: 'Familiar', color: 'bg-rose-100 text-rose-700' },
  financeira: { pt: 'Financeira', color: 'bg-blue-100 text-blue-700' },
  intelectual: { pt: 'Intelectual', color: 'bg-indigo-100 text-indigo-700' },
  profissional: { pt: 'Profissional', color: 'bg-slate-100 text-slate-700' },
  social: { pt: 'Social', color: 'bg-pink-100 text-pink-700' },
};

const entry = (i: number) => ({
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: i * 0.06, duration: 0.4, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

export function EducationHub() {
  const { courses, loading } = useCourses();
  const { current, userLevel, progressPct } = useLevels();
  const navigate = useNavigate();

  const inProgress = courses.find((c) => c.progress?.status === 'in_progress');

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
          <div className="absolute -left-10 -bottom-20 w-56 h-56 bg-violet-300/30 rounded-full blur-3xl" />

          <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-white/80" />
                <p className="text-white/80 text-sm font-medium uppercase tracking-wider">M7 Academy</p>
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-3">
                Aprenda. Aplique. Evolua.
              </h1>
              <p className="text-white/85 text-base max-w-xl">
                Cursos curtos, mensuráveis e baseados em ciência. Cada lição completada vira XP no seu nível.
              </p>
            </div>

            {current && (
              <div className="bg-white/15 backdrop-blur rounded-2xl px-6 py-5 border border-white/20 min-w-[240px]">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Seu nível</span>
                </div>
                <div className="text-2xl font-bold text-white mb-1">{current.name_pt}</div>
                <div className="text-xs text-white/70 mb-3">{userLevel?.total_xp ?? 0} XP total</div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-yellow-300 rounded-full"
                  />
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* Continue learning */}
        {inProgress && (
          <motion.button
            {...entry(0)}
            whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.99 }}
            onClick={() => navigate(`/education/${inProgress.id}`)}
            className="w-full text-left bg-white rounded-3xl p-6 md:p-7 border border-violet-100 shadow-lg mb-8 group hover:shadow-xl transition-shadow"
          >
            <div className="flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: inProgress.cover_color }}>
                <PlayCircle className="w-8 h-8 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">Continue de onde parou</p>
                <h3 className="text-xl font-bold text-violet-950 mb-2 truncate">{inProgress.title_pt}</h3>
                <div className="flex items-center gap-3">
                  <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden max-w-[280px]">
                    <div className="h-full bg-violet-500 rounded-full" style={{ width: `${inProgress.progress?.progress_pct ?? 0}%` }} />
                  </div>
                  <span className="text-sm font-bold text-violet-700">{inProgress.progress?.progress_pct ?? 0}%</span>
                </div>
              </div>
              <ChevronRight className="w-6 h-6 text-violet-500 group-hover:translate-x-1 transition-transform" />
            </div>
          </motion.button>
        )}

        {/* All courses */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-violet-950 mb-2">Todas as trilhas</h2>
          <p className="text-sm text-gray-500">Cursos por dimensão de saúde Mind7</p>
        </div>

        {loading ? (
          <div className="text-center py-12 text-gray-500">Carregando trilhas...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((c, i) => {
              const pillar = pillarLabel[c.health_pillar] ?? pillarLabel.fisica;
              const isCompleted = c.progress?.status === 'completed';
              const inProgressFlag = c.progress?.status === 'in_progress';
              return (
                <button
                  key={c.id}
                  onClick={() => navigate(`/education/${c.id}`)}
                  className="text-left bg-white rounded-3xl p-7 border border-violet-100 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-start justify-between mb-5">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: c.cover_color }}>
                      <GraduationCap className="w-7 h-7 text-white" strokeWidth={2} />
                    </div>
                    {isCompleted && (
                      <div className="flex items-center gap-1 px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-xs font-bold">
                        <CheckCircle className="w-3 h-3" /> Concluído
                      </div>
                    )}
                    {inProgressFlag && (
                      <div className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold">
                        Em andamento
                      </div>
                    )}
                  </div>

                  <span className={`inline-block text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-3 ${pillar.color}`}>
                    Saúde {pillar.pt}
                  </span>

                  <h3 className="text-lg font-bold text-violet-950 mb-2 leading-tight">{c.title_pt}</h3>
                  <p className="text-sm text-gray-500 mb-5 line-clamp-3">{c.description_pt}</p>

                  <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 pb-4 border-b border-violet-100">
                    <div className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      <span className="font-semibold">{c.estimated_minutes} min</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-yellow-500" />
                      <span className="font-semibold">+{c.total_xp_reward} XP</span>
                    </div>
                  </div>

                  {c.progress ? (
                    <div className="flex items-center gap-3">
                      <div className="flex-1 h-2 bg-violet-100 rounded-full overflow-hidden">
                        <div className="h-full bg-violet-500 rounded-full" style={{ width: `${c.progress.progress_pct}%` }} />
                      </div>
                      <span className="text-xs font-bold text-violet-700">{c.progress.progress_pct}%</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-violet-500 font-bold">Começar agora</span>
                      <ChevronRight className="w-5 h-5 text-violet-500" />
                    </div>
                  )}
                </button>
              );
            })}
            {/* Locked future courses placeholders */}
            {[1, 2, 3, 4].map((i) => (
              <div
                key={`locked-${i}`}
                className="bg-violet-50 rounded-3xl p-7 border-2 border-dashed border-violet-200 flex flex-col items-center justify-center text-center min-h-[280px]"
              >
                <div className="w-14 h-14 rounded-2xl bg-violet-100 flex items-center justify-center mb-3">
                  <Lock className="w-7 h-7 text-violet-300" />
                </div>
                <p className="text-sm font-bold text-violet-700 mb-1">Trilha em breve</p>
                <p className="text-xs text-gray-500">Outras 6 saúdes Mind7 chegando</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
