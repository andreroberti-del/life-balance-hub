-- M7 Life Balance: Super Admin Panel
-- 2026-05-22
-- Roles + subscriptions + payments + RPCs de KPIs SaaS

-- ============================================================
-- ADMIN ROLES
-- ============================================================

CREATE TABLE public.admin_roles (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL DEFAULT 'admin',
  granted_by UUID REFERENCES profiles(id) ON DELETE SET NULL,
  granted_at TIMESTAMPTZ DEFAULT NOW(),
  notes TEXT,
  CHECK (role IN ('super_admin', 'admin', 'support', 'analyst'))
);

-- Auto-promover Roberti
INSERT INTO admin_roles (user_id, role, notes)
SELECT id, 'super_admin', 'Founder, auto-granted on migration'
FROM profiles WHERE email = 'andreroberti@sistemamind7.com.br'
ON CONFLICT DO NOTHING;

-- Helper function: check if user is super_admin (ou admin)
CREATE OR REPLACE FUNCTION public.is_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = p_user_id
      AND role IN ('super_admin', 'admin', 'analyst')
  );
$$;

CREATE OR REPLACE FUNCTION public.is_super_admin(p_user_id UUID DEFAULT auth.uid())
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM admin_roles
    WHERE user_id = p_user_id AND role = 'super_admin'
  );
$$;

-- ============================================================
-- SUBSCRIPTIONS (Premium / Free / Distributor)
-- ============================================================

CREATE TABLE public.subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  source TEXT NOT NULL DEFAULT 'signup',
  started_at TIMESTAMPTZ DEFAULT NOW(),
  current_period_start TIMESTAMPTZ,
  current_period_end TIMESTAMPTZ,
  cancelled_at TIMESTAMPTZ,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  stripe_subscription_id TEXT,
  price_monthly_cents INTEGER,
  granted_by UUID REFERENCES profiles(id),
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (plan IN ('free', 'premium', 'premium_lifetime', 'distributor', 'trial')),
  CHECK (status IN ('active', 'past_due', 'cancelled', 'paused', 'expired')),
  CHECK (source IN ('signup', 'stripe', 'referral_reward', 'manual', 'distributor_promotion'))
);

CREATE INDEX idx_subscriptions_user_active ON subscriptions(user_id, status) WHERE status = 'active';
CREATE INDEX idx_subscriptions_plan_status ON subscriptions(plan, status);

-- Auto-create free subscription pra todos profiles novos
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO subscriptions (user_id, plan, status, source)
  VALUES (NEW.id, 'free', 'active', 'signup')
  ON CONFLICT DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_profile_created_subscription
  AFTER INSERT ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription();

-- Backfill pra users existentes
INSERT INTO subscriptions (user_id, plan, status, source)
SELECT id, 'free', 'active', 'signup' FROM profiles
WHERE id NOT IN (SELECT user_id FROM subscriptions)
ON CONFLICT DO NOTHING;

-- ============================================================
-- PAYMENTS (log de transações)
-- ============================================================

CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
  amount_cents INTEGER NOT NULL,
  currency TEXT NOT NULL DEFAULT 'BRL',
  status TEXT NOT NULL,
  payment_method TEXT,
  stripe_payment_intent_id TEXT,
  description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  CHECK (status IN ('pending', 'succeeded', 'failed', 'refunded', 'cancelled')),
  CHECK (payment_method IS NULL OR payment_method IN ('card', 'pix', 'boleto', 'manual'))
);

CREATE INDEX idx_payments_user_date ON payments(user_id, created_at DESC);
CREATE INDEX idx_payments_status ON payments(status, created_at DESC);

