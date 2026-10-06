import { useEffect, useRef, useState } from 'react';
import { isTokenExpired, tokenStorage } from '../../../shared/api/tokenStorage';
import type { SocketStatus } from '../../../entities/message/lib/type';
import { createWebSocket } from './utils/createWebSocket';
import { toast } from 'react-toastify';
import { refreshAccessToken } from '../../../shared/api/instance';
import { isSessionExpiredError } from '../../../shared/api/isSessionExpiredError';
import {
  type ChatMessageDTO,
  type ClientEvent,
  parseServerEvent,
  WS_CLOSE_TOKEN_EXPIRED,
  WS_CLOSE_USER_DELETED,
} from '@research/shared';

const WS_URL = import.meta.env.VITE_WS_URL as string;
const RECONNECT_BASE_DELAY = 1000;
const RECONNECT_MAX_DELAY = 10_000;

interface UseChatSocketReturnType {
  messages: ChatMessageDTO[];
  sendMessage: (message: string) => void;
  status: SocketStatus;
  isHistoryLoaded: boolean;
}

export const useChatSocket = (room: string): UseChatSocketReturnType => {
  const [history, setHistory] = useState<{ room: string; messages: ChatMessageDTO[] }>({
    room: '',
    messages: [],
  });
  const [connection, setConnection] = useState<{ room: string; status: SocketStatus }>({
    room,
    status: 'connecting',
  });
  const socketRef = useRef<WebSocket>(null);

  const sendMessage = (message: string) => {
    if (socketRef.current?.readyState === WebSocket.OPEN) {
      socketRef.current?.send(
        JSON.stringify({
          type: 'SEND_MESSAGE',
          payload: { room, text: message },
        } satisfies ClientEvent),
      );
    }
  };

  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;
    let attempt = 0;

    const reconnect = async (wasOpened: boolean) => {
      const token = tokenStorage.get();
      if (!wasOpened && (attempt === 0 || !token || isTokenExpired(token))) {
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

      const delay = Math.min(RECONNECT_BASE_DELAY * 2 ** attempt, RECONNECT_MAX_DELAY);
      attempt += 1;

      const timer = setTimeout(() => {
        setConnection({ room, status: 'connecting' });
        connect();
      }, delay);
      signal.addEventListener('abort', () => clearTimeout(timer), { once: true });
    };

    const connect = () => {
      if (signal.aborted) return;
      const ws = createWebSocket(
        `${WS_URL}?token=${encodeURIComponent(tokenStorage.get() ?? '')}`,
        controller.signal,
      );
      socketRef.current = ws;

      let wasOpened = false;

      ws.onopen = () => {
        wasOpened = true;
        attempt = 0;
        setConnection({ room, status: 'open' });

        ws.send(JSON.stringify({ type: 'JOIN_ROOM', payload: { room } } satisfies ClientEvent));
      };

      ws.onmessage = e => {
        const res = parseServerEvent(e.data);
        if (!res) {
          console.error('Unknown WS event', e.data);
          return;
        }

        switch (res.type) {
          case 'ROOM_HISTORY': {
            if (res.payload.room !== room) return;
            setHistory({ room, messages: res.payload.messages });
            break;
          }
          case 'NEW_MESSAGE': {
            if (res.payload.room !== room) return;
            setHistory(p =>
              p.room === room ? { ...p, messages: [...p.messages, res.payload] } : p,
            );
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

      ws.onclose = e => {
        if (signal.aborted) return;
        if (socketRef.current !== ws) return;

        socketRef.current = null;
        setConnection({ room, status: 'closed' });

        if (e.code === WS_CLOSE_USER_DELETED) {
          window.dispatchEvent(new Event('auth:unauthorized'));
          return;
        }

        reconnect(wasOpened && e.code !== WS_CLOSE_TOKEN_EXPIRED);
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
  const isHistoryLoaded = history.room === room;

  return { messages, status, sendMessage, isHistoryLoaded };
};
