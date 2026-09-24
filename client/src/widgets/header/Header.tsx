import HomeIcon from '@/shared/assets/images/Home.svg';
import GridIcon from '@/shared/assets/images/Grid.svg';
import s from './Header.module.css';
import Light from '@/shared/assets/images/Light.svg';
import Dark from '@/shared/assets/images/Dark.svg';
import { NavButton } from '../../shared/ui/nav-button/NavButton';
import { Button } from '../../shared/ui/button/Button';
import { useTheme } from '../../app/providers/theme-provider/useTheme';

export const Header = () => {
  // const { mutate: signOut } = useSignOutMutation();
  const { theme, toggleTheme } = useTheme();

  const onLogout = () => {
    console.log('signOut');
  };

  // const { user } = useAuth();

  return (
    <div className={s.headerWrapper}>
      <div className={s.navigation}>
        <NavButton title={'Home'}>
          <HomeIcon />
        </NavButton>
        <NavButton title={'Tables'} link={'/medications'}>
          <GridIcon />
        </NavButton>
      </div>
      <div className={s.settings}>
        <Button onClick={toggleTheme} variant={'outline'}>
          {theme === 'LIGHT' ? <Dark /> : <Light />}
        </Button>

        <Button variant={'outline'} onClick={onLogout}>
          {'SignIn'}
          {/*{user ? 'LogOut' : 'SignIn'}*/}
        </Button>
      </div>
    </div>
  );
};
