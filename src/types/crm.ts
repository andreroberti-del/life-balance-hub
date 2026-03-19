// ============================================================
// CRM Types for Zinzino Partner Pipeline
// ============================================================

export type LeadSource = 'instagram' | 'facebook' | 'whatsapp' | 'referral' | 'event' | 'website' | 'other';

export type LeadStage = 'novo' | 'contato' | 'conversa' | 'apresentacao' | 'decisao' | 'cliente' | 'partner' | 'perdido';

export type ActivityType = 'note' | 'call' | 'whatsapp' | 'email' | 'meeting' | 'stage_change' | 'test_sent' | 'test_result' | 'follow_up';

export type FollowUpType = 'call' | 'whatsapp' | 'email' | 'meeting' | 'reorder' | 'retest' | 'checkin';

export type FollowUpPriority = 'low' | 'normal' | 'high' | 'urgent';

export type ClientStatus = 'active' | 'inactive' | 'churned';

export type BalanceTestStatus = 'enviado' | 'recebido' | 'em_analise' | 'pronto';

export type BalanceTestType = 'balance' | 'gut_health';

// ============================================================
// Core Interfaces
// ============================================================

export interface Lead {
  id: string;
  partner_id: string;
  name: string;
  email: string | null;
  phone: string | null;
  source: LeadSource | null;
  stage: LeadStage;
  notes: string | null;
  tags: string[] | null;
  lost_reason: string | null;
  converted_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LeadActivity {
  id: string;
  lead_id: string;
  partner_id: string;
  type: ActivityType;
  title: string;
  description: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string;
}

export interface FollowUp {
  id: string;
  partner_id: string;
  lead_id: string | null;
  client_id: string | null;
  type: FollowUpType;
  title: string;
  description: string | null;
  suggested_message: string | null;
  due_date: string;
  completed_at: string | null;
  snoozed_until: string | null;
  priority: FollowUpPriority;
  created_at: string;
}

export interface Client {
  id: string;
  partner_id: string;
  lead_id: string | null;
  user_id: string | null;
  name: string;
  email: string | null;
  phone: string | null;
  status: ClientStatus;
  products: ClientProduct[];
  protocol_start_date: string | null;
  next_reorder_date: string | null;
  next_retest_date: string | null;
  lifetime_value: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface ClientProduct {
  product: string;
  start_date: string;
  autoship: boolean;
}

export interface BalanceTestTracking {
  id: string;
  partner_id: string;
  client_id: string | null;
  lead_id: string | null;
  client_name: string;
  status: BalanceTestStatus;
  test_type: BalanceTestType;
  sent_date: string;
  result_date: string | null;
  omega6_ratio: number | null;
  omega3_index: number | null;
  is_retest: boolean;
  previous_test_id: string | null;
  pdf_url: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

// ============================================================
// Stats & Metrics
// ============================================================

export interface PipelineStats {
  novo: number;
  contato: number;
  conversa: number;
  apresentacao: number;
  decisao: number;
  cliente: number;
  partner: number;
  perdido: number;
}

export interface PerformanceMetrics {
  total_leads: number;
  new_leads: number;
  converted_leads: number;
  lost_leads: number;
  conversion_rate: number;
  total_clients: number;
  active_clients: number;
  tests_sent: number;
  tests_completed: number;
  total_follow_ups: number;
  completed_follow_ups: number;
}

// ============================================================
// Input types (for create/update operations)
// ============================================================

export type CreateLeadInput = Omit<Lead, 'id' | 'created_at' | 'updated_at' | 'converted_at'> & {
  converted_at?: string;
};

export type UpdateLeadInput = Partial<Omit<Lead, 'id' | 'partner_id' | 'created_at'>>;

export type CreateLeadActivityInput = Omit<LeadActivity, 'id' | 'created_at'>;

export type CreateFollowUpInput = Omit<FollowUp, 'id' | 'created_at' | 'completed_at' | 'snoozed_until'>;

export type CreateClientInput = Omit<Client, 'id' | 'created_at' | 'updated_at'>;

export type UpdateClientInput = Partial<Omit<Client, 'id' | 'partner_id' | 'created_at'>>;

export type CreateBalanceTestInput = Omit<BalanceTestTracking, 'id' | 'created_at' | 'updated_at'>;
