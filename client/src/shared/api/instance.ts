import axios, { type InternalAxiosRequestConfig } from 'axios';
import { tokenStorage } from './tokenStorage';
import { isSessionExpiredError } from './isSessionExpiredError';

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

let refreshPromise: Promise<string> | null = null;

export const refreshAccessToken = (): Promise<string> => {
  if (refreshPromise === null) {
    refreshPromise = instance
      .post<{ accessToken: string }>('auth/refresh')
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
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    const isAuthUrl =
      originalRequest?.url?.includes('auth/login') ||
      originalRequest?.url?.includes('auth/register') ||
      originalRequest?.url?.includes('auth/refresh');

    if (error.response?.status === 401 && !originalRequest?._retry && !isAuthUrl) {
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
