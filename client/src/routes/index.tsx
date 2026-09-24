import { createFileRoute } from '@tanstack/react-router';
import { Dashboard } from '../widgets/dashboard/ui/Dashboard';

export const Route = createFileRoute('/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Dashboard />;
}
