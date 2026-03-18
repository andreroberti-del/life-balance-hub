import { useEffect, useState, useCallback } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthProvider, useAuth } from '../lib/AuthContext';
import { Colors } from '../constants/theme';

const ONBOARDED_KEY = '@life_balance_onboarded';

function RootNavigator() {
  const { session, loading: authLoading } = useAuth();
  const [isCheckingOnboarding, setIsCheckingOnboarding] = useState(true);
  const [isOnboarded, setIsOnboarded] = useState(false);
  const router = useRouter();
  const segments = useSegments();

  const checkOnboarding = useCallback(async () => {
    try {
      const value = await AsyncStorage.getItem(ONBOARDED_KEY);
      setIsOnboarded(value === 'true');
    } catch {
      setIsOnboarded(false);
    } finally {
      setIsCheckingOnboarding(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && session) {
      checkOnboarding();
    } else if (!authLoading && !session) {
      setIsCheckingOnboarding(false);
    }
  }, [authLoading, session, checkOnboarding]);

  useEffect(() => {
    if (authLoading || isCheckingOnboarding) return;

    const inAuth = segments[0] === '(auth)';
    const inOnboarding = segments[0] === '(onboarding)';
    const inTabs = segments[0] === '(tabs)';

    if (!session) {
      if (!inAuth) {
        router.replace('/(auth)/login');
      }
    } else if (!isOnboarded) {
      if (!inOnboarding) {
        router.replace('/(onboarding)');
      }
    } else {
      if (!inTabs) {
        router.replace('/(tabs)');
      }
    }
  }, [authLoading, isCheckingOnboarding, session, isOnboarded, segments]);

  if (authLoading || isCheckingOnboarding) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.dark, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" color={Colors.lime} />
      </View>
    );
  }

  return <Slot />;
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="light" />
      <RootNavigator />
    </AuthProvider>
  );
}
