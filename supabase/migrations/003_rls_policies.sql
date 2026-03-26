-- Row Level Security Policies
-- Users can only access their own data

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE scans ENABLE ROW LEVEL SECURITY;
ALTER TABLE supplements ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE streaks ENABLE ROW LEVEL SECURITY;

-- Profiles: user can read/update own profile
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Health Metrics: full CRUD on own data
CREATE POLICY "Users can view own metrics" ON health_metrics FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own metrics" ON health_metrics FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own metrics" ON health_metrics FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own metrics" ON health_metrics FOR DELETE USING (auth.uid() = user_id);

-- Scans: full CRUD on own data
CREATE POLICY "Users can view own scans" ON scans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own scans" ON scans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete own scans" ON scans FOR DELETE USING (auth.uid() = user_id);

-- Supplements: full CRUD on own data
CREATE POLICY "Users can view own supplements" ON supplements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own supplements" ON supplements FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own supplements" ON supplements FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own supplements" ON supplements FOR DELETE USING (auth.uid() = user_id);

-- Achievements: read own, insert own
CREATE POLICY "Users can view own achievements" ON achievements FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own achievements" ON achievements FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Streaks: read/update own
CREATE POLICY "Users can view own streak" ON streaks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own streak" ON streaks FOR UPDATE USING (auth.uid() = user_id);

-- Community Stats Function (returns aggregated data only, no PII)
CREATE OR REPLACE FUNCTION public.get_community_stats()
RETURNS JSON AS $$
  SELECT json_build_object(
    'total_members', (SELECT count(*) FROM profiles WHERE onboarding_completed = true),
    'total_weight_lost', (
      SELECT COALESCE(round(sum(first_w.weight_kg - latest_w.weight_kg)::numeric, 1), 0)
      FROM (
        SELECT DISTINCT ON (user_id) user_id, weight_kg
        FROM health_metrics WHERE weight_kg IS NOT NULL
        ORDER BY user_id, date ASC
      ) first_w
      JOIN (
        SELECT DISTINCT ON (user_id) user_id, weight_kg
        FROM health_metrics WHERE weight_kg IS NOT NULL
        ORDER BY user_id, date DESC
      ) latest_w ON first_w.user_id = latest_w.user_id
      WHERE first_w.weight_kg > latest_w.weight_kg
    ),
    'avg_omega_ratio', 4.2,
    'sleep_improved_pct', (
      SELECT COALESCE(round(
        count(*) FILTER (WHERE sleep_quality >= 4)::numeric / NULLIF(count(*), 0) * 100
      , 0), 0)
      FROM health_metrics WHERE sleep_quality IS NOT NULL
    ),
    'total_scans', (SELECT count(*) FROM scans),
    'total_checkins', (SELECT count(*) FROM health_metrics)
  );
$$ LANGUAGE SQL SECURITY DEFINER;
