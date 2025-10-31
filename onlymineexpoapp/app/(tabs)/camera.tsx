import { CameraScreen } from "@/components/screens/CameraScreen";
import SignupScreen from "@/components/screens/SignupScreen";
import { useAccount, useProvider } from '@reown/appkit-react-native';
import React from "react";

// const { walletProvider } = useAppKitProvider<Provider>("solana");

export default function MainScreen() {
  // const { address, walle tProvider } = useAppKit();
   const { provider, providerType } = useProvider(); 

  const { chainId, address, isConnected } = useAccount();

  if (!address) {
    return <SignupScreen />;
  }

  return (
    // <CameraScreen
    // />
     <CameraScreen
      onPostSuccess={() => {
        console.log('Post created successfully!');
        // You can add logic here like showing a success message
        // or refreshing a feed if you add one later
      }}
      onClose={() => {
        console.log('Camera closed');
        // Optional: handle closing the camera
        // For now it doesn't do anything since there's no navigation
      }}
    />
  );
}