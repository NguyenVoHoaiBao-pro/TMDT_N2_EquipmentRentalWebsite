// auth.hooks.ts
import { useState, useEffect } from 'react';

export const useDebounce = <T>(value: T, delay: number = 500): T => {
  // 1. Create a state to store debounced value
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  // 2. Update debounced value after delay
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // 3. Cancel the timeout if value changes (also on delay change or unmount)
    return () => {
      clearTimeout(timerId);
    };
  }, [value, delay]);

  return debouncedValue;
};
