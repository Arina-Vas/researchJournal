import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/not-found')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <h1>Page Not Found</h1>
    </div>
  );
}
