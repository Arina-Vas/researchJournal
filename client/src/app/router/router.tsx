import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';
import { Spinner } from '../../shared/ui/spinner/Spinner';
import { NotFound } from '../../shared/ui/notFound/NotFound';

// Create a new router instance
export const router = createRouter({
  routeTree,
  basepath: import.meta.env.BASE_URL,
  context: { auth: undefined! },
  defaultPreload: 'intent',
  scrollRestoration: true,

  defaultPendingComponent: Spinner,
  defaultNotFoundComponent: NotFound,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
