import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';

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

export default function Step1Screen() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [waist, setWaist] = useState('');
  const [birthDate, setBirthDate] = useState('');

  const isValid =
    weight.length > 0 &&
    height.length > 0 &&
    waist.length > 0 &&
    birthDate.length >= 8;

  async function handleContinue() {
    if (!isValid) return;
    await AsyncStorage.setItem(
      '@life_balance_step1',
      JSON.stringify({ weight, height, waist, birthDate })
    );
    router.push('/(onboarding)/step2');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <ProgressDots current={0} total={4} />

          <Text style={styles.title}>Dados Básicos</Text>
          <Text style={styles.subtitle}>
            Precisamos de algumas informações para personalizar sua experiência.
          </Text>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Peso (kg)</Text>
              <TextInput
                style={styles.input}
                value={weight}
                onChangeText={setWeight}
                placeholder="Ex: 85.5"
                placeholderTextColor={Colors.white30}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Altura (m)</Text>
              <TextInput
                style={styles.input}
                value={height}
                onChangeText={setHeight}
                placeholder="Ex: 1.75"
                placeholderTextColor={Colors.white30}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Circunferência abdominal (cm)</Text>
              <TextInput
                style={styles.input}
                value={waist}
                onChangeText={setWaist}
                placeholder="Ex: 92"
                placeholderTextColor={Colors.white30}
                keyboardType="decimal-pad"
                returnKeyType="next"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data de nascimento</Text>
              <TextInput
                style={styles.input}
                value={birthDate}
                onChangeText={setBirthDate}
                placeholder="DD/MM/AAAA"
                placeholderTextColor={Colors.white30}
                keyboardType="number-pad"
                maxLength={10}
              />
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, !isValid && styles.buttonDisabled]}
            onPress={handleContinue}
            activeOpacity={0.8}
            disabled={!isValid}
          >
            <Text style={[styles.buttonText, !isValid && styles.buttonTextDisabled]}>
              Continuar
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.dark2,
  },
  scrollContent: {
    flexGrow: 1,
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
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
  form: {
    gap: Spacing.xl,
    flex: 1,
  },
  inputGroup: {
    gap: Spacing.sm,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: Colors.white70,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  input: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.sm,
    height: 52,
    paddingHorizontal: Spacing.lg,
    fontSize: FontSize.base,
    color: Colors.white,
    borderWidth: 1,
    borderColor: Colors.white08,
  },
  button: {
    backgroundColor: Colors.lime,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.xxxl,
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
