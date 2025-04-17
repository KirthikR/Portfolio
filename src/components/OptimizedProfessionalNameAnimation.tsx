import React from 'react';
import { motion } from 'framer-motion';
import { usePerformance } from '../context/PerformanceContext';

interface NameAnimationProps {
  text: string;
  className?: string;
}

const OptimizedProfessionalNameAnimation: React.FC<NameAnimationProps> = ({ text, className = '' }) => {
  const { reduceMotion, lowPowerMode } = usePerformance();
  
  // Split text into words and letters for animation
  const words = text.split(' ');
  
  // Skip complex animations for low power mode
  if (lowPowerMode || reduceMotion) {
    return (
      <h1 className={className}>
        {text}
      </h1>
    );
  }

  return (
    <motion.h1 className={className}>
      {words.map((word, wordIndex) => (
        <motion.span
          key={`word-${wordIndex}`}
          className="inline-block mr-[0.25em] whitespace-nowrap"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ 
            duration: 0.5,
            delay: wordIndex * 0.2,
            ease: "easeInOut" 
          }}
        >
          {Array.from(word).map((letter, letterIndex) => (
            <motion.span
              key={`letter-${wordIndex}-${letterIndex}`}
              className="inline-block"
              initial={{ 
                opacity: 0,
                y: 20 
              }}
              animate={{ 
                opacity: 1,
                y: 0
              }}
              transition={{
                duration: 0.5,
                delay: wordIndex * 0.2 + letterIndex * 0.05,
                ease: "easeOut"
              }}
            >
              {letter}
            </motion.span>
          ))}
          {wordIndex < words.length - 1 ? ' ' : ''}
        </motion.span>
      ))}
    </motion.h1>
  );
};

export default OptimizedProfessionalNameAnimation;
