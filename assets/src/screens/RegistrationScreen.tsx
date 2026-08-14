import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { authApi, type Session } from '../services/api';
import { buttonStyles, fonts } from '../theme/theme';

interface RegistrationScreenProps {
  onRegistered: (session: Session) => void;
  onLoginPress: () => void;
}

export function RegistrationScreen({ onRegistered, onLoginPress }: RegistrationScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [turnstileToken, setTurnstileToken] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === window.location.origin && event.data?.type === 'quench-turnstile') {
        setTurnstileToken(event.data.token);
      }
    };

    if (Platform.OS === 'web') window.addEventListener('message', handleMessage);
    return () => {
      if (Platform.OS === 'web') window.removeEventListener('message', handleMessage);
    };
  }, []);

  const register = async () => {
    try {
      setError(null);
      onRegistered(await authApi.register(email, password, turnstileToken));
    } catch (_error) {
      setError('Registration could not be completed. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>Create your garden</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" mode="outlined" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
        {Platform.OS === 'web' ? (
          <iframe src="/auth/turnstile" style={styles.turnstile as never} title="Security verification" />
        ) : null}
        {error ? <Text style={styles.errorText}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button mode="outlined" onPress={onLoginPress} style={styles.button} labelStyle={styles.buttonLabel}>Log in</Button>
          <Button mode="contained" disabled={!turnstileToken} onPress={register} style={styles.button} labelStyle={styles.buttonLabel}>Create account</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 16 },
  card: { backgroundColor: 'white', borderRadius: 16, padding: 24 },
  title: { fontWeight: '600', marginBottom: 24 },
  input: { marginBottom: 8 },
  turnstile: { borderWidth: 0, height: 32, width: '100%' },
  errorText: { color: '#d14d3a', fontSize: 12, marginBottom: 16, marginLeft: 4 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 8 },
  button: { minWidth: 140, borderRadius: buttonStyles.borderRadius },
  buttonLabel: { fontFamily: fonts.semiBold, letterSpacing: 0.14 },
});
