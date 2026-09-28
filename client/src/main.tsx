import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ToastContainer } from 'react-toastify';
import { RouterProvider } from '@tanstack/react-router';
import { router } from './app/router/router';
import { ThemeProvider } from './app/providers/theme-provider/ThemeProvider';
import { QueryProvider } from './app/providers/query-provider/QueryProvider';
import { AuthProvider } from './app/providers/auth-provider/AuthProvider';
import { useAuth } from './app/providers/auth-provider/use-auth';
import { Spinner } from './shared/ui/spinner/Spinner';

const App = () => {
  const auth = useAuth();

  if (auth.isLoading) {
    return <Spinner />;
  }

  return <RouterProvider router={router} context={{ auth }}></RouterProvider>;
};

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <QueryProvider>
          <App />
          <ToastContainer />
        </QueryProvider>
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
