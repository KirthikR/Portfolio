import { motion, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useState, useEffect, useRef } from 'react';

interface RunningTextProps {
  text: string;
  className?: string;
}

export default function RunningText({ text, className = "" }: RunningTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  
  // For parallax effect
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);
  
  // Handle mouse movement for interactive effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    setMouseX(e.clientX - centerX);
    setMouseY(e.clientY - centerY);
    
    x.set(e.clientX - centerX);
    y.set(e.clientY - centerY);
  };

  // Split text into words for animation
  const words = text.split(" ");

  return (
    <div 
      ref={containerRef}
      className="w-full h-full flex items-center justify-center perspective-1200 my-16" 
      onMouseMove={handleMouseMove}
      style={{ perspective: "1200px" }}
    >
      <motion.div
        className="relative w-full flex flex-wrap justify-center"
        style={{
          rotateX,
          rotateY,
          transformStyle: "preserve-3d"
        }}
      >
        {words.map((word, index) => (
          <motion.div
            key={index}
            className="mx-4 mb-2"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 1,
              delay: index * 0.2,
              type: "spring",
              stiffness: 100
            }}
          >
            {Array.from(word).map((char, charIndex) => (
              <motion.span
                key={charIndex}
                className={`inline-block ${className}`}
                style={{ 
                  transformStyle: "preserve-3d",
                  textShadow: "0 10px 25px rgba(0,0,0,0.3)"
                }}
                initial={{ rotateY: 90, opacity: 0 }}
                animate={{ rotateY: 0, opacity: 1 }}
                transition={{
                  duration: 0.8,
                  delay: index * 0.2 + charIndex * 0.05,
                  type: "spring",
                  damping: 15
                }}
                whileHover={{
                  z: 50,
                  scale: 1.2,
                  color: "#ff5500",
                  transition: { duration: 0.2 }
                }}
              >
                {char}
              </motion.span>
            ))}
          </motion.div>
        ))}
        
        {/* Floating 3D elements around the text for luxury effect */}
        <motion.div
          className="absolute -z-10 w-full h-full"
          style={{ transformStyle: "preserve-3d" }}
        >
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-gradient-to-r from-purple-400 to-pink-600 opacity-20"
              style={{
                width: Math.random() * 100 + 20,
                height: Math.random() * 100 + 20,
                x: Math.random() * 1000 - 500,
                y: Math.random() * 300 - 150,
                z: Math.random() * -300,
              }}
              animate={{
                x: [null, Math.random() * 200 - 100],
                y: [null, Math.random() * 200 - 100],
                z: [null, Math.random() * -200],
                scale: [1, Math.random() + 0.5, 1],
              }}
              transition={{
                duration: Math.random() * 10 + 10,
                repeat: Infinity,
                repeatType: "reverse",
                ease: "easeInOut"
              }}
            />
          ))}
        </motion.div>
      </motion.div>
    </div>
  );
}
