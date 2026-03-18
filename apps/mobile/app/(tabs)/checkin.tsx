import { useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { Colors, Spacing, Radius, FontSize, FontWeight } from '../../constants/theme';
import { useAuth } from '../../lib/AuthContext';
import { saveCheckIn, updateProfile } from '../../lib/api';

export default function CheckInScreen() {
  const { user } = useAuth();
  const router = useRouter();

  const [weight, setWeight] = useState('');
  const [sleepQuality, setSleepQuality] = useState(3);
  const [waterLiters, setWaterLiters] = useState('');
  const [waist, setWaist] = useState('');
  const [tookOmega, setTookOmega] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSave = useCallback(async () => {
    if (!user) {
      Alert.alert('Erro', 'Voce precisa estar logado para fazer check-in.');
      return;
    }

    setSaving(true);
    try {
      const today = new Date().toISOString().split('T')[0];

      const checkInData: any = {
        check_date: today,
        sleep_quality: sleepQuality,
        took_omega: tookOmega,
      };

      if (weight) {
        const w = parseFloat(weight.replace(',', '.'));
        if (!isNaN(w) && w > 0) {
          checkInData.weight = w;
        }
      }

      if (waterLiters) {
        const wl = parseFloat(waterLiters.replace(',', '.'));
        if (!isNaN(wl) && wl > 0) {
          checkInData.water_liters = wl;
        }
      }

      if (waist) {
        const ws = parseFloat(waist.replace(',', '.'));
        if (!isNaN(ws) && ws > 0) {
          checkInData.waist = ws;
        }
      }

      await saveCheckIn(checkInData);

      // Update profile weight if changed
      if (checkInData.weight) {
        try {
          await updateProfile({ weight: checkInData.weight });
        } catch {}
      }

      setSuccess(true);
      setTimeout(() => {
        router.back();
      }, 1500);
    } catch (error: any) {
      Alert.alert('Erro', error?.message || 'Nao foi possivel salvar o check-in.');
    } finally {
      setSaving(false);
    }
  }, [user, weight, sleepQuality, waterLiters, waist, tookOmega, router]);

  if (success) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar style="light" />
        <View style={styles.successContainer}>
          <View style={styles.successCircle}>
            <Ionicons name="checkmark" size={64} color={Colors.dark} />
          </View>
          <Text style={styles.successTitle}>Check-in salvo!</Text>
          <Text style={styles.successSubtitle}>Continue assim, voce esta no caminho certo.</Text>
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
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color={Colors.white} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Check-in de Hoje</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Weight */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Ionicons name="scale-outline" size={22} color={Colors.lime} />
            <Text style={styles.fieldLabel}>Peso (kg)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={weight}
            onChangeText={setWeight}
            placeholder="Ex: 87.5"
            placeholderTextColor={Colors.white30}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Sleep Quality */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Ionicons name="moon-outline" size={22} color={Colors.blue} />
            <Text style={styles.fieldLabel}>Qualidade do Sono</Text>
          </View>
          <View style={styles.pillsRow}>
            {[1, 2, 3, 4, 5].map((val) => (
              <TouchableOpacity
                key={val}
                style={[styles.sleepPill, sleepQuality === val && styles.sleepPillActive]}
                onPress={() => setSleepQuality(val)}
                activeOpacity={0.7}
              >
                <Text style={[styles.sleepPillText, sleepQuality === val && styles.sleepPillTextActive]}>
                  {val}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
          <Text style={styles.sleepHint}>
            {sleepQuality <= 2 ? 'Ruim' : sleepQuality === 3 ? 'Regular' : sleepQuality === 4 ? 'Bom' : 'Excelente'}
          </Text>
        </View>

        {/* Water */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Text style={{ fontSize: 20 }}>💧</Text>
            <Text style={styles.fieldLabel}>Agua (litros)</Text>
          </View>
          <TextInput
            style={styles.input}
            value={waterLiters}
            onChangeText={setWaterLiters}
            placeholder="Ex: 2.0"
            placeholderTextColor={Colors.white30}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Waist (optional) */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Ionicons name="ellipse-outline" size={22} color={Colors.orange} />
            <Text style={styles.fieldLabel}>Cintura (cm)</Text>
            <View style={styles.optionalBadge}>
              <Text style={styles.optionalText}>Semanal</Text>
            </View>
          </View>
          <TextInput
            style={styles.input}
            value={waist}
            onChangeText={setWaist}
            placeholder="Ex: 94"
            placeholderTextColor={Colors.white30}
            keyboardType="decimal-pad"
          />
        </View>

        {/* Took Omega */}
        <View style={styles.fieldCard}>
          <View style={styles.fieldHeader}>
            <Ionicons name="fish-outline" size={22} color={Colors.lime} />
            <Text style={styles.fieldLabel}>Tomou Omega hoje?</Text>
          </View>
          <View style={styles.omegaRow}>
            <TouchableOpacity
              style={[styles.omegaButton, tookOmega && styles.omegaButtonActive]}
              onPress={() => setTookOmega(true)}
              activeOpacity={0.7}
            >
              <Ionicons name="checkmark-circle" size={24} color={tookOmega ? Colors.dark : Colors.white50} />
              <Text style={[styles.omegaButtonText, tookOmega && styles.omegaButtonTextActive]}>Sim</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.omegaButton, !tookOmega && styles.omegaButtonNo]}
              onPress={() => setTookOmega(false)}
              activeOpacity={0.7}
            >
              <Ionicons name="close-circle" size={24} color={!tookOmega ? Colors.white : Colors.white50} />
              <Text style={[styles.omegaButtonText, !tookOmega && styles.omegaButtonTextNo]}>Nao</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
          activeOpacity={0.8}
        >
          {saving ? (
            <ActivityIndicator size="small" color={Colors.dark} />
          ) : (
            <>
              <Ionicons name="checkmark-circle" size={24} color={Colors.dark} />
              <Text style={styles.saveButtonText}>Salvar Check-in</Text>
            </>
          )}
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

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: Spacing.lg,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Field Card
  fieldCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
  },
  fieldHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  fieldLabel: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
    flex: 1,
  },

  // Input
  input: {
    backgroundColor: Colors.white08,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white,
  },

  // Sleep Pills
  pillsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  sleepPill: {
    flex: 1,
    paddingVertical: Spacing.md,
    borderRadius: Radius.full,
    backgroundColor: Colors.white08,
    alignItems: 'center',
  },
  sleepPillActive: {
    backgroundColor: Colors.lime,
  },
  sleepPillText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.white50,
  },
  sleepPillTextActive: {
    color: Colors.dark,
  },
  sleepHint: {
    fontSize: FontSize.sm,
    color: Colors.white50,
    textAlign: 'center',
    marginTop: Spacing.sm,
  },

  // Optional badge
  optionalBadge: {
    backgroundColor: Colors.orangeBg,
    paddingHorizontal: Spacing.sm,
    paddingVertical: 2,
    borderRadius: Radius.xs,
  },
  optionalText: {
    fontSize: FontSize.xs,
    color: Colors.orange,
    fontWeight: FontWeight.semibold,
  },

  // Omega
  omegaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  omegaButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    paddingVertical: Spacing.lg,
    borderRadius: Radius.sm,
    backgroundColor: Colors.white08,
  },
  omegaButtonActive: {
    backgroundColor: Colors.lime,
  },
  omegaButtonNo: {
    backgroundColor: Colors.white15,
  },
  omegaButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.bold,
    color: Colors.white50,
  },
  omegaButtonTextActive: {
    color: Colors.dark,
  },
  omegaButtonTextNo: {
    color: Colors.white,
  },

  // Save
  saveButton: {
    backgroundColor: Colors.lime,
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
    marginTop: Spacing.lg,
  },
  saveButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },

  // Success
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xxxl,
  },
  successCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: Colors.lime,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  successTitle: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginBottom: Spacing.sm,
  },
  successSubtitle: {
    fontSize: FontSize.base,
    color: Colors.white50,
    textAlign: 'center',
  },
});
