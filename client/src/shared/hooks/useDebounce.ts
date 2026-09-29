import { useEffect, useState } from 'react';

export const useDebounce = (value: string | null, delay: number = 500) => {
  const [debounceValue, setDebounceValue] = useState('');

  useEffect(() => {
    if (value === null) return;
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue.trim();
};
