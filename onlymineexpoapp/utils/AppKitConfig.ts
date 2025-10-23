// src/AppKitConfig.ts
import { bitcoin, createAppKit, solana } from '@reown/appkit-react-native';
import { SolanaAdapter } from '@reown/appkit-solana-react-native';
import "@walletconnect/react-native-compat";
import { storage } from "./StorageUtils";

import { mainnet, polygon } from 'viem/chains';

const projectId = '7ac4f90671fe28d57da49c2a7dc35018';

const solanaAdapter = new SolanaAdapter();

export const appKit = createAppKit({
  projectId,
  networks: [mainnet, polygon, solana, bitcoin],
  defaultNetwork: mainnet,
  adapters: [solanaAdapter],
  
  // Required for React Native
  storage,
  metadata: {
    name: 'My Awesome dApp',
    description: 'My dApp description',
    url: 'https://myapp.com',
    icons: ['https://myapp.com/icon.png'],
    redirect: {
      native: "YOUR_APP_SCHEME://",
      universal: "YOUR_APP_UNIVERSAL_LINK.com",
    },
  }
});