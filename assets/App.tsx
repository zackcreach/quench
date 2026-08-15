import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { PaperProvider } from 'react-native-paper';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, View } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
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
import { LoginScreen } from './src/screens/LoginScreen';
import { authApi, type Session } from './src/services/api';
import {
  clearSelectedGarden,
  saveSelectedGarden,
  selectedGarden,
} from './src/utils/gardenSelection';

export default function App() {
  const [session, setSession] = useState<Session | null>(null);
  const [selectedGardenId, setSelectedGardenId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(
    typeof window !== 'undefined' && window.location.pathname === '/users/log-in'
  );
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  const updateSession = useCallback(async (nextSession: Session) => {
    const garden = await selectedGarden(nextSession);
    setSelectedGardenId(garden?.id ?? null);
    setSession(nextSession);
  }, []);

  const selectGarden = useCallback(async (gardenId: string) => {
    if (!session) return;

    setSelectedGardenId(gardenId);
    await saveSelectedGarden(session, gardenId);
  }, [session]);

  const logOut = useCallback(async () => {
    if (session) await clearSelectedGarden(session);
    setSelectedGardenId(null);
    setSession({ authenticated: false, csrf_token: '' });
  }, [session]);

  useEffect(() => {
    authApi.session().then(updateSession).catch(() => setSession({ authenticated: false, csrf_token: '' }));
  }, [updateSession]);

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FAFBFB' }}>
        <ActivityIndicator size="large" color="#52796f" />
      </View>
    );
  }

  if (!session) return null;

  const garden = session.gardens?.find(({ id }) => id === selectedGardenId) ?? session.gardens?.[0];

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          {session.authenticated && garden ? (
            <HomeScreen
              gardenId={garden.id}
              gardens={session.gardens ?? []}
              onGardenSelected={selectGarden}
              onLoggedOut={logOut}
            />
          ) : showLogin ? (
            <LoginScreen onLoggedIn={updateSession} onRegisterPress={() => setShowLogin(false)} />
          ) : (
            <RegistrationScreen onRegistered={updateSession} onLoginPress={() => setShowLogin(true)} />
          )}
        </PaperProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
