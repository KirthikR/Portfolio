import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, CheckCircle } from 'lucide-react';

interface LuxuryDownloadButtonProps {
  cvUrl: string;
  fileName?: string;
  className?: string;
}

const LuxuryDownloadButton: React.FC<LuxuryDownloadButtonProps> = ({
  cvUrl,
  fileName = "KIRTHIK R84.pdf",
  className = "w_full",
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isDownloaded, setIsDownloaded] = useState(false);
  
  const handleDownload = () => {
    setIsClicked(true);
    
    // Create an invisible anchor element
    const link = document.createElement('a');
    link.href = cvUrl;
    link.download = fileName;
    document.body.appendChild(link);
    
    // Small delay for the button press animation
    setTimeout(() => {
      link.click();
      document.body.removeChild(link);
      
      // Show success state
      setIsDownloaded(true);
      
      // Reset after 2 seconds
      setTimeout(() => {
        setIsClicked(false);
        setIsDownloaded(false);
      }, 2000);
    }, 300);
  };
  
  // Particle animation on click
  const particles = Array.from({ length: 20 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100 - 50,
    y: Math.random() * -100,
    size: Math.random() * 8 + 2,
    opacity: Math.random() * 0.7 + 0.3,
  }));

  return (
    <motion.div 
      className={`relative ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {/* Light beam effect behind button */}
      <motion.div 
        className="absolute inset-0 rounded-xl blur-xl"
        initial={{ opacity: 0 }}
        animate={{ 
          opacity: isHovered ? 0.7 : 0,
          scale: isHovered ? 1.1 : 1,
        }}
        transition={{ duration: 0.4 }}
        style={{ 
          background: `radial-gradient(circle, rgba(99, 102, 241, 0.4) 0%, rgba(168, 85, 247, 0.2) 80%, transparent 100%)`,
        }}
      />

      {/* Main button */}
      <motion.button
        className={`relative overflow-hidden group px-6 py-3 rounded-xl text-white font-medium 
                   flex items-center justify-center gap-2 border backdrop-blur-sm
                   ${isDownloaded 
                     ? 'bg-emerald-900/30 border-emerald-500/30' 
                     : 'bg-indigo-900/30 border-indigo-500/30'}`}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        onClick={handleDownload}
      >
        {/* Background gradient effect */}
        <motion.div 
          className="absolute inset-0 z-0"
          animate={{
            background: isDownloaded
              ? 'linear-gradient(45deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.4))'
              : isHovered
                ? 'linear-gradient(45deg, rgba(79, 70, 229, 0.4), rgba(168, 85, 247, 0.6))'
                : 'linear-gradient(45deg, rgba(79, 70, 229, 0.2), rgba(168, 85, 247, 0.3))',
          }}
          transition={{ duration: 0.3 }}
        />

        {/* Moving light effect */}
        <motion.div
          className="absolute w-20 h-20 bg-white/10 blur-xl rounded-full z-0"
          initial={{ opacity: 0, x: -100, scale: 0.5 }}
          animate={{
            opacity: isHovered ? 0.5 : 0,
            x: isHovered ? 100 : -100,
            scale: isHovered ? 1.2 : 0.5,
          }}
          transition={{ 
            duration: isHovered ? 1.5 : 0, 
            repeat: isHovered ? Infinity : 0,
            repeatType: "loop" 
          }}
        />

        {/* Shimmer effect on hover */}
        <motion.div
          className="absolute inset-0 z-0 overflow-hidden"
          initial={false}
          animate={isHovered ? "animate" : "initial"}
        >
          <motion.div
            className="absolute top-0 left-0 w-[200%] h-full"
            style={{
              background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
              transform: 'translateX(-100%)',
            }}
            variants={{
              initial: { x: '-100%' },
              animate: { x: '100%' }
            }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        </motion.div>

        {/* Button content */}
        <AnimatePresence mode="wait">
          {isDownloaded ? (
            <motion.div 
              key="success" 
              className="flex items-center gap-2 z-10 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <CheckCircle className="w-5 h-5 text-emerald-300" />
              <span>Downloaded!</span>
            </motion.div>
          ) : (
            <motion.div 
              key="download" 
              className="flex items-center gap-2 z-10 relative"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.2 }}
            >
              <motion.span
                animate={isClicked ? { y: [0, -30, 0] } : {}}
                transition={{ duration: 0.3 }}
              >
                <Download className="w-5 h-5" />
              </motion.span>
              <span>Download CV</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Particle effect on click */}
        <AnimatePresence>
          {isClicked && particles.map(particle => (
            <motion.div
              key={particle.id}
              className="absolute rounded-full z-10"
              style={{ 
                backgroundColor: `rgba(168, 85, 247, ${particle.opacity})`,
                width: particle.size,
                height: particle.size,
              }}
              initial={{ 
                x: 0, 
                y: 0, 
                opacity: 1 
              }}
              animate={{ 
                x: particle.x, 
                y: particle.y, 
                opacity: 0 
              }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            />
          ))}
        </AnimatePresence>
      </motion.button>

      {/* Reflection effect */}
      <motion.div 
        className="absolute left-0 right-0 h-[1px] bg-white/10 rounded-full"
        style={{ top: '100%' }}
        animate={{ 
          opacity: isHovered ? 0.4 : 0.1,
          width: isHovered ? '100%' : '80%',
          x: isHovered ? '0%' : '10%',
        }}
        transition={{ duration: 0.4 }}
      />
    </motion.div>
  );
};

export default LuxuryDownloadButton;
