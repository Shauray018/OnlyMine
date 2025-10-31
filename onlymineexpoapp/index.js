
import { registerRootComponent } from 'expo';
import { ExpoRoot } from 'expo-router';
import 'react-native-url-polyfill/auto'; // 👈 must come first!

// Expo Router uses this to bootstrap your "app" directory
export function App() {
  const ctx = require.context('./app');
  return <ExpoRoot context={ctx} />;
}

registerRootComponent(App); 