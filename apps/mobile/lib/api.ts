import { supabase } from './supabase';
import type { Database } from './supabase';

type Profile = Database['public']['Tables']['profiles']['Row'];
type CheckIn = Database['public']['Tables']['daily_checkins']['Row'];
type OmegaBrand = Database['public']['Tables']['omega_brands']['Row'];
type BalanceTest = Database['public']['Tables']['balance_tests']['Row'];
type ScanResult = Database['public']['Tables']['scan_results']['Row'];

// ============================================================
// AUTH
// ============================================================

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  });
  if (error) throw error;
  return data;
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession();
  return session;
}

// ============================================================
// PROFILE
// ============================================================

export async function getProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session) return null;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', session.user.id)
    .single();

  if (error) throw error;
  return data;
}

export async function updateProfile(updates: Partial<Profile>) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', session.user.id)
    .select()
    .single();

  if (error) throw error;
  return data;
}

// ============================================================
// DAILY CHECK-INS
// ============================================================

export async function saveCheckIn(checkIn: Omit<CheckIn, 'id' | 'user_id' | 'created_at'>) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('daily_checkins')
    .upsert({
      ...checkIn,
      user_id: session.user.id,
    }, {
      onConflict: 'user_id,check_date',
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCheckIns(limit = 30): Promise<CheckIn[]> {
  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', session.user.id)
    .order('check_date', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

export async function getTodayCheckIn(): Promise<CheckIn | null> {
  const session = await getSession();
  if (!session) return null;

  const today = new Date().toISOString().split('T')[0];
  const { data } = await supabase
    .from('daily_checkins')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('check_date', today)
    .single();

  return data;
}

// ============================================================
// OMEGA BRANDS (Public read)
// ============================================================

export async function getOmegaBrands(): Promise<OmegaBrand[]> {
  const { data, error } = await supabase
    .from('omega_brands')
    .select('*')
    .order('name');

  if (error) throw error;
  return data || [];
}

export async function getOmegaBrandStats() {
  const { data, error } = await supabase
    .from('omega_brand_stats' as any)
    .select('*')
    .order('users_count', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// USER OMEGA
// ============================================================

export async function setUserOmega(brandId: string | null, customName?: string) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  // End current omega
  await supabase
    .from('user_omega')
    .update({ ended_at: new Date().toISOString().split('T')[0] })
    .eq('user_id', session.user.id)
    .is('ended_at', null);

  if (!brandId && !customName) return null;

  // Start new omega
  const { data, error } = await supabase
    .from('user_omega')
    .insert({
      user_id: session.user.id,
      brand_id: brandId,
      custom_brand_name: customName || null,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getCurrentOmega() {
  const session = await getSession();
  if (!session) return null;

  const { data } = await supabase
    .from('user_omega')
    .select('*, omega_brands(*)')
    .eq('user_id', session.user.id)
    .is('ended_at', null)
    .single();

  return data;
}

// ============================================================
// BALANCE TESTS
// ============================================================

export async function saveBalanceTest(test: Omit<BalanceTest, 'id' | 'user_id' | 'created_at'>) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const { data, error } = await supabase
    .from('balance_tests')
    .insert({ ...test, user_id: session.user.id })
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function getBalanceTests(): Promise<BalanceTest[]> {
  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('balance_tests')
    .select('*, omega_brands(name)')
    .eq('user_id', session.user.id)
    .order('test_date', { ascending: false });

  if (error) throw error;
  return data || [];
}

// ============================================================
// SCAN RESULTS
// ============================================================

export async function saveScanResult(scan: Omit<ScanResult, 'id' | 'user_id' | 'scanned_at'>, ingredients: { name: string; score: string; tag: string }[]) {
  const session = await getSession();
  if (!session) throw new Error('Not authenticated');

  const { data: scanData, error: scanError } = await supabase
    .from('scan_results')
    .insert({ ...scan, user_id: session.user.id })
    .select()
    .single();

  if (scanError) throw scanError;

  if (ingredients.length > 0) {
    const { error: ingError } = await supabase
      .from('scan_ingredients')
      .insert(
        ingredients.map((ing, i) => ({
          scan_id: scanData.id,
          name: ing.name,
          score: ing.score,
          tag: ing.tag,
          sort_order: i,
        }))
      );
    if (ingError) throw ingError;
  }

  return scanData;
}

export async function getScanHistory(limit = 20): Promise<ScanResult[]> {
  const session = await getSession();
  if (!session) return [];

  const { data, error } = await supabase
    .from('scan_results')
    .select('*')
    .eq('user_id', session.user.id)
    .order('scanned_at', { ascending: false })
    .limit(limit);

  if (error) throw error;
  return data || [];
}

// ============================================================
// COMMUNITY METRICS (Public view)
// ============================================================

export async function getCommunityMetrics() {
  const { data, error } = await supabase
    .from('community_metrics' as any)
    .select('*')
    .single();

  if (error) return null;
  return data;
}

// ============================================================
// STREAK
// ============================================================

export async function getUserStreak(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;

  const { data, error } = await supabase
    .rpc('get_user_streak', { p_user_id: session.user.id });

  if (error) return 0;
  return data || 0;
}

// ============================================================
// PROTOCOL DAY
// ============================================================

export async function getProtocolDay(): Promise<number> {
  const session = await getSession();
  if (!session) return 0;

  const { data, error } = await supabase
    .rpc('get_protocol_day', { p_user_id: session.user.id });

  if (error) return 0;
  return data || 0;
}
