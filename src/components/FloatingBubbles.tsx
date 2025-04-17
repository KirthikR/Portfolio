import { motion } from 'framer-motion';
import { useState, useEffect, useMemo } from 'react';

interface BubbleProps {
  dark?: boolean;
  reduced?: boolean; // Add option for reduced bubbles on lower-end devices
}

export default function FloatingBubbles({ dark = false, reduced = false }: BubbleProps) {
  // Memoize the bubble generation to prevent regenerating on each render
  const bubbles = useMemo(() => {
    // Generate fewer bubbles if reduced mode is activated
    const count = reduced ? 6 : 12;
    return Array.from({ length: count }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 120 + 40,
      depth: Math.random(),
      opacity: 0.1 + Math.random() * 0.2, // Reduced opacity
      color: Math.random() > 0.6 ? 'blue' : Math.random() > 0.3 ? 'purple' : 'pink',
      rotation: Math.random() * 360,
      duration: 15 + Math.random() * 30
    }));
  }, [reduced]);
  
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  
  useEffect(() => {
    // Set initial window dimensions
    function handleResize() {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    }
    
    // Initial call
    handleResize();
    
    // Optimized event listener with throttling
    let timeoutId: number;
    const throttledResize = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(handleResize, 100) as unknown as number;
    };
    
    window.addEventListener('resize', throttledResize);
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', throttledResize);
    };
  }, []);
  
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

  // Use fewer glass spheres for better performance
  const glassSpheresCount = reduced ? 1 : 3;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {bubbles.map((bubble, index) => {
        // Calculate depth-based animation speeds and delays
        const scaleDelay = bubble.depth * 2;
        const movementFactor = bubble.depth * 2;
        
        return (
          <motion.div
            key={index}
            className="absolute rounded-full will-change-transform"
            style={{
              width: bubble.size,
              height: bubble.size,
              left: `${bubble.x}%`,
              top: `${bubble.y}%`,
              background: `radial-gradient(circle at 30% 30%, ${getGradient(bubble.color, bubble.opacity)}, transparent 70%)`,
              boxShadow: `0 0 40px 5px ${getGradient(bubble.color, bubble.opacity / 8)}`, // Reduced shadow intensity
              backdropFilter: reduced ? "none" : "blur(4px)", // Remove blur filter in reduced mode
              zIndex: Math.floor(bubble.depth * -10), // Simplified z-index
            }}
            initial={{ scale: 0, rotate: 0 }}
            animate={{
              x: [
                0,
                Math.sin(index) * 50 * movementFactor, // Reduce motion
                Math.cos(index) * 40 * movementFactor, // Reduce motion
                0
              ],
              y: [
                0,
                Math.cos(index) * 50 * movementFactor, // Reduce motion
                Math.sin(index) * 60 * movementFactor, // Reduce motion
                0
              ],
              rotate: [0, bubble.rotation, 360],
              scale: [0, 1, 0.9, 1],
            }}
            transition={{
              duration: bubble.duration * 1.5, // Slower animations
              times: [0, 0.3, 0.7, 1],
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          >
            {/* Simplified inner content */}
            {!reduced && (
              <motion.div
                className="w-full h-full rounded-full"
                style={{
                  background: `radial-gradient(circle at 30% 30%, transparent, ${getGradient(bubble.color, bubble.opacity / 2)} 90%)`,
                }}
                animate={{
                  scale: [1, 1.1, 1],
                  opacity: [bubble.opacity, bubble.opacity * 1.2, bubble.opacity],
                }}
                transition={{
                  duration: 8,
                  repeat: Infinity,
                  repeatType: "reverse",
                  ease: "easeInOut"
                }}
              />
            )}
          </motion.div>
        );
      })}
      
      {/* Glass spheres - fewer in reduced mode */}
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
            // Apply blur filter only on desktops
            backdropFilter: reduced ? "none" : "blur(2px)",
          }}
          animate={{
            // Reduced motion for better performance
            x: [0, -25, 25, 0],
            y: [0, 15, -20, 0],
            rotate: [0, 5, -5, 0],
          }}
          transition={{
            duration: 25 + index * 5,
            repeat: Infinity,
            repeatType: "reverse",
            ease: "easeInOut",
          }}
        >
          {/* Simplified highlight effect */}
          {!reduced && (
            <motion.div
              className="absolute w-1/3 h-1/3 rounded-full"
              style={{
                top: "15%",
                left: "15%",
                background: "linear-gradient(225deg, rgba(255,255,255,0.2) 0%, transparent 70%)",
              }}
            />
          )}
        </motion.div>
      ))}
    </div>
  );
}
