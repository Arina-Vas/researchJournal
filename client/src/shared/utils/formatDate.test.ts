import { describe, expect, it } from 'vitest';
import { formatDate } from './formatDate';

describe('formatDate', () => {
  it('formats a UTC midnight date without shifting the day', () => {
    expect(formatDate('2020-12-20T00:00:00Z')).toBe('Dec 20, 2020');
  });

  it('pads the day with a leading zero', () => {
    expect(formatDate('2018-08-01T00:00:00Z')).toBe('Aug 01, 2018');
  });

  it('keeps the first day of the year in the same year', () => {
    expect(formatDate('2021-01-01T00:00:00Z')).toBe('Jan 01, 2021');
  });
});
