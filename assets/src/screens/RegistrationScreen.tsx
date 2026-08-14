import { useEffect, useState } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { authApi, type Session } from '../services/api';

interface RegistrationScreenProps {
  onRegistered: (session: Session) => void;
}

export function RegistrationScreen({ onRegistered }: RegistrationScreenProps) {
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
      <Text variant="headlineMedium">Create your garden</Text>
      <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
      <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry />
      {Platform.OS === 'web' ? (
        <iframe src="/auth/turnstile" style={styles.turnstile as never} title="Security verification" />
      ) : null}
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Button mode="contained" disabled={!turnstileToken} onPress={register}>Create account</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, gap: 16, justifyContent: 'center', padding: 24 },
  turnstile: { borderWidth: 0, height: 65, width: '100%' },
  error: { color: '#b42318' },
});
