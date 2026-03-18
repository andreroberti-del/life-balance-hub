import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_URL) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_URL) ||
  'https://yrlwxqjvisjulcnilcyb.supabase.co';

const SUPABASE_ANON_KEY =
  (typeof process !== 'undefined' && process.env?.VITE_SUPABASE_ANON_KEY) ||
  (typeof process !== 'undefined' && process.env?.EXPO_PUBLIC_SUPABASE_ANON_KEY) ||
  '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          name: string;
          weight: number | null;
          height: number | null;
          waist: number | null;
          birth_date: string | null;
          gender: 'male' | 'female' | null;
          language: 'pt' | 'en' | 'es';
          protocol_start_date: string | null;
          avatar_url: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database['public']['Tables']['profiles']['Row']> & { id: string };
        Update: Partial<Database['public']['Tables']['profiles']['Row']>;
      };
      daily_checkins: {
        Row: {
          id: string;
          user_id: string;
          check_date: string;
          weight: number | null;
          waist: number | null;
          sleep_quality: number | null;
          water_liters: number | null;
          took_omega: boolean;
          blood_pressure_sys: number | null;
          blood_pressure_dia: number | null;
          glucose: number | null;
          notes: string | null;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['daily_checkins']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['daily_checkins']['Row']>;
      };
      omega_brands: {
        Row: {
          id: string;
          name: string;
          manufacturer: string | null;
          dosage: string | null;
          price_per_month: number | null;
          omega3_mg: number | null;
          epa_mg: number | null;
          dha_mg: number | null;
          form: 'capsule' | 'liquid' | 'gummy' | 'other' | null;
          image_url: string | null;
          is_verified: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Omit<Database['public']['Tables']['omega_brands']['Row'], 'id' | 'created_at' | 'updated_at'>;
        Update: Partial<Database['public']['Tables']['omega_brands']['Row']>;
      };
      balance_tests: {
        Row: {
          id: string;
          user_id: string;
          test_date: string;
          omega6_ratio: number | null;
          omega3_index: number | null;
          protection_value: number | null;
          mental_strength: number | null;
          cell_membrane: number | null;
          aa_index: number | null;
          omega_brand_id: string | null;
          pdf_url: string | null;
          is_baseline: boolean;
          created_at: string;
        };
        Insert: Omit<Database['public']['Tables']['balance_tests']['Row'], 'id' | 'created_at'>;
        Update: Partial<Database['public']['Tables']['balance_tests']['Row']>;
      };
      scan_results: {
        Row: {
          id: string;
          user_id: string;
          product_name: string;
          barcode: string | null;
          score: number | null;
          verdict: 'excellent' | 'good' | 'moderate' | 'avoid' | null;
          personal_impact: string | null;
          suggestion: string | null;
          image_url: string | null;
          scanned_at: string;
        };
        Insert: Omit<Database['public']['Tables']['scan_results']['Row'], 'id' | 'scanned_at'>;
        Update: Partial<Database['public']['Tables']['scan_results']['Row']>;
      };
    };
    Views: {
      omega_brand_stats: {
        Row: {
          brand_id: string;
          brand_name: string;
          users_count: number;
          avg_ratio_before: number | null;
          avg_ratio_after: number | null;
          improvement_rate: number | null;
        };
      };
      community_metrics: {
        Row: {
          total_members: number;
          total_weight_lost: number;
          avg_ratio_before: number | null;
          avg_ratio_after: number | null;
          sleep_improved_pct: number | null;
        };
      };
    };
    Functions: {
      get_user_streak: { Args: { p_user_id: string }; Returns: number };
      get_protocol_day: { Args: { p_user_id: string }; Returns: number };
    };
  };
};
