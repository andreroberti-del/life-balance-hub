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
      crm_balance_tests: {
        Row: {
          client_id: string | null
          client_name: string
          created_at: string | null
          id: string
          is_retest: boolean | null
          lead_id: string | null
          notes: string | null
          omega3_index: number | null
          omega6_ratio: number | null
          partner_id: string
          pdf_url: string | null
          previous_test_id: string | null
          result_date: string | null
          sent_date: string | null
          status: string
          test_type: string | null
          updated_at: string | null
        }
        Insert: {
          client_id?: string | null
          client_name: string
          created_at?: string | null
          id?: string
          is_retest?: boolean | null
          lead_id?: string | null
          notes?: string | null
          omega3_index?: number | null
          omega6_ratio?: number | null
          partner_id: string
          pdf_url?: string | null
          previous_test_id?: string | null
          result_date?: string | null
          sent_date?: string | null
          status?: string
          test_type?: string | null
          updated_at?: string | null
        }
        Update: {
          client_id?: string | null
          client_name?: string
          created_at?: string | null
          id?: string
          is_retest?: boolean | null
          lead_id?: string | null
          notes?: string | null
          omega3_index?: number | null
          omega6_ratio?: number | null
          partner_id?: string
          pdf_url?: string | null
          previous_test_id?: string | null
          result_date?: string | null
          sent_date?: string | null
          status?: string
          test_type?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_balance_tests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_balance_tests_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_balance_tests_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_balance_tests_previous_test_id_fkey"
            columns: ["previous_test_id"]
            isOneToOne: false
            referencedRelation: "crm_balance_tests"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_clients: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          lead_id: string | null
          lifetime_value: number | null
          name: string
          next_reorder_date: string | null
          next_retest_date: string | null
          notes: string | null
          partner_id: string
          phone: string | null
          products: Json | null
          protocol_start_date: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          lead_id?: string | null
          lifetime_value?: number | null
          name: string
          next_reorder_date?: string | null
          next_retest_date?: string | null
          notes?: string | null
          partner_id: string
          phone?: string | null
          products?: Json | null
          protocol_start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          lead_id?: string | null
          lifetime_value?: number | null
          name?: string
          next_reorder_date?: string | null
          next_retest_date?: string | null
          notes?: string | null
          partner_id?: string
          phone?: string | null
          products?: Json | null
          protocol_start_date?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_clients_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_clients_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_clients_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_follow_ups: {
        Row: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          lead_id: string | null
          partner_id: string
          priority: string | null
          snoozed_until: string | null
          suggested_message: string | null
          title: string
          type: string
        }
        Insert: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date: string
          id?: string
          lead_id?: string | null
          partner_id: string
          priority?: string | null
          snoozed_until?: string | null
          suggested_message?: string | null
          title: string
          type: string
        }
        Update: {
          client_id?: string | null
          completed_at?: string | null
          created_at?: string | null
          description?: string | null
          due_date?: string
          id?: string
          lead_id?: string | null
          partner_id?: string
          priority?: string | null
          snoozed_until?: string | null
          suggested_message?: string | null
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_follow_ups_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "crm_clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_follow_ups_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_follow_ups_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_lead_activities: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          lead_id: string
          metadata: Json | null
          partner_id: string
          title: string
          type: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id: string
          metadata?: Json | null
          partner_id: string
          title: string
          type: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          lead_id?: string
          metadata?: Json | null
          partner_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "crm_lead_activities_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "crm_leads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "crm_lead_activities_partner_id_fkey"
            columns: ["partner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      crm_leads: {
        Row: {
          converted_at: string | null
          created_at: string | null
          email: string | null
          id: string
          lost_reason: string | null
          name: string
          notes: string | null
          partner_id: string
          phone: string | null
          source: string | null
          stage: string
          tags: string[] | null
          updated_at: string | null
        }
        Insert: {
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lost_reason?: string | null
          name: string
          notes?: string | null
          partner_id: string
          phone?: string | null
          source?: string | null
          stage?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Update: {
          converted_at?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          lost_reason?: string | null
          name?: string
          notes?: string | null
          partner_id?: string
          phone?: string | null
          source?: string | null
          stage?: string
          tags?: string[] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "crm_leads_partner_id_fkey"
            columns: ["partner_id"]
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
      get_follow_ups_today: {
        Args: { p_partner_id: string }
        Returns: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          lead_id: string | null
          partner_id: string
          priority: string | null
          snoozed_until: string | null
          suggested_message: string | null
          title: string
          type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "crm_follow_ups"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_overdue_follow_ups: {
        Args: { p_partner_id: string }
        Returns: {
          client_id: string | null
          completed_at: string | null
          created_at: string | null
          description: string | null
          due_date: string
          id: string
          lead_id: string | null
          partner_id: string
          priority: string | null
          snoozed_until: string | null
          suggested_message: string | null
          title: string
          type: string
        }[]
        SetofOptions: {
          from: "*"
          to: "crm_follow_ups"
          isOneToOne: false
          isSetofReturn: true
        }
      }
      get_performance_metrics: {
        Args: {
          p_partner_id: string
          p_period_end: string
          p_period_start: string
        }
        Returns: {
          active_clients: number
          completed_follow_ups: number
          conversion_rate: number
          converted_leads: number
          lost_leads: number
          new_leads: number
          tests_completed: number
          tests_sent: number
          total_clients: number
          total_follow_ups: number
          total_leads: number
        }[]
      }
      get_pipeline_stats: {
        Args: { p_partner_id: string }
        Returns: {
          count: number
          stage: string
        }[]
      }
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
