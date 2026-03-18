export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      balance_tests: {
        Row: {
          aa_index: number | null
          cell_membrane: number | null
          created_at: string | null
          id: string
          is_baseline: boolean | null
          mental_strength: number | null
          omega_brand_id: string | null
          omega3_index: number | null
          omega6_ratio: number | null
          pdf_url: string | null
          protection_value: number | null
          test_date: string
          user_id: string
        }
        Insert: {
          aa_index?: number | null
          cell_membrane?: number | null
          created_at?: string | null
          id?: string
          is_baseline?: boolean | null
          mental_strength?: number | null
          omega_brand_id?: string | null
          omega3_index?: number | null
          omega6_ratio?: number | null
          pdf_url?: string | null
          protection_value?: number | null
          test_date: string
          user_id: string
        }
        Update: {
          aa_index?: number | null
          cell_membrane?: number | null
          created_at?: string | null
          id?: string
          is_baseline?: boolean | null
          mental_strength?: number | null
          omega_brand_id?: string | null
          omega3_index?: number | null
          omega6_ratio?: number | null
          pdf_url?: string | null
          protection_value?: number | null
          test_date?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "balance_tests_omega_brand_id_fkey"
            columns: ["omega_brand_id"]
            isOneToOne: false
            referencedRelation: "omega_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "balance_tests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      daily_checkins: {
        Row: {
          blood_pressure_dia: number | null
          blood_pressure_sys: number | null
          check_date: string
          created_at: string | null
          glucose: number | null
          id: string
          notes: string | null
          sleep_quality: number | null
          took_omega: boolean | null
          user_id: string
          waist: number | null
          water_liters: number | null
          weight: number | null
        }
        Insert: {
          blood_pressure_dia?: number | null
          blood_pressure_sys?: number | null
          check_date?: string
          created_at?: string | null
          glucose?: number | null
          id?: string
          notes?: string | null
          sleep_quality?: number | null
          took_omega?: boolean | null
          user_id: string
          waist?: number | null
          water_liters?: number | null
          weight?: number | null
        }
        Update: {
          blood_pressure_dia?: number | null
          blood_pressure_sys?: number | null
          check_date?: string
          created_at?: string | null
          glucose?: number | null
          id?: string
          notes?: string | null
          sleep_quality?: number | null
          took_omega?: boolean | null
          user_id?: string
          waist?: number | null
          water_liters?: number | null
          weight?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "daily_checkins_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      omega_brands: {
        Row: {
          created_at: string | null
          dha_mg: number | null
          dosage: string | null
          epa_mg: number | null
          form: string | null
          id: string
          image_url: string | null
          is_verified: boolean | null
          manufacturer: string | null
          name: string
          omega3_mg: number | null
          price_per_month: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          dha_mg?: number | null
          dosage?: string | null
          epa_mg?: number | null
          form?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          manufacturer?: string | null
          name: string
          omega3_mg?: number | null
          price_per_month?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          dha_mg?: number | null
          dosage?: string | null
          epa_mg?: number | null
          form?: string | null
          id?: string
          image_url?: string | null
          is_verified?: boolean | null
          manufacturer?: string | null
          name?: string
          omega3_mg?: number | null
          price_per_month?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          birth_date: string | null
          created_at: string | null
          gender: string | null
          height: number | null
          id: string
          language: string | null
          name: string
          protocol_start_date: string | null
          updated_at: string | null
          waist: number | null
          weight: number | null
        }
        Insert: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id: string
          language?: string | null
          name?: string
          protocol_start_date?: string | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Update: {
          avatar_url?: string | null
          birth_date?: string | null
          created_at?: string | null
          gender?: string | null
          height?: number | null
          id?: string
          language?: string | null
          name?: string
          protocol_start_date?: string | null
          updated_at?: string | null
          waist?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      scan_ingredients: {
        Row: {
          id: string
          name: string
          scan_id: string
          score: string | null
          sort_order: number | null
          tag: string | null
        }
        Insert: {
          id?: string
          name: string
          scan_id: string
          score?: string | null
          sort_order?: number | null
          tag?: string | null
        }
        Update: {
          id?: string
          name?: string
          scan_id?: string
          score?: string | null
          sort_order?: number | null
          tag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_ingredients_scan_id_fkey"
            columns: ["scan_id"]
            isOneToOne: false
            referencedRelation: "scan_results"
            referencedColumns: ["id"]
          },
        ]
      }
      scan_results: {
        Row: {
          barcode: string | null
          id: string
          image_url: string | null
          personal_impact: string | null
          product_name: string
          scanned_at: string | null
          score: number | null
          suggestion: string | null
          user_id: string
          verdict: string | null
        }
        Insert: {
          barcode?: string | null
          id?: string
          image_url?: string | null
          personal_impact?: string | null
          product_name: string
          scanned_at?: string | null
          score?: number | null
          suggestion?: string | null
          user_id: string
          verdict?: string | null
        }
        Update: {
          barcode?: string | null
          id?: string
          image_url?: string | null
          personal_impact?: string | null
          product_name?: string
          scanned_at?: string | null
          score?: number | null
          suggestion?: string | null
          user_id?: string
          verdict?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "scan_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      user_omega: {
        Row: {
          brand_id: string | null
          created_at: string | null
          custom_brand_name: string | null
          dosage: string | null
          ended_at: string | null
          id: string
          started_at: string | null
          user_id: string
        }
        Insert: {
          brand_id?: string | null
          created_at?: string | null
          custom_brand_name?: string | null
          dosage?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          user_id: string
        }
        Update: {
          brand_id?: string | null
          created_at?: string | null
          custom_brand_name?: string | null
          dosage?: string | null
          ended_at?: string | null
          id?: string
          started_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_omega_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "omega_brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_omega_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_protocol_day: { Args: { p_user_id: string }; Returns: number }
      get_user_streak: { Args: { p_user_id: string }; Returns: number }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
