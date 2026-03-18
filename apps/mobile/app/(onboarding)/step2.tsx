import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
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

type Gender = 'male' | 'female';

export default function Step2Screen() {
  const router = useRouter();
  const [gender, setGender] = useState<Gender | null>(null);

  async function handleContinue() {
    if (!gender) return;
    await AsyncStorage.setItem('@life_balance_step2', JSON.stringify({ gender }));
    router.push('/(onboarding)/step3');
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <ProgressDots current={1} total={4} />

        <Text style={styles.title}>Sexo Biológico</Text>
        <Text style={styles.subtitle}>
          Necessário para cálculos precisos de métricas de saúde.
        </Text>

        <View style={styles.cards}>
          <TouchableOpacity
            style={[
              styles.card,
              gender === 'male' && styles.cardSelected,
            ]}
            onPress={() => setGender('male')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconCircle,
                gender === 'male' && styles.iconCircleSelected,
              ]}
            >
              <Ionicons
                name="male"
                size={36}
                color={gender === 'male' ? Colors.dark : Colors.white50}
              />
            </View>
            <Text
              style={[
                styles.cardText,
                gender === 'male' && styles.cardTextSelected,
              ]}
            >
              Masculino
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.card,
              gender === 'female' && styles.cardSelected,
            ]}
            onPress={() => setGender('female')}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.iconCircle,
                gender === 'female' && styles.iconCircleSelected,
              ]}
            >
              <Ionicons
                name="female"
                size={36}
                color={gender === 'female' ? Colors.dark : Colors.white50}
              />
            </View>
            <Text
              style={[
                styles.cardText,
                gender === 'female' && styles.cardTextSelected,
              ]}
            >
              Feminino
            </Text>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1 }} />

        <TouchableOpacity
          style={[styles.button, !gender && styles.buttonDisabled]}
          onPress={handleContinue}
          activeOpacity={0.8}
          disabled={!gender}
        >
          <Text style={[styles.buttonText, !gender && styles.buttonTextDisabled]}>
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
    marginBottom: Spacing.xxxl,
    lineHeight: 22,
  },
  cards: {
    flexDirection: 'row',
    gap: Spacing.lg,
  },
  card: {
    flex: 1,
    backgroundColor: Colors.dark3,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.xxxl,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white08,
    gap: Spacing.lg,
  },
  cardSelected: {
    borderColor: Colors.lime,
    backgroundColor: Colors.limeBg2,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.white08,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleSelected: {
    backgroundColor: Colors.lime,
  },
  cardText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.white50,
  },
  cardTextSelected: {
    color: Colors.white,
  },
  button: {
    backgroundColor: Colors.lime,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
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
