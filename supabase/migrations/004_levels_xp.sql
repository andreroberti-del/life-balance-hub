-- M7 Life Balance: Sistema de Levels + XP Events
-- 2026-05-20 - Overnight build COO

-- 1. Definições de níveis (5 levels Duolingo-style)
CREATE TABLE public.level_definitions (
  level INTEGER PRIMARY KEY,
  name_en TEXT NOT NULL,
  name_pt TEXT NOT NULL,
  name_es TEXT NOT NULL,
  min_xp INTEGER NOT NULL,
  max_xp INTEGER NOT NULL,
  badge_color TEXT NOT NULL DEFAULT '#668DFF',
  description_en TEXT,
  description_pt TEXT,
  description_es TEXT,
  perks JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Estado atual do usuário (level + XP)
CREATE TABLE public.user_levels (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_level INTEGER NOT NULL DEFAULT 1 REFERENCES level_definitions(level),
  total_xp INTEGER NOT NULL DEFAULT 0,
  xp_to_next_level INTEGER NOT NULL DEFAULT 500,
  level_up_count INTEGER NOT NULL DEFAULT 0,
  last_xp_event_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Log de eventos XP (audit trail)
CREATE TABLE public.xp_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  reason_code TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_xp_events_user_created ON xp_events(user_id, created_at DESC);
CREATE INDEX idx_xp_events_reason_code ON xp_events(reason_code);

-- 4. Function: adicionar XP e fazer level up automático
CREATE OR REPLACE FUNCTION public.add_xp(
  p_user_id UUID,
  p_amount INTEGER,
  p_reason TEXT,
  p_reason_code TEXT,
  p_metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS TABLE(
  new_total_xp INTEGER,
  new_level INTEGER,
  leveled_up BOOLEAN,
  level_name_pt TEXT
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_current_xp INTEGER;
  v_current_level INTEGER;
  v_new_xp INTEGER;
  v_new_level INTEGER;
  v_leveled_up BOOLEAN := FALSE;
  v_level_name TEXT;
  v_next_min INTEGER;
BEGIN
  INSERT INTO xp_events (user_id, amount, reason, reason_code, metadata)
  VALUES (p_user_id, p_amount, p_reason, p_reason_code, p_metadata);

  INSERT INTO user_levels (user_id, total_xp, last_xp_event_at)
  VALUES (p_user_id, p_amount, NOW())
  ON CONFLICT (user_id) DO UPDATE SET
    total_xp = user_levels.total_xp + p_amount,
    last_xp_event_at = NOW(),
    updated_at = NOW();

  SELECT total_xp, current_level INTO v_new_xp, v_current_level
  FROM user_levels WHERE user_id = p_user_id;

  SELECT level INTO v_new_level
  FROM level_definitions
  WHERE v_new_xp >= min_xp AND v_new_xp <= max_xp
  ORDER BY level DESC
  LIMIT 1;

  IF v_new_level > v_current_level THEN
    v_leveled_up := TRUE;
    UPDATE user_levels SET
      current_level = v_new_level,
      level_up_count = level_up_count + (v_new_level - v_current_level),
      updated_at = NOW()
    WHERE user_id = p_user_id;
  END IF;

  SELECT name_pt, min_xp INTO v_level_name, v_next_min
  FROM level_definitions WHERE level = COALESCE(v_new_level, v_current_level) + 1;

  IF v_next_min IS NULL THEN
    v_next_min := v_new_xp;
  END IF;

  UPDATE user_levels SET xp_to_next_level = GREATEST(v_next_min - v_new_xp, 0)
  WHERE user_id = p_user_id;

  RETURN QUERY SELECT
    v_new_xp,
    COALESCE(v_new_level, v_current_level),
    v_leveled_up,
    v_level_name;
END;
$$;

-- 5. Trigger: auto-criar user_levels quando profile é criado
CREATE OR REPLACE FUNCTION public.handle_new_user_level()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_levels (user_id) VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_level
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_level();

-- 6. RLS
ALTER TABLE level_definitions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;
ALTER TABLE xp_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read level definitions"
  ON level_definitions FOR SELECT USING (true);

CREATE POLICY "Users can view own level"
  ON user_levels FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can view own XP events"
  ON xp_events FOR SELECT USING (auth.uid() = user_id);

-- 7. Grant para function ser chamada pelo cliente autenticado
GRANT EXECUTE ON FUNCTION public.add_xp(UUID, INTEGER, TEXT, TEXT, JSONB) TO authenticated;
