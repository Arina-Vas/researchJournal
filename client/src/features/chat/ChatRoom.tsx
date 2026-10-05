import { type SubmitEvent, useEffect, useRef, useState } from 'react';
import { Link } from '@tanstack/react-router';
import s from './ChatRoom.module.css';
import { useAuth } from '../../app/providers/auth-provider/use-auth';
import { useGetUserById } from '../../entities/user/lib/hooks';
import { getPeerId } from '../../shared/utils/getRoomId';
import { Input } from '../../shared/ui/input/Input';
import { Button } from '../../shared/ui/button/Button';
import type { SocketStatus } from '../../entities/message/lib/type';
import { useChatSocket } from './lib/useChatSocket';
import { formatTime } from '../../shared/utils/formatTime';
import { Spinner } from '../../shared/ui/spinner/Spinner';
import { MAX_MESSAGE_LENGTH } from '@research/shared';

const STATUS_LABEL: Record<SocketStatus, string> = {
  connecting: 'Connecting…',
  open: 'Online',
  closed: 'Reconnecting…',
};

type Props = {
  room: string;
};

export const ChatRoom = ({ room }: Props) => {
  const { user } = useAuth();
  const peerId = user ? getPeerId(room, user.id) : '';
  const { data: friend } = useGetUserById(peerId || '');

  const { messages, status, sendMessage, isHistoryLoaded } = useChatSocket(room);
  const [text, setText] = useState('');

  const listRef = useRef<HTMLDivElement>(null);
  const isFirstScroll = useRef(true);

  useEffect(() => {
    isFirstScroll.current = true;
  }, [room]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    list.scrollTo({ top: list.scrollHeight, behavior: isFirstScroll.current ? 'auto' : 'smooth' });
    if (messages.length) isFirstScroll.current = false;
  }, [messages]);

  const onSubmit = (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!text.trim() || status !== 'open') return;
    sendMessage(text);
    setText('');
  };

  return (
    <div className={s.wrapper}>
      <div className={s.header}>
        <Link to="/chat" className={s.back}>
          ← Dialogs
        </Link>
        <span className={s.peer}>{friend ? friend.email : 'Dialog'}</span>
        <span className={`${s.status} ${s[status] ?? ''}`}>{STATUS_LABEL[status]}</span>
      </div>

      <div className={s.messages} ref={listRef}>
        {isHistoryLoaded && messages.length === 0 && <p className={s.empty}>No messages yet</p>}
        {!isHistoryLoaded && (
          <div className={s.empty}>
            <Spinner overlay={false} />
          </div>
        )}
        {messages.map(m => {
          const isOwn = m.sender.id === user?.id;
          return (
            <div key={m.id} className={`${s.message} ${isOwn ? s.own : ''}`}>
              <span className={s.text}>{m.text}</span>
              <span className={s.time}>{formatTime(m.createdAt)}</span>
            </div>
          );
        })}
      </div>

      <form className={s.form} onSubmit={onSubmit}>
        <div className={s.input}>
          <Input value={text} onChange={setText} placeholder="Type a message…" maxLength={MAX_MESSAGE_LENGTH} />
        </div>
        <Button type="submit" disabled={status !== 'open' || !text.trim()}>
          Send
        </Button>
      </form>
    </div>
  );
};
