import { WebSocketServer, WebSocket } from 'ws';
import { Server } from 'http';
import {
  type CustomWebSocket,
  type IncomingWsMessage,
  Message,
  type MessageItem,
  type OutgoingWsMessage,
} from '../models/Message.js';

export const initWebSocketServer = (server: Server) => {
  const wss = new WebSocketServer({ server });

  wss.on('connection', (ws: CustomWebSocket) => {
    console.log('Новое WebSocket-соединение установлено');

    ws.on('message', async (data: string) => {
      try {
        const { type, payload } = JSON.parse(data) as IncomingWsMessage;

        switch (type) {
          case 'JOIN_ROOM': {
            const { room, senderId } = payload;

            ws.room = room;
            ws.senderId = senderId;

            const messages = await Message.find<MessageItem>({ room })
              .populate('sender', 'email')
              .sort({ createdAt: 1 })
              .limit(50);

            const res: OutgoingWsMessage = {
              type: 'ROOM_HISTORY',
              payload: messages,
            };

            ws.send(JSON.stringify(res));
            break;
          }
          case 'SEND_MESSAGE': {
            const { room, senderId, text } = payload;

            const newMessage = new Message<MessageItem>({ room, sender: senderId, text });
            await newMessage.save();

            const broadcastPayload = JSON.stringify({
              type: 'NEW_MESSAGE',
              payload: await newMessage.populate('sender', 'email'),
            });

            wss.clients.forEach((client: CustomWebSocket) => {
              if (client.readyState === WebSocket.OPEN && client.room === room) {
                client.send(broadcastPayload);
              }
            });

            console.log(`Сообщение "${text}" от ${senderId} отправлено в комнату ${room}`);
            break;
          }
          default:
            console.log('default');
            break;
        }

        // console.log(`message ${text} received from room ${room} with user ${userId} `);
      } catch (error) {
        console.log(error);
      }
    });

    ws.send('something');
    ws.on('error', console.error);
  });
};
