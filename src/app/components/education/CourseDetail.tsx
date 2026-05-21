import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, GraduationCap, Clock, Zap, CheckCircle, PlayCircle, Circle, BookOpen, FileText, Brain, Mic } from 'lucide-react';
import { useCourseDetail } from '../../hooks/useEducation';

const iconForType: Record<string, typeof BookOpen> = {
  article: FileText,
  video: PlayCircle,
  quiz: Brain,
  reflection: BookOpen,
  audio: Mic,
};

export function CourseDetail() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { course, modules, lessons, progress, lessonProgress, loading } = useCourseDetail(courseId);

  if (loading) {
    return <div className="min-h-screen bg-violet-50 flex items-center justify-center text-gray-500">Carregando...</div>;
  }
  if (!course) {
    return <div className="min-h-screen bg-violet-50 flex items-center justify-center text-gray-500">Curso não encontrado</div>;
  }

  const totalLessons = lessons.length;
  const doneLessons = lessons.filter((l) => lessonProgress.get(l.id)?.is_completed).length;
  const progressPct = totalLessons === 0 ? 0 : Math.round((doneLessons / totalLessons) * 100);

  const nextLesson = lessons.find((l) => !lessonProgress.get(l.id)?.is_completed) ?? lessons[0];

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10 py-8 md:py-10">

        <button
          onClick={() => navigate('/education')}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para trilhas
        </button>

        {/* HERO */}
        <motion.div
          initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-3xl p-8 md:p-10 mb-8 shadow-xl"
          style={{ background: course.cover_color, boxShadow: `0 20px 40px ${course.cover_color}30` }}
        >
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-white/10 rounded-full blur-3xl" />

          <div className="relative">
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-white/80" />
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Trilha</span>
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider">·</span>
              <span className="text-xs text-white/80 font-bold uppercase tracking-wider">Saúde {course.health_pillar}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-3 max-w-3xl">{course.title_pt}</h1>
            <p className="text-white/85 text-base max-w-2xl mb-6">{course.description_pt}</p>

            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm">
                <Clock className="w-4 h-4" />
                <span className="font-semibold">{course.estimated_minutes} min</span>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm">
                <Zap className="w-4 h-4 text-yellow-300" />
                <span className="font-semibold">+{course.total_xp_reward} XP total</span>
              </div>
              <div className="bg-white/20 backdrop-blur rounded-full px-4 py-2 flex items-center gap-2 text-white text-sm">
                <BookOpen className="w-4 h-4" />
                <span className="font-semibold">{totalLessons} lições</span>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="flex-1 max-w-[400px]">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-white/80 uppercase tracking-wider">Seu progresso</span>
                  <span className="text-xs font-bold text-white">{progressPct}%</span>
                </div>
                <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }} animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 1, delay: 0.3 }}
                    className="h-full bg-yellow-300 rounded-full"
                  />
                </div>
              </div>
              {nextLesson && (
                <button
                  onClick={() => navigate(`/education/lesson/${nextLesson.id}`)}
                  className="bg-white text-violet-700 px-6 py-3.5 rounded-2xl font-bold hover:scale-105 transition-all shadow-lg flex items-center gap-2"
                >
                  {progress?.status === 'in_progress' ? 'Continuar' : 'Começar'}
                  <PlayCircle className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Modules + Lessons */}
        <div className="space-y-6">
          {modules.map((m, mi) => {
            const moduleLessons = lessons.filter((l) => l.module_id === m.id);
            const moduleDone = moduleLessons.filter((l) => lessonProgress.get(l.id)?.is_completed).length;
            return (
              <motion.div
                key={m.id}
                initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + mi * 0.08, duration: 0.4 }}
                className="bg-white rounded-3xl p-7 border border-violet-100 shadow-lg"
              >
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-violet-500 mb-1">
                      Módulo {mi + 1}
                    </p>
                    <h3 className="text-xl font-bold text-violet-950">{m.title_pt}</h3>
                    {m.description_pt && <p className="text-sm text-gray-500 mt-1">{m.description_pt}</p>}
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-violet-700">{moduleDone}/{moduleLessons.length}</p>
                    <p className="text-xs text-gray-500">lições</p>
                  </div>
                </div>

                <div className="space-y-2">
                  {moduleLessons.map((l) => {
                    const isDone = lessonProgress.get(l.id)?.is_completed;
                    const Icon = iconForType[l.lesson_type] ?? FileText;
                    return (
                      <motion.button
                        key={l.id}
                        whileHover={{ x: 4 }}
                        onClick={() => navigate(`/education/lesson/${l.id}`)}
                        className={`w-full text-left flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                          isDone ? 'bg-emerald-50 hover:bg-emerald-100' : 'bg-violet-50 hover:bg-violet-100'
                        }`}
                      >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isDone ? 'bg-emerald-500 text-white' : 'bg-violet-500 text-white'
                        }`}>
                          {isDone ? <CheckCircle className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-violet-950 truncate">{l.title_pt}</p>
                          <div className="flex items-center gap-3 mt-1 text-xs text-gray-500">
                            <span className="capitalize font-semibold">{l.lesson_type}</span>
                            <span>·</span>
                            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {l.estimated_minutes} min</span>
                            <span>·</span>
                            <span className="flex items-center gap-1 text-yellow-600"><Zap className="w-3 h-3" /> +{l.xp_reward} XP</span>
                          </div>
                        </div>
                        {isDone ? (
                          <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-violet-300 flex-shrink-0" />
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
