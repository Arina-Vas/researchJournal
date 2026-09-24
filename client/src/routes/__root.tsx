import { createRootRoute, Outlet } from '@tanstack/react-router';
import s from '../app/Layout.module.css';
import { Header } from '../widgets/header/Header';

export const Route = createRootRoute({
  component: () => (
    <div>
      <Header />
      <main className={s.container}>
        <Outlet />
      </main>
    </div>
  ),
});
