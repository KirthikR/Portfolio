import { useState, useEffect, useRef } from 'react';

/**
 * A hook that returns a throttled version of a value that only updates
 * at most once per specified interval.
 * 
 * @param value The value to be throttled
 * @param interval The interval in milliseconds
 * @returns The throttled value
 */
function useThrottledValue<T>(value: T, interval: number = 200): T {
  const [throttledValue, setThrottledValue] = useState(value);
  const lastUpdated = useRef<number>(Date.now());
  
  useEffect(() => {
    const now = Date.now();
    const timeElapsed = now - lastUpdated.current;
    
    if (timeElapsed >= interval) {
      lastUpdated.current = now;
      setThrottledValue(value);
    } else {
      const timerId = setTimeout(() => {
        lastUpdated.current = Date.now();
        setThrottledValue(value);
      }, interval - timeElapsed);
      
      return () => {
        clearTimeout(timerId);
      };
    }
  }, [value, interval]);
  
  return throttledValue;
}

export default useThrottledValue;
