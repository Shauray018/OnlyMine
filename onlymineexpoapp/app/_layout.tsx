import { appKit } from '@/utils/AppKitConfig';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AppKit, AppKitProvider } from '@reown/appkit-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import '@walletconnect/react-native-compat';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import 'text-encoding'; // needed for @solana/web3.js to work

const solanaAdapter = new SolanaAdapter();

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
     <AppKitProvider instance={appKit}>
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
    <AppKit />
     </AppKitProvider>
  );
}
