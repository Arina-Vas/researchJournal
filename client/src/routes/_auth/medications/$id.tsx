import { createFileRoute } from '@tanstack/react-router';
import { MapProvider } from '../../../app/providers/map-provider/MapProvider';
import { Medication } from '../../../widgets/medication-details/Medication';

export const Route = createFileRoute('/_auth/medications/$id')({
  component: RouteComponent,
});

function RouteComponent() {
  const { id } = Route.useParams();

  return (
    <MapProvider>
      <Medication id={id} />
    </MapProvider>
  );
}
