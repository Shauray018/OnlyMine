// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// config.resolver.extraNodeModules = {
//   crypto: require.resolve('expo-crypto'),
//   stream: require.resolve('readable-stream'),
//   buffer: require.resolve('buffer'),
// };

// const { getDefaultConfig } = require('expo/metro-config');

// const config = getDefaultConfig(__dirname);

// // Safely extend resolver with Node polyfills
// config.resolver = {
//   ...config.resolver,
//   extraNodeModules: {
    // assert: require.resolve('assert/'),
//     crypto: require.resolve('crypto-browserify'),
//     stream: require.resolve('readable-stream'),
//     zlib: require.resolve('browserify-zlib'),
//     path: require.resolve('path-browserify'),
//     url: require.resolve('react-native-url-polyfill'),
//   },
// };

// // Keep transformer settings compatible
// config.transformer = {
//   ...config.transformer,
//   getTransformOptions: async () => ({
//     transform: {
//       experimentalImportSupport: false,
//       inlineRequires: true,
//     },
//   }),
// };

// module.exports = config;
/**
 * Metro configuration for React Native
 * https://github.com/facebook/react-native
 *
 * 
 */

// module.exports = {
//   resolver: {
//     extraNodeModules: {
//       assert: require.resolve('assert/'),
//       crypto: require.resolve('crypto-browserify'),
//       stream: require.resolve('readable-stream'),
//       url: require.resolve('react-native-url-polyfill'),
//       zlib: require.resolve('browserify-zlib'),
//       path: require.resolve('path-browserify'),
//     },
//   },
//   transformer: {
//     getTransformOptions: async () => ({
//       transform: {
//         experimentalImportSupport: false,
//         inlineRequires: true,
//       },
//     }),
//   },
// };

/**
 * @format
 */
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// ✅ Keep Expo's default asset resolvers
config.resolver.assetExts.push('png', 'jpg', 'jpeg', 'gif', 'svg', 'webp');

// ✅ Merge your Node polyfills safely
config.resolver.extraNodeModules = {
  assert: require.resolve('assert/'),
  crypto: require.resolve('crypto-browserify'),
  stream: require.resolve('readable-stream'),
  url: require.resolve('react-native-url-polyfill'),
  zlib: require.resolve('browserify-zlib'),
  path: require.resolve('path-browserify'),
};

config.transformer.getTransformOptions = async () => ({
  transform: {
    experimentalImportSupport: false,
    inlineRequires: true,
  },
});

module.exports = config;
