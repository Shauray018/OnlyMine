const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

const config = getDefaultConfig(__dirname);

config.resolver.extraNodeModules = {
  crypto: require.resolve('expo-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer/'),
  util: require.resolve('util/'),
  url: require.resolve('react-native-url-polyfill'),
  path: require.resolve('path-browserify'),
};

config.resolver.alias = {
  crypto: require.resolve('expo-crypto'),
  stream: require.resolve('readable-stream'),
  buffer: require.resolve('buffer/'),
};

module.exports = withNativeWind(config, { input: './global.css' });