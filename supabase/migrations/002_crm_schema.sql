-- ============================================================
-- CRM Schema for Zinzino Partners
-- Life Balance Hub - Leads Pipeline, Follow-ups, Clients, Tests
-- ============================================================

-- Enable uuid extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- LEADS
-- ============================================================
CREATE TABLE crm_leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  source TEXT CHECK (source IN ('instagram', 'facebook', 'whatsapp', 'referral', 'event', 'website', 'other')),
  stage TEXT NOT NULL DEFAULT 'novo' CHECK (stage IN ('novo', 'contato', 'conversa', 'apresentacao', 'decisao', 'cliente', 'partner', 'perdido')),
  notes TEXT,
  tags TEXT[],
  lost_reason TEXT,
  converted_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- CLIENTS (converted leads)
-- Must be created before follow_ups due to FK reference
-- ============================================================
CREATE TABLE crm_clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES crm_leads(id),
  user_id UUID REFERENCES profiles(id),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'churned')),
  products JSONB DEFAULT '[]'::jsonb,
  protocol_start_date DATE,
  next_reorder_date DATE,
  next_retest_date DATE,
  lifetime_value DECIMAL(10,2) DEFAULT 0,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- LEAD ACTIVITIES (timeline)
-- ============================================================
CREATE TABLE crm_lead_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES crm_leads(id) ON DELETE CASCADE,
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('note', 'call', 'whatsapp', 'email', 'meeting', 'stage_change', 'test_sent', 'test_result', 'follow_up')),
  title TEXT NOT NULL,
  description TEXT,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- FOLLOW-UPS (scheduled actions)
-- ============================================================
CREATE TABLE crm_follow_ups (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES crm_leads(id) ON DELETE CASCADE,
  client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('call', 'whatsapp', 'email', 'meeting', 'reorder', 'retest', 'checkin')),
  title TEXT NOT NULL,
  description TEXT,
  suggested_message TEXT,
  due_date TIMESTAMPTZ NOT NULL,
  completed_at TIMESTAMPTZ,
  snoozed_until TIMESTAMPTZ,
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- BALANCE TEST TRACKING
-- ============================================================
CREATE TABLE crm_balance_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  partner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  client_id UUID REFERENCES crm_clients(id) ON DELETE CASCADE,
  lead_id UUID REFERENCES crm_leads(id),
  client_name TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'enviado' CHECK (status IN ('enviado', 'recebido', 'em_analise', 'pronto')),
  test_type TEXT DEFAULT 'balance' CHECK (test_type IN ('balance', 'gut_health')),
  sent_date DATE DEFAULT CURRENT_DATE,
  result_date DATE,
  omega6_ratio DECIMAL(4,1),
  omega3_index DECIMAL(4,1),
  is_retest BOOLEAN DEFAULT FALSE,
  previous_test_id UUID REFERENCES crm_balance_tests(id),
  pdf_url TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- INDEXES
-- ============================================================

-- crm_leads
CREATE INDEX idx_crm_leads_partner_id ON crm_leads(partner_id);
CREATE INDEX idx_crm_leads_stage ON crm_leads(partner_id, stage);
CREATE INDEX idx_crm_leads_created_at ON crm_leads(partner_id, created_at DESC);
CREATE INDEX idx_crm_leads_source ON crm_leads(partner_id, source);

-- crm_lead_activities
CREATE INDEX idx_crm_lead_activities_lead_id ON crm_lead_activities(lead_id);
CREATE INDEX idx_crm_lead_activities_partner_id ON crm_lead_activities(partner_id);
CREATE INDEX idx_crm_lead_activities_created_at ON crm_lead_activities(lead_id, created_at DESC);

-- crm_follow_ups
CREATE INDEX idx_crm_follow_ups_partner_id ON crm_follow_ups(partner_id);
CREATE INDEX idx_crm_follow_ups_due_date ON crm_follow_ups(partner_id, due_date);
CREATE INDEX idx_crm_follow_ups_pending ON crm_follow_ups(partner_id, due_date)
  WHERE completed_at IS NULL AND (snoozed_until IS NULL OR snoozed_until <= NOW());
CREATE INDEX idx_crm_follow_ups_lead_id ON crm_follow_ups(lead_id);
CREATE INDEX idx_crm_follow_ups_client_id ON crm_follow_ups(client_id);

