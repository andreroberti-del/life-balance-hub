import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface WorkoutExercise {
  name_pt: string;
  sets: number;
  reps: string;
  rest_seconds: number;
  suggested_weight_pt: string;
  how_to_pt: string;
  muscle_groups: string[];
}

export interface WorkoutDay {
  day_of_week: string;
  name_pt: string;
  focus_pt: string;
  duration_minutes: number;
  estimated_calories: number;
  exercises: WorkoutExercise[];
}

export interface WorkoutPlanJson {
  name_pt: string;
  weekly_summary_pt: string;
  weekly_calorie_target: number;
  days: WorkoutDay[];
  zeno_tip_pt: string;
}

export interface WorkoutPlan {
  id: string;
  user_id: string;
  objective: string;
  current_weight: number | null;
  target_weight: number | null;
  deadline_days: number | null;
  workouts_per_week: number;
  experience_level: string;
  equipment: string;
  plan_json: WorkoutPlanJson;
  generated_by: string;
  is_active: boolean;
  created_at: string;
}

export interface WorkoutSession {
  id: string;
  user_id: string;
  plan_id: string;
  day_of_week: string;
  session_date: string;
  status: 'in_progress' | 'completed' | 'abandoned';
  total_exercises: number;
  completed_exercises: number;
  duration_minutes: number | null;
  shared_to_community: boolean;
  started_at: string;
  completed_at: string | null;
}

export interface WorkoutExerciseLog {
  id: string;
  session_id: string;
  exercise_index: number;
  exercise_name: string;
  planned_sets: number | null;
  planned_reps: string | null;
  actual_sets: number | null;
  actual_reps: string | null;
  weight_used_pt: string | null;
  is_completed: boolean;
  rpe: number | null;
  completed_at: string | null;
}

export function useActiveWorkoutPlan() {
  const { user } = useAuth();
  const [plan, setPlan] = useState<WorkoutPlan | null>(null);
  const [todaySessions, setTodaySessions] = useState<Map<string, WorkoutSession>>(new Map());
  const [loading, setLoading] = useState(true);

  const fetchActive = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const todayDate = new Date().toISOString().split('T')[0];

    const [{ data: p }, { data: sessions }] = await Promise.all([
      supabase
        .from('workout_plans')
        .select('*')
        .eq('user_id', user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .maybeSingle(),
      supabase
        .from('workout_sessions')
        .select('*')
        .eq('user_id', user.id)
        .eq('session_date', todayDate),
    ]);

    setPlan(p as WorkoutPlan | null);

    const sessionMap = new Map<string, WorkoutSession>();
    (sessions ?? []).forEach((s) => {
      sessionMap.set(`${s.plan_id}_${s.day_of_week}`, s as WorkoutSession);
    });
    setTodaySessions(sessionMap);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchActive();
  }, [fetchActive]);

  return { plan, todaySessions, loading, refetch: fetchActive };
}

export function useWorkoutSession(sessionId: string | null) {
  const [session, setSession] = useState<WorkoutSession | null>(null);
  const [exerciseLogs, setExerciseLogs] = useState<WorkoutExerciseLog[]>([]);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    if (!sessionId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    const [{ data: s }, { data: logs }] = await Promise.all([
      supabase.from('workout_sessions').select('*').eq('id', sessionId).maybeSingle(),
      supabase
        .from('workout_exercise_logs')
        .select('*')
        .eq('session_id', sessionId)
        .order('exercise_index'),
    ]);
    setSession(s);
    setExerciseLogs((logs ?? []) as WorkoutExerciseLog[]);
    setLoading(false);
  }, [sessionId]);

  useEffect(() => { fetch(); }, [fetch]);

  return { session, exerciseLogs, loading, refetch: fetch };
}

export async function startSession(userId: string, planId: string, dayOfWeek: string) {
  const { data } = await supabase.rpc('start_workout_session', {
    p_user_id: userId,
    p_plan_id: planId,
    p_day_of_week: dayOfWeek,
  });
  return data?.[0] as
    | { session_id: string; status: string; total_exercises: number; completed_exercises: number }
    | undefined;
}

export async function toggleExercise(
  userId: string,
  sessionId: string,
  exerciseIndex: number,
  options?: { actualSets?: number; actualReps?: string; weightUsed?: string; rpe?: number }
) {
  const { data } = await supabase.rpc('toggle_exercise_log', {
    p_user_id: userId,
    p_session_id: sessionId,
    p_exercise_index: exerciseIndex,
    p_actual_sets: options?.actualSets ?? null,
    p_actual_reps: options?.actualReps ?? null,
    p_weight_used: options?.weightUsed ?? null,
    p_rpe: options?.rpe ?? null,
  });
  return data?.[0] as
    | {
        is_completed: boolean;
        total_done: number;
        total_exercises: number;
        session_completed: boolean;
        xp_awarded: number;
      }
    | undefined;
}

export async function shareWorkoutToCommunity(
  userId: string,
  sessionId: string,
  message?: string
) {
  const { data } = await supabase.rpc('share_workout_to_community', {
    p_user_id: userId,
    p_session_id: sessionId,
    p_message: message ?? null,
  });
  return data?.[0] as { post_id: string | null } | undefined;
}

export async function generateWorkoutPlan(payload: {
  objective: string;
  current_weight?: number;
  current_body_fat?: number;
  target_weight?: number;
  target_body_fat?: number;
  deadline_days?: number;
  workouts_per_week?: number;
  experience_level?: 'beginner' | 'intermediate' | 'advanced';
  equipment?: 'gym' | 'home' | 'outdoor' | 'hybrid';
}) {
  const { data, error } = await supabase.functions.invoke('generate-workout-plan', { body: payload });
  if (error) throw error;
  return data;
}
