import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import { useEffect, useState } from 'react';
import {
  useFonts,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';
import { theme } from './src/theme/theme';
import { HomeScreen } from './src/screens/HomeScreen';
import { RegistrationScreen } from './src/screens/RegistrationScreen';
import { authApi, type Session } from './src/services/api';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    authApi.session().then(setSession).catch(() => setSession({ authenticated: false, csrf_token: '' }));
  }, []);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFBFB' }}>
        <ActivityIndicator size="large" color="#52796f" />
      </View>
    );
  }

  if (!session) return null;

  const garden = session.gardens?.[0];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          {session.authenticated && garden ? <HomeScreen gardenId={garden.id} onLoggedOut={() => setSession({ authenticated: false, csrf_token: '' })} /> : <RegistrationScreen onRegistered={setSession} />}
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
