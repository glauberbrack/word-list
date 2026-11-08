import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { credentialsSchema } from '@/core/schemas/auth.schema';
import { useAuthStore } from '@/store/auth.store';
import { colors, spacing, typography } from '@/theme';

import { PrimaryButton } from './primary-button';
import { TextField } from './text-field';

type TFieldErrors = Partial<Record<'email' | 'password', string>>;

type TSignInFormProps = {
  onSignedIn: () => void;
};

export function SignInForm({ onSignedIn }: TSignInFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fieldErrors, setFieldErrors] = useState<TFieldErrors>({});
  const [notice, setNotice] = useState<string | null>(null);
  const { pending, error, signIn, signUp } = useAuthStore();

  function validate() {
    const result = credentialsSchema.safeParse({ email: email.trim(), password });
    if (result.success) {
      setFieldErrors({});
      return result.data;
    }

    const errors: TFieldErrors = {};
    for (const issue of result.error.issues) {
      const field = issue.path[0];
      if (field === 'email' || field === 'password') errors[field] ??= issue.message;
    }
    setFieldErrors(errors);
    return null;
  }

  async function handleSignIn() {
    setNotice(null);
    const credentials = validate();
    if (credentials && (await signIn(credentials.email, credentials.password))) onSignedIn();
  }

  async function handleSignUp() {
    setNotice(null);
    const credentials = validate();
    if (!credentials) return;

    const result = await signUp(credentials.email, credentials.password);
    if (result?.needsConfirmation) setNotice('Conta criada. Confira seu e-mail para confirmar.');
    else if (result) onSignedIn();
  }

  return (
    <View style={styles.container}>
      <Text style={styles.description}>
        Entre para guardar favoritos e histórico na sua conta e ver em outro aparelho.
      </Text>
      <TextField
        label="E-mail"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        textContentType="emailAddress"
        error={fieldErrors.email}
      />
      <TextField
        label="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoComplete="password"
        textContentType="password"
        error={fieldErrors.password}
      />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      {notice ? <Text style={styles.notice}>{notice}</Text> : null}
      <PrimaryButton label="Entrar" onPress={handleSignIn} loading={pending} />
      <PrimaryButton label="Criar conta" onPress={handleSignUp} variant="outline" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  description: {
    ...typography.body,
    color: colors.textMuted,
  },
  error: {
    ...typography.caption,
    color: colors.danger,
  },
  notice: {
    ...typography.caption,
    color: colors.primary,
  },
});
