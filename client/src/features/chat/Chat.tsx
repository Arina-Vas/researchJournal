import { Link } from '@tanstack/react-router';
import s from './Chat.module.css';
import { useAuth } from '../../app/providers/auth-provider/use-auth';
import { useFetchUsers } from '../../entities/user/lib/hooks';
import { getRoomId } from '../../shared/utils/getRoomId';
import { Spinner } from '../../shared/ui/spinner/Spinner';

export const Chats = () => {
  const { user } = useAuth();
  const { data: users = [], isLoading } = useFetchUsers();

  return (
    <div className={s.wrapper}>
      <h1 className={s.title}>Dialogs</h1>
      {isLoading && <Spinner />}
      {!isLoading && users.length === 0 && <p className={s.empty}>No users to chat with yet</p>}
      {/* TODO пустой список */}
      <ul className={s.list}>
        {user &&
          users.map(u => (
            <li key={u.id}>
              <Link to="/chat/$room" params={{ room: getRoomId(user.id, u.id) }} className={s.item}>
                <span className={s.avatar}>{u.email[0]?.toUpperCase()}</span>
                <span>{u.email}</span>
              </Link>
            </li>
          ))}
      </ul>
    </div>
  );
};
