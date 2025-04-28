import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface OptimizedProfessionalNameAnimationProps {
  firstName?: string;
  lastName?: string;
  titles?: string[];
  titleChangeDuration?: number;
  isDarkMode?: boolean;
}

const OptimizedProfessionalNameAnimation = ({
  firstName = "Kirthik",
  lastName = "Ramadoss",
  titles = [
    "Software Engineer", 
    "Full Stack Developer", 
    "UI/UX Designer",
    "Data Scientist"
  ],
  titleChangeDuration = 3000,
  isDarkMode = false
}: OptimizedProfessionalNameAnimationProps) => {
  const [titleIndex, setTitleIndex] = useState(0);
  const [isChanging, setIsChanging] = useState(false);
  
  // Change professional title at regular intervals
  useEffect(() => {
    const intervalId = setInterval(() => {
      setIsChanging(true);
      setTimeout(() => {
        setTitleIndex((prev) => (prev + 1) % titles.length);
        setIsChanging(false);
      }, 500); // Half a second for the fade out/in effect
    }, titleChangeDuration);
    
    return () => clearInterval(intervalId);
  }, [titles.length, titleChangeDuration]);
  
  // Animation variants for the name
  const nameContainerVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.3,
      }
    }
  };
  
  const nameCharVariants = {
    initial: { y: 40, opacity: 0 },
    animate: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 12
      }
    }
  };
  
  const firstNameChars = Array.from(firstName);
  const lastNameChars = Array.from(lastName);
  
  return (
    <div className="relative will-change-transform">
      {/* First Name Animation */}
      <motion.div 
        className="mb-2"
        variants={nameContainerVariants}
        initial="initial"
        animate="animate"
      >
        <div className="flex items-center justify-center md:justify-start overflow-hidden">
          {firstNameChars.map((char, index) => (
            <motion.span
              key={`first-${index}`}
              variants={nameCharVariants}
              className={`inline-block text-5xl md:text-7xl font-extrabold
                ${isDarkMode ? 'text-white' : 'text-gray-900'}`}
              whileHover={{ 
                y: -5, 
                color: "#8B5CF6",
                transition: { duration: 0.2 }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      </motion.div>
      
      {/* Last Name Animation */}
      <motion.div 
        className="mb-4"
        variants={nameContainerVariants}
        initial="initial"
        animate="animate"
        transition={{ delayChildren: 0.5 }}
      >
        <div className="flex items-center justify-center md:justify-start overflow-hidden">
          {lastNameChars.map((char, index) => (
            <motion.span
              key={`last-${index}`}
              variants={nameCharVariants}
              className={`inline-block text-5xl md:text-7xl font-extrabold 
                text-transparent bg-clip-text bg-gradient-to-r 
                from-purple-600 to-pink-600`}
              style={{
                textShadow: "0 0 8px rgba(139, 92, 246, 0.3)",
              }}
              whileHover={{ 
                y: -5, 
                scale: 1.1,
                transition: { duration: 0.2 }
              }}
            >
              {char === ' ' ? '\u00A0' : char}
            </motion.span>
          ))}
        </div>
      </motion.div>
      
      {/* Professional Title Animation */}
      <motion.div
        className="relative h-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <motion.div
          className="absolute inset-0 flex items-center justify-center md:justify-start"
          initial={{ opacity: 0 }}
          animate={{ opacity: isChanging ? 0 : 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.span 
            className={`text-xl md:text-2xl font-medium
              ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}
            initial={{ y: 20 }}
            animate={{ y: 0 }}
            key={titles[titleIndex]}
          >
            {titles[titleIndex]}
          </motion.span>
          <motion.div
            className="h-[2px] bg-gradient-to-r from-purple-500 to-pink-500 ml-1 w-0"
            animate={{ width: ["0%", "100%"] }}
            transition={{ 
              duration: 1.5, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OptimizedProfessionalNameAnimation;
