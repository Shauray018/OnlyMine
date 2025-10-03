// entrypoint.js
import '@ethersproject/shims';
import 'expo-crypto'; // This automatically polyfills WebCrypto
import 'expo-router/entry';
import 'fast-text-encoding';
import 'react-native-get-random-values'; // Must be first