-- ============================================================
-- RPC: ADMIN DASHBOARD OVERVIEW (KPIs gerais)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_dashboard_overview()
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  WITH today_signups AS (
    SELECT COUNT(*)::INT AS c FROM profiles WHERE created_at::DATE = CURRENT_DATE
  ),
  week_signups AS (
    SELECT COUNT(*)::INT AS c FROM profiles WHERE created_at > NOW() - INTERVAL '7 days'
  ),
  month_signups AS (
    SELECT COUNT(*)::INT AS c FROM profiles WHERE created_at > NOW() - INTERVAL '30 days'
  ),
  total_users AS (
    SELECT COUNT(*)::INT AS c FROM profiles
  ),
  active_today AS (
    SELECT COUNT(DISTINCT user_id)::INT AS c FROM xp_events
    WHERE created_at::DATE = CURRENT_DATE
  ),
  active_week AS (
    SELECT COUNT(DISTINCT user_id)::INT AS c FROM xp_events
    WHERE created_at > NOW() - INTERVAL '7 days'
  ),
  active_month AS (
    SELECT COUNT(DISTINCT user_id)::INT AS c FROM xp_events
    WHERE created_at > NOW() - INTERVAL '30 days'
  ),
  premium_active AS (
    SELECT COUNT(*)::INT AS c FROM subscriptions
    WHERE plan IN ('premium', 'premium_lifetime') AND status = 'active'
  ),
  free_active AS (
    SELECT COUNT(*)::INT AS c FROM subscriptions
    WHERE plan = 'free' AND status = 'active'
  ),
  trial_active AS (
    SELECT COUNT(*)::INT AS c FROM subscriptions
    WHERE plan = 'trial' AND status = 'active'
  ),
  mrr AS (
    SELECT COALESCE(SUM(price_monthly_cents), 0)::INT AS c
    FROM subscriptions
    WHERE plan = 'premium' AND status = 'active' AND price_monthly_cents IS NOT NULL
  ),
  total_revenue AS (
    SELECT COALESCE(SUM(amount_cents), 0)::INT AS c
    FROM payments WHERE status = 'succeeded'
  ),
  revenue_30d AS (
    SELECT COALESCE(SUM(amount_cents), 0)::INT AS c
    FROM payments
    WHERE status = 'succeeded' AND created_at > NOW() - INTERVAL '30 days'
  ),
  total_referrals AS (
    SELECT COUNT(*)::INT AS c FROM referrals
  ),
  active_referrals AS (
    SELECT COUNT(*)::INT AS c FROM referrals WHERE status = 'active'
  ),
  family_rewards AS (
    SELECT COUNT(*)::INT AS c FROM referral_rewards WHERE reward_type = 'free_premium_permanent'
  ),
  distributors AS (
    SELECT COUNT(*) FILTER (WHERE status = 'approved')::INT AS approved,
           COUNT(*) FILTER (WHERE status = 'in_review')::INT AS in_review,
           COUNT(*) FILTER (WHERE status = 'applied')::INT AS applied
    FROM distributor_profiles
  ),
  ai_today AS (
    SELECT COUNT(*)::INT AS c FROM ai_usage_log
    WHERE created_at::DATE = CURRENT_DATE
  ),
  ai_month AS (
    SELECT COUNT(*)::INT AS c FROM ai_usage_log
    WHERE created_at > NOW() - INTERVAL '30 days'
  ),
  lessons_today AS (
    SELECT COUNT(*)::INT AS c FROM xp_events
    WHERE reason_code = 'lesson_completed' AND created_at::DATE = CURRENT_DATE
  ),
  scans_today AS (
    SELECT COUNT(*)::INT AS c FROM scans
    WHERE created_at::DATE = CURRENT_DATE
  )
  SELECT jsonb_build_object(
    'users', jsonb_build_object(
      'total', (SELECT c FROM total_users),
      'new_today', (SELECT c FROM today_signups),
      'new_week', (SELECT c FROM week_signups),
      'new_month', (SELECT c FROM month_signups),
      'dau', (SELECT c FROM active_today),
      'wau', (SELECT c FROM active_week),
      'mau', (SELECT c FROM active_month)
    ),
    'revenue', jsonb_build_object(
      'mrr_cents', (SELECT c FROM mrr),
      'total_cents', (SELECT c FROM total_revenue),
      'last_30d_cents', (SELECT c FROM revenue_30d)
    ),
    'subscriptions', jsonb_build_object(
      'premium_active', (SELECT c FROM premium_active),
      'free_active', (SELECT c FROM free_active),
      'trial_active', (SELECT c FROM trial_active)
    ),
    'growth', jsonb_build_object(
      'referrals_total', (SELECT c FROM total_referrals),
      'referrals_active', (SELECT c FROM active_referrals),
      'family_premium_rewards', (SELECT c FROM family_rewards),
      'distributors_approved', (SELECT approved FROM distributors),
      'distributors_in_review', (SELECT in_review FROM distributors)
    ),
    'engagement', jsonb_build_object(
      'lessons_completed_today', (SELECT c FROM lessons_today),
      'scans_today', (SELECT c FROM scans_today),
      'ai_calls_today', (SELECT c FROM ai_today),
      'ai_calls_30d', (SELECT c FROM ai_month)
    ),
    'generated_at', NOW()
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- RPC: ADMIN USERS LIST (paginada, com filtros)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_users_list(
  p_limit INTEGER DEFAULT 50,
  p_offset INTEGER DEFAULT 0,
  p_search TEXT DEFAULT NULL,
  p_plan_filter TEXT DEFAULT NULL,
  p_sort_by TEXT DEFAULT 'created_at'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_total INTEGER;
  v_rows JSONB;
BEGIN
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  SELECT COUNT(*)::INT INTO v_total
  FROM profiles p
  LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
  WHERE (p_search IS NULL
         OR p.email ILIKE '%' || p_search || '%'
         OR p.display_name ILIKE '%' || p_search || '%')
    AND (p_plan_filter IS NULL OR s.plan = p_plan_filter);

  SELECT jsonb_agg(row_to_json(t)) INTO v_rows FROM (
    SELECT
      p.id,
      p.display_name,
      p.email,
      p.created_at,
      p.protocol_start_date,
      COALESCE(s.plan, 'free') AS plan,
      COALESCE(s.status, 'active') AS subscription_status,
      ul.current_level,
      ul.total_xp,
      rc.code AS referral_code,
      rc.active_referrals,
      (SELECT MAX(created_at) FROM xp_events WHERE user_id = p.id) AS last_active_at,
      (SELECT status FROM distributor_profiles WHERE user_id = p.id) AS distributor_status,
      ar.role AS admin_role
    FROM profiles p
    LEFT JOIN subscriptions s ON s.user_id = p.id AND s.status = 'active'
    LEFT JOIN user_levels ul ON ul.user_id = p.id
    LEFT JOIN referral_codes rc ON rc.user_id = p.id
    LEFT JOIN admin_roles ar ON ar.user_id = p.id
    WHERE (p_search IS NULL
           OR p.email ILIKE '%' || p_search || '%'
           OR p.display_name ILIKE '%' || p_search || '%')
      AND (p_plan_filter IS NULL OR COALESCE(s.plan, 'free') = p_plan_filter)
    ORDER BY
      CASE WHEN p_sort_by = 'created_at' THEN p.created_at END DESC NULLS LAST,
      CASE WHEN p_sort_by = 'last_active' THEN (SELECT MAX(created_at) FROM xp_events WHERE user_id = p.id) END DESC NULLS LAST,
      CASE WHEN p_sort_by = 'total_xp' THEN ul.total_xp END DESC NULLS LAST
    LIMIT p_limit OFFSET p_offset
  ) t;

  RETURN jsonb_build_object(
    'total', v_total,
    'rows', COALESCE(v_rows, '[]'::jsonb),
    'limit', p_limit,
    'offset', p_offset
  );
END;
$$;

-- ============================================================
-- RPC: ADMIN USER DETAIL (visão completa de um user)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_user_detail(p_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  SELECT jsonb_build_object(
    'profile', (SELECT row_to_json(p) FROM profiles p WHERE id = p_user_id),
    'subscription', (SELECT row_to_json(s) FROM subscriptions s WHERE user_id = p_user_id AND status = 'active' LIMIT 1),
    'level', (SELECT row_to_json(ul) FROM user_levels ul WHERE user_id = p_user_id),
    'referral_code', (SELECT row_to_json(rc) FROM referral_codes rc WHERE user_id = p_user_id),
    'distributor', (SELECT row_to_json(dp) FROM distributor_profiles dp WHERE user_id = p_user_id),
    'admin_role', (SELECT row_to_json(ar) FROM admin_roles ar WHERE user_id = p_user_id),
    'referrals_made', (SELECT COUNT(*)::INT FROM referrals WHERE referrer_id = p_user_id),
    'referrals_active', (SELECT COUNT(*)::INT FROM referrals WHERE referrer_id = p_user_id AND status = 'active'),
    'referred_by', (
      SELECT jsonb_build_object('referrer_id', r.referrer_id, 'code_used', r.code_used, 'created_at', r.created_at)
      FROM referrals r WHERE referred_id = p_user_id LIMIT 1
    ),
    'recent_xp_events', (
      SELECT COALESCE(jsonb_agg(row_to_json(x)), '[]'::jsonb) FROM (
        SELECT amount, reason, reason_code, created_at FROM xp_events
        WHERE user_id = p_user_id ORDER BY created_at DESC LIMIT 20
      ) x
    ),
    'courses_in_progress', (SELECT COUNT(*)::INT FROM user_course_progress WHERE user_id = p_user_id AND status = 'in_progress'),
    'courses_completed', (SELECT COUNT(*)::INT FROM user_course_progress WHERE user_id = p_user_id AND status = 'completed'),
    'workout_sessions', (SELECT COUNT(*)::INT FROM workout_sessions WHERE user_id = p_user_id),
    'scans_total', (SELECT COUNT(*)::INT FROM scans WHERE user_id = p_user_id),
    'emotional_checkins_total', (SELECT COUNT(*)::INT FROM emotional_checkins WHERE user_id = p_user_id),
    'gratitude_entries_total', (SELECT COUNT(*)::INT FROM gratitude_entries WHERE user_id = p_user_id),
    'brain_dumps_total', (SELECT COUNT(*)::INT FROM brain_dump_entries WHERE user_id = p_user_id),
    'rewards', (
      SELECT COALESCE(jsonb_agg(row_to_json(r)), '[]'::jsonb) FROM (
        SELECT * FROM referral_rewards WHERE user_id = p_user_id ORDER BY granted_at DESC
      ) r
    )
  ) INTO v_result;

  RETURN v_result;
END;
$$;

-- ============================================================
-- RPC: ENGAGEMENT TIME SERIES (chart de DAU/signups por dia)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_engagement_timeseries(p_days INTEGER DEFAULT 30)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result JSONB;
BEGIN
  IF NOT is_admin() THEN
    RETURN jsonb_build_object('error', 'unauthorized');
  END IF;

  WITH days AS (
    SELECT generate_series(CURRENT_DATE - (p_days - 1) * INTERVAL '1 day', CURRENT_DATE, INTERVAL '1 day')::DATE AS d
  )
  SELECT jsonb_agg(jsonb_build_object(
    'date', d,
    'signups', (SELECT COUNT(*)::INT FROM profiles WHERE created_at::DATE = d),
    'active_users', (SELECT COUNT(DISTINCT user_id)::INT FROM xp_events WHERE created_at::DATE = d),
    'xp_earned', (SELECT COALESCE(SUM(amount), 0)::INT FROM xp_events WHERE created_at::DATE = d),
    'lessons_completed', (SELECT COUNT(*)::INT FROM xp_events WHERE created_at::DATE = d AND reason_code = 'lesson_completed'),
    'scans', (SELECT COUNT(*)::INT FROM scans WHERE created_at::DATE = d),
    'workouts', (SELECT COUNT(*)::INT FROM workout_sessions WHERE status = 'completed' AND completed_at::DATE = d),
    'ai_calls', (SELECT COUNT(*)::INT FROM ai_usage_log WHERE created_at::DATE = d)
  ) ORDER BY d) INTO v_result FROM days;

  RETURN COALESCE(v_result, '[]'::jsonb);
END;
$$;

-- ============================================================
-- RPC: GRANT/REVOKE ROLE (admin gerencia outros admins)
-- ============================================================

CREATE OR REPLACE FUNCTION public.admin_set_role(
  p_target_user_id UUID,
  p_role TEXT
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  IF NOT is_super_admin() THEN
    RETURN jsonb_build_object('error', 'unauthorized', 'msg', 'Only super_admin can manage roles');
  END IF;

  IF p_role IS NULL THEN
    DELETE FROM admin_roles WHERE user_id = p_target_user_id;
    RETURN jsonb_build_object('success', TRUE, 'action', 'revoked');
  END IF;

  IF p_role NOT IN ('super_admin', 'admin', 'support', 'analyst') THEN
    RETURN jsonb_build_object('error', 'invalid_role');
  END IF;

  INSERT INTO admin_roles (user_id, role, granted_by)
  VALUES (p_target_user_id, p_role, auth.uid())
  ON CONFLICT (user_id) DO UPDATE SET
    role = p_role,
    granted_by = auth.uid(),
    granted_at = NOW();

  RETURN jsonb_build_object('success', TRUE, 'action', 'granted', 'role', p_role);
END;
$$;

-- ============================================================
-- RLS
-- ============================================================

ALTER TABLE admin_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users veem própria role / subscription / payments
CREATE POLICY "Users view own role" ON admin_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all roles" ON admin_roles FOR SELECT USING (is_admin());
CREATE POLICY "Super admin manage roles" ON admin_roles FOR ALL USING (is_super_admin()) WITH CHECK (is_super_admin());

CREATE POLICY "Users view own subscription" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all subscriptions" ON subscriptions FOR SELECT USING (is_admin());
CREATE POLICY "Admins manage subscriptions" ON subscriptions FOR ALL USING (is_admin()) WITH CHECK (is_admin());

CREATE POLICY "Users view own payments" ON payments FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins view all payments" ON payments FOR SELECT USING (is_admin());

GRANT EXECUTE ON FUNCTION public.is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_super_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_dashboard_overview() TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_users_list(INTEGER, INTEGER, TEXT, TEXT, TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_user_detail(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_engagement_timeseries(INTEGER) TO authenticated;
GRANT EXECUTE ON FUNCTION public.admin_set_role(UUID, TEXT) TO authenticated;
