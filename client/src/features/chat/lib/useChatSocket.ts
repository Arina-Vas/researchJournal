import { useEffect, useRef, useState } from 'react';
import { tokenStorage } from '../../../shared/api/tokenStorage';
import { ChatMessageDTO, ClientEvent, SocketStatus, ServerEvent } from '../../../entities/message/lib/type';
import { createWebSocket } from './utils/createWebSocket';
import { toast } from 'react-toastify';
import { refreshAccessToken } from '../../../shared/api/instance';
import { isSessionExpiredError } from '../../../shared/api/isSessionExpiredError';

const WS_URL = import.meta.env.VITE_WS_URL as string;
const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 10_000;

interface UseChatSocketReturnType {
  messages: ChatMessageDTO[];
  sendMessage: (message: string) => void;
  status: SocketStatus;
}

export const useChatSocket = (room: string): UseChatSocketReturnType => {
  const [history, setHistory] = useState<{ room: string; messages: ChatMessageDTO[] }>({ room, messages: [] });
  const [connection, setConnection] = useState<{ room: string; status: SocketStatus }>({
    room,
    status: 'connecting',
  });
  const socketRef = useRef<WebSocket>(null);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current?.send(
        JSON.stringify({ type: 'SEND_MESSAGE', payload: { room, text: message } } satisfies ClientEvent),
      );
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let attempt = 0;

    const reconnect = async (wasOpened: boolean) => {
      if (!wasOpened) {
        try {
          await refreshAccessToken();
        } catch (error) {
          if (isSessionExpiredError(error)) {
            window.dispatchEvent(new Event('auth:unauthorized'));
            return;
          }
        }
        if (signal.aborted) return;
      }

      const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** attempt, RECONNECT_MAX_DELAY); // 1s, 2s, 4s, 8s, 10s…
      attempt += 1;

      const timer = setTimeout(() => {
        setConnection({ room, status: 'connecting' });
        connect();
      }, delay);
      signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
    };

    const connect = () => {
      if (signal.aborted) return;
      const ws = createWebSocket(`${WS_URL}?token=${encodeURIComponent(tokenStorage.get() ?? '')}`, controller.signal);
      socketRef.current = ws;

      let wasOpened = false;

      ws.onopen = () => {
        wasOpened = true;
        attempt = 0;
        setConnection({ room, status: 'open' });

        ws.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { room } } satisfies ClientEvent));
      };

      ws.onmessage = e => {
        const res = JSON.parse(e.data) as ServerEvent;
        switch (res.type) {
          case 'ROOM_HISTORY': {
            setHistory({ room, messages: res.payload.messages });
            break;
          }
          case 'NEW_MESSAGE': {
            setHistory(p => (p.room === room ? { ...p, messages: [...p.messages, res.payload] } : p));
            break;
          }
          case 'ERROR': {
            toast.error(res.payload.message);
            break;
          }
          default: {
            const exhaustive: never = res;
            return exhaustive;
          }
        }
      };

      ws.onclose = () => {
        if (signal.aborted) return;
        if (socketRef.current === ws) {
          socketRef.current = null;
          setConnection({ room, status: 'closed' });
          reconnect(wasOpened);
        }
      };
    };

    connect();

    return () => {
      controller.abort();
      socketRef.current = null;
    };
  }, [room]);

  const messages = history.room === room ? history.messages : [];
  const status = connection.room === room ? connection.status : 'connecting';

  return { messages, status, sendMessage };
};
