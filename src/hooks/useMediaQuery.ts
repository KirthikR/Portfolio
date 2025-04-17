import { useState, useEffect } from 'react';

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    // Skip media query on server side
    if (typeof window === 'undefined') return;
    
    const media = window.matchMedia(query);
    
    // Update the state with the current value
    setMatches(media.matches);
    
    // Create a handler to update the state whenever the media query changes
    const listener = (event: MediaQueryListEvent) => {
      setMatches(event.matches);
    };
    
    // Add the callback as a listener
    media.addEventListener('change', listener);
    
    // Remove the listener when the component is unmounted
    return () => {
      media.removeEventListener('change', listener);
    };
  }, [query]);

  return matches;
}

export default useMediaQuery;
