import { createFileRoute } from '@tanstack/react-router';
import { Medications } from '../../widgets/medications-table/ui/Medications';

export const Route = createFileRoute('/medications/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Medications />;
}
