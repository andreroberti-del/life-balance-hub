-- M7 Life Balance: Sistema de Referrals (3 níveis)
-- 2026-05-20 - Overnight build COO

-- 1. Códigos de indicação (1 por usuário, formato M7-XXXXXX)
CREATE TABLE public.referral_codes (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  code TEXT NOT NULL UNIQUE,
  uses_count INTEGER NOT NULL DEFAULT 0,
  active_referrals INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_referral_codes_code ON referral_codes(code);

-- 2. Relações de indicação (quem indicou quem)
CREATE TABLE public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  referred_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code_used TEXT NOT NULL,
  level INTEGER NOT NULL DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending',
  is_premium_active BOOLEAN DEFAULT FALSE,
  activated_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(referrer_id, referred_id),
  CHECK (status IN ('pending', 'active', 'inactive', 'churned')),
  CHECK (level BETWEEN 1 AND 3)
);

CREATE INDEX idx_referrals_referrer ON referrals(referrer_id);
CREATE INDEX idx_referrals_referred ON referrals(referred_id);
CREATE INDEX idx_referrals_status ON referrals(status);

-- 3. Histórico de recompensas concedidas
CREATE TABLE public.referral_rewards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  reward_type TEXT NOT NULL,
  reward_value JSONB NOT NULL,
  trigger_count INTEGER NOT NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  expires_at TIMESTAMPTZ,
  is_active BOOLEAN DEFAULT TRUE,
  CHECK (reward_type IN ('free_premium_30d', 'free_premium_permanent', 'xp_bonus', 'level_up', 'commission'))
);

CREATE INDEX idx_referral_rewards_user ON referral_rewards(user_id);

-- 4. Function: gerar código M7-XXXXXX único
CREATE OR REPLACE FUNCTION public.generate_referral_code()
RETURNS TEXT
LANGUAGE plpgsql
AS $$
DECLARE
  v_code TEXT;
  v_exists BOOLEAN;
BEGIN
  LOOP
    v_code := 'M7-' || upper(substring(md5(random()::text || clock_timestamp()::text) from 1 for 6));
    SELECT EXISTS(SELECT 1 FROM referral_codes WHERE code = v_code) INTO v_exists;
    EXIT WHEN NOT v_exists;
  END LOOP;
  RETURN v_code;
END;
$$;

-- 5. Trigger: auto-criar código no signup
CREATE OR REPLACE FUNCTION public.handle_new_user_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO referral_codes (user_id, code)
  VALUES (NEW.id, generate_referral_code())
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_referral_code
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_referral_code();

-- 6. Function: aplicar código de indicação (chamada após signup)
CREATE OR REPLACE FUNCTION public.apply_referral_code(
  p_new_user_id UUID,
  p_code TEXT
)
RETURNS TABLE(
  success BOOLEAN,
  message TEXT,
  referrer_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_id UUID;
  v_already_referred BOOLEAN;
BEGIN
  SELECT user_id INTO v_referrer_id FROM referral_codes WHERE code = upper(p_code);

  IF v_referrer_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 'Código não encontrado', NULL::UUID;
    RETURN;
  END IF;

  IF v_referrer_id = p_new_user_id THEN
    RETURN QUERY SELECT FALSE, 'Você não pode usar seu próprio código', NULL::UUID;
    RETURN;
  END IF;

  SELECT EXISTS(SELECT 1 FROM referrals WHERE referred_id = p_new_user_id) INTO v_already_referred;
  IF v_already_referred THEN
    RETURN QUERY SELECT FALSE, 'Você já foi indicado por alguém', NULL::UUID;
    RETURN;
  END IF;

  INSERT INTO referrals (referrer_id, referred_id, code_used, level, status)
  VALUES (v_referrer_id, p_new_user_id, upper(p_code), 1, 'pending');

  UPDATE referral_codes SET uses_count = uses_count + 1
  WHERE user_id = v_referrer_id;

  PERFORM add_xp(v_referrer_id, 50, 'New referral signup', 'referral_signup',
    jsonb_build_object('referred_id', p_new_user_id, 'code', upper(p_code)));

  RETURN QUERY SELECT TRUE, 'Código aplicado com sucesso', v_referrer_id;
END;
$$;

-- 7. Function: ativar referral (chamada quando user vira Premium)
CREATE OR REPLACE FUNCTION public.activate_referral(p_user_id UUID)
RETURNS TABLE(
  active_count INTEGER,
  reward_granted BOOLEAN
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_referrer_id UUID;
  v_active_count INTEGER;
  v_reward BOOLEAN := FALSE;
BEGIN
  UPDATE referrals SET
    status = 'active',
    is_premium_active = TRUE,
    activated_at = NOW()
  WHERE referred_id = p_user_id
  RETURNING referrer_id INTO v_referrer_id;

  IF v_referrer_id IS NULL THEN
    RETURN QUERY SELECT 0, FALSE;
    RETURN;
  END IF;

  SELECT COUNT(*) INTO v_active_count
  FROM referrals
  WHERE referrer_id = v_referrer_id AND status = 'active';

  UPDATE referral_codes SET active_referrals = v_active_count
  WHERE user_id = v_referrer_id;

  PERFORM add_xp(v_referrer_id, 200, 'Referral became Premium', 'referral_activated',
    jsonb_build_object('referred_id', p_user_id, 'active_count', v_active_count));

  IF v_active_count >= 3 AND NOT EXISTS (
    SELECT 1 FROM referral_rewards
    WHERE user_id = v_referrer_id AND reward_type = 'free_premium_permanent'
  ) THEN
    INSERT INTO referral_rewards (user_id, reward_type, reward_value, trigger_count)
    VALUES (v_referrer_id, 'free_premium_permanent',
      jsonb_build_object('reason', '3 referrals ativos', 'milestone', 3),
      v_active_count);
    v_reward := TRUE;

    PERFORM add_xp(v_referrer_id, 1000, 'Premium grátis permanente', 'reward_premium_perm',
      jsonb_build_object('milestone', 3));
  END IF;

  RETURN QUERY SELECT v_active_count, v_reward;
END;
$$;

-- 8. RLS
ALTER TABLE referral_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE referral_rewards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own code"
  ON referral_codes FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Anyone can lookup code for signup"
  ON referral_codes FOR SELECT USING (true);

CREATE POLICY "Users can view referrals they made"
  ON referrals FOR SELECT USING (auth.uid() = referrer_id OR auth.uid() = referred_id);

CREATE POLICY "Users can view own rewards"
  ON referral_rewards FOR SELECT USING (auth.uid() = user_id);

GRANT EXECUTE ON FUNCTION public.apply_referral_code(UUID, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.activate_referral(UUID) TO authenticated;
