# 📸 NFT Social - Mobile App

> A community-driven photo-sharing app on Solana where creators earn NFTs for their most engaging content.

[![Solana](https://img.shields.io/badge/Solana-14F195?style=for-the-badge&logo=solana&logoColor=black)](https://solana.com)
[![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)](https://expo.dev)
[![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)

## ✨ Features

- 🔐 **Wallet-First Authentication** - Connect with any Solana wallet (Phantom, Solflare, etc.)
- 📷 **Native Camera Integration** - Capture and share photos instantly
- ❤️ **Social Engagement** - Like, comment, and interact with the community
- 🏆 **Weekly NFT Drops** - Top 10 posts automatically become NFTs
- 👤 **User Profiles** - Showcase your posts and earned NFTs
- 📊 **Trending Algorithm** - Smart feed ranking based on engagement and recency

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ and npm/yarn
- Expo CLI: `npm install -g expo-cli`
- iOS Simulator (Mac) or Android Emulator
- Solana wallet app on your device (Phantom, Solflare)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/nft-social-app.git
cd nft-social-app

# Install dependencies
npm install

# Start development server
npx expo start
```

### Environment Variables

Create a `.env` file in the root directory:

```env
EXPO_PUBLIC_API_URL=https://your-backend-api.vercel.app
EXPO_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

Get your Reown Project ID from: https://cloud.reown.com

## 📱 Running the App

### Development

```bash
# Start Expo dev server
npx expo start

# Run on iOS
npx expo start --ios

# Run on Android
npx expo start --android

# Run on web (limited functionality)
npx expo start --web
```

### Building for Production

```bash
# iOS
npx expo build:ios

# Android
npx expo build:android

# Or use EAS Build (recommended)
npm install -g eas-cli
eas build --platform all
```

## 🏗️ Project Structure

```
nft-social-app/
├── app/
│   ├── (auth)/                 # Authentication screens
│   │   ├── _layout.tsx
│   │   └── login.tsx
│   ├── (tabs)/                 # Main app tabs
│   │   ├── _layout.tsx
│   │   ├── home.tsx           # Feed screen
│   │   ├── weekly.tsx         # Top 10 trending
│   │   ├── camera.tsx         # Photo capture
│   │   └── profile.tsx        # User profile
│   └── _layout.tsx            # Root layout
├── components/
│   └── common/
│       └── RootNavigator.tsx  # Navigation logic
├── contexts/
│   └── AuthContext.tsx        # Authentication state
├── utils/
│   └── AppKitConfig.ts        # Reown configuration
├── assets/                    # Images, fonts, etc.
├── .env
├── app.json
├── package.json
└── tsconfig.json
```

## 🔧 Tech Stack

- **Framework:** Expo 54 (React Native)
- **Language:** TypeScript
- **Navigation:** Expo Router
- **Wallet:** Reown AppKit (WalletConnect v2)
- **Blockchain:** Solana (via @solana/web3.js)
- **Camera:** expo-camera
- **Image Picker:** expo-image-picker
- **Icons:** lucide-react-native
- **Storage:** AsyncStorage

## 🔐 Authentication Flow

1. User taps "Connect Wallet"
2. Reown modal opens with wallet options
3. User selects wallet (Phantom, Solflare, etc.)
4. Wallet prompts for signature
5. Backend verifies signature
6. User authenticated and redirected to feed

## 📸 Photo Upload Flow

1. User captures/selects photo
2. App requests presigned upload URL from backend
3. Photo uploaded directly to Cloudflare R2
4. Post metadata saved to database
5. Post appears in feed with real-time trending score

## 🎨 Customization

### Theme Colors

Edit the colors in your components:

```typescript
const colors = {
  primary: '#14F195',    // Solana green
  background: '#000',    // Black
  text: '#fff',          // White
  secondary: '#333',     // Dark gray
};
```

### API Endpoints

All API calls are in individual screen files. Update `API_URL` in `.env`:

```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL;
```

## 🐛 Troubleshooting

### Camera Permission Issues

```json
// app.json
{
  "plugins": [
    [
      "expo-camera",
      {
        "cameraPermission": "Allow $(PRODUCT_NAME) to access your camera"
      }
    ]
  ]
}
```

### Wallet Connection Fails

- Ensure Reown Project ID is correct
- Check wallet app is installed on device
- Try disconnecting and reconnecting

### Images Not Loading

- Verify R2 bucket has public access enabled
- Check CORS configuration on R2
- Ensure presigned URLs are not expired

## 📚 Key Dependencies

```json
{
  "@reown/appkit-react-native": "^1.1.2",
  "@reown/appkit-adapter-solana": "^1.1.2",
  "@solana/web3.js": "^1.91.0",
  "expo-camera": "~16.0.0",
  "expo-image-picker": "~16.0.0",
  "expo-router": "~4.0.0",
  "react-native": "0.76.5",
  "lucide-react-native": "^0.453.0"
}
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Backend API:** [GitHub](https://github.com/yourusername/nft-social-backend)
- **Landing Page:** [nftsocial.app](https://nftsocial.app)
- **Demo Video:** [YouTube](https://youtube.com/...)
- **Solana Devnet:** [Explorer](https://explorer.solana.com/?cluster=devnet)

## 💬 Support

- Twitter: [@nftsocial](https://twitter.com/nftsocial)
- Discord: [Join our server](https://discord.gg/...)
- Email: support@nftsocial.app

## 🙏 Acknowledgments

- [Solana Foundation](https://solana.org) for blockchain infrastructure
- [Reown](https://reown.com) for wallet integration
- [Metaplex](https://metaplex.com) for NFT standards
- [Expo](https://expo.dev) for mobile framework

---

Built with ❤️ for the Solana community