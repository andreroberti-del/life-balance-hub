-- M7 Life Balance: AI usage tracking + quota limits
-- 2026-05-21
-- Garante que o app NUNCA estoura free tier do Gemini

CREATE TABLE public.ai_usage_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  function_name TEXT NOT NULL,
  provider TEXT NOT NULL,
  model_used TEXT NOT NULL,
  input_tokens INTEGER,
  output_tokens INTEGER,
  success BOOLEAN NOT NULL DEFAULT TRUE,
  error_message TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (provider IN ('gemini', 'anthropic'))
);

CREATE INDEX idx_ai_usage_date ON ai_usage_log(created_at DESC);
CREATE INDEX idx_ai_usage_user_date ON ai_usage_log(user_id, created_at DESC);
CREATE INDEX idx_ai_usage_function_date ON ai_usage_log(function_name, created_at DESC);

-- Quota config (1 row, configurável via UPDATE)
CREATE TABLE public.ai_quota_config (
  id INTEGER PRIMARY KEY DEFAULT 1,
  daily_total_limit INTEGER NOT NULL DEFAULT 1000,
  daily_per_user_limit INTEGER NOT NULL DEFAULT 50,
  per_function_daily_limit JSONB NOT NULL DEFAULT '{
    "zeno-coach": 500,
    "generate-workout-plan": 50,
    "scan-food": 200
  }'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (id = 1)
);

INSERT INTO ai_quota_config (id) VALUES (1) ON CONFLICT DO NOTHING;

-- Function: checar se pode fazer chamada AI
CREATE OR REPLACE FUNCTION public.check_ai_quota(p_user_id UUID, p_function_name TEXT)
RETURNS TABLE(
  allowed BOOLEAN,
  reason TEXT,
  total_today INTEGER,
  user_today INTEGER,
  function_today INTEGER,
  daily_limit INTEGER,
  user_limit INTEGER,
  function_limit INTEGER
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_config RECORD;
  v_today DATE := CURRENT_DATE;
  v_total INTEGER;
  v_user INTEGER;
  v_function INTEGER;
  v_function_limit INTEGER;
BEGIN
  SELECT * INTO v_config FROM ai_quota_config WHERE id = 1;

  SELECT COUNT(*)::INTEGER INTO v_total
  FROM ai_usage_log WHERE created_at::DATE = v_today AND success = TRUE;

  SELECT COUNT(*)::INTEGER INTO v_user
  FROM ai_usage_log WHERE user_id = p_user_id AND created_at::DATE = v_today AND success = TRUE;

  SELECT COUNT(*)::INTEGER INTO v_function
  FROM ai_usage_log WHERE function_name = p_function_name AND created_at::DATE = v_today AND success = TRUE;

  v_function_limit := COALESCE((v_config.per_function_daily_limit ->> p_function_name)::INTEGER, 100);

  IF v_total >= v_config.daily_total_limit THEN
    RETURN QUERY SELECT FALSE, 'Limite diário global atingido. Tenta amanhã.'::TEXT,
      v_total, v_user, v_function, v_config.daily_total_limit, v_config.daily_per_user_limit, v_function_limit;
    RETURN;
  END IF;

  IF v_user >= v_config.daily_per_user_limit THEN
    RETURN QUERY SELECT FALSE, 'Você atingiu seu limite diário de chamadas IA.'::TEXT,
      v_total, v_user, v_function, v_config.daily_total_limit, v_config.daily_per_user_limit, v_function_limit;
    RETURN;
  END IF;

  IF v_function >= v_function_limit THEN
    RETURN QUERY SELECT FALSE, 'Limite diário desta função atingido.'::TEXT,
      v_total, v_user, v_function, v_config.daily_total_limit, v_config.daily_per_user_limit, v_function_limit;
    RETURN;
  END IF;

  RETURN QUERY SELECT TRUE, 'OK'::TEXT,
    v_total, v_user, v_function, v_config.daily_total_limit, v_config.daily_per_user_limit, v_function_limit;
END;
$$;

-- Function: registrar uso
CREATE OR REPLACE FUNCTION public.log_ai_usage(
  p_user_id UUID,
  p_function_name TEXT,
  p_provider TEXT,
  p_model_used TEXT,
  p_success BOOLEAN,
  p_error_message TEXT DEFAULT NULL
)
RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_id UUID;
BEGIN
  INSERT INTO ai_usage_log (user_id, function_name, provider, model_used, success, error_message)
  VALUES (p_user_id, p_function_name, p_provider, p_model_used, p_success, p_error_message)
  RETURNING id INTO v_id;
  RETURN v_id;
END;
$$;

-- RLS
ALTER TABLE ai_usage_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_quota_config ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users see own AI usage" ON ai_usage_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Anyone reads quota config" ON ai_quota_config FOR SELECT USING (TRUE);

GRANT EXECUTE ON FUNCTION public.check_ai_quota(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.log_ai_usage(UUID, TEXT, TEXT, TEXT, BOOLEAN, TEXT) TO authenticated;
