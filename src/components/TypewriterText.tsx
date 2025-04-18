import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  text: string;
  className?: string;
  speed?: number;
  startDelay?: number;
  shouldStart: boolean;
  forceDisplay?: boolean; // New prop to force full text display
}

const TypewriterText: React.FC<TypewriterTextProps> = ({ 
  text, 
  className = "", 
  speed = 150,
  startDelay = 0,
  shouldStart = false,
  forceDisplay = false // Default is false
}) => {
  // Split text into words
  const words = text.split(' ');
  const [displayedWordCount, setDisplayedWordCount] = useState(0);
  const [started, setStarted] = useState(false);
  const [completed, setCompleted] = useState(false);
  const animationRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialMount = useRef(true);

  // When forceDisplay is true, immediately show all text
  useEffect(() => {
    if (forceDisplay) {
      setDisplayedWordCount(words.length);
      setStarted(true);
      setCompleted(true);
    }
  }, [forceDisplay, words.length]);

  // Reset when text changes
  useEffect(() => {
    // Skip on initial render to prevent flash of empty content
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    if (!forceDisplay) {
      setDisplayedWordCount(0);
      setStarted(false);
      setCompleted(false);
    }
  }, [text, forceDisplay]);

  // Handle initial delay
  useEffect(() => {
    if (!shouldStart || started || forceDisplay) return;
    
    const timeout = setTimeout(() => {
      setStarted(true);
    }, startDelay);
    
    return () => clearTimeout(timeout);
  }, [shouldStart, started, startDelay, forceDisplay]);

  // Handle word-by-word animation
  useEffect(() => {
    if (!started || forceDisplay) return;
    
    if (completed) {
      // If animation was completed, immediately show all words
      setDisplayedWordCount(words.length);
      return;
    }

    if (displayedWordCount < words.length) {
      animationRef.current = setTimeout(() => {
        setDisplayedWordCount(prev => {
          const newCount = prev + 1;
          if (newCount >= words.length) {
            setCompleted(true);
          }
          return newCount;
        });
      }, speed);
    }
    
    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [displayedWordCount, started, words, speed, completed, forceDisplay]);

  // If we need to force display the full text
  if (forceDisplay) {
    return (
      <p className={className}>
        {words.join(' ')}
      </p>
    );
  }

  return (
    <p className={className}>
      {words.slice(0, displayedWordCount).map((word, index) => (
        <React.Fragment key={index}>
          <motion.span
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {word}
          </motion.span>
          {index < displayedWordCount - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
      {started && !completed && (
        <span className="inline-block w-2 h-5 ml-1 bg-indigo-400 animate-pulse"></span>
      )}
    </p>
  );
}

export default TypewriterText;
