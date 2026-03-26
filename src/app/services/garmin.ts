import { supabase } from './supabase';
import type {
  GarminConnection,
  GarminDailySummary,
  GarminSleepSummary,
  GarminBodyComposition,
  GarminActivity,
  GarminStressSummary,
} from '../types/database';

const FUNCTIONS_BASE = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1`;

// ============================================
// Connection Management
// ============================================

export async function getGarminConnection(userId: string): Promise<GarminConnection | null> {
  const { data, error } = await supabase
    .from('garmin_connections')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .single();

  if (error) return null;
  return data as GarminConnection;
}

export async function initiateGarminAuth(): Promise<{ authorizationUrl: string }> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await fetch(`${FUNCTIONS_BASE}/garmin-auth-request`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to initiate Garmin auth');
  }

  return res.json();
}

export async function disconnectGarmin(): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) throw new Error('Not authenticated');

  const res = await fetch(`${FUNCTIONS_BASE}/garmin-disconnect`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${session.access_token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || 'Failed to disconnect Garmin');
  }
}

// ============================================
// Data Fetching
// ============================================

export async function getGarminDailySummary(
  userId: string,
  date: string
): Promise<GarminDailySummary | null> {
  const { data, error } = await supabase
    .from('garmin_daily_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('summary_date', date)
    .single();

  if (error) return null;
  return data as GarminDailySummary;
}

export async function getGarminDailySummaries(
  userId: string,
  startDate: string,
  endDate: string
): Promise<GarminDailySummary[]> {
  const { data, error } = await supabase
    .from('garmin_daily_summaries')
    .select('*')
    .eq('user_id', userId)
    .gte('summary_date', startDate)
    .lte('summary_date', endDate)
    .order('summary_date', { ascending: false });

  if (error) return [];
  return data as GarminDailySummary[];
}

export async function getGarminSleepSummary(
  userId: string,
  date: string
): Promise<GarminSleepSummary | null> {
  const { data, error } = await supabase
    .from('garmin_sleep_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('sleep_date', date)
    .single();

  if (error) return null;
  return data as GarminSleepSummary;
}

export async function getGarminSleepSummaries(
  userId: string,
  limit = 7
): Promise<GarminSleepSummary[]> {
  const { data, error } = await supabase
    .from('garmin_sleep_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('sleep_date', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as GarminSleepSummary[];
}

export async function getGarminActivities(
  userId: string,
  limit = 10
): Promise<GarminActivity[]> {
  const { data, error } = await supabase
    .from('garmin_activities')
    .select('*')
    .eq('user_id', userId)
    .order('started_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as GarminActivity[];
}

export async function getGarminStressSummary(
  userId: string,
  date: string
): Promise<GarminStressSummary | null> {
  const { data, error } = await supabase
    .from('garmin_stress_summaries')
    .select('*')
    .eq('user_id', userId)
    .eq('stress_date', date)
    .single();

  if (error) return null;
  return data as GarminStressSummary;
}

export async function getGarminBodyCompositions(
  userId: string,
  limit = 10
): Promise<GarminBodyComposition[]> {
  const { data, error } = await supabase
    .from('garmin_body_compositions')
    .select('*')
    .eq('user_id', userId)
    .order('measured_at', { ascending: false })
    .limit(limit);

  if (error) return [];
  return data as GarminBodyComposition[];
}

// ============================================
// Utility
// ============================================

export function formatDuration(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(1)} km`;
  return `${Math.round(meters)} m`;
}

export function getActivityIcon(type: string): string {
  const icons: Record<string, string> = {
    RUNNING: '🏃',
    CYCLING: '🚴',
    WALKING: '🚶',
    SWIMMING: '🏊',
    STRENGTH_TRAINING: '🏋️',
    YOGA: '🧘',
    HIKING: '🥾',
    OTHER: '💪',
  };
  return icons[type] || icons.OTHER;
}
