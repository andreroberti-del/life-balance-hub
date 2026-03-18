import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../lib/AuthContext';
import { Colors, FontSize, FontWeight, Spacing, Radius } from '../../constants/theme';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignIn() {
    if (!email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      const message = err?.message || 'Erro ao fazer login.';
      if (message.includes('Invalid login credentials')) {
        setError('Email ou senha incorretos.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
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
          <View style={styles.logoContainer}>
            <View style={styles.logoCircle}>
              <Ionicons name="leaf" size={48} color={Colors.lime} />
            </View>
            <Text style={styles.logoText}>Life Balance</Text>
            <Text style={styles.tagline}>Wellness Intelligence</Text>
          </View>

          <View style={styles.form}>
            {error.length > 0 && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={Colors.red} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="seu@email.com"
                placeholderTextColor={Colors.white30}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Senha</Text>
              <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="Sua senha"
                placeholderTextColor={Colors.white30}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignIn}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonLoading]}
              onPress={handleSignIn}
              activeOpacity={0.8}
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.dark} />
              ) : (
                <Text style={styles.buttonText}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={styles.dividerRow}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>ou</Text>
              <View style={styles.dividerLine} />
            </View>

            <TouchableOpacity
              style={[styles.googleButton, googleLoading && styles.buttonLoading]}
              onPress={async () => {
                setError('');
                setGoogleLoading(true);
                try {
                  await signInWithGoogle();
                } catch (err: any) {
                  setError(err?.message || 'Erro ao conectar com Google.');
                } finally {
                  setGoogleLoading(false);
                }
              }}
              activeOpacity={0.8}
              disabled={isLoading || googleLoading}
            >
              {googleLoading ? (
                <ActivityIndicator size="small" color={Colors.white} />
              ) : (
                <>
                  <Ionicons name="logo-google" size={20} color={Colors.white} />
                  <Text style={styles.googleButtonText}>Continuar com Google</Text>
                </>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.outlineButton}
              onPress={() => router.push('/(auth)/signup')}
              activeOpacity={0.8}
              disabled={isLoading || googleLoading}
            >
              <Text style={styles.outlineButtonText}>Criar conta com email</Text>
            </TouchableOpacity>
          </View>
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
    justifyContent: 'center',
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xxxl + 16,
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
  form: {
    gap: Spacing.xl,
    marginBottom: Spacing.xxxl,
  },
  errorContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: Colors.redBg,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderRadius: Radius.sm,
  },
  errorText: {
    fontSize: FontSize.md,
    color: Colors.red,
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
  actions: {
    gap: Spacing.lg,
  },
  button: {
    backgroundColor: Colors.lime,
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonLoading: {
    opacity: 0.8,
  },
  buttonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.dark,
  },
  outlineButton: {
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.lime,
  },
  outlineButtonText: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
    color: Colors.lime,
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.white15,
  },
  dividerText: {
    fontSize: FontSize.sm,
    color: Colors.white30,
    fontWeight: FontWeight.medium,
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  googleButton: {
    height: 56,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: Spacing.md,
    backgroundColor: Colors.dark3,
    borderWidth: 1,
    borderColor: Colors.white15,
  },
  googleButtonText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
    color: Colors.white,
  },
});
