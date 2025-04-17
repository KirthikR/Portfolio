import React, { useState, useEffect, useRef, useMemo } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';

interface ProfessionalNameAnimationProps {
  text: string;
  className?: string;
}

const ProfessionalNameAnimation: React.FC<ProfessionalNameAnimationProps> = ({ text, className = "" }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [cursorPosition, setCursorPosition] = useState({ x: 0, y: 0 });
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  
  // Motion values for smooth animations
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Setup spring physics for smooth motion
  const springConfig = { damping: 15, stiffness: 100, mass: 0.5 };
  const rotateX = useSpring(useMotionValue(0), springConfig);
  const rotateY = useSpring(useMotionValue(0), springConfig);
  const scaleMotion = useSpring(1, { stiffness: 200, damping: 20 });
  
  // Transform for parallax effect on letters
  const moveX = useTransform(mouseX, [-500, 500], [-15, 15]);
  const moveY = useTransform(mouseY, [-500, 500], [15, -15]);
  
  // Light effect positioning
  const lightX = useTransform(mouseX, [-500, 500], [-20, 80], { clamp: true });
  const lightY = useTransform(mouseY, [-500, 500], [-20, 80], { clamp: true });

  // Split the text into words and then into letters
  const words = useMemo(() => {
    return text.split(' ').map(word => word.split(''));
  }, [text]);

  // Observer for when component is in view
  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      });
    }, { threshold: 0.1 });
    
    if (containerRef.current) {
      observer.observe(containerRef.current);
    }
    
    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current);
      }
    };
  }, []);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle mouse movement
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    
    // Mouse position relative to container center
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    // Update motion values
    mouseX.set(x);
    mouseY.set(y);
    
    // Set rotation values for 3D effect (limit the rotation range)
    rotateX.set(y / rect.height * -10); // -5 to 5 degrees
    rotateY.set(x / rect.width * 10);   // -5 to 5 degrees
    
    // Update cursor position for lighting effects
    setCursorPosition({
      x: (e.clientX - rect.left) / rect.width,
      y: (e.clientY - rect.top) / rect.height
    });
  };

  // Generate professional gradient styles
  const generateGradientStyle = (index: number, total: number) => {
    // Professional gradient palette
    const gradients = [
      'linear-gradient(to right, #4F46E5, #7C3AED, #A855F7)', // Indigo to purple
      'linear-gradient(to right, #2563EB, #3B82F6, #60A5FA)', // Blue spectrum
      'linear-gradient(to right, #0EA5E9, #38BDF8, #7DD3FC)', // Sky blue
      'linear-gradient(to right, #0891B2, #06B6D4, #22D3EE)', // Cyan
      'linear-gradient(to right, #0E7490, #0EA5E9, #38BDF8)'  // Teal to blue
    ];
    
    return { backgroundImage: gradients[index % gradients.length] };
  };
  
  return (
    <div 
      ref={containerRef}
      className="relative w-full h-full my-8 perspective-2000 overflow-visible cursor-default"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => scaleMotion.set(1.05)}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
        rotateX.set(0);
        rotateY.set(0);
        scaleMotion.set(1);
      }}
      style={{ perspective: '2000px' }}
    >
      {/* Moving glow effect */}
      <AnimatePresence>
        <motion.div
          className="absolute inset-0 z-0 opacity-70 rounded-full blur-3xl"
          style={{
            background: `radial-gradient(circle at ${cursorPosition.x * 100}% ${cursorPosition.y * 100}%, rgba(99, 102, 241, 0.5), rgba(79, 70, 229, 0.2), transparent 70%)`,
            width: '100%',
            height: '100%'
          }}
        />
      </AnimatePresence>

      {/* Main 3D container */}
      <motion.div
        className="relative flex flex-col items-center justify-center w-full h-full"
        style={{
          rotateX: rotateX,
          rotateY: rotateY,
          scale: scaleMotion,
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          willChange: 'transform'
        }}
      >
        {/* Dynamic lighting effect */}
        <div 
          className="absolute inset-0 pointer-events-none"
          style={{
            background: `radial-gradient(circle at ${lightX.get()}% ${lightY.get()}%, 
                        rgba(255, 255, 255, 0.15), 
                        transparent 40%)`,
          }}
        />

        {/* Name display with words and letters */}
        <div className="flex flex-wrap justify-center gap-3 md:gap-5 px-4">
          {words.map((word, wordIndex) => (
            <div key={`word-${wordIndex}`} className="flex">
              {word.map((letter, letterIndex) => {
                const delay = wordIndex * 0.1 + letterIndex * 0.04;
                const index = wordIndex * 10 + letterIndex;
                const totalLetters = words.reduce((sum, w) => sum + w.length, 0);
                
                return (
                  <motion.div
                    key={`letter-${wordIndex}-${letterIndex}`}
                    className={`inline-block ${className} px-0.5 bg-clip-text text-transparent will-change-transform`}
                    style={{
                      ...generateGradientStyle(index, totalLetters),
                      textShadow: '0 10px 30px rgba(79, 70, 229, 0.45)',
                      transformStyle: 'preserve-3d',
                      x: moveX,
                      y: moveY,
                      z: index % 2 === 0 ? 10 : 0
                    }}
                    initial={{ 
                      opacity: 0, 
                      y: 50,
                      rotateX: 90
                    }}
                    animate={isInView ? { 
                      opacity: 1, 
                      y: 0,
                      rotateX: 0
                    } : {}}
                    transition={{
                      duration: 0.8,
                      delay,
                      type: 'spring',
                      stiffness: 100,
                      damping: 10
                    }}
                    whileHover={{
                      scale: 1.2,
                      z: 30,
                      transition: { duration: 0.2 }
                    }}
                  >
                    {letter === ' ' ? '\u00A0' : letter}
                    
                    {/* Reflection/shadow effect */}
                    <motion.div
                      className="absolute top-full left-0 w-full opacity-20 blur-sm"
                      style={{
                        transformOrigin: 'top',
                        rotateX: -90,
                        scaleY: 0.5
                      }}
                    >
                      {letter === ' ' ? '\u00A0' : letter}
                    </motion.div>
                  </motion.div>
                );
              })}
            </div>
          ))}
        </div>

        {/* Animated accent lines */}
        <div className="absolute w-full h-full pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <motion.div
              key={`accent-${i}`}
              className="absolute left-0 w-full h-[1px] opacity-50"
              style={{
                top: `${25 + i * 25}%`,
                background: `linear-gradient(90deg, 
                  transparent 0%, 
                  rgba(99, 102, 241, 0.3) 20%, 
                  rgba(79, 70, 229, 0.6) 50%,
                  rgba(99, 102, 241, 0.3) 80%, 
                  transparent 100%
                )`,
                zIndex: -1,
                scaleX: 1.2,
              }}
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: (10 + i * 5),
                repeat: Infinity,
                ease: "linear",
              }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default ProfessionalNameAnimation;
