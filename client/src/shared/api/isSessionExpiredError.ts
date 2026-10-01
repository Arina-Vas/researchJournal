import { isAxiosError } from 'axios';

export const isSessionExpiredError = (error: unknown): boolean => {
  const status = isAxiosError(error) ? error.response?.status : undefined;
  return status === 401 || status === 403;
};
