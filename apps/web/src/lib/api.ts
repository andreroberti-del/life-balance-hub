import { supabase } from './supabase';
import type {
  Profile,
  CheckIn,
  ScanResult,
  OmegaBrand,
  CommunityMetrics,
  UserStreak,
  ProtocolDay,
} from '../types';

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();

  if (error) {
    console.error('Error fetching profile:', error);
    return null;
  }
  return data;
}

export async function updateProfile(
  userId: string,
  updates: Partial<Profile>
): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    console.error('Error updating profile:', error);
    return null;
  }
  return data;
}

export async function saveCheckIn(
  checkIn: Omit<CheckIn, 'id' | 'created_at'>
): Promise<CheckIn | null> {
  const { data, error } = await supabase
    .from('checkins')
    .insert(checkIn)
    .select()
    .single();

  if (error) {
    console.error('Error saving check-in:', error);
    return null;
  }
  return data;
}

export async function getCheckIns(
  userId: string,
  limit = 30
): Promise<CheckIn[]> {
  const { data, error } = await supabase
    .from('checkins')
    .select('*')
    .eq('user_id', userId)
    .order('date', { ascending: false })
    .limit(limit);

  if (error) {
    console.error('Error fetching check-ins:', error);
    return [];
  }
  return data || [];
}

export async function getOmegaBrands(): Promise<OmegaBrand[]> {
  const { data, error } = await supabase
    .from('omega_brands')
    .select('*')
    .order('users_count', { ascending: false });

  if (error) {
    console.error('Error fetching omega brands:', error);
    return [];
  }
  return data || [];
}

export async function getScanHistory(userId: string): Promise<ScanResult[]> {
  const { data, error } = await supabase
    .from('scan_results')
    .select('*')
    .eq('user_id', userId)
    .order('scanned_at', { ascending: false });

  if (error) {
    console.error('Error fetching scan history:', error);
    return [];
  }
  return data || [];
}

export async function getCommunityMetrics(): Promise<CommunityMetrics | null> {
  const { data, error } = await supabase
    .from('community_metrics')
    .select('*')
    .single();

  if (error) {
    console.error('Error fetching community metrics:', error);
    return null;
  }
  return data;
}

export async function getUserStreak(userId: string): Promise<UserStreak> {
  const { data, error } = await supabase
    .from('user_streaks')
    .select('*')
    .eq('user_id', userId)
    .single();

  if (error) {
    console.error('Error fetching user streak:', error);
    return { current_streak: 0, longest_streak: 0, total_checkins: 0 };
  }
  return data || { current_streak: 0, longest_streak: 0, total_checkins: 0 };
}

export async function getProtocolDay(userId: string): Promise<ProtocolDay | null> {
  const { data, error } = await supabase
    .from('protocols')
    .select('*')
    .eq('user_id', userId)
    .eq('active', true)
    .single();

  if (error) {
    console.error('Error fetching protocol day:', error);
    return null;
  }
  return data;
}
