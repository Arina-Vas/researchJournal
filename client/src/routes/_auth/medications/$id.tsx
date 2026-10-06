import { createFileRoute, notFound } from '@tanstack/react-router';
import { MapProvider } from '../../../app/providers/map-provider/MapProvider';
import { Medication } from '../../../widgets/medication-details/Medication';
import { ObjectIdSchema } from '@research/shared';

export const Route = createFileRoute('/_auth/medications/$id')({
  params: {
    parse: ({ id }) => {
      if (!ObjectIdSchema.safeParse(id).success) throw notFound();
      return { id };
    },
  },
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
