import HomeIcon from '@/shared/assets/images/Home.svg';
import GridIcon from '@/shared/assets/images/Grid.svg';
import ChatIcon from '@/shared/assets/images/Chat.svg';
import s from './Header.module.css';
import Light from '@/shared/assets/images/Light.svg';
import Dark from '@/shared/assets/images/Dark.svg';
import { NavButton } from '../../shared/ui/nav-button/NavButton';
import { Button } from '../../shared/ui/button/Button';
import { useTheme } from '../../app/providers/theme-provider/useTheme';
import { useAuth } from '../../app/providers/auth-provider/use-auth';
import { useSignOutMutation } from '../../features/login/lib/useLogin';
import { useLocation } from '@tanstack/react-router';

export const Header = () => {
  const { mutate: signOut } = useSignOutMutation();
  const { theme, toggleTheme } = useTheme();

  const pathname = useLocation({
    select: location => location.pathname,
  });
  const onLogout = () => {
    signOut();
  };

  const { isAuthenticated } = useAuth();

  return (
    <div className={s.headerWrapper}>
      <div className={s.navigation}>
        <NavButton title={'Home'}>
          <HomeIcon />
        </NavButton>
        {isAuthenticated && (
          <>
            <NavButton title={'Tables'} link={'/medications'}>
              <GridIcon />
            </NavButton>
            <NavButton title={'Chat'} link={'/chat'}>
              <ChatIcon />
            </NavButton>
          </>
        )}
      </div>
      <div className={s.settings}>
        <Button onClick={toggleTheme} variant={'outline'}>
          {theme === 'LIGHT' ? <Dark /> : <Light />}
        </Button>
        {pathname !== '/login' && (
          <Button variant={'outline'} onClick={onLogout}>
            {isAuthenticated ? 'SignOut' : 'SignIn'}
          </Button>
        )}
      </div>
    </div>
  );
};
