import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export type HealthPillar =
  | 'fisica' | 'mental' | 'espiritual' | 'familiar'
  | 'financeira' | 'intelectual' | 'profissional' | 'social';

export interface Course {
  id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  title_es: string;
  description_pt: string | null;
  health_pillar: HealthPillar;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  cover_color: string;
  estimated_minutes: number;
  total_xp_reward: number;
  is_published: boolean;
  display_order: number;
}

export interface CourseModule {
  id: string;
  course_id: string;
  title_pt: string;
  title_en: string;
  description_pt: string | null;
  display_order: number;
}

export interface CourseLesson {
  id: string;
  module_id: string;
  course_id: string;
  slug: string;
  title_pt: string;
  title_en: string;
  lesson_type: 'article' | 'video' | 'audio' | 'quiz' | 'reflection';
  content_pt: string | null;
  video_url: string | null;
  audio_url: string | null;
  quiz_data: { questions: QuizQuestion[] } | null;
  estimated_minutes: number;
  xp_reward: number;
  display_order: number;
}

export interface QuizQuestion {
  id: number;
  question_pt: string;
  options_pt: string[];
  correct_index: number;
  explanation_pt: string;
}

export interface UserCourseProgress {
  user_id: string;
  course_id: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'paused';
  lessons_completed: number;
  total_lessons: number;
  progress_pct: number;
  xp_earned: number;
  started_at: string | null;
  completed_at: string | null;
  last_lesson_id: string | null;
}

export interface UserLessonProgress {
  user_id: string;
  lesson_id: string;
  course_id: string;
  is_completed: boolean;
  quiz_score: number | null;
  reflection_text: string | null;
  completed_at: string | null;
}

export interface CourseWithProgress extends Course {
  progress?: UserCourseProgress;
}

export function useCourses() {
  const { user } = useAuth();
  const [courses, setCourses] = useState<CourseWithProgress[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);

    const { data: list } = await supabase
      .from('courses')
      .select('*')
      .eq('is_published', true)
      .order('display_order', { ascending: true });

    if (!list) {
      setCourses([]);
      setLoading(false);
      return;
    }

    if (!user?.id) {
      setCourses(list);
      setLoading(false);
      return;
    }

    const { data: progress } = await supabase
      .from('user_course_progress')
      .select('*')
      .eq('user_id', user.id);

    const progressMap = new Map<string, UserCourseProgress>();
    (progress ?? []).forEach((p) => progressMap.set(p.course_id, p));

    setCourses(
      list.map((c) => ({
        ...c,
        progress: progressMap.get(c.id),
      }))
    );
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return { courses, loading, refetch: fetchCourses };
}

export function useCourseDetail(courseId: string | undefined) {
  const { user } = useAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [lessons, setLessons] = useState<CourseLesson[]>([]);
  const [progress, setProgress] = useState<UserCourseProgress | null>(null);
  const [lessonProgress, setLessonProgress] = useState<Map<string, UserLessonProgress>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!courseId) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const [
      { data: c },
      { data: ms },
      { data: ls },
    ] = await Promise.all([
      supabase.from('courses').select('*').eq('id', courseId).maybeSingle(),
      supabase.from('course_modules').select('*').eq('course_id', courseId).order('display_order'),
      supabase.from('course_lessons').select('*').eq('course_id', courseId).order('display_order'),
    ]);

    setCourse(c);
    setModules(ms ?? []);
    setLessons((ls ?? []) as CourseLesson[]);

    if (user?.id) {
      const { data: p } = await supabase
        .from('user_course_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId)
        .maybeSingle();
      setProgress(p);

      const { data: lp } = await supabase
        .from('user_lesson_progress')
        .select('*')
        .eq('user_id', user.id)
        .eq('course_id', courseId);

      const map = new Map<string, UserLessonProgress>();
      (lp ?? []).forEach((row) => map.set(row.lesson_id, row));
      setLessonProgress(map);
    }
    setLoading(false);
  }, [courseId, user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  return { course, modules, lessons, progress, lessonProgress, loading, refetch: fetchAll };
}

export async function completeLesson(
  userId: string,
  lessonId: string,
  quizScore?: number,
  reflection?: string
) {
  const { data, error } = await supabase.rpc('complete_lesson', {
    p_user_id: userId,
    p_lesson_id: lessonId,
    p_quiz_score: quizScore ?? null,
    p_reflection: reflection ?? null,
  });
  if (error) throw error;
  return data?.[0] as
    | { xp_earned: number; course_completed: boolean; new_progress_pct: number }
    | undefined;
}
