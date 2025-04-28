import { motion } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { useMotionValue } from 'framer-motion';

type Bubble = {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  opacity: number;
  speed: number;
  delay: number;
};

interface OptimizedFloatingBubblesProps {
  count?: number;
  colors?: string[];
  minSize?: number;
  maxSize?: number;
  minOpacity?: number;
  maxOpacity?: number;
  minSpeed?: number;
  maxSpeed?: number;
}

const OptimizedFloatingBubbles = ({
  count = 15,
  colors = ['#8B5CF6', '#EC4899', '#3B82F6', '#10B981', '#6366F1'],
  minSize = 10,
  maxSize = 60,
  minOpacity = 0.2,
  maxOpacity = 0.6,
  minSpeed = 10,
  maxSpeed = 30
}: OptimizedFloatingBubblesProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // Initialize bubbles with random properties
  useEffect(() => {
    if (!containerRef.current) return;
    
    const { offsetWidth, offsetHeight } = containerRef.current;
    setDimensions({ width: offsetWidth, height: offsetHeight });
    
    const newBubbles = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * offsetWidth,
      y: Math.random() * offsetHeight,
      size: minSize + Math.random() * (maxSize - minSize),
      color: colors[Math.floor(Math.random() * colors.length)],
      opacity: minOpacity + Math.random() * (maxOpacity - minOpacity),
      speed: minSpeed + Math.random() * (maxSpeed - minSpeed),
      delay: Math.random() * 2
    }));

    setBubbles(newBubbles);
  }, [count, colors, minSize, maxSize, minOpacity, maxOpacity, minSpeed, maxSpeed]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (!containerRef.current) return;
      
      const { offsetWidth, offsetHeight } = containerRef.current;
      setDimensions({ width: offsetWidth, height: offsetHeight });
      
      setBubbles(prev => 
        prev.map(bubble => ({
          ...bubble,
          x: (bubble.x / dimensions.width) * offsetWidth,
          y: (bubble.y / dimensions.height) * offsetHeight
        }))
      );
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [dimensions]);

  // Mouse interaction handler
  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    mouseX.set(x);
    mouseY.set(y);
    
    setIsHovering(true);
  };

  const handleMouseLeave = () => {
    setIsHovering(false);
  };

  return (
    <div 
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none z-0"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {bubbles.map((bubble) => (
        <motion.div
          key={bubble.id}
          className="absolute rounded-full will-change-transform"
          style={{
            width: bubble.size,
            height: bubble.size,
            backgroundColor: bubble.color,
            opacity: bubble.opacity,
            x: bubble.x,
            y: bubble.y,
            filter: 'blur(2px)',
          }}
          initial={{ scale: 0 }}
          animate={{ 
            scale: 1,
            x: [
              bubble.x,
              bubble.x + (Math.random() * 100 - 50),
              bubble.x + (Math.random() * 100 - 50),
              bubble.x
            ],
            y: [
              bubble.y,
              bubble.y - bubble.speed * 2,
              bubble.y - bubble.speed * 4,
              bubble.y - bubble.speed * 6
            ],
            opacity: [bubble.opacity, bubble.opacity, bubble.opacity * 0.8, 0]
          }}
          transition={{
            duration: bubble.speed,
            delay: bubble.delay,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: Math.random() * 2
          }}
          drag={isHovering}
          dragConstraints={containerRef}
          dragElastic={0.3}
          dragTransition={{ bounceStiffness: 100, bounceDamping: 10 }}
          whileHover={{ scale: 1.2, opacity: bubble.opacity * 1.5 }}
        />
      ))}
    </div>
  );
};

export default OptimizedFloatingBubbles;