-- crm_clients
CREATE INDEX idx_crm_clients_partner_id ON crm_clients(partner_id);
CREATE INDEX idx_crm_clients_status ON crm_clients(partner_id, status);
CREATE INDEX idx_crm_clients_lead_id ON crm_clients(lead_id);
CREATE INDEX idx_crm_clients_reorder ON crm_clients(partner_id, next_reorder_date)
  WHERE status = 'active' AND next_reorder_date IS NOT NULL;

-- crm_balance_tests
CREATE INDEX idx_crm_balance_tests_partner_id ON crm_balance_tests(partner_id);
CREATE INDEX idx_crm_balance_tests_status ON crm_balance_tests(partner_id, status);
CREATE INDEX idx_crm_balance_tests_client_id ON crm_balance_tests(client_id);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Enable RLS on all CRM tables
ALTER TABLE crm_leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_lead_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_follow_ups ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE crm_balance_tests ENABLE ROW LEVEL SECURITY;

-- crm_leads policies
CREATE POLICY "Partners can view their own leads"
  ON crm_leads FOR SELECT
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert their own leads"
  ON crm_leads FOR INSERT
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can update their own leads"
  ON crm_leads FOR UPDATE
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can delete their own leads"
  ON crm_leads FOR DELETE
  USING (partner_id = auth.uid());

-- crm_lead_activities policies
CREATE POLICY "Partners can view their own lead activities"
  ON crm_lead_activities FOR SELECT
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert their own lead activities"
  ON crm_lead_activities FOR INSERT
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can delete their own lead activities"
  ON crm_lead_activities FOR DELETE
  USING (partner_id = auth.uid());

-- crm_follow_ups policies
CREATE POLICY "Partners can view their own follow-ups"
  ON crm_follow_ups FOR SELECT
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert their own follow-ups"
  ON crm_follow_ups FOR INSERT
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can update their own follow-ups"
  ON crm_follow_ups FOR UPDATE
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can delete their own follow-ups"
  ON crm_follow_ups FOR DELETE
  USING (partner_id = auth.uid());

-- crm_clients policies
CREATE POLICY "Partners can view their own clients"
  ON crm_clients FOR SELECT
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert their own clients"
  ON crm_clients FOR INSERT
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can update their own clients"
  ON crm_clients FOR UPDATE
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can delete their own clients"
  ON crm_clients FOR DELETE
  USING (partner_id = auth.uid());

-- crm_balance_tests policies
CREATE POLICY "Partners can view their own balance tests"
  ON crm_balance_tests FOR SELECT
  USING (partner_id = auth.uid());

CREATE POLICY "Partners can insert their own balance tests"
  ON crm_balance_tests FOR INSERT
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can update their own balance tests"
  ON crm_balance_tests FOR UPDATE
  USING (partner_id = auth.uid())
  WITH CHECK (partner_id = auth.uid());

CREATE POLICY "Partners can delete their own balance tests"
  ON crm_balance_tests FOR DELETE
  USING (partner_id = auth.uid());

-- ============================================================
-- UPDATED_AT TRIGGER
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_crm_leads_updated_at
  BEFORE UPDATE ON crm_leads
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_clients_updated_at
  BEFORE UPDATE ON crm_clients
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_crm_balance_tests_updated_at
  BEFORE UPDATE ON crm_balance_tests
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================
-- HELPER FUNCTIONS
-- ============================================================

