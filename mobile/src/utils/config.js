import Constants from 'expo-constants';

const getBaseUrl = () => {
  // Automatically extract host IP from Expo debuggerHost or hostUri
  const hostUri = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost || Constants.manifest2?.extra?.expoGo?.developer?.tool;
  if (hostUri) {
    const ip = hostUri.split(':')[0];
    if (ip) {
      return `http://${ip}:5000/api`;
    }
  }
  // Fallback to local computer IPv4 address
  return 'http://192.168.100.98:5000/api';
};

export const API_BASE_URL = getBaseUrl();
console.log('Mobile App API_BASE_URL set to:', API_BASE_URL);
