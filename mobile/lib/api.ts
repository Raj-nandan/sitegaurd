import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: `${API_URL}/api`,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  try {
    const token = await SecureStore.getItemAsync('authToken');
    if (token) config.headers.Authorization = `Bearer ${token}`;
  } catch {}
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => Promise.reject(err)
);

export const setAuthToken = async (token: string) => {
  await SecureStore.setItemAsync('authToken', token);
};

export const clearAuthToken = async () => {
  await SecureStore.deleteItemAsync('authToken');
};

export const getAuthToken = async () => {
  return SecureStore.getItemAsync('authToken');
};
