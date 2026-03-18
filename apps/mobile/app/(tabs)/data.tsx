import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { mockWeightHistory, mockSleepHistory } from '../../constants/mockData';
import { useAuth } from '../../lib/AuthContext';
import { getCheckIns, getProfile } from '../../lib/api';

type MetricTab = 'peso' | 'cintura' | 'sono' | 'agua';

const mockWaistHistory = [
  { date: '2026-03-05', value: 97 },
  { date: '2026-03-07', value: 96.5 },
  { date: '2026-03-09', value: 96 },
  { date: '2026-03-11', value: 95.2 },
  { date: '2026-03-13', value: 95 },
  { date: '2026-03-15', value: 94.3 },
  { date: '2026-03-17', value: 94 },
];

const mockWaterHistory = [
  { date: '2026-03-11', value: 1.5 },
  { date: '2026-03-12', value: 2.0 },
  { date: '2026-03-13', value: 1.8 },
  { date: '2026-03-14', value: 2.2 },
  { date: '2026-03-15', value: 2.5 },
  { date: '2026-03-16', value: 2.3 },
  { date: '2026-03-17', value: 1.8 },
];

function getUnit(tab: MetricTab) {
  switch (tab) {
    case 'peso': return 'kg';
    case 'cintura': return 'cm';
    case 'sono': return '/5';
    case 'agua': return 'L';
  }
}

function calcStats(data: { value: number }[]) {
  const values = data.map(d => d.value);
  const min = Math.min(...values);
  const max = Math.max(...values);
  const avg = values.reduce((s, v) => s + v, 0) / values.length;
  const trend = values.length >= 2 ? values[values.length - 1] - values[0] : 0;
  return { min, max, avg, trend };
}

function calcIMC(weight: number, heightCm: number) {
  const h = heightCm / 100;
  return weight / (h * h);
}

