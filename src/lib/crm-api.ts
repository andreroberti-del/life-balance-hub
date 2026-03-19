import { supabase } from './supabase';
import type {
  Lead,
  LeadActivity,
  FollowUp,
  Client,
  BalanceTestTracking,
  PipelineStats,
  PerformanceMetrics,
  LeadStage,
  BalanceTestStatus,
  ClientStatus,
  CreateLeadInput,
  UpdateLeadInput,
  CreateLeadActivityInput,
  CreateFollowUpInput,
  CreateClientInput,
  UpdateClientInput,
  CreateBalanceTestInput,
} from '../types/crm';

// ============================================================
// LEADS
// ============================================================

export async function getLeads(stage?: LeadStage): Promise<Lead[]> {
  let query = supabase
    .from('crm_leads')
    .select('*')
    .order('updated_at', { ascending: false });

  if (stage) {
    query = query.eq('stage', stage);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching leads:', error);
    return [];
  }
  return (data as Lead[]) || [];
}

export async function createLead(lead: CreateLeadInput): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('crm_leads')
    .insert(lead)
    .select()
    .single();

  if (error) {
    console.error('Error creating lead:', error);
    return null;
  }
  return data as Lead;
}

export async function updateLead(
  id: string,
  updates: UpdateLeadInput
): Promise<Lead | null> {
  const { data, error } = await supabase
    .from('crm_leads')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating lead:', error);
    return null;
  }
  return data as Lead;
}

// ============================================================
// LEAD ACTIVITIES
// ============================================================

export async function getLeadActivities(leadId: string): Promise<LeadActivity[]> {
  const { data, error } = await supabase
    .from('crm_lead_activities')
    .select('*')
    .eq('lead_id', leadId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching lead activities:', error);
    return [];
  }
  return (data as LeadActivity[]) || [];
}

export async function addLeadActivity(
  activity: CreateLeadActivityInput
): Promise<LeadActivity | null> {
  const { data, error } = await supabase
    .from('crm_lead_activities')
    .insert(activity)
    .select()
    .single();

  if (error) {
    console.error('Error adding lead activity:', error);
    return null;
  }
  return data as LeadActivity;
}

// ============================================================
// FOLLOW-UPS
// ============================================================

export async function getFollowUps(
  date?: string,
  includeOverdue = true
): Promise<FollowUp[]> {
  let query = supabase
    .from('crm_follow_ups')
    .select('*')
    .is('completed_at', null)
    .order('priority', { ascending: false })
    .order('due_date', { ascending: true });

  if (date) {
    if (includeOverdue) {
      query = query.lte('due_date', `${date}T23:59:59.999Z`);
    } else {
      query = query
        .gte('due_date', `${date}T00:00:00.000Z`)
        .lte('due_date', `${date}T23:59:59.999Z`);
    }
  }

  // Filter out snoozed follow-ups
  query = query.or('snoozed_until.is.null,snoozed_until.lte.now()');

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching follow-ups:', error);
    return [];
  }
  return (data as FollowUp[]) || [];
}

export async function createFollowUp(
  followUp: CreateFollowUpInput
): Promise<FollowUp | null> {
  const { data, error } = await supabase
    .from('crm_follow_ups')
    .insert(followUp)
    .select()
    .single();

  if (error) {
    console.error('Error creating follow-up:', error);
    return null;
  }
  return data as FollowUp;
}

export async function completeFollowUp(id: string): Promise<FollowUp | null> {
  const { data, error } = await supabase
    .from('crm_follow_ups')
    .update({ completed_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error completing follow-up:', error);
    return null;
  }
  return data as FollowUp;
}

export async function snoozeFollowUp(
  id: string,
  until: string
): Promise<FollowUp | null> {
  const { data, error } = await supabase
    .from('crm_follow_ups')
    .update({ snoozed_until: until })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error snoozing follow-up:', error);
    return null;
  }
  return data as FollowUp;
}

// ============================================================
// CLIENTS
// ============================================================

export async function getClients(status?: ClientStatus): Promise<Client[]> {
  let query = supabase
    .from('crm_clients')
    .select('*')
    .order('name', { ascending: true });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching clients:', error);
    return [];
  }
  return (data as Client[]) || [];
}

export async function createClient(
  client: CreateClientInput
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('crm_clients')
    .insert(client)
    .select()
    .single();

  if (error) {
    console.error('Error creating client:', error);
    return null;
  }
  return data as Client;
}

export async function updateClient(
  id: string,
  updates: UpdateClientInput
): Promise<Client | null> {
  const { data, error } = await supabase
    .from('crm_clients')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating client:', error);
    return null;
  }
  return data as Client;
}

