import { useEffect, useState, useCallback } from 'react';
import { supabase } from '../services/supabase';
import { useAuth } from '../contexts/AuthContext';
import { addXP } from './useLevels';

export interface EmotionalCheckin {
  id: string;
  user_id: string;
  check_date: string;
  mood: number;
  stress: number | null;
  anxiety: number | null;
  energy: number | null;
  gratitude_text: string | null;
  emotions: string[];
  notes: string | null;
}

export interface BreathingTechnique {
  id: string;
  slug: string;
  name_pt: string;
  description_pt: string;
  inhale_seconds: number;
  hold_seconds: number;
  exhale_seconds: number;
  hold_after_exhale_seconds: number;
  recommended_cycles: number;
  benefit_pt: string;
  best_for_pt: string;
}

export interface Devotional {
  id: string;
  slug: string;
  title_pt: string;
  scripture_quote: string | null;
  scripture_reference: string | null;
  reflection_pt: string;
  prayer_pt: string | null;
  action_pt: string | null;
  category: string | null;
  estimated_minutes: number;
  xp_reward: number;
}

export interface GratitudeEntry {
  id: string;
  user_id: string;
  entry_date: string;
  item_1: string;
  item_2: string | null;
  item_3: string | null;
  reflection: string | null;
}

export interface PeerBenchmark {
  peer_count: number;
  peer_group_label_pt: string;
  my_xp: number;
  peer_avg_xp: number;
  my_level: number;
  peer_avg_level: number;
  percentile: number;
}

export function useEmotionalCheckin() {
  const { user } = useAuth();
  const [today, setToday] = useState<EmotionalCheckin | null>(null);
  const [history, setHistory] = useState<EmotionalCheckin[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    setLoading(true);
    const todayDate = new Date().toISOString().split('T')[0];

    const [{ data: t }, { data: h }] = await Promise.all([
      supabase.from('emotional_checkins').select('*').eq('user_id', user.id).eq('check_date', todayDate).maybeSingle(),
      supabase.from('emotional_checkins').select('*').eq('user_id', user.id).order('check_date', { ascending: false }).limit(30),
    ]);

    setToday(t);
    setHistory((h ?? []) as EmotionalCheckin[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  const submit = async (data: Partial<EmotionalCheckin>) => {
    if (!user?.id) return null;
    const todayDate = new Date().toISOString().split('T')[0];
    const payload = { ...data, user_id: user.id, check_date: todayDate };
    const { data: row, error } = await supabase
      .from('emotional_checkins')
      .upsert(payload, { onConflict: 'user_id,check_date' })
      .select()
      .maybeSingle();

    if (!error && row && !today) {
      try { await addXP(user.id, 15, 'Check-in emocional', 'emotional_checkin'); } catch (e) { void e; }
    }
    if (row) {
      setToday(row);
      await fetchAll();
    }
    return row;
  };

  return { today, history, loading, refetch: fetchAll, submit };
}

export function useBreathingTechniques() {
  const [techniques, setTechniques] = useState<BreathingTechnique[]>([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      const { data } = await supabase.from('breathing_techniques').select('*').order('display_order');
      setTechniques((data ?? []) as BreathingTechnique[]);
      setLoading(false);
    })();
  }, []);
  return { techniques, loading };
}

export async function logBreathingSession(
  userId: string,
  techniqueSlug: string,
  cyclesCompleted: number,
  durationSeconds: number,
  moodBefore?: number,
  moodAfter?: number
) {
  const { data } = await supabase
    .from('breathing_sessions')
    .insert({
      user_id: userId,
      technique_slug: techniqueSlug,
      cycles_completed: cyclesCompleted,
      duration_seconds: durationSeconds,
      mood_before: moodBefore,
      mood_after: moodAfter,
    })
    .select()
    .maybeSingle();

  try { await addXP(userId, 10, 'Sessão de respiração', 'breathing_session'); } catch (e) { void e; }
  return data;
}

export function useDevotionals() {
  const { user } = useAuth();
  const [devotionals, setDevotionals] = useState<Devotional[]>([]);
  const [readMap, setReadMap] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const [{ data: list }, { data: reads }] = await Promise.all([
        supabase.from('devotionals').select('*').eq('is_published', true).order('display_order'),
        user?.id
          ? supabase.from('user_devotional_reads').select('devotional_id').eq('user_id', user.id)
          : Promise.resolve({ data: null }),
      ]);
      setDevotionals((list ?? []) as Devotional[]);
      setReadMap(new Set((reads ?? []).map((r: { devotional_id: string }) => r.devotional_id)));
      setLoading(false);
    })();
  }, [user?.id]);

  const markAsRead = async (devotionalId: string, reflection?: string) => {
    if (!user?.id) return;
    await supabase
      .from('user_devotional_reads')
      .upsert({ user_id: user.id, devotional_id: devotionalId, reflection_response: reflection ?? null });
    setReadMap((prev) => new Set([...prev, devotionalId]));
    const dev = devotionals.find((d) => d.id === devotionalId);
    if (dev) {
      try { await addXP(user.id, dev.xp_reward, `Devocional: ${dev.title_pt}`, 'devotional_read'); } catch (e) { void e; }
    }
  };

  return { devotionals, readMap, loading, markAsRead };
}

export function useGratitude() {
  const { user } = useAuth();
  const [today, setToday] = useState<GratitudeEntry | null>(null);
  const [history, setHistory] = useState<GratitudeEntry[]>([]);
  const [loading, setLoading] = useState(true);

  const refetch = useCallback(async () => {
    if (!user?.id) { setLoading(false); return; }
    const todayDate = new Date().toISOString().split('T')[0];
    const [{ data: t }, { data: h }] = await Promise.all([
      supabase.from('gratitude_entries').select('*').eq('user_id', user.id).eq('entry_date', todayDate).maybeSingle(),
      supabase.from('gratitude_entries').select('*').eq('user_id', user.id).order('entry_date', { ascending: false }).limit(14),
    ]);
    setToday(t);
    setHistory((h ?? []) as GratitudeEntry[]);
    setLoading(false);
  }, [user?.id]);

  useEffect(() => { refetch(); }, [refetch]);

  const submit = async (item1: string, item2?: string, item3?: string, reflection?: string) => {
    if (!user?.id || !item1.trim()) return;
    const todayDate = new Date().toISOString().split('T')[0];
    const wasNew = !today;
    const { data } = await supabase
      .from('gratitude_entries')
      .upsert({
        user_id: user.id,
        entry_date: todayDate,
        item_1: item1.trim(),
        item_2: item2?.trim() || null,
        item_3: item3?.trim() || null,
        reflection: reflection?.trim() || null,
      }, { onConflict: 'user_id,entry_date' })
      .select()
      .maybeSingle();
    if (wasNew && data) {
      try { await addXP(user.id, 15, 'Diário de gratidão', 'gratitude_entry'); } catch (e) { void e; }
    }
    await refetch();
    return data;
  };

  return { today, history, loading, submit, refetch };
}

export function usePeerBenchmark() {
  const { user } = useAuth();
  const [benchmark, setBenchmark] = useState<PeerBenchmark | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user?.id) { setLoading(false); return; }
    (async () => {
      const { data } = await supabase.rpc('peer_benchmark', { p_user_id: user.id });
      setBenchmark(data?.[0] ?? null);
      setLoading(false);
    })();
  }, [user?.id]);

  return { benchmark, loading };
}