-- Get pipeline stats: count of leads per stage for the current partner
CREATE OR REPLACE FUNCTION get_pipeline_stats(p_partner_id UUID)
RETURNS TABLE (
  stage TEXT,
  count BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT l.stage, COUNT(*)::BIGINT
  FROM crm_leads l
  WHERE l.partner_id = p_partner_id
  GROUP BY l.stage
  ORDER BY
    CASE l.stage
      WHEN 'novo' THEN 1
      WHEN 'contato' THEN 2
      WHEN 'conversa' THEN 3
      WHEN 'apresentacao' THEN 4
      WHEN 'decisao' THEN 5
      WHEN 'cliente' THEN 6
      WHEN 'partner' THEN 7
      WHEN 'perdido' THEN 8
    END;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get follow-ups due today (includes overdue and snoozed-until-now)
CREATE OR REPLACE FUNCTION get_follow_ups_today(p_partner_id UUID)
RETURNS SETOF crm_follow_ups AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM crm_follow_ups f
  WHERE f.partner_id = p_partner_id
    AND f.completed_at IS NULL
    AND f.due_date <= (CURRENT_DATE + INTERVAL '1 day')
    AND (f.snoozed_until IS NULL OR f.snoozed_until <= NOW())
  ORDER BY f.priority DESC, f.due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get overdue follow-ups (due before today, not completed)
CREATE OR REPLACE FUNCTION get_overdue_follow_ups(p_partner_id UUID)
RETURNS SETOF crm_follow_ups AS $$
BEGIN
  RETURN QUERY
  SELECT *
  FROM crm_follow_ups f
  WHERE f.partner_id = p_partner_id
    AND f.completed_at IS NULL
    AND f.due_date < CURRENT_DATE
    AND (f.snoozed_until IS NULL OR f.snoozed_until <= NOW())
  ORDER BY f.due_date ASC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get performance metrics for a given period
CREATE OR REPLACE FUNCTION get_performance_metrics(
  p_partner_id UUID,
  p_period_start DATE,
  p_period_end DATE
)
RETURNS TABLE (
  total_leads BIGINT,
  new_leads BIGINT,
  converted_leads BIGINT,
  lost_leads BIGINT,
  conversion_rate NUMERIC,
  total_clients BIGINT,
  active_clients BIGINT,
  tests_sent BIGINT,
  tests_completed BIGINT,
  total_follow_ups BIGINT,
  completed_follow_ups BIGINT
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    -- Total leads for this partner
    (SELECT COUNT(*) FROM crm_leads l WHERE l.partner_id = p_partner_id)::BIGINT AS total_leads,
    -- New leads in period
    (SELECT COUNT(*) FROM crm_leads l
     WHERE l.partner_id = p_partner_id
       AND l.created_at >= p_period_start
       AND l.created_at < p_period_end + INTERVAL '1 day')::BIGINT AS new_leads,
    -- Converted in period
    (SELECT COUNT(*) FROM crm_leads l
     WHERE l.partner_id = p_partner_id
       AND l.stage IN ('cliente', 'partner')
       AND l.converted_at >= p_period_start
       AND l.converted_at < p_period_end + INTERVAL '1 day')::BIGINT AS converted_leads,
    -- Lost in period
    (SELECT COUNT(*) FROM crm_leads l
     WHERE l.partner_id = p_partner_id
       AND l.stage = 'perdido'
       AND l.updated_at >= p_period_start
       AND l.updated_at < p_period_end + INTERVAL '1 day')::BIGINT AS lost_leads,
    -- Conversion rate (all time)
    CASE
      WHEN (SELECT COUNT(*) FROM crm_leads l WHERE l.partner_id = p_partner_id) = 0 THEN 0
      ELSE ROUND(
        (SELECT COUNT(*) FROM crm_leads l WHERE l.partner_id = p_partner_id AND l.stage IN ('cliente', 'partner'))::NUMERIC /
        (SELECT COUNT(*) FROM crm_leads l WHERE l.partner_id = p_partner_id)::NUMERIC * 100, 1
      )
    END AS conversion_rate,
    -- Total clients
    (SELECT COUNT(*) FROM crm_clients c WHERE c.partner_id = p_partner_id)::BIGINT AS total_clients,
    -- Active clients
    (SELECT COUNT(*) FROM crm_clients c WHERE c.partner_id = p_partner_id AND c.status = 'active')::BIGINT AS active_clients,
    -- Tests sent in period
    (SELECT COUNT(*) FROM crm_balance_tests t
     WHERE t.partner_id = p_partner_id
       AND t.sent_date >= p_period_start
       AND t.sent_date <= p_period_end)::BIGINT AS tests_sent,
    -- Tests completed in period
    (SELECT COUNT(*) FROM crm_balance_tests t
     WHERE t.partner_id = p_partner_id
       AND t.status = 'pronto'
       AND t.result_date >= p_period_start
       AND t.result_date <= p_period_end)::BIGINT AS tests_completed,
    -- Total follow-ups in period
    (SELECT COUNT(*) FROM crm_follow_ups fu
     WHERE fu.partner_id = p_partner_id
       AND fu.due_date >= p_period_start
       AND fu.due_date < p_period_end + INTERVAL '1 day')::BIGINT AS total_follow_ups,
    -- Completed follow-ups in period
    (SELECT COUNT(*) FROM crm_follow_ups fu
     WHERE fu.partner_id = p_partner_id
       AND fu.completed_at >= p_period_start
       AND fu.completed_at < p_period_end + INTERVAL '1 day')::BIGINT AS completed_follow_ups;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
