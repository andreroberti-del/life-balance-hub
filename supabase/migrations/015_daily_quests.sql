-- M7 Life Balance: Daily Quests (gamification Duolingo-style)
-- 2026-05-21 - Sprint Duolingo

-- 1. Tipos de quest que existem no sistema
CREATE TABLE public.quest_templates (
  code TEXT PRIMARY KEY,
  title_pt TEXT NOT NULL,
  description_pt TEXT NOT NULL,
  icon_name TEXT NOT NULL,
  xp_reward INTEGER NOT NULL DEFAULT 10,
  category TEXT NOT NULL,
  CHECK (category IN ('body', 'mind', 'spirit', 'social', 'learn'))
);

INSERT INTO quest_templates (code, title_pt, description_pt, icon_name, xp_reward, category) VALUES
  ('emotional_checkin', 'Check-in emocional', 'Registre seu humor de hoje em /mind', 'Brain', 10, 'mind'),
  ('breathing_session', '1 sessão de respiração', 'Conclua uma técnica de respiração guiada', 'Wind', 10, 'mind'),
  ('gratitude_entry', 'Diário de gratidão', '3 coisas pelas quais você é grato hoje', 'Heart', 10, 'spirit'),
  ('devotional_read', 'Leia 1 devocional', 'Reflexão espiritual de 5 minutos', 'BookOpen', 15, 'spirit'),
  ('lesson_complete', 'Conclua 1 lição', 'M7 Academy: uma lição rápida', 'GraduationCap', 15, 'learn'),
  ('omega_taken', 'Tomei meu ômega 3', 'Marque seu suplemento de hoje', 'Pill', 10, 'body'),
  ('water_goal', 'Meta de água', 'Beba 2.5L hoje', 'Droplet', 10, 'body'),
  ('movement', 'Movimento do dia', 'Caminhada, treino ou sessão ativa', 'Activity', 15, 'body');

-- 2. Daily quests (3 por dia por usuário, escolhidos aleatoriamente)
CREATE TABLE public.user_daily_quests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  quest_date DATE NOT NULL DEFAULT CURRENT_DATE,
  quest_code TEXT NOT NULL REFERENCES quest_templates(code),
  is_completed BOOLEAN NOT NULL DEFAULT FALSE,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE (user_id, quest_date, quest_code)
);

CREATE INDEX idx_user_daily_quests_lookup ON user_daily_quests(user_id, quest_date, is_completed);

-- 3. Function: garantir que o usuário tem 3 quests pra hoje
CREATE OR REPLACE FUNCTION public.ensure_daily_quests(p_user_id UUID)
RETURNS TABLE(
  quest_code TEXT,
  title_pt TEXT,
  description_pt TEXT,
  icon_name TEXT,
  xp_reward INTEGER,
  category TEXT,
  is_completed BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_count INTEGER;
BEGIN
  SELECT COUNT(*) INTO v_count
  FROM user_daily_quests
  WHERE user_id = p_user_id AND quest_date = v_today;

  IF v_count < 3 THEN
    INSERT INTO user_daily_quests (user_id, quest_date, quest_code)
    SELECT p_user_id, v_today, code
    FROM quest_templates
    WHERE code NOT IN (
      SELECT quest_code FROM user_daily_quests WHERE user_id = p_user_id AND quest_date = v_today
    )
    ORDER BY random()
    LIMIT (3 - v_count)
    ON CONFLICT DO NOTHING;
  END IF;

  RETURN QUERY
  SELECT
    udq.quest_code,
    qt.title_pt,
    qt.description_pt,
    qt.icon_name,
    qt.xp_reward,
    qt.category,
    udq.is_completed
  FROM user_daily_quests udq
  INNER JOIN quest_templates qt ON qt.code = udq.quest_code
  WHERE udq.user_id = p_user_id AND udq.quest_date = v_today
  ORDER BY udq.created_at;
END;
$$;

-- 4. Function: completar uma quest (idempotente, dá XP, e se for a 3a do dia, bonus)
CREATE OR REPLACE FUNCTION public.complete_daily_quest(p_user_id UUID, p_quest_code TEXT)
RETURNS TABLE(
  xp_gained INTEGER,
  daily_complete BOOLEAN,
  bonus_xp INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_today DATE := CURRENT_DATE;
  v_was_completed BOOLEAN;
  v_quest_xp INTEGER;
  v_quest_title TEXT;
  v_total_today INTEGER;
  v_completed_today INTEGER;
  v_bonus INTEGER := 0;
  v_daily_done BOOLEAN := FALSE;
BEGIN
  -- Lookup current state
  SELECT udq.is_completed, qt.xp_reward, qt.title_pt
  INTO v_was_completed, v_quest_xp, v_quest_title
  FROM user_daily_quests udq
  INNER JOIN quest_templates qt ON qt.code = udq.quest_code
  WHERE udq.user_id = p_user_id AND udq.quest_date = v_today AND udq.quest_code = p_quest_code;

  IF v_quest_xp IS NULL THEN
    RETURN QUERY SELECT 0, FALSE, 0;
    RETURN;
  END IF;

  IF v_was_completed THEN
    RETURN QUERY SELECT 0, FALSE, 0;
    RETURN;
  END IF;

  -- Mark as completed
  UPDATE user_daily_quests
  SET is_completed = TRUE, completed_at = NOW()
  WHERE user_id = p_user_id AND quest_date = v_today AND quest_code = p_quest_code;

  -- Award XP for the quest
  PERFORM add_xp(p_user_id, v_quest_xp, 'Quest diária: ' || v_quest_title, 'daily_quest', jsonb_build_object('quest_code', p_quest_code));

  -- Check if all 3 done today
  SELECT COUNT(*), COUNT(*) FILTER (WHERE is_completed)
  INTO v_total_today, v_completed_today
  FROM user_daily_quests
  WHERE user_id = p_user_id AND quest_date = v_today;

  IF v_total_today >= 3 AND v_completed_today >= 3 THEN
    v_daily_done := TRUE;
    -- Check if bonus already awarded
    IF NOT EXISTS (
      SELECT 1 FROM xp_events
      WHERE user_id = p_user_id
        AND reason_code = 'daily_quest_bonus'
        AND created_at::DATE = v_today
    ) THEN
      v_bonus := 30;
      PERFORM add_xp(p_user_id, 30, 'Bonus: completou todas quests do dia', 'daily_quest_bonus', '{}'::jsonb);
    END IF;
  END IF;

  RETURN QUERY SELECT v_quest_xp, v_daily_done, v_bonus;
END;
$$;

-- 5. RLS
ALTER TABLE quest_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_daily_quests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone reads quest templates" ON quest_templates FOR SELECT USING (TRUE);
CREATE POLICY "Users see own daily quests" ON user_daily_quests FOR SELECT USING (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.ensure_daily_quests(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.complete_daily_quest(UUID, TEXT) TO authenticated;
