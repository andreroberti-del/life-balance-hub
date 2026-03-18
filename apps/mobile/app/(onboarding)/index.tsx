import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Ionicons name="leaf" size={48} color={Colors.lime} />
          </View>
          <Text style={styles.logoText}>Life Balance</Text>
          <Text style={styles.tagline}>Wellness Intelligence</Text>
        </View>

        <View style={styles.features}>
          <FeatureItem
            icon="analytics"
            text="Acompanhe seu progresso de saúde"
          />
          <FeatureItem
            icon="scan"
            text="Escaneie e avalie alimentos"
          />
          <FeatureItem
            icon="fish"
            text="Compare marcas de Omega-3"
          />
          <FeatureItem
            icon="trending-up"
            text="Visualize suas métricas"
          />
        </View>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(onboarding)/step1')}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Começar</Text>
          <Ionicons name="arrow-forward" size={20} color={Colors.dark} />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function FeatureItem({ icon, text }: { icon: React.ComponentProps<typeof Ionicons>['name']; text: string }) {
  return (
    <View style={styles.featureItem}>
      <View style={styles.featureIcon}>
        <Ionicons name={icon} size={20} color={Colors.lime} />
      </View>
      <Text style={styles.featureText}>{text}</Text>
    </View>
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
    justifyContent: 'space-between',
    paddingTop: 60,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logoCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: Colors.limeBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  logoText: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.black,
    color: Colors.white,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.light,
    color: Colors.lime,
    marginTop: Spacing.xs,
    letterSpacing: 2,
    textTransform: 'uppercase',
  },
  features: {
    gap: Spacing.lg,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.lg,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: Colors.limeBg2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontSize: FontSize.base,
    color: Colors.white70,
    flex: 1,
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
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
});
