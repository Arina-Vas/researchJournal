import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { act, renderHook } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it('updates the value only after the delay', () => {
    const { result } = renderHook(() => useDebounce('aaa', 500));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(499));
    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(1));
    expect(result.current).toBe('aaa');
  });

  it('trims the debounced value', () => {
    const { result } = renderHook(() => useDebounce(' aaa ', 500));

    act(() => vi.advanceTimersByTime(500));

    expect(result.current).toBe('aaa');
  });

  it('ignores null', () => {
    const { result } = renderHook(() => useDebounce(null, 100));

    act(() => vi.advanceTimersByTime(100));
    expect(result.current).toBe('');
  });

  it('restarts the timer on every change and keeps only the last value', () => {
    const { result, rerender } = renderHook(({ value }) => useDebounce(value, 500), {
      initialProps: { value: 'h' },
    });

    act(() => vi.advanceTimersByTime(100));
    rerender({ value: 'he' });

    act(() => vi.advanceTimersByTime(200));
    rerender({ value: 'hell' });

    act(() => vi.advanceTimersByTime(300));
    rerender({ value: 'hello' });

    expect(result.current).toBe('');

    act(() => vi.advanceTimersByTime(500));
    expect(result.current).toBe('hello');
  });

  afterEach(() => {
    vi.useRealTimers();
  });
});
