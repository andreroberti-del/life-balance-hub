import { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { setUserOmega } from '../../lib/api';

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

type Language = 'pt' | 'en' | 'es';

interface LanguageOption {
  code: Language;
  label: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'pt', label: 'Portugues', flag: 'BR' },
  { code: 'en', label: 'English', flag: 'US' },
  { code: 'es', label: 'Espanol', flag: 'ES' },
];

export default function Step4Screen() {
  const router = useRouter();
  const { user } = useAuth();
  const [language, setLanguage] = useState<Language>('pt');
  const [isLoading, setIsLoading] = useState(false);

  async function handleStart() {
    if (isLoading || !user) return;
    setIsLoading(true);

    try {
      const step1Raw = await AsyncStorage.getItem('@life_balance_step1');
      const step2Raw = await AsyncStorage.getItem('@life_balance_step2');
      const step3Raw = await AsyncStorage.getItem('@life_balance_step3');

      const step1 = step1Raw ? JSON.parse(step1Raw) : {};
      const step2 = step2Raw ? JSON.parse(step2Raw) : {};
      const step3 = step3Raw ? JSON.parse(step3Raw) : {};

      const today = new Date().toISOString().split('T')[0];

      // Save profile to Supabase
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          name: user.user_metadata?.name || '',
          weight: parseFloat(step1.weight) || null,
          height: parseFloat(step1.height) || null,
          waist: parseFloat(step1.waist) || null,
          birth_date: step1.birthDate || null,
          gender: step2.gender || null,
          language,
          protocol_start_date: today,
        })
        .eq('id', user.id);

      if (profileError) {
        console.error('Error updating profile:', profileError);
        throw profileError;
      }

      // Set user omega if a brand was selected
      const selectedBrandId = step3.selectedBrandId || null;
      if (selectedBrandId) {
        await setUserOmega(selectedBrandId);
      }

      // Mark onboarded in AsyncStorage
      await AsyncStorage.setItem('@life_balance_onboarded', 'true');

      // Clean up temp keys
      await AsyncStorage.multiRemove([
        '@life_balance_step1',
        '@life_balance_step2',
        '@life_balance_step3',
      ]);

      router.replace('/(tabs)');
    } catch (error) {
      console.error('Error saving profile:', error);
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <ProgressDots current={3} total={4} />

        <Text style={styles.title}>Idioma</Text>
        <Text style={styles.subtitle}>
          Escolha o idioma do aplicativo.
        </Text>

        <View style={styles.languageList}>
          {languages.map((lang) => (
            <TouchableOpacity
              key={lang.code}
              style={[
                styles.languageCard,
                language === lang.code && styles.languageCardSelected,
              ]}
              onPress={() => setLanguage(lang.code)}
              activeOpacity={0.7}
            >
              <Text style={styles.flag}>{lang.flag}</Text>
              <Text
                style={[
                  styles.languageLabel,
                  language === lang.code && styles.languageLabelSelected,
                ]}
              >
                {lang.label}
              </Text>
              {language === lang.code && (
                <Ionicons
                  name="checkmark-circle"
                  size={24}
                  color={Colors.lime}
                />
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={{ flex: 1 }} />

        <View style={styles.readyContainer}>
          <Ionicons name="rocket" size={32} color={Colors.lime} />
          <Text style={styles.readyText}>Tudo pronto!</Text>
          <Text style={styles.readySubtext}>
            Seu protocolo de 120 dias comeca agora.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, isLoading && styles.buttonDisabled]}
          onPress={handleStart}
          activeOpacity={0.8}
          disabled={isLoading}
        >
          <Text style={styles.buttonText}>
            {isLoading ? 'Salvando...' : 'Comecar Protocolo'}
          </Text>
          {!isLoading && (
            <Ionicons name="arrow-forward" size={20} color={Colors.dark} />
          )}
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
  languageList: {
    gap: Spacing.md,
  },
  languageCard: {
    backgroundColor: Colors.dark3,
    borderRadius: Radius.sm,
    padding: Spacing.lg,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
    borderWidth: 1.5,
    borderColor: Colors.white08,
  },
  languageCardSelected: {
    borderColor: Colors.lime,
    backgroundColor: Colors.limeBg2,
  },
  flag: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white50,
    width: 36,
    textAlign: 'center',
  },
  languageLabel: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    color: Colors.white50,
    flex: 1,
  },
  languageLabelSelected: {
    color: Colors.white,
  },
  readyContainer: {
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.xxxl,
  },
  readyText: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: Colors.white,
    marginTop: Spacing.sm,
  },
  readySubtext: {
    fontSize: FontSize.base,
    color: Colors.white50,
    textAlign: 'center',
  },
  button: {
    backgroundColor: Colors.lime,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
});
