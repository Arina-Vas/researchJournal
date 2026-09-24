// import { type ReactNode, useEffect, useState } from 'react';
// import type { User } from 'firebase/auth';
// import { onAuthStateChanged } from 'firebase/auth';
// import { auth } from '@/shared/api/firebase.ts';
// import { AuthContext } from '@/app/providers/auth-provider/use-auth.ts';
//
// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [user, setUser] = useState<User | null>(null);
//   const [loading, setLoading] = useState<boolean>(true);
//
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, currentUser => {
//       setUser(currentUser);
//       setLoading(false);
//     });
//
//     return () => unsubscribe();
//   }, []);
//
//   return <AuthContext.Provider value={{ user, loading }}>{children}</AuthContext.Provider>;
// };
