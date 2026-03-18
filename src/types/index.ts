export interface Profile {
  id: string;
  name: string;
  email: string;
  weight: number | null;
  height: number | null;
  waist: number | null;
  birth_date: string | null;
  gender: string | null;
  omega_brand: string | null;
  language: string;
  avatar_url: string | null;
  created_at: string;
}

export interface CheckIn {
  id: string;
  user_id: string;
  date: string;
  weight: number | null;
  sleep_quality: number | null;
  water_liters: number | null;
  waist: number | null;
  took_omega: boolean;
  blood_pressure_sys: number | null;
  blood_pressure_dia: number | null;
  glucose: number | null;
  notes: string | null;
  created_at: string;
}

export interface ScanResult {
  id: string;
  user_id: string;
  product_name: string;
  score: number;
  verdict: 'excellent' | 'good' | 'moderate' | 'avoid';
  ingredients: string[];
  personal_impact: string | null;
  scanned_at: string;
}

export interface OmegaBrand {
  id: string;
  name: string;
  manufacturer: string;
  omega3_mg: number;
  epa_mg: number;
  dha_mg: number;
  price: number;
  currency: string;
  users_count: number;
  avg_improvement: number;
  avg_ratio_before: number;
  avg_ratio_after: number;
}

export interface CommunityMetrics {
  total_members: number;
  total_kg_lost: number;
  avg_ratio_improvement: number;
  active_protocols: number;
  total_checkins: number;
  members_trend: number;
  kg_trend: number;
  ratio_trend: number;
}

export interface UserStreak {
  current_streak: number;
  longest_streak: number;
  total_checkins: number;
}

export interface ProtocolDay {
  current_day: number;
  total_days: number;
  start_date: string;
  end_date: string;
  ratio_before: number | null;
  ratio_after: number | null;
  checkin_dates: string[];
}
