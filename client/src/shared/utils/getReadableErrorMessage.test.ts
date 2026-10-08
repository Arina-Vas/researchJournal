import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { getReadableErrorMessage } from './getReadableErrorMessage';

const axiosError = (status?: number, data?: unknown, code?: string) =>
  new AxiosError(
    'Request failed',
    code,
    undefined,
    undefined,
    status === undefined
      ? undefined
      : { status, data, statusText: '', headers: {}, config: { headers: new AxiosHeaders() } },
  );

describe('getReadableErrorMessage', () => {
  it('prefers the message from the server', () => {
    expect(getReadableErrorMessage(axiosError(400, { message: 'User already exists' }))).toBe(
      'User already exists',
    );
  });

  it('falls back to a message by status', () => {
    expect(getReadableErrorMessage(axiosError(429))).toBe(
      'Too many requests. Please try again later.',
    );
    expect(getReadableErrorMessage(axiosError(503))).toBe('Server error. Please try again later.');
    expect(getReadableErrorMessage(axiosError(418))).toBe('Unexpected error');
  });

  it('detects timeouts and network errors', () => {
    expect(getReadableErrorMessage(axiosError(undefined, undefined, 'ECONNABORTED'))).toBe(
      'The server is taking too long to respond. Please try again.',
    );
    expect(getReadableErrorMessage(axiosError())).toBe(
      'The server is unavailable. Check your internet connection.',
    );
  });

  it('handles plain errors and unknown values', () => {
    expect(getReadableErrorMessage(new Error('Boom'))).toBe('Boom');
    expect(getReadableErrorMessage('oops')).toBe('Unexpected error');
  });
});
