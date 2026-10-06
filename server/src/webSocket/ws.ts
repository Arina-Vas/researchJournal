import type { IncomingMessage, Server } from 'http';
import type { Duplex } from 'stream';
import { WebSocketServer, WebSocket } from 'ws';
import { verifyAccessToken } from '../utils/tokens.js';
import { createMessage, getRoomHistory, isRoomMember } from '../utils/chat.js';
import type { AuthedSocket } from '../types/chat.js';
import {
  isToken,
  type JwtPayload,
  parseClientEvent,
  type ServerEvent,
  WS_CLOSE_TOKEN_EXPIRED,
  WS_CLOSE_USER_DELETED,
} from '@research/shared';

const WS_PATH = '/ws';
const HEARTBEAT_INTERVAL = 30_000;

const send = (ws: WebSocket, event: ServerEvent) => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(event));
  }
};

const sendError = (ws: WebSocket, message: string) =>
  send(ws, { type: 'ERROR', payload: { message } });

const rejectUpgrade = (socket: Duplex, status: number, reason: string) => {
  socket.write(`HTTP/1.1 ${status} ${reason}\r\nConnection: close\r\n\r\n`);
  socket.destroy();
};

export const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ noServer: true, maxPayload: 16 * 1024 });
  const rooms = new Map<string, Set<AuthedSocket>>();

  const joinRoom = (ws: AuthedSocket, room: string) => {
    let members = rooms.get(room);
    if (!members) {
      members = new Set();
      rooms.set(room, members);
    }
    members.add(ws);
    ws.rooms.add(room);
  };

  const leaveRoom = (ws: AuthedSocket, room: string) => {
    const members = rooms.get(room);
    members?.delete(ws);
    if (members?.size === 0) rooms.delete(room);
    ws.rooms.delete(room);
  };

  const broadcast = (room: string, event: ServerEvent) => {
    rooms.get(room)?.forEach(client => send(client, event));
  };

  server.on('upgrade', (req: IncomingMessage, socket: Duplex, head: Buffer) => {
    const url = new URL(req.url ?? '', `http://${req.headers.host}`);

    if (url.pathname !== WS_PATH) {
      rejectUpgrade(socket, 404, 'Not Found');
      return;
    }

    let payload: JwtPayload;
    try {
      const token = url.searchParams.get('token');
      if (!isToken(token)) {
        rejectUpgrade(socket, 401, 'Unauthorized');
        return;
      }
      payload = verifyAccessToken(token);
    } catch {
      rejectUpgrade(socket, 401, 'Unauthorized');
      return;
    }

    wss.handleUpgrade(req, socket, head, ws => {
      //TODO
      const authed = ws as AuthedSocket;
      authed.userId = payload.userId;
      authed.rooms = new Set();
      authed.isAlive = true;
      const ttl = payload.exp * 1000 - Date.now();
      const expiryTimer = setTimeout(
        () => authed.close(WS_CLOSE_TOKEN_EXPIRED, 'Token expired'),
        ttl,
      );
      authed.once('close', () => clearTimeout(expiryTimer));
      wss.emit('connection', authed, req);
    });
  });

  wss.on('connection', (ws: AuthedSocket) => {
    ws.on('pong', () => {
      ws.isAlive = true;
    });

    ws.on('message', async raw => {
      const event = parseClientEvent(raw.toString());
      if (!event) {
        sendError(ws, 'Invalid message');
        return;
      }

      const { room } = event.payload;
      if (!isRoomMember(room, ws.userId)) {
        sendError(ws, 'Access to this room is denied');
        return;
      }

      try {
        switch (event.type) {
          case 'JOIN_ROOM': {
            joinRoom(ws, room);
            const messages = await getRoomHistory(room);
            send(ws, { type: 'ROOM_HISTORY', payload: { room, messages } });
            break;
          }
          case 'LEAVE_ROOM':
            leaveRoom(ws, room);
            break;
          case 'SEND_MESSAGE': {
            const message = await createMessage(room, ws.userId, event.payload.text);
            if (!message) {
              ws.close(WS_CLOSE_USER_DELETED, 'User not found');
              break;
            }
            broadcast(room, { type: 'NEW_MESSAGE', payload: message });
            break;
          }
          default: {
            const exhaustive: never = event;
            return exhaustive;
          }
        }
      } catch (error) {
        console.error(error);
        sendError(ws, 'Server error');
      }
    });

    ws.on('close', () => {
      [...ws.rooms].forEach(room => leaveRoom(ws, room));
    });

    ws.on('error', console.error);
  });

  const heartbeat = setInterval(() => {
    wss.clients.forEach(client => {
      //TODO
      const ws = client as AuthedSocket;
      if (!ws.isAlive) {
        ws.terminate();
        return;
      }
      ws.isAlive = false;
      ws.ping();
    });
  }, HEARTBEAT_INTERVAL);

  wss.on('close', () => clearInterval(heartbeat));

  return wss;
};
