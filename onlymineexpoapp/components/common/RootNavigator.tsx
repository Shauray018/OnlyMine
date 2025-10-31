import { useAccount } from '@reown/appkit-react-native';
import { Stack, useRouter, useSegments } from 'expo-router';
import { useEffect, useState } from 'react';

export default function RootNavigator() {
  const { address } = useAccount();
  const segments = useSegments();
  const router = useRouter();
  const [isReady, setIsReady] = useState(false);

  // Wait for first render to complete
  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if (!isReady) return; // Don't navigate until ready

    const inAuthGroup = segments[0] === '(auth)';
    
    // Not connected/no address -> go to login
    if (!address && !inAuthGroup) {
      router.replace('/(auth)/login');
    } 
    // Connected with address -> go to tabs
    else if (address && inAuthGroup) {
      router.replace('/(tabs)/home');
    }
  }, [address, segments, isReady]);

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
      <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
    </Stack>
  );
}