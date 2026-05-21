import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, CheckCircle, Zap, Trophy, Sparkles, Brain } from 'lucide-react';
import { supabase } from '../../services/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { completeLesson, CourseLesson, QuizQuestion } from '../../hooks/useEducation';

export function LessonPlayer() {
  const { lessonId } = useParams<{ lessonId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [lesson, setLesson] = useState<CourseLesson | null>(null);
  const [allLessons, setAllLessons] = useState<CourseLesson[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [reflection, setReflection] = useState('');
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [xpResult, setXpResult] = useState<{ xp: number; newLevel?: string } | null>(null);

  useEffect(() => {
    if (!lessonId) return;
    (async () => {
      setLoading(true);
      const { data: l } = await supabase
        .from('course_lessons')
        .select('*')
        .eq('id', lessonId)
        .maybeSingle();

      if (l) {
        setLesson(l as CourseLesson);
        const { data: list } = await supabase
          .from('course_lessons')
          .select('*')
          .eq('course_id', l.course_id)
          .order('display_order', { ascending: true });
        setAllLessons((list ?? []) as CourseLesson[]);

        if (user?.id) {
          const { data: prog } = await supabase
            .from('user_lesson_progress')
            .select('*')
            .eq('user_id', user.id)
            .eq('lesson_id', lessonId)
            .maybeSingle();
          if (prog?.is_completed) {
            setIsDone(true);
            if (prog.reflection_text) setReflection(prog.reflection_text);
          }
        }
      }
      setLoading(false);
    })();
  }, [lessonId, user?.id]);

  if (loading) {
    return <div className="min-h-screen bg-violet-50 flex items-center justify-center text-gray-500">Carregando...</div>;
  }
  if (!lesson) {
    return <div className="min-h-screen bg-violet-50 flex items-center justify-center text-gray-500">Lição não encontrada</div>;
  }

  const currentIdx = allLessons.findIndex((l) => l.id === lesson.id);
  const prevLesson = allLessons[currentIdx - 1];
  const nextLesson = allLessons[currentIdx + 1];

  const handleComplete = async () => {
    if (!user?.id || submitting || isDone) return;
    setSubmitting(true);
    try {
      let quizScore: number | undefined;
      if (lesson.lesson_type === 'quiz' && lesson.quiz_data) {
        const total = lesson.quiz_data.questions.length;
        const correct = lesson.quiz_data.questions.filter(
          (q) => quizAnswers[q.id] === q.correct_index
        ).length;
        quizScore = Math.round((correct / total) * 100);
      }
      const result = await completeLesson(user.id, lesson.id, quizScore, reflection || undefined);
      if (result) {
        setXpResult({ xp: result.xp_earned });
        setIsDone(true);
      }
    } finally {
      setSubmitting(false);
    }
  };

  const goNext = () => {
    if (nextLesson) navigate(`/education/lesson/${nextLesson.id}`);
    else navigate(`/education/${lesson.course_id}`);
  };

  return (
    <div className="min-h-screen bg-violet-50">
      <div className="max-w-[900px] mx-auto px-6 md:px-10 py-8 md:py-10">

        <button
          onClick={() => navigate(`/education/${lesson.course_id}`)}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-violet-700 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" /> Voltar para a trilha
        </button>

        {/* Progress dots */}
        {allLessons.length > 1 && (
          <div className="flex items-center gap-1.5 mb-8">
            {allLessons.map((l, i) => (
              <div
                key={l.id}
                className={`h-2 rounded-full flex-1 ${
                  i < currentIdx ? 'bg-violet-500' :
                  i === currentIdx ? 'bg-violet-500' : 'bg-violet-200'
                }`}
              />
            ))}
          </div>
        )}

        {/* Lesson card */}
        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="bg-white rounded-3xl p-8 md:p-10 border border-violet-100 shadow-lg mb-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-violet-100 text-violet-700 rounded-full text-xs font-bold uppercase tracking-wider">
              {lesson.lesson_type}
            </span>
            <span className="flex items-center gap-1 text-xs text-yellow-600 font-bold">
              <Zap className="w-3 h-3" /> +{lesson.xp_reward} XP
            </span>
          </div>

          <h1 className="text-3xl md:text-4xl font-bold text-violet-950 tracking-tight mb-6">{lesson.title_pt}</h1>

          {/* Content por tipo */}
          {lesson.lesson_type === 'article' && lesson.content_pt && (
            <div className="prose prose-violet max-w-none">
              {lesson.content_pt.split('\n\n').map((para, i) => (
                <p key={i} className="text-gray-700 text-base leading-relaxed mb-4">{para}</p>
              ))}
            </div>
          )}

          {lesson.lesson_type === 'reflection' && (
            <div>
              {lesson.content_pt && (
                <p className="text-gray-700 text-base leading-relaxed mb-6">{lesson.content_pt}</p>
              )}
              <label className="block text-sm font-bold text-violet-950 mb-2">Sua reflexão</label>
              <textarea
                value={reflection}
                onChange={(e) => setReflection(e.target.value)}
                rows={8}
                placeholder="Escreva aqui..."
                className="w-full p-4 rounded-2xl border-2 border-violet-100 focus:border-violet-500 focus:outline-none text-violet-950 placeholder:text-gray-400"
              />
            </div>
          )}

          {lesson.lesson_type === 'video' && lesson.video_url && (
            <div className="aspect-video rounded-2xl overflow-hidden bg-black">
              <iframe src={lesson.video_url} className="w-full h-full" allowFullScreen />
            </div>
          )}

          {lesson.lesson_type === 'quiz' && lesson.quiz_data && (
            <div className="space-y-6">
              <div className="flex items-center gap-3 p-4 bg-violet-50 rounded-2xl">
                <Brain className="w-6 h-6 text-violet-500" />
                <p className="text-sm font-bold text-violet-950">
                  {lesson.quiz_data.questions.length} perguntas. Responda todas para ganhar XP.
                </p>
              </div>
              {lesson.quiz_data.questions.map((q: QuizQuestion, qi) => (
                <div key={q.id} className="bg-violet-50 rounded-2xl p-5 border border-violet-100">
                  <p className="font-bold text-violet-950 mb-4">
                    {qi + 1}. {q.question_pt}
                  </p>
                  <div className="space-y-2">
                    {q.options_pt.map((opt, oi) => {
                      const isSelected = quizAnswers[q.id] === oi;
                      const isCorrect = quizSubmitted && oi === q.correct_index;
                      const isWrong = quizSubmitted && isSelected && oi !== q.correct_index;
                      return (
                        <button
                          key={oi}
                          onClick={() => !quizSubmitted && setQuizAnswers({ ...quizAnswers, [q.id]: oi })}
                          disabled={quizSubmitted}
                          className={`w-full text-left p-3 rounded-xl border-2 transition-all ${
                            isCorrect ? 'border-emerald-500 bg-emerald-50' :
                            isWrong ? 'border-red-500 bg-red-50' :
                            isSelected ? 'border-violet-500 bg-violet-100' :
                            'border-violet-100 bg-white hover:border-violet-300'
                          }`}
                        >
                          <span className="text-sm font-medium text-violet-950">{opt}</span>
                        </button>
                      );
                    })}
                  </div>
                  {quizSubmitted && q.explanation_pt && (
                    <div className="mt-3 p-3 bg-white border border-violet-100 rounded-xl text-sm text-gray-700">
                      <strong className="text-violet-700">Por quê:</strong> {q.explanation_pt}
                    </div>
                  )}
                </div>
              ))}
              {!quizSubmitted && (
                <button
                  onClick={() => setQuizSubmitted(true)}
                  disabled={Object.keys(quizAnswers).length < lesson.quiz_data.questions.length}
                  className="w-full py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Conferir respostas
                </button>
              )}
            </div>
          )}
        </motion.div>

        {/* CTA */}
        {!isDone && (
          <motion.button
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
            onClick={handleComplete}
            disabled={submitting || (lesson.lesson_type === 'quiz' && !quizSubmitted)}
            className="w-full py-4 bg-violet-500 text-white font-bold rounded-2xl shadow-lg shadow-violet-500/20 hover:bg-violet-600 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>Salvando...</>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Marcar como concluída
              </>
            )}
          </motion.button>
        )}

        {/* Success state */}
        <AnimatePresence>
          {isDone && (
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
              className="bg-emerald-50 border-2 border-emerald-200 rounded-3xl p-6 mb-6"
            >
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center flex-shrink-0">
                  <Trophy className="w-7 h-7 text-white" />
                </div>
                <div>
                  <p className="text-lg font-bold text-emerald-900">Lição concluída!</p>
                  {xpResult && (
                    <p className="text-sm text-emerald-700 flex items-center gap-1">
                      <Sparkles className="w-4 h-4 text-yellow-500" /> +{xpResult.xp} XP ganhos
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                {prevLesson && (
                  <button
                    onClick={() => navigate(`/education/lesson/${prevLesson.id}`)}
                    className="flex-1 py-3 bg-white text-violet-700 font-bold rounded-2xl border-2 border-violet-200 hover:border-violet-300 transition-all flex items-center justify-center gap-2"
                  >
                    <ArrowLeft className="w-4 h-4" /> Anterior
                  </button>
                )}
                <button
                  onClick={goNext}
                  className="flex-1 py-3 bg-violet-500 text-white font-bold rounded-2xl hover:bg-violet-600 transition-all flex items-center justify-center gap-2"
                >
                  {nextLesson ? 'Próxima lição' : 'Voltar à trilha'} <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
