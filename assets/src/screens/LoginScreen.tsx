import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { authApi, type Session } from '../services/api';
import { buttonStyles, fonts } from '../theme/theme';

export function LoginScreen({ onLoggedIn, onRegisterPress }: { onLoggedIn: (session: Session) => void; onRegisterPress: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const login = async () => {
    try {
      setError(null);
      onLoggedIn(await authApi.login(email, password));
    } catch (_error) {
      setError('Invalid email or password.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text variant="titleLarge" style={styles.title}>Log in</Text>
        <TextInput label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" mode="outlined" style={styles.input} />
        <TextInput label="Password" value={password} onChangeText={setPassword} secureTextEntry mode="outlined" style={styles.input} />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <View style={styles.actions}>
          <Button mode="outlined" onPress={onRegisterPress} style={styles.button} labelStyle={styles.label}>Create account</Button>
          <Button mode="contained" onPress={login} style={styles.button} labelStyle={styles.label}>Log in</Button>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({ container: { flex: 1, justifyContent: 'center', padding: 16 }, card: { backgroundColor: 'white', borderRadius: 16, padding: 24 }, title: { fontWeight: '600', marginBottom: 24 }, input: { marginBottom: 8 }, error: { color: '#d14d3a', fontSize: 12, marginBottom: 16, marginLeft: 4 }, actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 }, button: { minWidth: 100, borderRadius: buttonStyles.borderRadius }, label: { fontFamily: fonts.semiBold, letterSpacing: 0.14 } });
