import { FirebaseError } from 'firebase/app';

export const getReadableErrorMessage = (error: unknown): string => {
  if (error instanceof FirebaseError) {
    switch (error.code) {
      case 'auth/user-not-found':
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
      case 'auth/invalid-email':
      case 'auth/invalid-password':
        return 'Invalid email or password';
      case 'auth/email-already-in-use':
        return 'The user with this email already exists.';
      case 'permission-denied':
        return "You don't have enough permissions to perform this action.";
      case 'not-found':
        return 'The requested data was not found.';
      case 'unavailable':
        return 'The server is temporarily unavailable. Check your internet connection.';
      default:
        return 'Server error';
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Unexpected error';
};
