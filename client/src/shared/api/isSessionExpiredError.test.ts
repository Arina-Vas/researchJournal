import { AxiosError, AxiosHeaders } from 'axios';
import { describe, expect, it } from 'vitest';
import { isSessionExpiredError } from './isSessionExpiredError';

const withStatus = (status: number) =>
  new AxiosError('Request failed', undefined, undefined, undefined, {
    status,
    data: {},
    statusText: '',
    headers: {},
    config: { headers: new AxiosHeaders() },
  });

describe('isSessionExpiredError', () => {
  it.each([401, 403])('is true for %i', status => {
    expect(isSessionExpiredError(withStatus(status))).toBe(true);
  });

  it.each([400, 404, 500])('is false for %i', status => {
    expect(isSessionExpiredError(withStatus(status))).toBe(false);
  });

  it('is false for network errors and non-axios errors', () => {
    expect(isSessionExpiredError(new AxiosError('Network Error'))).toBe(false);
    expect(isSessionExpiredError(new Error('401'))).toBe(false);
  });
});
