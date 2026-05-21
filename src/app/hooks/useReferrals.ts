import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface ReferralCode {
  user_id: string;
  code: string;
  uses_count: number;
  active_referrals: number;
  created_at: string;
}

export interface Referral {
  id: string;
  referrer_id: string;
  referred_id: string;
  code_used: string;
  level: number;
  status: 'pending' | 'active' | 'inactive' | 'churned';
  is_premium_active: boolean;
  activated_at: string | null;
  created_at: string;
  referred?: {
    display_name: string | null;
    avatar_url: string | null;
    email: string | null;
  } | null;
}

export interface ReferralReward {
  id: string;
  user_id: string;
  reward_type: string;
  reward_value: Record<string, unknown>;
  trigger_count: number;
  granted_at: string;
  expires_at: string | null;
  is_active: boolean;
}

export interface ReferralBundle {
  myCode: ReferralCode | null;
  referrals: Referral[];
  rewards: ReferralReward[];
  stats: {
    total: number;
    active: number;
    pending: number;
    untilNextReward: number;
  };
  loading: boolean;
  refetch: () => Promise<void>;
  shareLink: string;
}

export function useReferrals(): ReferralBundle {
  const { user } = useAuth();
  const [myCode, setMyCode] = useState<ReferralCode | null>(null);
  const [referrals, setReferrals] = useState<Referral[]>([]);
  const [rewards, setRewards] = useState<ReferralReward[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: code } = await supabase
      .from('referral_codes')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (!code) {
      const { data: newCodeRow } = await supabase
        .from('referral_codes')
        .insert({ user_id: user.id, code: 'M7-PENDING' })
        .select()
        .maybeSingle();
      if (newCodeRow) setMyCode(newCodeRow);
    } else {
      setMyCode(code);
    }

    const { data: refs } = await supabase
      .from('referrals')
      .select(`
        *,
        referred:profiles!referred_id (display_name, avatar_url, email)
      `)
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false });

    if (refs) setReferrals(refs as Referral[]);

    const { data: rws } = await supabase
      .from('referral_rewards')
      .select('*')
      .eq('user_id', user.id)
      .order('granted_at', { ascending: false });

    if (rws) setRewards(rws);

    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = {
    total: referrals.length,
    active: referrals.filter((r) => r.status === 'active').length,
    pending: referrals.filter((r) => r.status === 'pending').length,
    untilNextReward: Math.max(0, 3 - referrals.filter((r) => r.status === 'active').length),
  };

  const shareLink = myCode?.code
    ? `${typeof window !== 'undefined' ? window.location.origin : ''}/signup?ref=${myCode.code}`
    : '';

  return { myCode, referrals, rewards, stats, loading, refetch: fetchAll, shareLink };
}

export async function applyReferralCode(newUserId: string, code: string) {
  const { data, error } = await supabase.rpc('apply_referral_code', {
    p_new_user_id: newUserId,
    p_code: code,
  });
  if (error) throw error;
  return data?.[0] as { success: boolean; message: string; referrer_id: string | null } | undefined;
}
