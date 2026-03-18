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

export default function SignupScreen() {
  const router = useRouter();
  const { signUp, signInWithGoogle } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSignUp() {
    if (!name.trim() || !email.trim() || !password.trim()) {
      setError('Preencha todos os campos.');
      return;
    }
    if (password.length < 6) {
      setError('A senha deve ter no minimo 6 caracteres.');
      return;
    }
    setError('');
    setIsLoading(true);
    try {
      await signUp(email.trim(), password, name.trim());
      router.replace('/(onboarding)');
    } catch (err: any) {
      const message = err?.message || 'Erro ao criar conta.';
      if (message.includes('already registered')) {
        setError('Este email ja esta cadastrado.');
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
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={Colors.white70} />
            </TouchableOpacity>
            <Text style={styles.title}>Criar Conta</Text>
            <Text style={styles.subtitle}>
              Crie sua conta para comecar seu protocolo de saude.
            </Text>
          </View>

          <View style={styles.form}>
            {error.length > 0 && (
              <View style={styles.errorContainer}>
                <Ionicons name="alert-circle" size={18} color={Colors.red} />
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome</Text>
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Seu nome completo"
                placeholderTextColor={Colors.white30}
                autoCapitalize="words"
                returnKeyType="next"
                editable={!isLoading}
              />
            </View>

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
                placeholder="Minimo 6 caracteres"
                placeholderTextColor={Colors.white30}
                secureTextEntry
                returnKeyType="done"
                onSubmitEditing={handleSignUp}
                editable={!isLoading}
              />
            </View>
          </View>

          <View style={styles.actions}>
            <TouchableOpacity
              style={[styles.button, isLoading && styles.buttonLoading]}
              onPress={handleSignUp}
              activeOpacity={0.8}
              disabled={isLoading || googleLoading}
            >
              {isLoading ? (
                <ActivityIndicator size="small" color={Colors.dark} />
              ) : (
                <Text style={styles.buttonText}>Criar Conta</Text>
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
              style={styles.linkButton}
              onPress={() => router.back()}
              activeOpacity={0.7}
              disabled={isLoading || googleLoading}
            >
              <Text style={styles.linkText}>Ja tenho conta</Text>
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
    paddingTop: Spacing.xxl,
    paddingBottom: 40,
  },
  header: {
    marginBottom: Spacing.xxxl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.dark3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
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
    lineHeight: 22,
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
    gap: Spacing.xl,
    marginTop: 'auto',
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
  linkButton: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  linkText: {
    fontSize: FontSize.base,
    fontWeight: FontWeight.semibold,
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
