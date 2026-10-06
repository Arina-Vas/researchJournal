import { createFileRoute } from '@tanstack/react-router';
import { Outlet, redirect } from '@tanstack/react-router';
import { useAuth } from '../app/providers/auth-provider/use-auth';

export const Route = createFileRoute('/_auth')({
  beforeLoad: ({ context, location }) => {
    if (!context.auth.isAuthenticated) {
      throw redirect({
        to: '/login',
        search: {
          redirect: location.href,
        },
      });
    }
  },
  component: AuthLayout,
});

function AuthLayout() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return null;
  return <Outlet />;
}
