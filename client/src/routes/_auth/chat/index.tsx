import { createFileRoute } from '@tanstack/react-router';
import { Chats } from '../../../features/chat/Chat';

export const Route = createFileRoute('/_auth/chat/')({
  component: RouteComponent,
});

function RouteComponent() {
  return <Chats />;
}