// ============================================================
// BALANCE TESTS
// ============================================================

export async function getBalanceTests(
  status?: BalanceTestStatus
): Promise<BalanceTestTracking[]> {
  let query = supabase
    .from('crm_balance_tests')
    .select('*')
    .order('created_at', { ascending: false });

  if (status) {
    query = query.eq('status', status);
  }

  const { data, error } = await query;

  if (error) {
    console.error('Error fetching balance tests:', error);
    return [];
  }
  return (data as BalanceTestTracking[]) || [];
}

export async function createBalanceTest(
  test: CreateBalanceTestInput
): Promise<BalanceTestTracking | null> {
  const { data, error } = await supabase
    .from('crm_balance_tests')
    .insert(test)
    .select()
    .single();

  if (error) {
    console.error('Error creating balance test:', error);
    return null;
  }
  return data as BalanceTestTracking;
}

export async function updateBalanceTestStatus(
  id: string,
  status: BalanceTestStatus,
  extras?: Partial<Pick<BalanceTestTracking, 'result_date' | 'omega6_ratio' | 'omega3_index' | 'pdf_url'>>
): Promise<BalanceTestTracking | null> {
  const updates: Record<string, unknown> = { status };

  if (extras) {
    if (extras.result_date !== undefined) updates.result_date = extras.result_date;
    if (extras.omega6_ratio !== undefined) updates.omega6_ratio = extras.omega6_ratio;
    if (extras.omega3_index !== undefined) updates.omega3_index = extras.omega3_index;
    if (extras.pdf_url !== undefined) updates.pdf_url = extras.pdf_url;
  }

  const { data, error } = await supabase
    .from('crm_balance_tests')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating balance test status:', error);
    return null;
  }
  return data as BalanceTestTracking;
}

// ============================================================
// PIPELINE STATS & METRICS
// ============================================================

export async function getPipelineStats(): Promise<PipelineStats> {
  const defaultStats: PipelineStats = {
    novo: 0,
    contato: 0,
    conversa: 0,
    apresentacao: 0,
    decisao: 0,
    cliente: 0,
    partner: 0,
    perdido: 0,
  };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    console.error('Error fetching pipeline stats: not authenticated');
    return defaultStats;
  }

  const { data, error } = await supabase
    .rpc('get_pipeline_stats', { p_partner_id: userData.user.id });

  if (error) {
    console.error('Error fetching pipeline stats:', error);
    return defaultStats;
  }

  const stats = { ...defaultStats };
  if (data) {
    for (const row of data as Array<{ stage: string; count: number }>) {
      const stage = row.stage as keyof PipelineStats;
      if (stage in stats) {
        stats[stage] = Number(row.count);
      }
    }
  }
  return stats;
}

export async function getPerformanceMetrics(
  period: { start: string; end: string }
): Promise<PerformanceMetrics> {
  const defaultMetrics: PerformanceMetrics = {
    total_leads: 0,
    new_leads: 0,
    converted_leads: 0,
    lost_leads: 0,
    conversion_rate: 0,
    total_clients: 0,
    active_clients: 0,
    tests_sent: 0,
    tests_completed: 0,
    total_follow_ups: 0,
    completed_follow_ups: 0,
  };

  const { data: userData } = await supabase.auth.getUser();
  if (!userData.user) {
    console.error('Error fetching performance metrics: not authenticated');
    return defaultMetrics;
  }

  const { data, error } = await supabase
    .rpc('get_performance_metrics', {
      p_partner_id: userData.user.id,
      p_period_start: period.start,
      p_period_end: period.end,
    });

  if (error) {
    console.error('Error fetching performance metrics:', error);
    return defaultMetrics;
  }

  if (data && Array.isArray(data) && data.length > 0) {
    const row = data[0] as Record<string, number>;
    return {
      total_leads: Number(row.total_leads ?? 0),
      new_leads: Number(row.new_leads ?? 0),
      converted_leads: Number(row.converted_leads ?? 0),
      lost_leads: Number(row.lost_leads ?? 0),
      conversion_rate: Number(row.conversion_rate ?? 0),
      total_clients: Number(row.total_clients ?? 0),
      active_clients: Number(row.active_clients ?? 0),
      tests_sent: Number(row.tests_sent ?? 0),
      tests_completed: Number(row.tests_completed ?? 0),
      total_follow_ups: Number(row.total_follow_ups ?? 0),
      completed_follow_ups: Number(row.completed_follow_ups ?? 0),
    };
  }

  return defaultMetrics;
}