export default function DataScreen() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<MetricTab>('peso');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Data from Supabase (or mock fallback)
  const [weightData, setWeightData] = useState(mockWeightHistory.map(e => ({ date: e.date, value: e.weight })));
  const [waistData, setWaistData] = useState(mockWaistHistory);
  const [sleepData, setSleepData] = useState(mockSleepHistory.map(e => ({ date: e.date, value: e.quality })));
  const [waterData, setWaterData] = useState(mockWaterHistory);
  const [userWeight, setUserWeight] = useState(87.6);
  const [userHeight, setUserHeight] = useState(178);
  const [userWaist, setUserWaist] = useState(94);

  const loadData = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // Load profile for IMC
      try {
        const profile = await getProfile();
        if (profile) {
          if (profile.weight) setUserWeight(profile.weight);
          if (profile.height) setUserHeight(profile.height);
          if (profile.waist) setUserWaist(profile.waist);
        }
      } catch {}

      // Load check-ins for charts
      try {
        const checkIns = await getCheckIns(30);
        if (checkIns && checkIns.length > 0) {
          const reversed = [...checkIns].reverse();

          const weights = reversed
            .filter((c: any) => c.weight != null)
            .map((c: any) => ({ date: c.check_date, value: c.weight as number }));
          if (weights.length > 0) {
            setWeightData(weights);
            setUserWeight(weights[weights.length - 1].value);
          }

          const waists = reversed
            .filter((c: any) => c.waist != null)
            .map((c: any) => ({ date: c.check_date, value: c.waist as number }));
          if (waists.length > 0) {
            setWaistData(waists);
            setUserWaist(waists[waists.length - 1].value);
          }

          const sleeps = reversed
            .filter((c: any) => c.sleep_quality != null)
            .map((c: any) => ({ date: c.check_date, value: c.sleep_quality as number }));
          if (sleeps.length > 0) setSleepData(sleeps);

          const waters = reversed
            .filter((c: any) => c.water_liters != null)
            .map((c: any) => ({ date: c.check_date, value: c.water_liters as number }));
          if (waters.length > 0) setWaterData(waters);
        }
      } catch {}
    } catch {
      // fallback to mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

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

  const tabs: { key: MetricTab; label: string }[] = [
    { key: 'peso', label: 'Peso' },
    { key: 'cintura', label: 'Cintura' },
    { key: 'sono', label: 'Sono' },
    { key: 'agua', label: 'Agua' },
  ];

  function getDataForTab(tab: MetricTab) {
    switch (tab) {
      case 'peso': return weightData;
      case 'cintura': return waistData;
      case 'sono': return sleepData;
      case 'agua': return waterData;
    }
  }

  const data = getDataForTab(activeTab);
  const unit = getUnit(activeTab);
  const stats = calcStats(data);
  const maxVal = Math.max(...data.map(d => d.value));
  const minVal = Math.min(...data.map(d => d.value));
  const range = maxVal - minVal || 1;

  const userAge = 35;
  const imc = calcIMC(userWeight, userHeight);

  const riskIndicators = [
    {
      label: 'IMC',
      value: imc.toFixed(1),
      description: imc < 25 ? 'Normal' : imc < 30 ? 'Sobrepeso' : 'Obesidade',
      color: imc < 25 ? Colors.green : imc < 30 ? Colors.orange : Colors.red,
      bgColor: imc < 25 ? 'rgba(76,175,80,0.15)' : imc < 30 ? Colors.orangeBg : Colors.redBg,
      icon: 'body-outline' as const,
    },
    {
      label: 'Circunferencia',
      value: `${userWaist} cm`,
      description: userWaist > 94 ? 'Risco elevado' : userWaist > 80 ? 'Risco moderado' : 'Normal',
      color: userWaist > 94 ? Colors.red : userWaist > 80 ? Colors.orange : Colors.green,
      bgColor: userWaist > 94 ? Colors.redBg : userWaist > 80 ? Colors.orangeBg : 'rgba(76,175,80,0.15)',
      icon: 'resize-outline' as const,
    },
    {
      label: 'Idade Metabolica Est.',
      value: `${userAge + 8} anos`,
      description: `Idade real: ${userAge} anos`,
      color: Colors.orange,
      bgColor: Colors.orangeBg,
      icon: 'time-outline' as const,
    },
    {
      label: 'Omega Estimado',
      value: '15:1',
      description: 'Ideal: < 3:1',
      color: Colors.red,
      bgColor: Colors.redBg,
      icon: 'fish-outline' as const,
    },
  ];

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
        <Text style={styles.header}>Seus Dados</Text>

        {/* Toggle Pills */}
        <View style={styles.pillsRow}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.pill, activeTab === tab.key && styles.pillActive]}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, activeTab === tab.key && styles.pillTextActive]}>
                {tab.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Chart */}
        <View style={styles.chartCard}>
          <View style={styles.chartContainer}>
            {data.map((entry, i) => {
              const barHeight = ((entry.value - minVal) / range) * 120 + 20;
              const isLast = i === data.length - 1;
              return (
                <View key={i} style={styles.chartBarWrapper}>
                  <Text style={styles.chartBarValue}>
                    {isLast ? entry.value.toFixed(1) : ''}
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

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Min</Text>
            <Text style={styles.statValue}>{stats.min.toFixed(1)}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Max</Text>
            <Text style={styles.statValue}>{stats.max.toFixed(1)}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Media</Text>
            <Text style={styles.statValue}>{stats.avg.toFixed(1)}</Text>
            <Text style={styles.statUnit}>{unit}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Trend</Text>
            <View style={styles.statTrend}>
              <Ionicons
                name={stats.trend <= 0 ? 'trending-down' : 'trending-up'}
                size={16}
                color={
                  activeTab === 'sono' || activeTab === 'agua'
                    ? (stats.trend >= 0 ? Colors.green : Colors.red)
                    : (stats.trend <= 0 ? Colors.green : Colors.red)
                }
              />
              <Text
                style={[
                  styles.statTrendText,
                  {
                    color:
                      activeTab === 'sono' || activeTab === 'agua'
                        ? (stats.trend >= 0 ? Colors.green : Colors.red)
                        : (stats.trend <= 0 ? Colors.green : Colors.red),
                  },
                ]}
              >
                {Math.abs(stats.trend).toFixed(1)}
              </Text>
            </View>
          </View>
        </View>

        {/* Risk Indicators */}
        <Text style={styles.sectionTitle}>Indicadores de Risco</Text>
        {riskIndicators.map((item, i) => (
          <View key={i} style={styles.riskCard}>
            <View style={[styles.riskIconContainer, { backgroundColor: item.bgColor }]}>
              <Ionicons name={item.icon} size={22} color={item.color} />
            </View>
            <View style={styles.riskInfo}>
              <Text style={styles.riskLabel}>{item.label}</Text>
              <Text style={styles.riskDescription}>{item.description}</Text>
            </View>
            <Text style={[styles.riskValue, { color: item.color }]}>{item.value}</Text>
          </View>
        ))}

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
  header: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  pill: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.white08,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.lime,
  },
  pillText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white50,
  },
  pillTextActive: {
    color: Colors.dark,
  },
  chartCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: 160,
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
    width: '75%',
    borderRadius: 4,
    minHeight: 4,
  },
  chartBarLabel: {
    fontSize: 8,
    color: Colors.white30,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.sm,
    alignItems: 'center',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    marginBottom: 4,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  statUnit: {
    fontSize: FontSize.xs,
    color: Colors.white30,
  },
  statDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.white15,
  },
  statTrend: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statTrendText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.bold,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.lg,
  },
  riskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.sm,
  },
  riskIconContainer: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  riskInfo: {
    flex: 1,
  },
  riskLabel: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    marginBottom: 2,
  },
  riskDescription: {
    fontSize: FontSize.sm,
    color: Colors.white50,
  },
  riskValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
