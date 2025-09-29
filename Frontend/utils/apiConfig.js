import { Platform } from 'react-native';

const getLocalhost = () => {
  if (Platform.OS === 'android') {
    return '10.0.2.2';
  }
  return 'localhost';
};

const baseHost = getLocalhost();

const expoApiUrl =
  typeof process !== 'undefined' && process?.env?.EXPO_PUBLIC_API_URL
    ? process.env.EXPO_PUBLIC_API_URL.replace(/\/$/, '')
    : undefined;

export const API_BASE_URL = expoApiUrl ?? `http://${baseHost}:3000/api`;

export const TURNOS_ENDPOINT = `${API_BASE_URL}/turnos`;
