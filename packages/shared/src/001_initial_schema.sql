-- ============================================================
-- LIFE BALANCE — Database Schema
-- Supabase (PostgreSQL) + Row Level Security
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- 1. PROFILES — User profiles
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL DEFAULT '',
  weight DECIMAL(5,1),           -- kg
  height DECIMAL(4,2),           -- meters (e.g. 1.78)
  waist DECIMAL(4,1),            -- cm
  birth_date DATE,
  gender TEXT CHECK (gender IN ('male', 'female')),
  language TEXT DEFAULT 'pt' CHECK (language IN ('pt', 'en', 'es')),
  protocol_start_date DATE,
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================================
-- 2. OMEGA_BRANDS — Collective omega database (PUBLIC READ)
-- ============================================================
CREATE TABLE omega_brands (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  manufacturer TEXT,
  dosage TEXT,                    -- e.g. "2.840mg/dia"
  price_per_month DECIMAL(8,2),  -- USD
  omega3_mg INTEGER,             -- mg per serving
  epa_mg INTEGER,
  dha_mg INTEGER,
  form TEXT CHECK (form IN ('capsule', 'liquid', 'gummy', 'other')),
  image_url TEXT,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE omega_brands ENABLE ROW LEVEL SECURITY;

-- Everyone can read omega brands (public data)
CREATE POLICY "Anyone can view omega brands"
  ON omega_brands FOR SELECT
  USING (TRUE);

-- Only service role can insert/update (admin)
CREATE POLICY "Service role manages omega brands"
  ON omega_brands FOR ALL
  USING (auth.role() = 'service_role');

-- ============================================================
-- 3. USER_OMEGA — Which omega each user takes
-- ============================================================
CREATE TABLE user_omega (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand_id UUID REFERENCES omega_brands(id) ON DELETE SET NULL,
  custom_brand_name TEXT,        -- if brand not in DB yet
  dosage TEXT,
  started_at DATE DEFAULT CURRENT_DATE,
  ended_at DATE,                 -- NULL = currently taking
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE user_omega ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own omega"
  ON user_omega FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 4. DAILY_CHECKINS — Daily health tracking
-- ============================================================
CREATE TABLE daily_checkins (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  check_date DATE NOT NULL DEFAULT CURRENT_DATE,
  weight DECIMAL(5,1),           -- kg
  waist DECIMAL(4,1),            -- cm (weekly)
  sleep_quality SMALLINT CHECK (sleep_quality BETWEEN 1 AND 5),
  water_liters DECIMAL(3,1),
  took_omega BOOLEAN DEFAULT FALSE,
  blood_pressure_sys SMALLINT,   -- systolic
  blood_pressure_dia SMALLINT,   -- diastolic
  glucose DECIMAL(5,1),          -- mg/dL
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(user_id, check_date)
);

ALTER TABLE daily_checkins ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own checkins"
  ON daily_checkins FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 5. BALANCE_TESTS — BalanceTest results (Zinzino)
-- ============================================================
CREATE TABLE balance_tests (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  test_date DATE NOT NULL,
  omega6_ratio DECIMAL(4,1),     -- e.g. 15.0 (means 15:1)
  omega3_index DECIMAL(4,1),     -- percentage
  protection_value DECIMAL(4,1),
  mental_strength DECIMAL(4,1),
  cell_membrane DECIMAL(4,1),
  aa_index DECIMAL(4,1),         -- arachidonic acid
  omega_brand_id UUID REFERENCES omega_brands(id),
  pdf_url TEXT,                  -- original PDF result
  is_baseline BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE balance_tests ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own tests"
  ON balance_tests FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 6. SCAN_RESULTS — Food label scans
-- ============================================================
CREATE TABLE scan_results (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  barcode TEXT,
  score SMALLINT CHECK (score BETWEEN 0 AND 100),
  verdict TEXT CHECK (verdict IN ('excellent', 'good', 'moderate', 'avoid')),
  personal_impact TEXT,          -- AI-generated impact explanation
  suggestion TEXT,               -- AI-suggested alternative
  image_url TEXT,                -- photo of the label
  scanned_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE scan_results ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own scans"
  ON scan_results FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- 7. SCAN_INGREDIENTS — Ingredients per scan
-- ============================================================
CREATE TABLE scan_ingredients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  scan_id UUID NOT NULL REFERENCES scan_results(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  score TEXT CHECK (score IN ('good', 'moderate', 'bad')),
  tag TEXT,                      -- e.g. "PRO-INFLAM", "OMEGA-3 ↑"
  sort_order SMALLINT DEFAULT 0
);

ALTER TABLE scan_ingredients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own scan ingredients"
  ON scan_ingredients FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM scan_results sr
      WHERE sr.id = scan_ingredients.scan_id
      AND sr.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own scan ingredients"
  ON scan_ingredients FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM scan_results sr
      WHERE sr.id = scan_ingredients.scan_id
      AND sr.user_id = auth.uid()
    )
  );

-- ============================================================
-- 8. OMEGA_STATS — Aggregated stats per brand (materialized)
-- ============================================================
CREATE MATERIALIZED VIEW omega_brand_stats AS
SELECT
  ob.id AS brand_id,
  ob.name AS brand_name,
  COUNT(DISTINCT bt.user_id) AS users_count,
  ROUND(AVG(CASE WHEN bt.is_baseline THEN bt.omega6_ratio END), 1) AS avg_ratio_before,
  ROUND(AVG(CASE WHEN NOT bt.is_baseline THEN bt.omega6_ratio END), 1) AS avg_ratio_after,
  ROUND(
    100.0 * COUNT(DISTINCT CASE
      WHEN NOT bt.is_baseline AND bt.omega6_ratio <
        (SELECT bt2.omega6_ratio FROM balance_tests bt2
         WHERE bt2.user_id = bt.user_id AND bt2.is_baseline
         ORDER BY bt2.test_date LIMIT 1)
      THEN bt.user_id
    END) / NULLIF(COUNT(DISTINCT bt.user_id), 0),
    0
  ) AS improvement_rate
FROM omega_brands ob
LEFT JOIN balance_tests bt ON bt.omega_brand_id = ob.id
GROUP BY ob.id, ob.name;

CREATE UNIQUE INDEX ON omega_brand_stats (brand_id);

-- ============================================================
-- 9. COMMUNITY_METRICS — Aggregate view
-- ============================================================
CREATE OR REPLACE VIEW community_metrics AS
SELECT
  (SELECT COUNT(DISTINCT id) FROM profiles) AS total_members,

  COALESCE((
    SELECT ROUND(SUM(first_weight - last_weight), 0)
    FROM (
      SELECT user_id,
        (ARRAY_AGG(weight ORDER BY check_date ASC))[1] AS first_weight,
        (ARRAY_AGG(weight ORDER BY check_date DESC))[1] AS last_weight
      FROM daily_checkins
      WHERE weight IS NOT NULL
      GROUP BY user_id
      HAVING COUNT(*) >= 2
    ) sub
    WHERE first_weight > last_weight
  ), 0) AS total_weight_lost,

  (SELECT ROUND(AVG(omega6_ratio), 1)
   FROM balance_tests WHERE is_baseline = TRUE) AS avg_ratio_before,

  (SELECT ROUND(AVG(omega6_ratio), 1)
   FROM balance_tests WHERE is_baseline = FALSE) AS avg_ratio_after,

  (SELECT ROUND(100.0 * COUNT(DISTINCT CASE
     WHEN latest.quality > earliest.quality THEN latest.user_id END)
     / NULLIF(COUNT(DISTINCT latest.user_id), 0), 0)
   FROM (
     SELECT DISTINCT ON (user_id) user_id, sleep_quality AS quality
     FROM daily_checkins WHERE sleep_quality IS NOT NULL
     ORDER BY user_id, check_date DESC
   ) latest
   JOIN (
     SELECT DISTINCT ON (user_id) user_id, sleep_quality AS quality
     FROM daily_checkins WHERE sleep_quality IS NOT NULL
     ORDER BY user_id, check_date ASC
   ) earliest ON latest.user_id = earliest.user_id
  ) AS sleep_improved_pct;

-- ============================================================
-- 10. INDEXES for performance
-- ============================================================
CREATE INDEX idx_checkins_user_date ON daily_checkins(user_id, check_date DESC);
CREATE INDEX idx_checkins_date ON daily_checkins(check_date DESC);
CREATE INDEX idx_balance_tests_user ON balance_tests(user_id, test_date DESC);
CREATE INDEX idx_balance_tests_brand ON balance_tests(omega_brand_id);
CREATE INDEX idx_scans_user ON scan_results(user_id, scanned_at DESC);
CREATE INDEX idx_user_omega_user ON user_omega(user_id, ended_at);

-- ============================================================
-- 11. FUNCTIONS
-- ============================================================

-- Get user's current streak
CREATE OR REPLACE FUNCTION get_user_streak(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  streak INTEGER := 0;
  check_day DATE := CURRENT_DATE;
  found BOOLEAN;
BEGIN
  LOOP
    SELECT EXISTS(
      SELECT 1 FROM daily_checkins
      WHERE user_id = p_user_id AND check_date = check_day
    ) INTO found;

    IF NOT found THEN
      EXIT;
    END IF;

    streak := streak + 1;
    check_day := check_day - 1;
  END LOOP;

  RETURN streak;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Get user's protocol day
CREATE OR REPLACE FUNCTION get_protocol_day(p_user_id UUID)
RETURNS INTEGER AS $$
DECLARE
  start_date DATE;
BEGIN
  SELECT protocol_start_date INTO start_date
  FROM profiles WHERE id = p_user_id;

  IF start_date IS NULL THEN
    RETURN 0;
  END IF;

  RETURN GREATEST(1, (CURRENT_DATE - start_date) + 1);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Refresh omega stats (call periodically)
CREATE OR REPLACE FUNCTION refresh_omega_stats()
RETURNS VOID AS $$
BEGIN
  REFRESH MATERIALIZED VIEW CONCURRENTLY omega_brand_stats;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- 12. TRIGGERS
-- ============================================================

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'name', ''));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- 13. SEED DATA — Initial omega brands
-- ============================================================
INSERT INTO omega_brands (name, manufacturer, dosage, price_per_month, omega3_mg, epa_mg, dha_mg, form, is_verified) VALUES
  ('Nordic Naturals Ultimate Omega', 'Nordic Naturals', '2 softgels/dia', 37.00, 2840, 1460, 1010, 'capsule', TRUE),
  ('NOW Foods Ultra Omega-3', 'NOW Foods', '2 softgels/dia', 18.00, 1000, 500, 250, 'capsule', TRUE),
  ('Nature Made Fish Oil', 'Nature Made', '2 softgels/dia', 12.00, 1200, 360, 240, 'capsule', TRUE),
  ('Kirkland Signature Fish Oil', 'Costco/Kirkland', '2 softgels/dia', 8.00, 1000, 300, 200, 'capsule', TRUE),
  ('Life Extension Super Omega-3', 'Life Extension', '2 softgels/dia', 28.00, 2000, 750, 500, 'capsule', TRUE),
  ('Carlson Labs Very Finest Fish Oil', 'Carlson Labs', '1 tsp/dia', 32.00, 1600, 800, 500, 'liquid', TRUE),
  ('Viva Naturals Triple Strength', 'Viva Naturals', '2 softgels/dia', 25.00, 2200, 1400, 480, 'capsule', TRUE),
  ('Sports Research Triple Strength', 'Sports Research', '1 softgel/dia', 22.00, 1250, 690, 310, 'capsule', TRUE),
  ('WHC UnoCardio 1000', 'WHC', '1 softgel/dia', 45.00, 1200, 675, 475, 'capsule', TRUE),
  ('Dr. Tobias Triple Strength', 'Dr. Tobias', '2 softgels/dia', 20.00, 2200, 1400, 600, 'capsule', TRUE);
