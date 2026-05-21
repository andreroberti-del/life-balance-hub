-- M7 Life Balance: Planos de treino gerados por IA
-- 2026-05-21

CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  objective TEXT NOT NULL,
  current_weight NUMERIC(5,1),
  current_body_fat NUMERIC(4,1),
  target_weight NUMERIC(5,1),
  target_body_fat NUMERIC(4,1),
  deadline_days INTEGER,
  workouts_per_week INTEGER NOT NULL DEFAULT 3,
  experience_level TEXT NOT NULL DEFAULT 'beginner',
  equipment TEXT NOT NULL DEFAULT 'gym',
  plan_json JSONB NOT NULL,
  generated_by TEXT NOT NULL DEFAULT 'ai',
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (experience_level IN ('beginner','intermediate','advanced')),
  CHECK (equipment IN ('gym','home','outdoor','hybrid'))
);

CREATE INDEX idx_workout_plans_user_active ON workout_plans(user_id, is_active) WHERE is_active = TRUE;

ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own workout plans"
  ON workout_plans FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
