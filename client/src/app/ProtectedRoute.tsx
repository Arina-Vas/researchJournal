// import { Layout } from './Layout';
// import { Navigate } from 'react-router';
// import { useAuth } from '@/app/providers/auth-provider/use-auth.ts';
// import { Spinner } from '@/shared/ui/spinner/Spinner.tsx';
//
// export const ProtectedRoute = () => {
//   const { user, loading } = useAuth();
//
//   if (loading) {
//     return <Spinner />;
//   }
//
//   if (!user) {
//     return <Navigate to="/login" replace />;
//   }
//
//   return <Layout />;
// };
