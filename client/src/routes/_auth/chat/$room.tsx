import { createFileRoute, Navigate, notFound } from '@tanstack/react-router';
import { ChatRoom } from '../../../features/chat/ChatRoom';
import { ChatRoomSchema, isRoomMember } from '@research/shared';
import { useAuth } from '../../../app/providers/auth-provider/use-auth';

export const Route = createFileRoute('/_auth/chat/$room')({
  params: {
    parse: ({ room }) => {
      if (!ChatRoomSchema.safeParse(room).success) throw notFound();
      return { room };
    },
  },
  component: RouteComponent,
});

function RouteComponent() {
  const { room } = Route.useParams();
  const { user } = useAuth();

  if (!user || !isRoomMember(room, user.id)) return <Navigate to="/chat" replace />;

  return <ChatRoom room={room} />;
}
