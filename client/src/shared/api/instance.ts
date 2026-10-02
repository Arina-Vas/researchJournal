import axios, { type InternalAxiosRequestConfig, isAxiosError } from 'axios';
import { tokenStorage } from './tokenStorage';
import { isSessionExpiredError } from './isSessionExpiredError';
import type { RefreshResponse, Token } from '@research/shared';

export const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
  timeout: 10000,
});

instance.interceptors.request.use(config => {
  const token = tokenStorage.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

let refreshPromise: Promise<Token> | null = null;

export const refreshAccessToken = (): Promise<Token> => {
  if (refreshPromise === null) {
    refreshPromise = instance
      .post<RefreshResponse>('auth/refresh')
      .then(({ data }) => {
        tokenStorage.set(data.accessToken);
        return data.accessToken;
      })
      .finally(() => {
        refreshPromise = null;
      });
  }

  return refreshPromise;
};

instance.interceptors.response.use(
  response => response,
  async error => {
    if (!isAxiosError(error)) return Promise.reject(error);

    const originalRequest: (InternalAxiosRequestConfig & { _retry?: boolean }) | undefined = error.config;
    if (!originalRequest) return Promise.reject(error);

    const isAuthUrl =
      originalRequest.url?.includes('auth/login') ||
      originalRequest.url?.includes('auth/register') ||
      originalRequest.url?.includes('auth/refresh');

    if (error.response?.status === 401 && !originalRequest._retry && !isAuthUrl) {
      originalRequest._retry = true;
      try {
        const token = await refreshAccessToken(); // все параллельные 401 ждут один запрос
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return instance(originalRequest);
      } catch (refreshError) {
        if (isSessionExpiredError(refreshError)) {
          tokenStorage.clear();
          window.dispatchEvent(new Event('auth:unauthorized'));
        }
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  },
);
