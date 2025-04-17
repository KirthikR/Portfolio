import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface ScrollOptimizationContextType {
  isScrolling: boolean;
  scrollPosition: number;
  lastScrollTime: number;
  scrollDirection: 'up' | 'down' | null;
}

// Default context values
const defaultContextValue: ScrollOptimizationContextType = {
  isScrolling: false,
  scrollPosition: 0,
  lastScrollTime: 0,
  scrollDirection: null,
};

// Create the context
const ScrollOptimizationContext = createContext<ScrollOptimizationContextType>(defaultContextValue);

// Custom hook to use the context
export const useScrollOptimization = () => {
  return useContext(ScrollOptimizationContext);
};

interface ScrollOptimizationProviderProps {
  children: ReactNode;
  scrollThrottle?: number; // Time in ms to consider scrolling stopped
}

export const ScrollOptimizationProvider: React.FC<ScrollOptimizationProviderProps> = ({ 
  children, 
  scrollThrottle = 200 
}) => {
  const [isScrolling, setIsScrolling] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [lastScrollTime, setLastScrollTime] = useState(0);
  const [scrollDirection, setScrollDirection] = useState<'up' | 'down' | null>(null);
  
  useEffect(() => {
    let scrollTimer: number | null = null;
    let lastKnownScrollPosition = 0;
    
    const handleScroll = () => {
      const currentScrollPosition = window.scrollY;
      
      // Update scroll direction
      if (currentScrollPosition > lastKnownScrollPosition) {
        setScrollDirection('down');
      } else if (currentScrollPosition < lastKnownScrollPosition) {
        setScrollDirection('up');
      }
      
      lastKnownScrollPosition = currentScrollPosition;
      setScrollPosition(currentScrollPosition);
      setIsScrolling(true);
      setLastScrollTime(Date.now());
      
      // Clear previous timer
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
      
      // Set new timer to detect when scrolling stops
      scrollTimer = window.setTimeout(() => {
        setIsScrolling(false);
      }, scrollThrottle);
    };
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    // Clean up
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer !== null) {
        window.clearTimeout(scrollTimer);
      }
    };
  }, [scrollThrottle]);
  
  return (
    <ScrollOptimizationContext.Provider 
      value={{ isScrolling, scrollPosition, lastScrollTime, scrollDirection }}
    >
      {children}
    </ScrollOptimizationContext.Provider>
  );
};

export default ScrollOptimizationContext;
