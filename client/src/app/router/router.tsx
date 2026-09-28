// Import the generated route tree

import { createRouter } from '@tanstack/react-router';
import { routeTree } from '../../routeTree.gen';

// Create a new router instance
export const router = createRouter({
  routeTree,
  context: {
    auth: undefined!, // This will be set after we wrap the app in an AuthProvider
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
});

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
    context: {
      auth: undefined;
    };
  }
}
