import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../features/login/ui/LoginForm';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      throw redirect({ to: '/' });
    }
  },
});

function RouteComponent() {
  return <LoginForm />;
}
