import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Dimensions, Platform, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { mockWeightHistory, mockSleepHistory } from '../../constants/mockData';
import { useAuth } from '../../lib/AuthContext';
import { supabase } from '../../lib/supabase';
import { getProfile, getTodayCheckIn, getCheckIns, getUserStreak, getProtocolDay as fetchProtocolDay } from '../../lib/api';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

function getGreeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
}

function getProtocolDayLocal(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(diff + 1, 120));
}

export default function HomeScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [profileName, setProfileName] = useState('Usuario');
  const [profileWeight, setProfileWeight] = useState(87.6);
  const [profileWaist, setProfileWaist] = useState(94);
  const [protocolStartDate, setProtocolStartDate] = useState<string | null>('2026-02-15');

  const [todayCheckedIn, setTodayCheckedIn] = useState(false);
  const [todayCheckIn, setTodayCheckIn] = useState<any>(null);
  const [weightHistory, setWeightHistory] = useState(mockWeightHistory);
  const [streak, setStreak] = useState(5);
  const [protocolDay, setProtocolDay] = useState(1);

  const loadData = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // Load profile
      try {
        const profile = await getProfile();
        if (profile) {
          setProfileName(profile.name || 'Usuario');
          setProfileWeight(profile.weight || 87.6);
          setProfileWaist(profile.waist || 94);
          setProtocolStartDate(profile.protocol_start_date || '2026-02-15');
        }
      } catch {}

      // Load today's check-in
      try {
        const todayCI = await getTodayCheckIn();
        if (todayCI) {
          setTodayCheckedIn(true);
          setTodayCheckIn(todayCI);
        } else {
          setTodayCheckedIn(false);
          setTodayCheckIn(null);
        }
      } catch {}

      // Load recent check-ins for weight chart
      try {
        const checkIns = await getCheckIns(14);
        if (checkIns && checkIns.length > 0) {
          const weightData = checkIns
            .filter((c: any) => c.weight != null)
            .map((c: any) => ({ date: c.check_date, weight: c.weight as number }))
            .reverse();
          if (weightData.length > 0) {
            setWeightHistory(weightData);
            setProfileWeight(weightData[weightData.length - 1].weight);
          }
        }
      } catch {}

      // Load streak
      try {
        const s = await getUserStreak();
        if (s > 0) setStreak(s);
      } catch {}

      // Load protocol day
      try {
        const pd = await fetchProtocolDay();
        if (pd > 0) {
          setProtocolDay(pd);
        } else {
          setProtocolDay(getProtocolDayLocal(protocolStartDate));
        }
      } catch {
        setProtocolDay(getProtocolDayLocal(protocolStartDate));
      }
    } catch {
      // fallback to mock data, already set as defaults
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user, protocolStartDate]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadData();
  }, [loadData]);

  const currentWeight = weightHistory[weightHistory.length - 1]?.weight || 87.6;
  const prevWeight = weightHistory.length >= 2 ? weightHistory[weightHistory.length - 2].weight : currentWeight;
  const weightTrend = currentWeight - prevWeight;

  const currentSleep = todayCheckIn?.sleep_quality || mockSleepHistory[mockSleepHistory.length - 1].quality;
  const prevSleep = mockSleepHistory.length >= 2 ? mockSleepHistory[mockSleepHistory.length - 2].quality : currentSleep;
  const sleepTrend = currentSleep - prevSleep;

  const waistValue = profileWaist;
  const waterToday = todayCheckIn?.water_liters || 1.8;

  const maxWeight = Math.max(...weightHistory.map(w => w.weight));
  const minWeight = Math.min(...weightHistory.map(w => w.weight));
  const chartRange = maxWeight - minWeight || 1;

  const streakDays = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];
    if (dateStr === today) return todayCheckedIn ? 'done' : 'today';
    if (dateStr < today) {
      // Check if within streak
      const daysAgo = 6 - i;
      return daysAgo < streak ? 'done' : 'future';
    }
    return 'future';
  });

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={Colors.lime} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={Colors.lime}
            colors={[Colors.lime]}
          />
        }
      >
        {/* Top Nav */}
        <View style={styles.topNav}>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="settings-outline" size={22} color={Colors.white70} />
          </TouchableOpacity>
          <View style={styles.navTitle}>
            <View style={styles.greenDot} />
            <Text style={styles.navTitleText}>Life Balance</Text>
          </View>
          <TouchableOpacity style={styles.navIcon}>
            <Ionicons name="notifications-outline" size={22} color={Colors.white70} />
          </TouchableOpacity>
        </View>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          {/* Topographic pattern (decorative lines) */}
          <View style={styles.topoPattern}>
            <View style={[styles.topoLine, { top: 15, left: -20, width: 180, transform: [{ rotate: '-8deg' }] }]} />
            <View style={[styles.topoLine, { top: 35, left: -10, width: 200, transform: [{ rotate: '-5deg' }] }]} />
            <View style={[styles.topoLine, { top: 55, right: -20, width: 160, transform: [{ rotate: '3deg' }] }]} />
            <View style={[styles.topoLine, { bottom: 30, right: -30, width: 220, transform: [{ rotate: '-10deg' }] }]} />
            <View style={[styles.topoLine, { bottom: 50, left: 20, width: 140, transform: [{ rotate: '6deg' }] }]} />
          </View>
          <Text style={styles.heroGreeting}>
            {getGreeting()}, {profileName.split(' ')[0]}
          </Text>
          <View style={styles.heroDay}>
            <Text style={styles.heroDayNumber}>Dia {protocolDay}</Text>
            <Text style={styles.heroDayTotal}> de 120</Text>
          </View>
          <View style={styles.heroProgressBar}>
            <View style={[styles.heroProgressFill, { width: `${(protocolDay / 120) * 100}%` }]} />
          </View>
        </View>

        {/* 3 Metric Cards */}
        <View style={styles.metricsRow}>
          {/* Weight */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Peso</Text>
            <Text style={styles.metricValue}>{currentWeight}</Text>
            <Text style={styles.metricUnit}>kg</Text>
            <View style={styles.metricTrend}>
              <Ionicons
                name={weightTrend <= 0 ? 'trending-down' : 'trending-up'}
                size={14}
                color={weightTrend <= 0 ? Colors.green : Colors.red}
              />
              <Text style={[styles.metricTrendText, { color: weightTrend <= 0 ? Colors.green : Colors.red }]}>
                {Math.abs(weightTrend).toFixed(1)}
              </Text>
            </View>
          </View>
          {/* Waist */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Cintura</Text>
            <Text style={styles.metricValue}>{waistValue}</Text>
            <Text style={styles.metricUnit}>cm</Text>
            <View style={styles.metricTrend}>
              <Ionicons name="trending-down" size={14} color={Colors.green} />
              <Text style={[styles.metricTrendText, { color: Colors.green }]}>1.2</Text>
            </View>
          </View>
          {/* Sleep */}
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>Sono</Text>
            <Text style={styles.metricValue}>{currentSleep.toFixed(1)}</Text>
            <Text style={styles.metricUnit}>/5</Text>
            <View style={styles.metricTrend}>
              <Ionicons
                name={sleepTrend >= 0 ? 'trending-up' : 'trending-down'}
                size={14}
                color={sleepTrend >= 0 ? Colors.green : Colors.red}
              />
              <Text style={[styles.metricTrendText, { color: sleepTrend >= 0 ? Colors.green : Colors.red }]}>
                {Math.abs(sleepTrend).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Streak Bar */}
        <View style={styles.streakCard}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakFire}>🔥</Text>
            <Text style={styles.streakCount}>{streak} dias</Text>
            <Text style={styles.streakMessage}>Nao quebre agora!</Text>
          </View>
          <View style={styles.streakDots}>
            {streakDays.map((status, i) => (
              <View
                key={i}
                style={[
                  styles.streakDot,
                  status === 'done' && styles.streakDotDone,
                  status === 'today' && styles.streakDotToday,
                  status === 'future' && styles.streakDotFuture,
                ]}
              >
                {status === 'done' && (
                  <Ionicons name="checkmark" size={12} color={Colors.dark} />
                )}
                {status === 'today' && (
                  <View style={styles.streakDotTodayInner} />
                )}
              </View>
            ))}
          </View>
        </View>

        {/* Weight Chart */}
        <View style={styles.chartCard}>
          <Text style={styles.chartTitle}>Evolucao do Peso</Text>
          <View style={styles.chartContainer}>
            {weightHistory.slice(-12).map((entry, i) => {
              const barHeight = ((entry.weight - minWeight) / chartRange) * 100 + 20;
              const isLast = i === weightHistory.slice(-12).length - 1;
              return (
                <View key={i} style={styles.chartBarWrapper}>
                  <Text style={styles.chartBarValue}>
                    {isLast ? entry.weight.toFixed(1) : ''}
                  </Text>
                  <View
                    style={[
                      styles.chartBar,
                      {
                        height: barHeight,
                        backgroundColor: isLast ? Colors.lime : Colors.white15,
                      },
                    ]}
                  />
                  <Text style={styles.chartBarLabel}>
                    {entry.date.slice(8)}
                  </Text>
                </View>
              );
            })}
          </View>
        </View>

        {/* CTA Card */}
        <TouchableOpacity
          style={[styles.ctaCard, todayCheckedIn && styles.ctaCardDone]}
          activeOpacity={0.8}
          onPress={() => {
            if (!todayCheckedIn) {
              router.push('/(tabs)/checkin');
            }
          }}
        >
          {todayCheckedIn ? (
            <View style={styles.ctaContent}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.dark} />
              <Text style={styles.ctaText}>Check-in completo!</Text>
            </View>
          ) : (
            <View style={styles.ctaContent}>
              <Ionicons name="add-circle-outline" size={24} color={Colors.dark} />
              <Text style={styles.ctaText}>Check-in de hoje</Text>
              <Ionicons name="chevron-forward" size={20} color={Colors.dark} />
            </View>
          )}
        </TouchableOpacity>

        {/* Water Card */}
        <View style={styles.waterCard}>
          <View style={styles.waterLeft}>
            <Text style={styles.waterIcon}>💧</Text>
            <View>
              <Text style={styles.waterLabel}>Agua</Text>
              <Text style={styles.waterMeta}>Meta: 2.5L</Text>
            </View>
          </View>
          <View style={styles.waterRight}>
            <Text style={styles.waterValue}>{waterToday}L</Text>
            <View style={styles.waterProgressBar}>
              <View
                style={[
                  styles.waterProgressFill,
                  { width: `${Math.min((waterToday / 2.5) * 100, 100)}%` },
                ]}
              />
            </View>
          </View>
        </View>

        {/* ZENO Tip Card */}
        <View style={styles.tipCard}>
          <View style={styles.tipHeader}>
            <Text style={styles.tipIcon}>💡</Text>
            <Text style={styles.tipTitle}>Dica do ZENO</Text>
          </View>
          <Text style={styles.tipText}>
            Seu sono melhorou 15% essa semana. Manter o horario regular de dormir
            potencializa a absorcao do Omega-3 e acelera a recuperacao anti-inflamatoria.
          </Text>
        </View>

        {/* Bottom spacer for tab bar */}
        <View style={{ height: 100 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark2,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
  },

  // Top Nav
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  navIcon: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navTitle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  greenDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.green,
  },
  navTitleText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Hero Card
  heroCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.xxl,
    marginTop: Spacing.lg,
    overflow: 'hidden',
    position: 'relative',
  },
  topoPattern: {
    ...StyleSheet.absoluteFillObject,
  },
  topoLine: {
    position: 'absolute',
    height: 1,
    backgroundColor: Colors.white08,
    borderRadius: 1,
  },
  heroGreeting: {
    fontSize: FontSize.base,
    color: Colors.white70,
    marginBottom: Spacing.xs,
  },
  heroDay: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  heroDayNumber: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.white,
  },
  heroDayTotal: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.medium,
    color: Colors.white50,
  },
  heroProgressBar: {
    height: 6,
    backgroundColor: Colors.white15,
    borderRadius: 3,
    overflow: 'hidden',
  },
  heroProgressFill: {
    height: '100%',
    backgroundColor: Colors.lime,
    borderRadius: 3,
  },

  // Metrics Row
  metricsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: Spacing.xs,
  },
  metricValue: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  metricUnit: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    marginBottom: Spacing.sm,
  },
  metricTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metricTrendText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
  },

  // Streak
  streakCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  streakHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  streakFire: {
    fontSize: 20,
  },
  streakCount: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  streakMessage: {
    fontSize: FontSize.sm,
    color: Colors.orange,
    marginLeft: 'auto',
  },
  streakDots: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  streakDot: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.white08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  streakDotDone: {
    backgroundColor: Colors.lime,
  },
  streakDotToday: {
    backgroundColor: Colors.white15,
    borderWidth: 2,
    borderColor: Colors.lime,
  },
  streakDotTodayInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.lime,
  },
  streakDotFuture: {
    backgroundColor: Colors.white08,
  },

  // Chart
  chartCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  chartTitle: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    marginBottom: Spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 140,
    gap: 4,
  },
  chartBarWrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  chartBarValue: {
    fontSize: FontSize.xs,
    color: Colors.lime,
    fontWeight: FontWeight.semibold,
    marginBottom: 4,
  },
  chartBar: {
    width: '80%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 8,
    color: Colors.white30,
    marginTop: 4,
  },

  // CTA
  ctaCard: {
    backgroundColor: Colors.lime,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  ctaCardDone: {
    backgroundColor: Colors.lime2,
    opacity: 0.8,
  },
  ctaContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  ctaText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },

  // Water
  waterCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  waterLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  waterIcon: {
    fontSize: 28,
  },
  waterLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
  waterMeta: {
    fontSize: FontSize.xs,
    color: Colors.white50,
  },
  waterRight: {
    alignItems: 'flex-end',
  },
  waterValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.blue,
    marginBottom: Spacing.xs,
  },
  waterProgressBar: {
    width: 100,
    height: 6,
    backgroundColor: Colors.white15,
    borderRadius: 3,
    overflow: 'hidden',
  },
  waterProgressFill: {
    height: '100%',
    backgroundColor: Colors.blue,
    borderRadius: 3,
  },

  // Tip
  tipCard: {
    backgroundColor: Colors.limeBg2,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.limeBg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  tipHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.sm,
  },
  tipIcon: {
    fontSize: 18,
  },
  tipTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.lime,
  },
  tipText: {
    fontSize: FontSize.md,
    color: Colors.white70,
    lineHeight: 20,
  },
});
