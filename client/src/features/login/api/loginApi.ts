// import {
//   createUserWithEmailAndPassword,
//   signInWithEmailAndPassword,
//   signOut,
//   type User,
//   type UserCredential,
// } from 'firebase/auth';
// import { auth } from '@/shared/api/firebase';
//
// export const loginApi = {
//   signUp: async (email: string, password: string): Promise<UserCredential> => {
//     try {
//       return await createUserWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Ошибка при регистрации:', error);
//       throw error;
//     }
//   },
//   signIn: async (email: string, password: string): Promise<UserCredential> => {
//     try {
//       return await signInWithEmailAndPassword(auth, email, password);
//     } catch (error) {
//       console.error('Ошибка при регистрации:', error);
//       throw error;
//     }
//   },
//   logOut: async (): Promise<void> => {
//     try {
//       await signOut(auth);
//     } catch (error) {
//       console.error('Ошибка при при выходе:', error);
//       throw error;
//     }
//   },
//   me: async (): Promise<User | null> => {
//     return auth.currentUser;
//   },
// };
