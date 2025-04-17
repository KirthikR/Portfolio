import React, { memo, ComponentType } from 'react';

interface OptimizationOptions {
  memoize?: boolean;
  enableHardwareAcceleration?: boolean;
  displayName?: string;
}

export function withPerformanceOptimizations<P extends object>(
  Component: ComponentType<P>,
  options: OptimizationOptions = {
    memoize: true,
    enableHardwareAcceleration: true,
    displayName: undefined
  }
) {
  const { memoize, enableHardwareAcceleration, displayName } = options;
  
  // Create a wrapper component that applies performance optimizations
  const OptimizedComponent: React.FC<P> = (props) => {
    return (
      <div className={enableHardwareAcceleration ? 'force-hardware-acceleration' : ''}>
        <Component {...props} />
      </div>
    );
  };
  
  // Set display name for better debugging
  if (displayName) {
    OptimizedComponent.displayName = displayName;
  } else {
    OptimizedComponent.displayName = `Optimized${Component.displayName || Component.name || 'Component'}`;
  }
  
  // Apply memoization if enabled
  return memoize ? memo(OptimizedComponent) : OptimizedComponent;
}

export default withPerformanceOptimizations;
