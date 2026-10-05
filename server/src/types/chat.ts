import type { WebSocket } from 'ws';

export interface AuthedSocket extends WebSocket {
  userId: string;
  rooms: Set<string>;
  isAlive: boolean;
}
