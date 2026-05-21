-- M7 Life Balance: Workout sessions (execução real dos planos)
-- 2026-05-21
-- Usuário marca exercícios como feitos → XP + progresso real

CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan_id UUID NOT NULL REFERENCES workout_plans(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL,
  session_date DATE NOT NULL DEFAULT CURRENT_DATE,
  status TEXT NOT NULL DEFAULT 'in_progress',
  total_exercises INTEGER NOT NULL,
  completed_exercises INTEGER NOT NULL DEFAULT 0,
  duration_minutes INTEGER,
  calories_burned INTEGER,
  notes TEXT,
  shared_to_community BOOLEAN DEFAULT FALSE,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  CHECK (status IN ('in_progress', 'completed', 'abandoned')),
  UNIQUE (user_id, plan_id, day_of_week, session_date)
);

CREATE INDEX idx_workout_sessions_user_status ON workout_sessions(user_id, status);
CREATE INDEX idx_workout_sessions_user_date ON workout_sessions(user_id, session_date DESC);

CREATE TABLE public.workout_exercise_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES workout_sessions(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  exercise_index INTEGER NOT NULL,
  exercise_name TEXT NOT NULL,
  planned_sets INTEGER,
  planned_reps TEXT,
  actual_sets INTEGER,
  actual_reps TEXT,
  weight_used_pt TEXT,
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  rpe INTEGER CHECK (rpe BETWEEN 1 AND 10),
  notes TEXT,
  completed_at TIMESTAMPTZ,
  UNIQUE (session_id, exercise_index)
);

CREATE INDEX idx_workout_exercise_logs_session ON workout_exercise_logs(session_id);

