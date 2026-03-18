import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import type { Database } from '../../lib/supabase';

type OmegaBrandRow = Database['public']['Tables']['omega_brands']['Row'];

function ProgressDots({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.dotsContainer}>
      {Array.from({ length: total }, (_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            i === current ? styles.dotActive : styles.dotInactive,
          ]}
        />
      ))}
    </View>
  );
}

export default function Step3Screen() {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [noOmega, setNoOmega] = useState(false);
  const [brands, setBrands] = useState<OmegaBrandRow[]>([]);
  const [loadingBrands, setLoadingBrands] = useState(true);

  useEffect(() => {
    loadBrands();
  }, []);

  async function loadBrands() {
    try {
      const { data, error } = await supabase
        .from('omega_brands')
        .select('*')
        .order('name');

      if (error) throw error;
      setBrands(data || []);
    } catch (err) {
      console.error('Error loading omega brands:', err);
      setBrands([]);
    } finally {
      setLoadingBrands(false);
    }
  }

  function handleSelectBrand(id: string) {
    setNoOmega(false);
    setSelectedId(id);
  }

  function handleNoOmega() {
    setSelectedId(null);
    setNoOmega(true);
  }

  const hasSelection = selectedId !== null || noOmega;

  async function handleContinue() {
    if (!hasSelection) return;
    const selected = noOmega
      ? null
      : brands.find((b) => b.id === selectedId) ?? null;
    await AsyncStorage.setItem(
      '@life_balance_step3',
      JSON.stringify({
        currentOmega: selected,
        selectedBrandId: selected?.id ?? null,
      })
    );
    router.push('/(onboarding)/step4');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <ProgressDots current={2} total={4} />

        <Text style={styles.title}>Seu Omega-3</Text>
        <Text style={styles.subtitle}>
          Qual marca de Omega-3 voce toma atualmente?
        </Text>

        {loadingBrands ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={Colors.lime} />
            <Text style={styles.loadingText}>Carregando marcas...</Text>
          </View>
        ) : (
          <ScrollView
            style={styles.list}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
          >
            {brands.map((brand) => (
              <TouchableOpacity
                key={brand.id}
                style={[
                  styles.brandCard,
                  selectedId === brand.id && styles.brandCardSelected,
                ]}
                onPress={() => handleSelectBrand(brand.id)}
                activeOpacity={0.7}
              >
                <View style={styles.brandInfo}>
                  <Text
                    style={[
                      styles.brandName,
                      selectedId === brand.id && styles.brandNameSelected,
                    ]}
                  >
                    {brand.name}
                  </Text>
                  {brand.dosage && (
                    <Text style={styles.brandDosage}>{brand.dosage}</Text>
                  )}
                </View>
                <View style={styles.brandMeta}>
                  {brand.manufacturer && (
                    <Text style={styles.brandManufacturer}>
                      {brand.manufacturer}
                    </Text>
                  )}
                  {selectedId === brand.id && (
                    <Ionicons
                      name="checkmark-circle"
                      size={24}
                      color={Colors.lime}
                    />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[
                styles.noOmegaCard,
                noOmega && styles.noOmegaCardSelected,
              ]}
              onPress={handleNoOmega}
              activeOpacity={0.7}
            >
              <Ionicons
                name="close-circle-outline"
                size={24}
                color={noOmega ? Colors.lime : Colors.white30}
              />
              <Text
                style={[
                  styles.noOmegaText,
                  noOmega && styles.noOmegaTextSelected,
                ]}
              >
                Nao tomo Omega-3
              </Text>
            </TouchableOpacity>
          </ScrollView>
        )}

        <TouchableOpacity
          style={[styles.button, !hasSelection && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!hasSelection}
        >
          <Text
            style={[
              styles.buttonText,
              !hasSelection && styles.buttonTextDisabled,
            ]}
          >
            Continuar
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark2,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xxl,
    paddingTop: Spacing.xxl,
    paddingBottom: 40,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotActive: {
    backgroundColor: Colors.lime,
    width: 24,
  },
  dotInactive: {
    backgroundColor: Colors.white15,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.base,
    color: Colors.white50,
    marginBottom: Spacing.xl,
    lineHeight: 22,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.lg,
  },
  loadingText: {
    fontSize: FontSize.base,
    color: Colors.white50,
  },
  list: {
    flex: 1,
  },
  listContent: {
    gap: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  brandCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: Colors.white08,
  },
  brandCardSelected: {
    borderColor: Colors.lime,
    backgroundColor: Colors.limeBg2,
  },
  brandInfo: {
    flex: 1,
    gap: 2,
  },
  brandName: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white70,
  },
  brandNameSelected: {
    color: Colors.white,
  },
  brandDosage: {
    fontSize: FontSize.sm,
    color: Colors.white30,
  },
  brandMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandManufacturer: {
    fontSize: FontSize.xs,
    color: Colors.white30,
  },
  noOmegaCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.white08,
    marginTop: Spacing.sm,
  },
  noOmegaCardSelected: {
    borderColor: Colors.lime,
    backgroundColor: Colors.limeBg2,
  },
  noOmegaText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    color: Colors.white50,
  },
  noOmegaTextSelected: {
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.lime,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  buttonDisabled: {
    backgroundColor: Colors.white08,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  buttonTextDisabled: {
    color: Colors.white30,
  },
});
