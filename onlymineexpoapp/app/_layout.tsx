// import { appKit } from '@/utils/AppKitConfig';
// import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
// import { AppKit, AppKitProvider, useAccount } from '@reown/appkit-react-native';
// import { SolanaAdapter } from '@reown/appkit-solana-react-native';
// import '@walletconnect/react-native-compat';
// import { Stack, useRouter, useSegments } from 'expo-router';
// import { StatusBar } from 'expo-status-bar';
// import { useEffect } from 'react';
// import 'react-native-reanimated';
// import 'text-encoding'; // needed for @solana/web3.js to work

// const solanaAdapter = new SolanaAdapter();

// import { useColorScheme } from '@/hooks/use-color-scheme';

// export const unstable_settings = {
//   anchor: '(tabs)',
// };

// export default function RootLayout() {
//   const colorScheme = useColorScheme();
//   const { address } = useAccount();
//   const segments = useSegments();
//   const router = useRouter();

//   useEffect(() => {
//     const inAuthGroup = segments[0] === '(auth)';
    
//     // Not connected/no address -> go to login
//     if (!address && !inAuthGroup) {
//       router.replace('/(auth)/login');
//     } 
//     // Connected with address -> go to tabs
//     else if (address && inAuthGroup) {
//       router.replace('/(tabs)/home');
//     }
//   }, [address, segments]);

//   return (
//      <AppKitProvider instance={appKit}>
//     <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
//       <Stack>
//         <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
//         <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
//       </Stack>
//       <StatusBar style="auto" />
//     </ThemeProvider>
//     <AppKit />
//      </AppKitProvider>
//   );
// }
import { AuthProvider } from '@/components/contexts/AuthContext';
import { appKit } from '@/utils/AppKitConfig';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { AppKit, AppKitProvider } from '@reown/appkit-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import '@walletconnect/react-native-compat';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from "react-native-gesture-handler";
import 'react-native-reanimated';
import 'text-encoding';

const solanaAdapter = new SolanaAdapter();

import RootNavigator from '@/components/common/RootNavigator';
import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
     <GestureHandlerRootView style={{ flex: 1 }}>

    <AppKitProvider instance={appKit}>
      <AuthProvider>

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <RootNavigator />
        <StatusBar style="auto" />
      </ThemeProvider>
      </AuthProvider>
      <AppKit />
    </AppKitProvider>
     </GestureHandlerRootView>
  );
}