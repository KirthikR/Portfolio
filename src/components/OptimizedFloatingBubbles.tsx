import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';
import { usePerformance } from '../context/PerformanceContext';

interface BubbleProps {
  dark?: boolean;
}

export default function OptimizedFloatingBubbles({ dark = false }: BubbleProps) {
  const { reduceMotion, lowPowerMode, enableParallax, isScrolling, fpsValue } = usePerformance();
  
  // Set adaptive quality based on performance state
  const quality = useMemo(() => {
    if (reduceMotion || lowPowerMode) return 'low';
    if (isScrolling || fpsValue < 40) return 'medium';
    return 'high';
  }, [reduceMotion, lowPowerMode, isScrolling, fpsValue]);
  
  // Adjust bubble count based on device performance
  const bubbleCount = useMemo(() => {
    switch (quality) {
      case 'low': return 3;
      case 'medium': return 6;
      case 'high': return 12;
      default: return 6;
    }
  }, [quality]);
  
  // Memoize the bubble generation to prevent regenerating on each render
  const bubbles = useMemo(() => {
    return Array.from({ length: bubbleCount }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 40,
      depth: Math.random(),
      opacity: quality === 'low' ? 0.1 : 0.1 + Math.random() * 0.2,
      color: Math.random() > 0.6 ? 'blue' : Math.random() > 0.3 ? 'purple' : 'pink',
      rotation: Math.random() * 360,
      duration: quality === 'low' ? 60 : 15 + Math.random() * 30
    }));
  }, [bubbleCount, quality]);
  
  
  // Get gradient colors based on dark mode - memoized
  const getGradient = useMemo(() => (color: string, opacity: number) => {
    if (dark) {
      switch(color) {
        case 'blue': return `rgba(30, 64, 175, ${opacity})`;
        case 'purple': return `rgba(126, 34, 206, ${opacity})`;
        case 'pink': return `rgba(190, 24, 93, ${opacity})`;
        default: return `rgba(30, 64, 175, ${opacity})`;
      }
    } else {
      switch(color) {
        case 'blue': return `rgba(59, 130, 246, ${opacity})`;
        case 'purple': return `rgba(168, 85, 247, ${opacity})`;
        case 'pink': return `rgba(236, 72, 153, ${opacity})`;
        default: return `rgba(59, 130, 246, ${opacity})`;
      }
    }
  }, [dark]);

  // Only render glass spheres on high performance
  const glassSpheresCount = quality === 'high' ? 3 : quality === 'medium' ? 1 : 0;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => {
        // Reduce animation complexity based on performance
        const movementFactor = quality === 'low' ? 0.5 : bubble.depth * 2;
        const shouldAnimate = !reduceMotion && !isScrolling;
        
        return (
          <motion.div
            key={index}
            className={`absolute rounded-full will-change-transform ${
              quality !== 'low' ? 'blur-effect' : ''
            }`}
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, ${getGradient(bubble.color, bubble.opacity)}, transparent 70%)`,
              boxShadow: quality !== 'low' ? `0 0 40px 5px ${getGradient(bubble.color, bubble.opacity / 8)}` : 'none',
              backdropFilter: quality === 'high' ? "blur(4px)" : "none",
              zIndex: Math.floor(bubble.depth * -10),
              // Apply reduced transform on low-power mode
              transform: !shouldAnimate ? 'none' : undefined
            }}
            initial={false}
            animate={shouldAnimate ? {
              x: [
                0,
                Math.sin(index) * 50 * movementFactor * 0.5,
                Math.cos(index) * 40 * movementFactor * 0.5,
                0
              ],
              y: [
                0,
                Math.cos(index) * 50 * movementFactor * 0.5,
                Math.sin(index) * 60 * movementFactor * 0.5,
                0
              ],
              rotate: quality === 'low' ? 0 : [0, bubble.rotation, 360],
            } : {}}
            transition={{
              duration: bubble.duration * (quality === 'low' ? 2 : 1),
              times: [0, 0.3, 0.7, 1],
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        );
      })}
      
      {/* Glass spheres - only render on medium/high quality */}
      {Array.from({ length: glassSpheresCount }).map((_, index) => (
        <motion.div
          key={`glass-${index}`}
          className="absolute rounded-full will-change-transform"
          style={{
            width: 160 + index * 40,
            height: 160 + index * 40,
            left: `${20 + index * 25}%`,
            top: `${20 + index * 20}%`,
            background: `radial-gradient(circle at 30% 30%, 
              rgba(255, 255, 255, 0.05), 
              rgba(255, 255, 255, 0.03) 40%, 
              transparent 60%)`,
            border: "1px solid rgba(255,255,255,0.05)",
            backdropFilter: quality === 'high' ? "blur(2px)" : "none",
          }}
          animate={!reduceMotion && !isScrolling ? {
            // Simplified animation for better performance
            x: [0, -25, 25, 0],
            y: [0, 15, -20, 0],
            rotate: quality === 'high' ? [0, 5, -5, 0] : 0,
          } : {}}
          transition={{
            duration: 25 + index * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}
