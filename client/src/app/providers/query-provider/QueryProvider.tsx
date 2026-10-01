import type { ReactNode } from 'react';
import { QueryCache, QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getReadableErrorMessage } from '../../../shared/utils/getReadableErrorMessage';
import { isAxiosError } from 'axios';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: error => {
      toast.error(getReadableErrorMessage(error), { position: 'top-right' });
    },
  }),
  defaultOptions: {
    queries: {
      retry: (count, error) => count < 1 && (!isAxiosError(error) || (error.response?.status ?? 500) >= 500),
      refetchOnWindowFocus: false,
    },
  },
});

export const QueryProvider = ({ children }: { children: ReactNode }) => {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
};
