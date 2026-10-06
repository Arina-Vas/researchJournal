import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../features/login/ui/LoginForm';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: (search: Record<string, unknown>): { redirect?: string } => ({
    redirect: typeof search.redirect === 'string' ? search.redirect : undefined,
  }),
  beforeLoad: ({ context, search }) => {
    if (context.auth.isAuthenticated) {
      const target =
        search.redirect?.startsWith('/') && !search.redirect.startsWith('//')
          ? search.redirect
          : '/';
      throw redirect({ href: target });
    }
  },
});

function RouteComponent() {
  return <LoginForm />;
}
