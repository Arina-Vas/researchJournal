import { createFileRoute, redirect } from '@tanstack/react-router';
import { LoginForm } from '../features/login/ui/LoginForm';
import { z } from 'zod';

export const Route = createFileRoute('/login')({
  component: RouteComponent,
  validateSearch: z.object({ redirect: z.string().optional().catch(undefined) }).parse,
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
