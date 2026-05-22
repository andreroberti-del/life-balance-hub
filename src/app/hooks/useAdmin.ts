import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface AdminOverview {
  users: { total: number; new_today: number; new_week: number; new_month: number; dau: number; wau: number; mau: number };
  revenue: { mrr_cents: number; total_cents: number; last_30d_cents: number };
  subscriptions: { premium_active: number; free_active: number; trial_active: number };
  growth: {
    referrals_total: number; referrals_active: number; family_premium_rewards: number;
    distributors_approved: number; distributors_in_review: number;
  };
  engagement: { lessons_completed_today: number; scans_today: number; ai_calls_today: number; ai_calls_30d: number };
  generated_at: string;
}

export interface AdminUserRow {
  id: string;
  display_name: string | null;
  email: string;
  created_at: string;
  protocol_start_date: string | null;
  plan: string;
  subscription_status: string;
  current_level: number;
  total_xp: number;
  referral_code: string;
  active_referrals: number;
  last_active_at: string | null;
  distributor_status: string | null;
  admin_role: string | null;
}

export function useIsAdmin() {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.from('admin_roles').select('role').eq('user_id', user.id).maybeSingle();
      const role = data?.role ?? null;
      setIsAdmin(role !== null && ['super_admin', 'admin', 'analyst'].includes(role));
      setIsSuperAdmin(role === 'super_admin');
      setLoading(false);
    })();
  }, [user?.id]);

  return { isAdmin, isSuperAdmin, loading };
}

export function useAdminOverview() {
  const [data, setData] = useState<AdminOverview | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refetch = useCallback(async () => {
    setLoading(true);
    const { data: res, error } = await supabase.rpc('admin_dashboard_overview');
    if (error) setError(error.message);
    else if ((res as { error?: string })?.error) setError((res as { error?: string }).error!);
    else setData(res as AdminOverview);
    setLoading(false);
  }, []);

  useEffect(() => { refetch(); }, [refetch]);

  return { data, loading, error, refetch };
}

export function useAdminUsers(opts: {
  limit?: number; offset?: number; search?: string; plan?: string | null; sortBy?: string;
} = {}) {
  const [data, setData] = useState<{ total: number; rows: AdminUserRow[] } | null>(null);
  const [loading, setLoading] = useState(true);

  const fetch = useCallback(async () => {
    setLoading(true);
    const { data: res } = await supabase.rpc('admin_users_list', {
      p_limit: opts.limit ?? 50,
      p_offset: opts.offset ?? 0,
      p_search: opts.search ?? null,
      p_plan_filter: opts.plan ?? null,
      p_sort_by: opts.sortBy ?? 'created_at',
    });
    if (res && !(res as { error?: string }).error) {
      setData(res as { total: number; rows: AdminUserRow[] });
    }
    setLoading(false);
  }, [opts.limit, opts.offset, opts.search, opts.plan, opts.sortBy]);

  useEffect(() => { fetch(); }, [fetch]);

  return { data, loading, refetch: fetch };
}

export async function fetchAdminUserDetail(userId: string) {
  const { data } = await supabase.rpc('admin_user_detail', { p_user_id: userId });
  return data;
}

export interface EngagementDay {
  date: string; signups: number; active_users: number; xp_earned: number;
  lessons_completed: number; scans: number; workouts: number; ai_calls: number;
}

export function useEngagementTimeseries(days = 30) {
  const [data, setData] = useState<EngagementDay[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data: res } = await supabase.rpc('admin_engagement_timeseries', { p_days: days });
      setData((res as EngagementDay[]) ?? []);
      setLoading(false);
    })();
  }, [days]);

  return { data, loading };
}
