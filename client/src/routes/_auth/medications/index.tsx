import { createFileRoute } from '@tanstack/react-router';
import { Medications } from '../../../widgets/medications-table/ui/Medications';

export const Route = createFileRoute('/_auth/medications/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Medications />;
}
