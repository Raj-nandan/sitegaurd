import { QueryClient } from '@tanstack/react-query';
import { api } from './api';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 30_000,
    },
  },
});

export const getApiUrl = () =>
  process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3001';

export const apiRequest = async <T = unknown>(
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE',
  path: string,
  data?: unknown
): Promise<T> => {
  const res = await api.request<T>({ method, url: path, data });
  return res.data;
};
