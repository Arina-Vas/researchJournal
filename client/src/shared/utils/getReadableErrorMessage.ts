import { isAxiosError } from 'axios';

// Shape of error bodies sent by the server: res.status(...).json({ message })
interface ServerErrorBody {
  message?: string;
  error?: string;
}

const STATUS_MESSAGES: Record<number, string> = {
  400: 'Invalid request data.',
  401: 'Your session has expired. Please sign in again.',
  403: "You don't have enough permissions to perform this action.",
  404: 'The requested data was not found.',
  429: 'Too many requests. Please try again later.',
};

const SERVER_ERROR_MESSAGE = 'Server error. Please try again later.';
const NETWORK_ERROR_MESSAGE = 'The server is unavailable. Check your internet connection.';
const TIMEOUT_MESSAGE = 'The server is taking too long to respond. Please try again.';
const UNEXPECTED_ERROR_MESSAGE = 'Unexpected error';

export const getReadableErrorMessage = (error: unknown): string => {
  if (isAxiosError<ServerErrorBody>(error)) {
    // 1. Message from our backend has priority — it is the most specific
    const serverMessage = error.response?.data?.message || error.response?.data?.error;
    if (serverMessage) {
      return serverMessage;
    }

    // 2. No response at all — request never reached the server
    if (error.code === 'ECONNABORTED' || error.code === 'ETIMEDOUT') {
      return TIMEOUT_MESSAGE;
    }
    if (!error.response) {
      return NETWORK_ERROR_MESSAGE;
    }

    // 3. Response without a message — fall back to the HTTP status
    const { status } = error.response;
    return (
      STATUS_MESSAGES[status] ?? (status >= 500 ? SERVER_ERROR_MESSAGE : UNEXPECTED_ERROR_MESSAGE)
    );
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return UNEXPECTED_ERROR_MESSAGE;
};