-- RPC: começar (ou retomar) uma sessão pra um dia do plano
CREATE OR REPLACE FUNCTION public.start_workout_session(
  p_user_id UUID,
  p_plan_id UUID,
  p_day_of_week TEXT
)
RETURNS TABLE(
  session_id UUID,
  status TEXT,
  total_exercises INTEGER,
  completed_exercises INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_existing_id UUID;
  v_existing_status TEXT;
  v_existing_total INTEGER;
  v_existing_done INTEGER;
  v_new_id UUID;
  v_plan JSONB;
  v_day JSONB;
  v_total INTEGER;
  v_idx INTEGER := 0;
  v_exercise JSONB;
BEGIN
  -- Já existe sessão de hoje pra esse dia do plano?
  SELECT id, status, total_exercises, completed_exercises
  INTO v_existing_id, v_existing_status, v_existing_total, v_existing_done
  FROM workout_sessions
  WHERE user_id = p_user_id
    AND plan_id = p_plan_id
    AND day_of_week = p_day_of_week
    AND session_date = v_today;

  IF v_existing_id IS NOT NULL THEN
    RETURN QUERY SELECT v_existing_id, v_existing_status, v_existing_total, v_existing_done;
    RETURN;
  END IF;

  -- Pega plan JSON e localiza o dia
  SELECT plan_json INTO v_plan FROM workout_plans WHERE id = p_plan_id AND user_id = p_user_id;
  IF v_plan IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 'plan_not_found'::TEXT, 0, 0;
    RETURN;
  END IF;

  SELECT day INTO v_day
  FROM jsonb_array_elements(v_plan -> 'days') day
  WHERE day ->> 'day_of_week' = p_day_of_week;

  IF v_day IS NULL THEN
    RETURN QUERY SELECT NULL::UUID, 'day_not_found'::TEXT, 0, 0;
    RETURN;
  END IF;

  v_total := jsonb_array_length(v_day -> 'exercises');

  -- Cria sessão
  INSERT INTO workout_sessions (user_id, plan_id, day_of_week, total_exercises)
  VALUES (p_user_id, p_plan_id, p_day_of_week, v_total)
  RETURNING id INTO v_new_id;

  -- Cria exercise logs
  FOR v_exercise IN SELECT * FROM jsonb_array_elements(v_day -> 'exercises')
  LOOP
    INSERT INTO workout_exercise_logs (
      session_id, user_id, exercise_index, exercise_name,
      planned_sets, planned_reps
    ) VALUES (
      v_new_id, p_user_id, v_idx,
      v_exercise ->> 'name_pt',
      (v_exercise ->> 'sets')::INTEGER,
      v_exercise ->> 'reps'
    );
    v_idx := v_idx + 1;
  END LOOP;

  RETURN QUERY SELECT v_new_id, 'in_progress'::TEXT, v_total, 0;
END;
$$;

-- RPC: marcar exercício como completo (ou desmarcar)
CREATE OR REPLACE FUNCTION public.toggle_exercise_log(
  p_user_id UUID,
  p_session_id UUID,
  p_exercise_index INTEGER,
  p_actual_sets INTEGER DEFAULT NULL,
  p_actual_reps TEXT DEFAULT NULL,
  p_weight_used TEXT DEFAULT NULL,
  p_rpe INTEGER DEFAULT NULL
)
RETURNS TABLE(
  is_completed BOOLEAN,
  total_done INTEGER,
  total_exercises INTEGER,
  session_completed BOOLEAN,
  xp_awarded INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session RECORD;
  v_was_completed BOOLEAN;
  v_new_completed BOOLEAN;
  v_total_done INTEGER;
  v_total INTEGER;
  v_session_done BOOLEAN := FALSE;
  v_xp INTEGER := 0;
BEGIN
  SELECT * INTO v_session
  FROM workout_sessions
  WHERE id = p_session_id AND user_id = p_user_id;

  IF v_session IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 0, FALSE, 0;
    RETURN;
  END IF;

  SELECT is_completed INTO v_was_completed
  FROM workout_exercise_logs
  WHERE session_id = p_session_id AND exercise_index = p_exercise_index;

  v_new_completed := NOT COALESCE(v_was_completed, FALSE);

  UPDATE workout_exercise_logs
  SET is_completed = v_new_completed,
      actual_sets = COALESCE(p_actual_sets, actual_sets),
      actual_reps = COALESCE(p_actual_reps, actual_reps),
      weight_used_pt = COALESCE(p_weight_used, weight_used_pt),
      rpe = COALESCE(p_rpe, rpe),
      completed_at = CASE WHEN v_new_completed THEN NOW() ELSE NULL END
  WHERE session_id = p_session_id AND exercise_index = p_exercise_index;

  -- Recalcula totais
  SELECT COUNT(*) FILTER (WHERE is_completed), COUNT(*)
  INTO v_total_done, v_total
  FROM workout_exercise_logs
  WHERE session_id = p_session_id;

  UPDATE workout_sessions
  SET completed_exercises = v_total_done,
      status = CASE WHEN v_total_done = v_total THEN 'completed' ELSE 'in_progress' END,
      completed_at = CASE WHEN v_total_done = v_total AND completed_at IS NULL THEN NOW() ELSE completed_at END
  WHERE id = p_session_id;

  -- Se atingiu 100%, dá XP
  IF v_total_done = v_total AND v_session.status != 'completed' THEN
    v_session_done := TRUE;
    v_xp := 25 + (v_total * 5);
    PERFORM add_xp(p_user_id, v_xp, 'Treino concluído: ' || v_session.day_of_week, 'workout_completed',
      jsonb_build_object('session_id', p_session_id, 'exercises', v_total));
  END IF;

  RETURN QUERY SELECT v_new_completed, v_total_done, v_total, v_session_done, v_xp;
END;
$$;

-- RPC: compartilhar conclusão na comunidade
CREATE OR REPLACE FUNCTION public.share_workout_to_community(
  p_user_id UUID,
  p_session_id UUID,
  p_message TEXT DEFAULT NULL
)
RETURNS TABLE(post_id UUID)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_session RECORD;
  v_post_id UUID;
  v_default_msg TEXT;
BEGIN
  SELECT * INTO v_session FROM workout_sessions
  WHERE id = p_session_id AND user_id = p_user_id AND status = 'completed';

  IF v_session IS NULL THEN
    RETURN QUERY SELECT NULL::UUID;
    RETURN;
  END IF;

  v_default_msg := format(
    'Concluí o treino de %s. %s exercícios feitos!',
    v_session.day_of_week,
    v_session.completed_exercises
  );

  INSERT INTO community_posts (user_id, post_type, content, metric_value)
  VALUES (
    p_user_id,
    'achievement',
    COALESCE(p_message, v_default_msg),
    jsonb_build_object(
      'workout_session_id', p_session_id,
      'day_of_week', v_session.day_of_week,
      'exercises_completed', v_session.completed_exercises
    )
  )
  RETURNING id INTO v_post_id;

  UPDATE workout_sessions SET shared_to_community = TRUE WHERE id = p_session_id;

  RETURN QUERY SELECT v_post_id;
END;
$$;

-- RLS
ALTER TABLE workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_exercise_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own workout sessions"
  ON workout_sessions FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users manage own exercise logs"
  ON workout_exercise_logs FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.start_workout_session(UUID, UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.toggle_exercise_log(UUID, UUID, INTEGER, INTEGER, TEXT, TEXT, INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.share_workout_to_community(UUID, UUID, TEXT) TO authenticated;
