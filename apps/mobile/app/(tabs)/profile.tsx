import { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { communityMetrics } from '../../constants/mockData';
import { useAuth } from '../../lib/AuthContext';
import { getProfile, getUserStreak, getProtocolDay as fetchProtocolDay, getCurrentOmega } from '../../lib/api';

function getProtocolDayLocal(startDate: string | null): number {
  if (!startDate) return 1;
  const start = new Date(startDate);
  const now = new Date();
  const diff = Math.floor((now.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  return Math.max(1, Math.min(diff + 1, 120));
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map(w => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

function getAge(birthDate: string): number {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const m = now.getMonth() - birth.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
  return age;
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const [profileName, setProfileName] = useState('Andre Roberti');
  const [profileWeight, setProfileWeight] = useState(87.6);
  const [profileHeight, setProfileHeight] = useState(178);
  const [profileWaist, setProfileWaist] = useState(94);
  const [profileBirthDate, setProfileBirthDate] = useState('1991-05-15');
  const [profileLanguage, setProfileLanguage] = useState<'pt' | 'en' | 'es'>('pt');
  const [protocolStartDate, setProtocolStartDate] = useState<string | null>('2026-02-15');
  const [omegaName, setOmegaName] = useState('Nordic Naturals Ultimate');
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
          setProfileHeight(profile.height || 178);
          setProfileWaist(profile.waist || 94);
          setProfileBirthDate(profile.birth_date || '1991-05-15');
          setProfileLanguage(profile.language || 'pt');
          setProtocolStartDate(profile.protocol_start_date || '2026-02-15');
        }
      } catch {}

      // Load omega
      try {
        const omega = await getCurrentOmega();
        if (omega?.omega_brands) {
          setOmegaName((omega.omega_brands as any).name || 'Nao selecionado');
        } else if (omega?.custom_brand_name) {
          setOmegaName(omega.custom_brand_name);
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
      // fallback to defaults
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

  const handleSignOut = useCallback(async () => {
    Alert.alert(
      'Sair',
      'Tem certeza que deseja sair da sua conta?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            try {
              await signOut();
              // Clear AsyncStorage
              await AsyncStorage.multiRemove([
                '@life_balance_profile',
                '@life_balance_checkins',
                '@life_balance_onboarded',
              ]);
            } catch (error: any) {
              Alert.alert('Erro', error?.message || 'Nao foi possivel sair.');
            }
          },
        },
      ]
    );
  }, [signOut]);

  const name = profileName;
  const initials = getInitials(name);
  const age = getAge(profileBirthDate);

  const languageLabels: Record<string, string> = {
    pt: 'Portugues',
    en: 'English',
    es: 'Espanol',
  };

  const profileFields = [
    { label: 'Peso', value: `${profileWeight} kg`, icon: 'scale-outline' as const },
    { label: 'Altura', value: `${profileHeight} cm`, icon: 'resize-outline' as const },
    { label: 'Cintura', value: `${profileWaist} cm`, icon: 'ellipse-outline' as const },
    { label: 'Idade', value: `${age} anos`, icon: 'calendar-outline' as const },
    { label: 'Omega', value: omegaName, icon: 'fish-outline' as const },
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
        {/* Avatar */}
        <View style={styles.avatarSection}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <Text style={styles.userName}>{name}</Text>
          <Text style={styles.userDay}>Dia {protocolDay} do Protocolo</Text>
        </View>

        {/* Profile Data Cards */}
        <View style={styles.sectionCard}>
          {profileFields.map((field, i) => (
            <View
              key={i}
              style={[
                styles.profileRow,
                i < profileFields.length - 1 && styles.profileRowBorder,
              ]}
            >
              <View style={styles.profileRowLeft}>
                <Ionicons name={field.icon} size={20} color={Colors.white50} />
                <Text style={styles.profileLabel}>{field.label}</Text>
              </View>
              <Text style={styles.profileValue}>{field.value}</Text>
            </View>
          ))}
        </View>

        {/* Protocol Progress */}
        <Text style={styles.sectionTitle}>Protocolo 120 Dias</Text>
        <View style={styles.sectionCard}>
          <View style={styles.protocolHeader}>
            <Text style={styles.protocolDay}>
              <Text style={styles.protocolDayBig}>{protocolDay}</Text>
              <Text style={styles.protocolDaySmall}> / 120 dias</Text>
            </Text>
            <Text style={styles.protocolPercent}>
              {Math.round((protocolDay / 120) * 100)}%
            </Text>
          </View>
          <View style={styles.protocolBarBg}>
            <View
              style={[
                styles.protocolBarFill,
                { width: `${(protocolDay / 120) * 100}%` },
              ]}
            />
          </View>
          <View style={styles.protocolStats}>
            <View style={styles.protocolStat}>
              <Text style={styles.protocolStatValue}>{protocolDay}</Text>
              <Text style={styles.protocolStatLabel}>Dias feitos</Text>
            </View>
            <View style={styles.protocolStatDivider} />
            <View style={styles.protocolStat}>
              <Text style={styles.protocolStatValue}>{120 - protocolDay}</Text>
              <Text style={styles.protocolStatLabel}>Dias restantes</Text>
            </View>
            <View style={styles.protocolStatDivider} />
            <View style={styles.protocolStat}>
              <Text style={styles.protocolStatValue}>{streak}</Text>
              <Text style={styles.protocolStatLabel}>Streak atual</Text>
            </View>
          </View>
        </View>

        {/* Community */}
        <Text style={styles.sectionTitle}>Comunidade</Text>
        <View style={styles.sectionCard}>
          <View style={styles.communityGrid}>
            <View style={styles.communityItem}>
              <Ionicons name="people" size={20} color={Colors.lime} />
              <Text style={styles.communityValue}>
                {communityMetrics.totalMembers.toLocaleString()}
              </Text>
              <Text style={styles.communityLabel}>Membros</Text>
            </View>
            <View style={styles.communityItem}>
              <Ionicons name="trending-down" size={20} color={Colors.green} />
              <Text style={styles.communityValue}>
                {(communityMetrics.totalWeightLost / 1000).toFixed(1)}t
              </Text>
              <Text style={styles.communityLabel}>Peso perdido</Text>
            </View>
            <View style={styles.communityItem}>
              <Ionicons name="moon" size={20} color={Colors.blue} />
              <Text style={styles.communityValue}>
                {communityMetrics.sleepImproved}%
              </Text>
              <Text style={styles.communityLabel}>Melhoraram sono</Text>
            </View>
            <View style={styles.communityItem}>
              <Ionicons name="heart" size={20} color={Colors.red} />
              <Text style={styles.communityValue}>
                {communityMetrics.painReduced}%
              </Text>
              <Text style={styles.communityLabel}>Reduziram dor</Text>
            </View>
          </View>
          <View style={styles.omegaRatioRow}>
            <Text style={styles.omegaRatioLabel}>Ratio Omega medio</Text>
            <View style={styles.omegaRatioValues}>
              <Text style={styles.omegaRatioBefore}>{communityMetrics.avgRatioBefore}:1</Text>
              <Ionicons name="arrow-forward" size={16} color={Colors.lime} />
              <Text style={styles.omegaRatioAfter}>{communityMetrics.avgRatioAfter}:1</Text>
            </View>
          </View>
        </View>

        {/* Language */}
        <Text style={styles.sectionTitle}>Idioma</Text>
        <View style={styles.sectionCard}>
          <View style={styles.languageRow}>
            <Ionicons name="globe-outline" size={20} color={Colors.white50} />
            <Text style={styles.languageText}>{languageLabels[profileLanguage]}</Text>
            <Ionicons name="chevron-forward" size={18} color={Colors.white30} />
          </View>
        </View>

        {/* Streak Record */}
        <View style={[styles.sectionCard, { marginTop: Spacing.lg }]}>
          <View style={styles.streakRecordRow}>
            <Text style={styles.streakRecordFire}>🔥</Text>
            <View style={styles.streakRecordInfo}>
              <Text style={styles.streakRecordLabel}>Recorde de streak</Text>
              <Text style={styles.streakRecordValue}>
                {Math.max(streak, 12)} dias seguidos
              </Text>
            </View>
          </View>
        </View>

        {/* Sign Out Button */}
        <TouchableOpacity
          style={styles.signOutButton}
          onPress={handleSignOut}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={22} color={Colors.red} />
          <Text style={styles.signOutText}>Sair da conta</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>Life Balance v1.0.0</Text>

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

  // Avatar Section
  avatarSection: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.limeBg,
    borderWidth: 3,
    borderColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  },
  avatarText: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.lime,
  },
  userName: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.xs,
  },
  userDay: {
    fontSize: FontSize.md,
    color: Colors.white50,
  },

  // Section
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
  sectionCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
  },

  // Profile Rows
  profileRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.md,
  },
  profileRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.white08,
  },
  profileRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  profileLabel: {
    fontSize: FontSize.md,
    color: Colors.white70,
  },
  profileValue: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    maxWidth: '50%',
    textAlign: 'right',
  },

  // Protocol
  protocolHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginBottom: Spacing.md,
  },
  protocolDay: {
    flexDirection: 'row',
  },
  protocolDayBig: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.white,
  },
  protocolDaySmall: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.medium,
    color: Colors.white50,
  },
  protocolPercent: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.lime,
  },
  protocolBarBg: {
    height: 10,
    backgroundColor: Colors.white15,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: Spacing.lg,
  },
  protocolBarFill: {
    height: '100%',
    backgroundColor: Colors.lime,
    borderRadius: 5,
  },
  protocolStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  protocolStat: {
    flex: 1,
    alignItems: 'center',
  },
  protocolStatValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },
  protocolStatLabel: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    marginTop: 2,
  },
  protocolStatDivider: {
    width: 1,
    height: 30,
    backgroundColor: Colors.white15,
  },

  // Community
  communityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.md,
    marginBottom: Spacing.lg,
  },
  communityItem: {
    width: '45%',
    alignItems: 'center',
    backgroundColor: Colors.white08,
    borderRadius: Radius.sm,
    padding: Spacing.md,
  },
  communityValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginVertical: Spacing.xs,
  },
  communityLabel: {
    fontSize: FontSize.xs,
    color: Colors.white50,
    textAlign: 'center',
  },
  omegaRatioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white08,
    borderRadius: Radius.sm,
    padding: Spacing.md,
  },
  omegaRatioLabel: {
    fontSize: FontSize.sm,
    color: Colors.white50,
  },
  omegaRatioValues: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  omegaRatioBefore: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.red,
  },
  omegaRatioAfter: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.green,
  },

  // Language
  languageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  languageText: {
    flex: 1,
    fontSize: FontSize.md,
    color: Colors.white,
  },

  // Streak Record
  streakRecordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  streakRecordFire: {
    fontSize: 32,
  },
  streakRecordInfo: {
    flex: 1,
  },
  streakRecordLabel: {
    fontSize: FontSize.sm,
    color: Colors.white50,
  },
  streakRecordValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Sign Out
  signOutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.redBg,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  signOutText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.red,
  },

  // Version
  versionText: {
    fontSize: FontSize.sm,
    color: Colors.white30,
    textAlign: 'center',
    marginTop: Spacing.xxl,
    marginBottom: Spacing.md,
  },
});
