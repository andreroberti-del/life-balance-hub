export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: Profile;
        Insert: Omit<Profile, 'created_at' | 'updated_at'>;
        Update: Partial<Omit<Profile, 'id' | 'created_at'>>;
      };
      health_metrics: {
        Row: HealthMetric;
        Insert: Omit<HealthMetric, 'id' | 'created_at'>;
        Update: Partial<Omit<HealthMetric, 'id' | 'user_id' | 'created_at'>>;
      };
      scans: {
        Row: Scan;
        Insert: Omit<Scan, 'id' | 'created_at'>;
        Update: Partial<Omit<Scan, 'id' | 'user_id' | 'created_at'>>;
      };
      supplements: {
        Row: Supplement;
        Insert: Omit<Supplement, 'id' | 'created_at'>;
        Update: Partial<Omit<Supplement, 'id' | 'user_id' | 'created_at'>>;
      };
      achievements: {
        Row: Achievement;
        Insert: Omit<Achievement, 'id' | 'unlocked_at'>;
        Update: never;
      };
      streaks: {
        Row: Streak;
        Insert: Omit<Streak, 'updated_at'>;
        Update: Partial<Omit<Streak, 'user_id'>>;
      };
    };
    Functions: {
      get_community_stats: {
        Args: Record<string, never>;
        Returns: CommunityStats;
      };
    };
  };
}

export interface Profile {
  id: string;
  display_name: string;
  email: string;
  avatar_url: string | null;
  age: number | null;
  gender: 'male' | 'female' | 'other' | null;
  height_cm: number | null;
  weight_kg: number | null;
  waist_cm: number | null;
  activity_level: 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active' | null;
  health_goals: string[];
  preferred_language: 'en' | 'pt' | 'es';
  onboarding_completed: boolean;
  protocol_start_date: string | null;
  timezone: string;
  created_at: string;
  updated_at: string;
}

export interface HealthMetric {
  id: string;
  user_id: string;
  date: string;
  weight_kg: number | null;
  waist_cm: number | null;
  sleep_quality: number | null;
  water_liters: number | null;
  omega_supplement_taken: boolean;
  notes: string | null;
  created_at: string;
}

export interface Scan {
  id: string;
  user_id: string;
  product_name: string;
  brand: string | null;
  score: number;
  verdict: 'GOOD' | 'MODERATE' | 'BAD';
  ingredients_detected: string[];
  inflammatory_flags: string[];
  good_ingredients: string[];
  bad_ingredients: string[];
  ai_analysis: string | null;
  image_url: string | null;
  created_at: string;
}

export interface Supplement {
  id: string;
  user_id: string;
  brand: string;
  product_name: string;
  type: string | null;
  dosage: string | null;
  daily_servings: number;
  omega_ratio_before: number | null;
  omega_ratio_after: number | null;
  balance_test_date: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Achievement {
  id: string;
  user_id: string;
  achievement_key: string;
  unlocked_at: string;
  points: number;
}

export interface Streak {
  user_id: string;
  current_streak: number;
  longest_streak: number;
  last_checkin_date: string | null;
  total_points: number;
  updated_at: string;
}

export interface CommunityStats {
  total_members: number;
  total_weight_lost: number;
  avg_omega_ratio: number;
  sleep_improved_pct: number;
  total_scans: number;
  total_checkins: number;
}

// ============================================
// Garmin Integration Types
// ============================================

export interface GarminConnection {
  id: string;
  user_id: string;
  garmin_user_id: string | null;
  access_token: string;
  access_token_secret: string;
  is_active: boolean;
  scopes: string[];
  last_sync_at: string | null;
  connected_at: string;
  disconnected_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface GarminDailySummary {
  id: string;
  user_id: string;
  summary_date: string;
  steps: number | null;
  distance_meters: number | null;
  active_calories: number | null;
  total_calories: number | null;
  resting_heart_rate: number | null;
  max_heart_rate: number | null;
  avg_stress_level: number | null;
  floors_climbed: number | null;
  intensity_minutes: number | null;
  moderate_intensity_minutes: number | null;
  vigorous_intensity_minutes: number | null;
  raw_json: Record<string, unknown> | null;
  synced_at: string;
}

export interface GarminSleepSummary {
  id: string;
  user_id: string;
  sleep_date: string;
  total_sleep_seconds: number | null;
  deep_sleep_seconds: number | null;
  light_sleep_seconds: number | null;
  rem_sleep_seconds: number | null;
  awake_seconds: number | null;
  sleep_score: number | null;
  sleep_start: string | null;
  sleep_end: string | null;
  avg_respiration: number | null;
  avg_spo2: number | null;
  avg_heart_rate: number | null;
  hrv_status: string | null;
  hrv_value: number | null;
  raw_json: Record<string, unknown> | null;
  synced_at: string;
}

export interface GarminBodyComposition {
  id: string;
  user_id: string;
  measured_at: string;
  weight_grams: number | null;
  bmi: number | null;
  body_fat_pct: number | null;
  muscle_mass_grams: number | null;
  bone_mass_grams: number | null;
  body_water_pct: number | null;
  raw_json: Record<string, unknown> | null;
  synced_at: string;
}

export interface GarminActivity {
  id: string;
  user_id: string;
  garmin_activity_id: string;
  activity_type: string;
  activity_name: string | null;
  started_at: string;
  duration_seconds: number | null;
  distance_meters: number | null;
  active_calories: number | null;
  avg_heart_rate: number | null;
  max_heart_rate: number | null;
  avg_speed: number | null;
  elevation_gain: number | null;
  raw_json: Record<string, unknown> | null;
  synced_at: string;
}

export interface GarminStressSummary {
  id: string;
  user_id: string;
  stress_date: string;
  avg_stress: number | null;
  max_stress: number | null;
  stress_duration_seconds: number | null;
  rest_duration_seconds: number | null;
  activity_duration_seconds: number | null;
  low_stress_duration_seconds: number | null;
  medium_stress_duration_seconds: number | null;
  high_stress_duration_seconds: number | null;
  raw_json: Record<string, unknown> | null;
  synced_at: string;
}
