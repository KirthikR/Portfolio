import React, { ReactNode } from 'react';
import { motion, MotionProps } from 'framer-motion';
import { usePerformance } from '../context/PerformanceContext';

interface OptimizedAnimationProps extends MotionProps {
  children: ReactNode;
  className?: string;
  skipAnimationCondition?: boolean;
}

const OptimizedAnimation: React.FC<OptimizedAnimationProps> = ({ 
  children, 
  className = '', 
  skipAnimationCondition, 
  ...motionProps 
}) => {
  const { reduceMotion, lowPowerMode, isScrolling } = usePerformance();
  
  // Skip animations under certain conditions for better performance
  const shouldSkipAnimation = skipAnimationCondition || reduceMotion || lowPowerMode || isScrolling;
  
  if (shouldSkipAnimation) {
    return (
      <div className={className}>
        {children}
      </div>
    );
  }
  
  return (
    <motion.div
      className={`${className} will-change-transform`}
      {...motionProps}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedAnimation;
