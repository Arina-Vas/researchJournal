import { useEffect, useState } from 'react';

export const useDebounce = (value: string, delay: number = 500) => {
  const [debounceValue, setDebounceValue] = useState('');

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebounceValue(value);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounceValue;
};
