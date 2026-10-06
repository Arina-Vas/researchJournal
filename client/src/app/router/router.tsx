import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';
import { Spinner } from '../../shared/ui/spinner/Spinner';

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: { auth: undefined! },
  defaultPreload: 'intent',
  scrollRestoration: true,

  defaultPendingComponent: Spinner,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}
