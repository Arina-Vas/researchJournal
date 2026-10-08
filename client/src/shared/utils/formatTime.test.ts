import { describe, expect, it } from 'vitest';
import { formatTime } from './formatTime';

// Message time is shown in the viewer's timezone; tests run in America/Los_Angeles (see vite.config.ts)
describe('formatTime', () => {
  it('shows hours and minutes in the local timezone', () => {
    expect(formatTime('2026-01-15T15:05:00Z')).toBe('07:05 AM');
  });

  it('uses PM for the afternoon', () => {
    expect(formatTime('2026-01-15T23:30:00Z')).toBe('03:30 PM');
  });
});
