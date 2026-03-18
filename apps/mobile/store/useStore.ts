import { useState, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserProfile, DailyCheckIn, ScanResult } from '../types';

const PROFILE_KEY = '@life_balance_profile';
const CHECKINS_KEY = '@life_balance_checkins';
const ONBOARDED_KEY = '@life_balance_onboarded';

export function useProfile() {
  const [profile, setProfileState] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(PROFILE_KEY);
      if (data) setProfileState(JSON.parse(data));
    } catch {} finally {
      setLoading(false);
    }
  }, []);

  const saveProfile = useCallback(async (p: UserProfile) => {
    await AsyncStorage.setItem(PROFILE_KEY, JSON.stringify(p));
    setProfileState(p);
  }, []);

  return { profile, loading, loadProfile, saveProfile };
}

export function useCheckIns() {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);

  const loadCheckIns = useCallback(async () => {
    try {
      const data = await AsyncStorage.getItem(CHECKINS_KEY);
      if (data) setCheckIns(JSON.parse(data));
    } catch {}
  }, []);

  const saveCheckIn = useCallback(async (checkIn: DailyCheckIn) => {
    const updated = [...checkIns.filter(c => c.date !== checkIn.date), checkIn];
    await AsyncStorage.setItem(CHECKINS_KEY, JSON.stringify(updated));
    setCheckIns(updated);
  }, [checkIns]);

  const getStreak = useCallback(() => {
    const sorted = [...checkIns].sort((a, b) => b.date.localeCompare(a.date));
    let streak = 0;
    const today = new Date().toISOString().split('T')[0];
    let current = today;
    for (const c of sorted) {
      if (c.date === current) {
        streak++;
        const d = new Date(current);
        d.setDate(d.getDate() - 1);
        current = d.toISOString().split('T')[0];
      } else break;
    }
    return streak;
  }, [checkIns]);

  return { checkIns, loadCheckIns, saveCheckIn, getStreak };
}

export async function isOnboarded(): Promise<boolean> {
  const val = await AsyncStorage.getItem(ONBOARDED_KEY);
  return val === 'true';
}

export async function setOnboarded() {
  await AsyncStorage.setItem(ONBOARDED_KEY, 'true');
}
