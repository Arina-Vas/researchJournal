import { createRootRouteWithContext, Outlet } from '@tanstack/react-router';
import s from './Layout.module.css';
import { Header } from '../widgets/header/Header';
import { AuthContextType } from '../app/providers/auth-provider/use-auth';

interface MyRouterContext {
  auth: AuthContextType;
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  component: () => (
    <>
      <Header />
      <main className={s.container}>
        <Outlet />
      </main>
    </>
  ),
});
