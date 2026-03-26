-- Life Balance Database Schema
-- Run this migration in your Supabase SQL Editor

-- 1. Profiles (extends auth.users)
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT NOT NULL,
  email TEXT NOT NULL,
  avatar_url TEXT,
  age INTEGER,
  gender TEXT CHECK (gender IN ('male', 'female', 'other')),
  height_cm NUMERIC(5,1),
  weight_kg NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'light', 'moderate', 'active', 'very_active')),
  health_goals TEXT[] DEFAULT '{}',
  preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'pt', 'es')),
  onboarding_completed BOOLEAN DEFAULT FALSE,
  protocol_start_date DATE,
  timezone TEXT DEFAULT 'America/New_York',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Health Metrics (daily check-ins)
CREATE TABLE public.health_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  weight_kg NUMERIC(5,1),
  waist_cm NUMERIC(5,1),
  sleep_quality INTEGER CHECK (sleep_quality BETWEEN 1 AND 5),
  water_liters NUMERIC(3,1),
  omega_supplement_taken BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- 3. Scans (food scanner results)
CREATE TABLE public.scans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  brand TEXT,
  score INTEGER CHECK (score BETWEEN 0 AND 100),
  verdict TEXT CHECK (verdict IN ('GOOD', 'MODERATE', 'BAD')),
  ingredients_detected TEXT[] DEFAULT '{}',
  inflammatory_flags TEXT[] DEFAULT '{}',
  good_ingredients TEXT[] DEFAULT '{}',
  bad_ingredients TEXT[] DEFAULT '{}',
  ai_analysis TEXT,
  image_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Supplements (Omega Database)
CREATE TABLE public.supplements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  brand TEXT NOT NULL,
  product_name TEXT NOT NULL,
  type TEXT,
  dosage TEXT,
  daily_servings INTEGER DEFAULT 1,
  omega_ratio_before NUMERIC(4,1),
  omega_ratio_after NUMERIC(4,1),
  balance_test_date DATE,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Achievements (gamification)
CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT NOW(),
  points INTEGER NOT NULL DEFAULT 0,
  UNIQUE(user_id, achievement_key)
);

-- 6. Streaks (computed/cached)
CREATE TABLE public.streaks (
  user_id UUID PRIMARY KEY REFERENCES profiles(id) ON DELETE CASCADE,
  current_streak INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_checkin_date DATE,
  total_points INTEGER DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_health_metrics_user_date ON health_metrics(user_id, date DESC);
CREATE INDEX idx_scans_user_created ON scans(user_id, created_at DESC);
CREATE INDEX idx_supplements_user_active ON supplements(user_id, is_active);
CREATE INDEX idx_achievements_user ON achievements(user_id);

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, email)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email
  );
  INSERT INTO public.streaks (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Auto-update updated_at on profiles
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
