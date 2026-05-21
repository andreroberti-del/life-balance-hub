import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface LevelDefinition {
  level: number;
  name_en: string;
  name_pt: string;
  name_es: string;
  min_xp: number;
  max_xp: number;
  badge_color: string;
  description_pt: string | null;
  perks: string[];
}

export interface UserLevel {
  user_id: string;
  current_level: number;
  total_xp: number;
  xp_to_next_level: number;
  level_up_count: number;
  last_xp_event_at: string | null;
}

export interface LevelStateBundle {
  current: LevelDefinition | null;
  next: LevelDefinition | null;
  userLevel: UserLevel | null;
  progressPct: number;
  loading: boolean;
  refetch: () => Promise<void>;
}

export function useLevels(): LevelStateBundle {
  const { user } = useAuth();
  const [definitions, setDefinitions] = useState<LevelDefinition[]>([]);
  const [userLevel, setUserLevel] = useState<UserLevel | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    setLoading(true);

    const { data: defs } = await supabase
      .from('level_definitions')
      .select('*')
      .order('level', { ascending: true });

    const { data: ul } = await supabase
      .from('user_levels')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (defs) setDefinitions(defs);
    if (ul) {
      setUserLevel(ul);
    } else {
      const { data: created } = await supabase
        .from('user_levels')
        .insert({ user_id: user.id })
        .select()
        .maybeSingle();
      if (created) setUserLevel(created);
    }
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  useEffect(() => {
    if (!user?.id) return;
    const channel = supabase
      .channel(`user-level-${user.id}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'user_levels', filter: `user_id=eq.${user.id}` },
        (payload) => {
          if (payload.new) setUserLevel(payload.new as UserLevel);
        }
      )
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, [user?.id]);

  const current = userLevel
    ? definitions.find((d) => d.level === userLevel.current_level) ?? null
    : null;

  const next = userLevel
    ? definitions.find((d) => d.level === (userLevel.current_level ?? 1) + 1) ?? null
    : null;

  let progressPct = 0;
  if (userLevel && current && next) {
    const range = next.min_xp - current.min_xp;
    const into = userLevel.total_xp - current.min_xp;
    progressPct = Math.max(0, Math.min(100, Math.round((into / Math.max(range, 1)) * 100)));
  } else if (userLevel && current && !next) {
    progressPct = 100;
  }

  return { current, next, userLevel, progressPct, loading, refetch: fetchAll };
}

export async function addXP(
  userId: string,
  amount: number,
  reason: string,
  reasonCode: string,
  metadata: Record<string, unknown> = {}
) {
  const { data, error } = await supabase.rpc('add_xp', {
    p_user_id: userId,
    p_amount: amount,
    p_reason: reason,
    p_reason_code: reasonCode,
    p_metadata: metadata,
  });
  if (error) throw error;
  return data?.[0] as
    | { new_total_xp: number; new_level: number; leveled_up: boolean; level_name_pt: string }
    | undefined;
}
