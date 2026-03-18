import { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { omegaBrands as mockBrands } from '../../constants/mockData';
import { OmegaBrand } from '../../types';
import { useAuth } from '../../lib/AuthContext';
import { getOmegaBrands, getCurrentOmega } from '../../lib/api';

type FilterTab = 'todas' | 'minha' | 'top10';

// Convert Supabase omega_brands row to OmegaBrand type
function dbBrandToOmegaBrand(dbBrand: any): OmegaBrand {
  return {
    id: dbBrand.id,
    name: dbBrand.name,
    dosage: dbBrand.dosage || 'N/A',
    pricePerMonth: dbBrand.price_per_month || 0,
    usersCount: dbBrand.users_count || 0,
    avgRatioBefore: dbBrand.avg_ratio_before || 15,
    avgRatioAfter: dbBrand.avg_ratio_after || 5,
    improvementRate: dbBrand.improvement_rate || 0,
  };
}

export default function OmegaScreen() {
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState<FilterTab>('todas');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [brands, setBrands] = useState<OmegaBrand[]>(mockBrands);
  const [userBrandId, setUserBrandId] = useState<string | null>('1'); // Default to Nordic Naturals

  const loadData = useCallback(async () => {
    try {
      if (!user) {
        setLoading(false);
        return;
      }

      // Load brands from Supabase
      try {
        const dbBrands = await getOmegaBrands();
        if (dbBrands && dbBrands.length > 0) {
          setBrands(dbBrands.map(dbBrandToOmegaBrand));
        }
        // If empty, keep mock data
      } catch {}

      // Load user's current omega
      try {
        const currentOmega = await getCurrentOmega();
        if (currentOmega) {
          setUserBrandId(currentOmega.brand_id || null);
        }
      } catch {}
    } catch {
      // fallback to mock
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

  const filters: { key: FilterTab; label: string }[] = [
    { key: 'todas', label: 'Todas' },
    { key: 'minha', label: 'Minha marca' },
    { key: 'top10', label: 'Top 10' },
  ];

  function getFilteredBrands() {
    switch (activeFilter) {
      case 'todas':
        return brands;
      case 'minha':
        return brands.filter(b => b.id === userBrandId);
      case 'top10':
        return [...brands].sort((a, b) => b.improvementRate - a.improvementRate).slice(0, 10);
    }
  }

  const filteredBrands = getFilteredBrands();

  function getImprovementColor(rate: number) {
    if (rate >= 60) return Colors.green;
    if (rate >= 40) return Colors.orange;
    return Colors.red;
  }

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
        <Text style={styles.header}>Banco de Omega</Text>

        {/* Toggle Pills */}
        <View style={styles.pillsRow}>
          {filters.map(filter => (
            <TouchableOpacity
              key={filter.key}
              style={[styles.pill, activeFilter === filter.key && styles.pillActive]}
              onPress={() => setActiveFilter(filter.key)}
              activeOpacity={0.7}
            >
              <Text style={[styles.pillText, activeFilter === filter.key && styles.pillTextActive]}>
                {filter.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Brands List */}
        {filteredBrands.map((brand) => {
          const isUserBrand = brand.id === userBrandId;
          const improvementColor = getImprovementColor(brand.improvementRate);

          return (
            <View
              key={brand.id}
              style={[
                styles.brandCard,
                isUserBrand && styles.brandCardHighlight,
              ]}
            >
              {isUserBrand && (
                <View style={styles.userBadge}>
                  <Text style={styles.userBadgeText}>Sua marca</Text>
                </View>
              )}

              {/* Brand Header */}
              <View style={styles.brandHeader}>
                <View style={styles.brandIcon}>
                  <Ionicons name="fish" size={24} color={Colors.lime} />
                </View>
                <View style={styles.brandInfo}>
                  <Text style={styles.brandName}>{brand.name}</Text>
                  <Text style={styles.brandDosage}>{brand.dosage}</Text>
                </View>
              </View>

              {/* Users Count */}
              <View style={styles.usersRow}>
                <Ionicons name="people-outline" size={14} color={Colors.white50} />
                <Text style={styles.usersText}>
                  {brand.usersCount.toLocaleString()} usuarios
                </Text>
                <Text style={styles.priceText}>
                  ${brand.pricePerMonth}/mes
                </Text>
              </View>

              {/* Ratio Before/After */}
              <View style={styles.ratioRow}>
                <View style={styles.ratioItem}>
                  <Text style={styles.ratioLabel}>Antes</Text>
                  <Text style={styles.ratioValue}>{brand.avgRatioBefore}:1</Text>
                </View>
                <View style={styles.ratioArrow}>
                  <Ionicons name="arrow-forward" size={20} color={Colors.lime} />
                </View>
                <View style={styles.ratioItem}>
                  <Text style={styles.ratioLabel}>Depois</Text>
                  <Text style={[styles.ratioValue, { color: Colors.green }]}>
                    {brand.avgRatioAfter}:1
                  </Text>
                </View>
              </View>

              {/* Improvement Bar */}
              <View style={styles.improvementSection}>
                <View style={styles.improvementHeader}>
                  <Text style={styles.improvementLabel}>Melhoria</Text>
                  <Text style={[styles.improvementValue, { color: improvementColor }]}>
                    {brand.improvementRate}%
                  </Text>
                </View>
                <View style={styles.improvementBarBg}>
                  <View
                    style={[
                      styles.improvementBarFill,
                      {
                        width: `${brand.improvementRate}%`,
                        backgroundColor: improvementColor,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>
          );
        })}

        {/* CTA */}
        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
          <Ionicons name="flask-outline" size={22} color={Colors.dark} />
          <Text style={styles.ctaText}>Fazer BalanceTest</Text>
          <Ionicons name="chevron-forward" size={20} color={Colors.dark} />
        </TouchableOpacity>

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

  // Pills
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

  // Brand Card
  brandCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  brandCardHighlight: {
    borderColor: Colors.lime,
    borderWidth: 2,
  },
  userBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.limeBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 3,
    borderRadius: Radius.xs,
    marginBottom: Spacing.sm,
  },
  userBadgeText: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.bold,
    color: Colors.lime,
  },
  brandHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  brandIcon: {
    width: 44,
    height: 44,
    borderRadius: Radius.sm,
    backgroundColor: Colors.limeBg2,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  brandInfo: {
    flex: 1,
  },
  brandName: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: 2,
  },
  brandDosage: {
    fontSize: FontSize.sm,
    color: Colors.white50,
  },

  // Users
  usersRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: Spacing.lg,
  },
  usersText: {
    fontSize: FontSize.sm,
    color: Colors.white50,
    flex: 1,
  },
  priceText: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white70,
  },

  // Ratio
  ratioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white08,
    borderRadius: Radius.sm,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  ratioItem: {
    flex: 1,
    alignItems: 'center',
  },
  ratioLabel: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    marginBottom: 4,
  },
  ratioValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.extrabold,
    color: Colors.white,
  },
  ratioArrow: {
    paddingHorizontal: Spacing.lg,
  },

  // Improvement
  improvementSection: {
    marginTop: Spacing.xs,
  },
  improvementHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  improvementLabel: {
    fontSize: FontSize.sm,
    color: Colors.white50,
  },
  improvementValue: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
  },
  improvementBarBg: {
    height: 8,
    backgroundColor: Colors.white15,
    borderRadius: 4,
    overflow: 'hidden',
  },
  improvementBarFill: {
    height: '100%',
    borderRadius: 4,
  },

  // CTA
  ctaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.lime,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.lg,
  },
  ctaText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
});
