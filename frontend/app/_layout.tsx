import { useEffect } from 'react';
import { Stack, useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold
} from '@expo-google-fonts/inter';
import { SplashScreen } from 'expo-router';
import { AuthProvider, useAuth } from '@hooks/useAuth';

SplashScreen.preventAutoHideAsync();

function AuthRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        // If not logged in, redirect to login
        router.replace('/login');
      } else if (user.role === 'caregiver') {
        router.replace('/(tabs-caregiver)');
      } else {
        router.replace('/(tabs-patient)');
      }
    }
  }, [user, loading]);

  return null;
}

export default function RootLayout() {
  useFrameworkReady();

  const [fontsLoaded, fontError] = useFonts({
    'Inter-Regular': Inter_400Regular,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <AuthProvider>
      <>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="login" options={{ headerShown: false }} />
          <Stack.Screen name="signup" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs-caregiver)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs-patient)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" />
        </Stack>
        <AuthRedirect />
        <StatusBar style="dark" />
      </>
    </AuthProvider>
  );
}