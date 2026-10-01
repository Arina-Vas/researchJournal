import { createFileRoute } from '@tanstack/react-router';
import { ChatRoom } from '../../../features/chat/ChatRoom';

export const Route = createFileRoute('/_auth/chat/$room')({
  component: RouteComponent,
});

function RouteComponent() {
  const { room } = Route.useParams();

  return <ChatRoom room={room} />;
}
