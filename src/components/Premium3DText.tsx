import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';

interface Premium3DTextProps {
  text: string;
  className?: string;
  reduced?: boolean; // Add option for reduced effects
}

const Premium3DText: React.FC<Premium3DTextProps> = ({ text, className = "", reduced = false }) => {
  // Container refs and state for mouse tracking
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0.5, y: 0.5 }); // Default center position
  const [isHovered, setIsHovered] = useState(false);
  const [letterHovered, setLetterHovered] = useState<number | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Smooth spring physics with reduced stiffness for better performance
  const springConfig = { damping: 20, stiffness: reduced ? 100 : 150 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);
  
  // Transform mouse position into rotation values - reduced range for better performance
  const rotateRange = reduced ? 3 : 7;
  const rotateX = useTransform(y, [-100, 100], [rotateRange, -rotateRange]);
  const rotateY = useTransform(x, [-100, 100], [-rotateRange, rotateRange]);
  
  // Handle window resize with throttling
  useEffect(() => {
    let timeoutId: number;
    
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    const handleResize = () => {
      if (timeoutId) clearTimeout(timeoutId);
      timeoutId = window.setTimeout(updateDimensions, 100);
    };
    
    window.addEventListener('resize', handleResize);
    updateDimensions(); // Initial call
    
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Debounced mouse move handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Calculate mouse position relative to the center of the container
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Set motion values based on mouse position - limit updates for better performance
    mouseX.set((e.clientX - centerX) / 5);
    mouseY.set((e.clientY - centerY) / 5);
    
    // Update regular state for other calculations
    setMousePosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  // Get color based on letter index for rainbow effect - memoize function
  const getLetterColor = useMemo(() => (index: number, total: number, hovered: boolean, isThisLetterHovered: boolean) => {
    if (isThisLetterHovered) {
      return 'hsl(0, 0%, 100%)'; // White when letter is hovered
    } else if (hovered) {
      return `hsl(${(index / total) * 360}, 100%, 70%)`; // Rainbow when any letter is hovered
    } else {
      return `hsl(${(index / total) * 360}, 80%, 70%)`; // Default rainbow with less saturation
    }
  }, []);
  
  // Create an array of letters from the text - memoized
  const letters = useMemo(() => Array.from(text), [text]);
  
  // Reduce the number of particle effects based on reduced mode
  const particleCount = reduced ? 5 : 15;
  
  return (
    <div 
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setLetterHovered(null);
        mouseX.set(0);
        mouseY.set(0);
      }}
      className="relative w-full perspective-1500 py-16 overflow-visible cursor-default select-none"
    >
      {/* 3D text container with perspective */}
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        className="flex justify-center items-center w-full h-full will-change-transform"
      >
        {/* The main text container */}
        <div className="flex flex-wrap justify-center text-center">
          {letters.map((letter, index) => {
            // Skip animating spaces but keep them
            if (letter === ' ') {
              return <span key={`space-${index}`} className="mx-2" />;
            }
            
            const isLetterHovered = letterHovered === index;
            const letterColor = getLetterColor(index, letters.length, isHovered, isLetterHovered);
            
            return (
              <motion.span
                key={index}
                className={`inline-block ${className} transition-colors duration-200`}
                style={{ 
                  color: letterColor,
                  textShadow: isLetterHovered 
                    ? '0 0 20px rgba(255, 255, 255, 0.8), 0 0 30px rgba(255, 100, 255, 0.6)'
                    : isHovered 
                      ? '0 0 10px rgba(255, 255, 255, 0.5)'
                      : '0 0 5px rgba(255, 255, 255, 0.3)',
                  transformStyle: 'preserve-3d',
                }}
                onMouseEnter={() => !reduced && setLetterHovered(index)}
                onMouseLeave={() => !reduced && setLetterHovered(null)}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  z: isLetterHovered ? 30 : isHovered ? 10 : 0,
                  scale: isLetterHovered ? 1.1 : 1
                }}
                transition={{
                  duration: 0.3,
                  delay: index * 0.03, // Faster delay
                }}
              >
                {letter}
                
                {/* Only render additional depth elements if not in reduced mode */}
                {!reduced && (
                  <>
                    {/* 3D depth effect - letter shadow projected backwards */}
                    <motion.span
                      className="absolute left-0 top-0 opacity-10 text-gray-800 pointer-events-none"
                      style={{
                        transform: 'translateZ(-15px)',
                        filter: 'blur(1px)',
                      }}
                    >
                      {letter}
                    </motion.span>
                  </>
                )}
              </motion.span>
            );
          })}
        </div>
      </motion.div>
      
      {/* Only render particle effects if not in reduced mode and is hovered */}
      {isHovered && !reduced && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {Array.from({ length: particleCount }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 rounded-full bg-white opacity-70"
              style={{
                left: `${mousePosition.x * 100}%`,
                top: `${mousePosition.y * 100}%`,
                x: `${Math.sin(i * 24) * 50}px`,
                y: `${Math.cos(i * 24) * 50}px`,
              }}
              animate={{
                opacity: [0, 0.5, 0],
                scale: [0, 1, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.1,
              }}
            />
          ))}
        </div>
      )}
      
      {/* Only render 1 animated line in reduced mode */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {Array.from({ length: reduced ? 1 : 3 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-px w-full opacity-20"
            style={{
              top: `${30 + i * 20}%`,
              background: `linear-gradient(90deg, 
                transparent 0%, 
                rgba(255,255,255,0.2) 20%, 
                rgba(255,255,255,0.5) 50%, 
                rgba(255,255,255,0.2) 80%, 
                transparent 100%
              )`,
              scaleX: 1.2,
            }}
            animate={{
              x: [dimensions.width, -dimensions.width],
            }}
            transition={{
              duration: (8 + i * 4) * (reduced ? 1.5 : 1), // Slower animation in reduced mode
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default Premium3DText;
