// TransportScreen.js
import { Platform } from 'react-native';

// Conditionally import the platform-specific file
export default Platform.select({
  ios: () => require('./TransportScreen.native').default,
  android: () => require('./TransportScreen.native').default,
  web: () => require('./TransportScreen.web').default,
})();