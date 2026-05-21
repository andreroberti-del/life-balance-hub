import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';

export interface DailyQuest {
  quest_code: string;
  title_pt: string;
  description_pt: string;
  icon_name: string;
  xp_reward: number;
  category: 'body' | 'mind' | 'spirit' | 'social' | 'learn';
  is_completed: boolean;
}

export function useDailyQuests() {
  const { user } = useAuth();
  const [quests, setQuests] = useState<DailyQuest[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchQuests = useCallback(async () => {
    if (!user?.id) {
      setLoading(false);
      return;
    }
    const { data } = await supabase.rpc('ensure_daily_quests', { p_user_id: user.id });
    setQuests((data ?? []) as DailyQuest[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => {
    fetchQuests();
  }, [fetchQuests]);

  const completeQuest = async (questCode: string) => {
    if (!user?.id) return null;
    const { data } = await supabase.rpc('complete_daily_quest', {
      p_user_id: user.id,
      p_quest_code: questCode,
    });
    await fetchQuests();
    return data?.[0] as { xp_gained: number; daily_complete: boolean; bonus_xp: number } | null;
  };

  const completedCount = quests.filter((q) => q.is_completed).length;
  const totalCount = quests.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return { quests, loading, refetch: fetchQuests, completeQuest, completedCount, totalCount, progressPct };
}
