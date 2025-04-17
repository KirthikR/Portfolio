import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import performanceService from '../services/performanceService';
import { performance as performanceConfig } from '../config/performanceSettings';

interface PerformanceContextType {
  isScrolling: boolean;
  isResizing: boolean;
  reduceMotion: boolean;
  lowPowerMode: boolean;
  pauseAnimations: boolean;
  enableParallax: boolean;
  enableBlur: boolean;
  fpsValue: number;
  optimizeInteraction: (callback: () => void) => void;
  optimizeRendering: (component: string) => boolean;
}

// Create context with default values
const PerformanceContext = createContext<PerformanceContextType>({
  isScrolling: false,
  isResizing: false,
  reduceMotion: false,
  lowPowerMode: false,
  pauseAnimations: false,
  enableParallax: true,
  enableBlur: true,
  fpsValue: 60,
  optimizeInteraction: () => {},
  optimizeRendering: () => true,
});

export const usePerformance = () => useContext(PerformanceContext);

// Enhanced scroll and resize detection
export const PerformanceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Core performance state
  const [isScrolling, setIsScrolling] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [lowPowerMode, setLowPowerMode] = useState(false);
  const [pauseAnimations, setPauseAnimations] = useState(false);
  const [fpsValue, setFpsValue] = useState(60);
  
  // Component render optimization cache
  const [renderOptimizationCache] = useState<Record<string, boolean>>({});
  
  // Initialize performance monitoring
  useEffect(() => {
    // Detect if reduced motion is preferred
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(reducedMotionQuery.matches || performanceConfig.device.animations.reduceMotion);
    
    const handleReducedMotionChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };
    
    reducedMotionQuery.addEventListener('change', handleReducedMotionChange);
    
    // Initialize performance service
    performanceService.init();
    
    // Battery status detection for low power mode
    if ('getBattery' in navigator) {
      (navigator as any).getBattery().then((battery: any) => {
        const updateBatteryStatus = () => {
          // Enable low power mode if battery is below 20%
          if (battery.level < 0.2 && !battery.charging) {
            setLowPowerMode(true);
          } else if (lowPowerMode && battery.level > 0.3) {
            setLowPowerMode(false);
          }
        };
        
        updateBatteryStatus();
        battery.addEventListener('levelchange', updateBatteryStatus);
        battery.addEventListener('chargingchange', updateBatteryStatus);
        
        return () => {
          battery.removeEventListener('levelchange', updateBatteryStatus);
          battery.removeEventListener('chargingchange', updateBatteryStatus);
        };
      }).catch(() => {}); // Ignore if battery API not available
    }
    
    // Optimized scroll handler
    let scrollTimeout: number;
    const handleOptimizedScroll = () => {
      setIsScrolling(true);
      setPauseAnimations(true);
      
      // Clear previous timeout
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      
      // Reset scrolling state after scrolling stops
      scrollTimeout = window.setTimeout(() => {
        setIsScrolling(false);
        setPauseAnimations(false);
      }, 100) as unknown as number;
    };
    
    // Optimized resize handler
    let resizeTimeout: number;
    const handleOptimizedResize = () => {
      setIsResizing(true);
      setPauseAnimations(true);
      
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
      
      resizeTimeout = window.setTimeout(() => {
        setIsResizing(false);
        setPauseAnimations(false);
      }, 100) as unknown as number;
    };
    
    // Monitor FPS periodically
    const fpsInterval = setInterval(() => {
      setFpsValue(performanceService.getCurrentFPS());
    }, 2000);
    
    // Listen for low FPS events
    const handleReduceVisualComplexity = () => {
      setLowPowerMode(true);
    };
    
    // Subscribe to optimized events
    window.addEventListener('optimized-scroll', handleOptimizedScroll);
    window.addEventListener('optimized-resize', handleOptimizedResize);
    window.addEventListener('reduce-visual-complexity', handleReduceVisualComplexity);
    
    return () => {
      window.removeEventListener('optimized-scroll', handleOptimizedScroll);
      window.removeEventListener('optimized-resize', handleOptimizedResize);
      window.removeEventListener('reduce-visual-complexity', handleReduceVisualComplexity);
      reducedMotionQuery.removeEventListener('change', handleReducedMotionChange);
      clearInterval(fpsInterval);
      if (scrollTimeout) window.clearTimeout(scrollTimeout);
      if (resizeTimeout) window.clearTimeout(resizeTimeout);
    };
  }, [lowPowerMode]);
  
  // Function to optimize interaction handlers
  const optimizeInteraction = useCallback((callback: () => void) => {
    if (isScrolling || isResizing) {
      performanceService.scheduleIdleWork(callback);
    } else {
      callback();
    }
  }, [isScrolling, isResizing]);
  
  // Function to determine if a component should render with full effects
  const optimizeRendering = useCallback((componentName: string): boolean => {
    // Check if we've already made a decision for this component this session
    if (renderOptimizationCache[componentName] !== undefined) {
      return renderOptimizationCache[componentName];
    }
    
    // Determine if the component should render with full effects
    const shouldRenderFull = !lowPowerMode && 
                            !reduceMotion && 
                            fpsValue > 35 &&
                            performanceService.isPageVisible();
    
    // Cache the result to avoid recalculation
    renderOptimizationCache[componentName] = shouldRenderFull;
    
    return shouldRenderFull;
  }, [lowPowerMode, reduceMotion, fpsValue, renderOptimizationCache]);
  
  return (
    <PerformanceContext.Provider value={{
      isScrolling,
      isResizing,
      reduceMotion,
      lowPowerMode,
      pauseAnimations,
      enableParallax: !reduceMotion && !lowPowerMode && performanceConfig.device.animations.parallaxEffects,
      enableBlur: performanceConfig.device.visual.enableBlur,
      fpsValue,
      optimizeInteraction,
      optimizeRendering
    }}>
      {children}
    </PerformanceContext.Provider>
  );
};

export default PerformanceProvider;
