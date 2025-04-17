import { useCallback, useState, useRef } from 'react';

/**
 * A state hook that uses requestAnimationFrame to batch updates
 * for smoother animations and state transitions
 */
export function useRafState<T>(initialState: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [state, setState] = useState<T>(initialState);
  const rafRef = useRef<number | null>(null);
  const newStateRef = useRef<T>(initialState);
  
  const setRafState = useCallback((value: T | ((prev: T) => T)) => {
    const newState = value instanceof Function ? value(newStateRef.current) : value;
    newStateRef.current = newState;
    
    if (rafRef.current === null) {
      rafRef.current = requestAnimationFrame(() => {
        setState(newStateRef.current);
        rafRef.current = null;
      });
    }
  }, []);
  
  return [state, setRafState];
}
