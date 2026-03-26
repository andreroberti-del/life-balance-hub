import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  getGarminConnection,
  getGarminDailySummary,
  getGarminSleepSummary,
  getGarminStressSummary,
  getGarminActivities,
  getGarminBodyCompositions,
  initiateGarminAuth,
  disconnectGarmin as disconnectGarminService,
} from '../lib/garmin';
import type {
  GarminConnection,
  GarminDailySummary,
  GarminSleepSummary,
  GarminStressSummary,
  GarminActivity,
  GarminBodyComposition,
} from '../types/database';

function getToday(): string {
  return new Date().toISOString().split('T')[0];
}

export function useGarmin() {
  const { user } = useAuth();
  const [connection, setConnection] = useState<GarminConnection | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [dailySummary, setDailySummary] = useState<GarminDailySummary | null>(null);
  const [sleepSummary, setSleepSummary] = useState<GarminSleepSummary | null>(null);
  const [stressSummary, setStressSummary] = useState<GarminStressSummary | null>(null);
  const [activities, setActivities] = useState<GarminActivity[]>([]);
  const [bodyCompositions, setBodyCompositions] = useState<GarminBodyComposition[]>([]);

  const isConnected = !!connection?.is_active;

  // Load connection status
  useEffect(() => {
    if (!user) {
      setIsLoading(false);
      return;
    }

    getGarminConnection(user.id).then((conn) => {
      setConnection(conn);
      setIsLoading(false);
    });
  }, [user]);

  // Load data when connected
  useEffect(() => {
    if (!user || !isConnected) return;

    const today = getToday();
    Promise.all([
      getGarminDailySummary(user.id, today),
      getGarminSleepSummary(user.id, today),
      getGarminStressSummary(user.id, today),
      getGarminActivities(user.id, 5),
      getGarminBodyCompositions(user.id, 5),
    ]).then(([daily, sleep, stress, acts, body]) => {
      setDailySummary(daily);
      setSleepSummary(sleep);
      setStressSummary(stress);
      setActivities(acts);
      setBodyCompositions(body);
    });
  }, [user, isConnected]);

  const connect = useCallback(async () => {
    const { authorizationUrl } = await initiateGarminAuth();
    window.location.href = authorizationUrl;
  }, []);

  const disconnect = useCallback(async () => {
    await disconnectGarminService();
    setConnection(null);
    setDailySummary(null);
    setSleepSummary(null);
    setStressSummary(null);
    setActivities([]);
    setBodyCompositions([]);
  }, []);

  const refresh = useCallback(async () => {
    if (!user || !isConnected) return;
    const today = getToday();
    const [daily, sleep, stress, acts, body] = await Promise.all([
      getGarminDailySummary(user.id, today),
      getGarminSleepSummary(user.id, today),
      getGarminStressSummary(user.id, today),
      getGarminActivities(user.id, 5),
      getGarminBodyCompositions(user.id, 5),
    ]);
    setDailySummary(daily);
    setSleepSummary(sleep);
    setStressSummary(stress);
    setActivities(acts);
    setBodyCompositions(body);
  }, [user, isConnected]);

  return {
    isConnected,
    isLoading,
    connection,
    connect,
    disconnect,
    refresh,
    dailySummary,
    sleepSummary,
    stressSummary,
    activities,
    bodyCompositions,
  };
}
