import { useRef, useState, useEffect, memo } from 'react';
import { 
  motion, useMotionValue, useSpring, useTransform, 
  AnimatePresence, useInView, useScroll, useVelocity 
} from 'framer-motion';
import { Link as ScrollLink } from 'react-scroll';
import { ChevronDown } from 'lucide-react';

// Dynamic 3D transformation helpers
const calculateX = (e: React.MouseEvent, elem: HTMLElement) => {
  const { clientX } = e;
  const { left, width } = elem.getBoundingClientRect();
  const middleX = left + width / 2;
  return (clientX - middleX) / (width / 2);
};

const calculateY = (e: React.MouseEvent, elem: HTMLElement) => {
  const { clientY } = e;
  const { top, height } = elem.getBoundingClientRect();
  const middleY = top + height / 2;
  return (clientY - middleY) / (height / 2);
};

interface UltraPremiumHeroSectionProps {
  isDarkMode: boolean;
}

const UltraPremiumHeroSection = ({ isDarkMode }: UltraPremiumHeroSectionProps) => {
  // State for interactive elements
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [carouselRotation, setCarouselRotation] = useState(0);
  const phrases = ["Data Analyst", "Frontend Developer", "UI/UX Designer", "Creative Thinker"];
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Performance optimization - reduce animation complexity on mobile
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  
  // Framer Motion values for parallax effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springConfig = { damping: 20, stiffness: 300 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);
  
  // Scroll progress for scroll-triggered animations
  const { scrollYProgress } = useScroll();
  const scrollVelocity = useVelocity(scrollYProgress);
  const inView = useInView(containerRef, { amount: 0.2, once: false });
  
  // Transform values for parallax layers
  const bgX = useTransform(springX, [-1, 1], [-20, 20]);
  const bgY = useTransform(springY, [-1, 1], [-20, 20]);
  const textX = useTransform(springX, [-1, 1], [-25, 25]);
  const textY = useTransform(springY, [-1, 1], [-25, 25]);

  // Study-related images for 3D carousel
  const studyImages = [
    {
      src: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
      alt: "Data Analysis Dashboard",
      category: "Data Science"
    },
    {
      src: "https://images.unsplash.com/photo-1551033406-611cf9a28f67?auto=format&fit=crop&q=80&w=800",
      alt: "Programming Code",
      category: "Frontend Development"
    },
    {
      src: "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&q=80&w=800",
      alt: "Business Analytics",
      category: "Analytics"
    },
    {
      src: "https://images.unsplash.com/photo-1517511620798-cec17d428bc0?auto=format&fit=crop&q=80&w=800",
      alt: "Data Visualization",
      category: "Data Science"
    },
    {
      src: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&q=80&w=800",
      alt: "Software Development",
      category: "Engineering"
    }
  ];

  // State for 3D carousel
  const [hoveredImage, setHoveredImage] = useState<number | null>(null);
  
  // Continuous rotation animation for the carousel
  useEffect(() => {
    let animationFrameId: number;
    let lastTimestamp = 0;
    const rotationSpeed = 0.2; // degrees per frame
    
    const animate = (timestamp: number) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const deltaTime = timestamp - lastTimestamp;
      lastTimestamp = timestamp;
      
      // Slow down rotation if an image is being hovered
      const speedMultiplier = hoveredImage !== null ? 0.1 : 1;
      
      // Update rotation angle
      setCarouselRotation(prev => (prev + rotationSpeed * speedMultiplier * deltaTime / 16) % 360);
      
      animationFrameId = requestAnimationFrame(animate);
    };
    
    if (!isReducedMotion) {
      animationFrameId = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
      }
    };
  }, [isReducedMotion, hoveredImage]);

  // Handle mouse movement for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isReducedMotion || !containerRef.current) return;
    
    // Update raw mouse position for cursor effects
    const { clientX, clientY } = e;
    const bounds = containerRef.current.getBoundingClientRect();
    
    // Calculate normalized position (-1 to 1)
    const normX = ((clientX - bounds.left) / bounds.width) * 2 - 1;
    const normY = ((clientY - bounds.top) / bounds.height) * 2 - 1;
    
    setMousePosition({ x: clientX - bounds.left, y: clientY - bounds.top });
    mouseX.set(normX);
    mouseY.set(normY);
  };
  
  // Text 3D effect on hover
  const handleTextEffect = (e: React.MouseEvent) => {
    if (isReducedMotion || !textRef.current) return;
    const x = calculateX(e, textRef.current);
    const y = calculateY(e, textRef.current);
    
    if (textRef.current) {
      textRef.current.style.transform = `perspective(1000px) rotateX(${y * 2}deg) rotateY(${-x * 2}deg)`;
    }
  };
  
  // Rotate through headline phrases
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex(prevIndex => (prevIndex + 1) % phrases.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [phrases.length]);
  
  // Check for reduced motion preference
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setIsReducedMotion(mediaQuery.matches || window.innerWidth < 768);
    
    const handleResize = () => {
      setIsReducedMotion(mediaQuery.matches || window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoaded(true), 500);
    return () => clearTimeout(timer);
  }, []);
  
  // Define gradient colors based on dark mode
  const gradientColors = isDarkMode 
    ? "from-indigo-900 via-blue-900 to-purple-900" 
    : "from-indigo-800 via-purple-800 to-pink-800";
    
  const accentGradient = isDarkMode
    ? "from-cyan-500 via-blue-500 to-indigo-500"
    : "from-pink-500 via-purple-500 to-indigo-500";
    
  return (
    <motion.div
      ref={containerRef}
      className={`relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Luxury background with dynamic movement */}
      <motion.div 
        className="absolute inset-0 z-0 bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
      >
        {/* Premium gradient background with subtle motion */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-br ${gradientColors} opacity-70`}
          style={{ x: bgX, y: bgY }}
        />
        
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Animated grid pattern */}
          <motion.div 
            className="absolute inset-0" 
            style={{
              backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
              backgroundSize: '72px 72px',
              x: useTransform(springX, [-1, 1], [-5, 5]),
              y: useTransform(springY, [-1, 1], [-5, 5]),
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            transition={{ duration: 2, delay: 0.5 }}
          />
          
          {/* Premium particle effect */}
          {!isReducedMotion && (
            <div className="absolute inset-0 z-0">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: Math.random() * 6 + 2,
                    height: Math.random() * 6 + 2,
                    top: `${Math.random() * 100}%`,
                    left: `${Math.random() * 100}%`,
                    background: `linear-gradient(to right, ${
                      Math.random() > 0.5 ? 'rgba(156, 163, 175, 0.3)' : 'rgba(139, 92, 246, 0.3)'
                    })`,
                    boxShadow: '0 0 10px rgba(255,255,255,0.2)',
                    willChange: 'transform',
                  }}
                  animate={{
                    y: [0, Math.random() * -150 - 50],
                    x: [0, Math.random() * 100 - 50],
                    opacity: [0, 0.8, 0],
                    scale: [0, 1, 0.5],
                  }}
                  transition={{
                    duration: Math.random() * 8 + 12,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: Math.random() * 5,
                  }}
                />
              ))}
            </div>
          )}
          
          {/* 3D Rotating Carousel */}
          <div 
            ref={carouselRef}
            className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none"
            style={{
              perspective: "1200px",
            }}
          >
            {/* This is the actual 3D carousel that will rotate continuously */}
            <div 
              className="relative" 
              style={{
                width: '600px',
                height: '600px',
                transformStyle: 'preserve-3d',
                transform: `rotateY(${carouselRotation}deg)`,
                transition: 'transform 0.05s linear',
              }}
            >
              {studyImages.map((image, index) => {
                // Calculate position on a circle
                const theta = (2 * Math.PI / studyImages.length) * index;
                const radius = 300; // Distance from center
                
                // Calculate 3D position
                const x = radius * Math.sin(theta);
                const z = radius * Math.cos(theta);
                
                // Calculate if the image is facing front (visible)
                // This helps with applying different styling to visible vs. hidden faces
                const angleToFront = Math.abs(((carouselRotation + (360 / studyImages.length) * index) % 360) - 180);
                const isFacingFront = angleToFront < 90; // within 90 degrees of facing front
                
                return (
                  <motion.div
                    key={index}
                    className="absolute left-0 top-0 w-64 h-40 rounded-xl shadow-2xl overflow-hidden pointer-events-auto"
                    style={{
                      transformStyle: 'preserve-3d',
                      transform: `translateX(${x}px) translateZ(${z}px) rotateY(${-theta * (180/Math.PI)}deg)`,
                      opacity: isFacingFront ? 0.8 : 0.3,
                      filter: `blur(${isFacingFront ? 0 : 3}px)`,
                      zIndex: isFacingFront ? 10 : 1,
                      transition: 'opacity 0.3s, filter 0.3s',
                      willChange: 'transform, opacity, filter',
                    }}
                    onMouseEnter={() => setHoveredImage(index)}
                    onMouseLeave={() => setHoveredImage(null)}
                  >
                    {/* Image container with enhanced effects */}
                    <div className="relative w-full h-full overflow-hidden">
                      {/* The actual image */}
                      <img 
                        src={image.src} 
                        alt={image.alt} 
                        className="w-full h-full object-cover"
                      />
                      
                      {/* Overlay with category info */}
                      <motion.div 
                        className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent 
                                 flex flex-col justify-end p-4"
                        animate={{
                          opacity: hoveredImage === index ? 1 : 0.7,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        <motion.h4 
                          className="text-white text-lg font-bold"
                          animate={{
                            y: hoveredImage === index ? 0 : 10,
                            opacity: hoveredImage === index ? 1 : 0.7,
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {image.category}
                        </motion.h4>
                      </motion.div>
                      
                      {/* Highlight effect for the hovered image */}
                      {hoveredImage === index && (
                        <motion.div 
                          className="absolute inset-0 border-2 border-white rounded-xl"
                          initial={{ opacity: 0 }}
                          animate={{ 
                            opacity: [0, 0.8, 0],
                          }}
                          transition={{ 
                            duration: 2,
                            repeat: Infinity,
                          }}
                        />
                      )}
                      
                      {/* Shine effect that moves across the image */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-tr from-transparent via-white to-transparent opacity-0"
                        style={{
                          mixBlendMode: 'overlay',
                        }}
                        animate={{
                          opacity: hoveredImage === index ? [0, 0.4, 0] : 0,
                          left: hoveredImage === index ? ['-100%', '100%', '100%'] : '-100%',
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: hoveredImage === index ? Infinity : 0,
                          repeatDelay: 2,
                        }}
                      />
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
          
          {/* Subtle glow effect */}
          <motion.div
            className="absolute w-[60vw] h-[60vh] rounded-full filter blur-[150px] opacity-15 bg-indigo-900"
            style={{
              top: '40%',
              left: '50%',
              x: '-50%',
              y: '-50%',
              transform: 'translate3d(-50%, -50%, 0)',
            }}
          />
        </div>
      </motion.div>
      
      {/* Custom interactive cursor for premium feel */}
      {isHovering && !isReducedMotion && (
        <motion.div 
          className="fixed w-12 h-12 rounded-full pointer-events-none z-50 flex items-center justify-center text-white mix-blend-difference"
          animate={{
            x: mousePosition.x - 24,
            y: mousePosition.y - 24,
            scale: [1, 1.2, 1],
          }}
          transition={{
            type: "spring",
            mass: 0.1,
            damping: 10,
            stiffness: 100,
            restDelta: 0.001
          }}
        >
          <div className="w-4 h-4 rounded-full border border-white" />
        </motion.div>
      )}
      
      {/* Main Content Container */}
      <div className="max-w-7xl w-full mx-auto px-6 z-10 relative flex flex-col lg:flex-row items-center justify-between">
        {/* Text Content */}
        <motion.div 
          className="w-full lg:w-3/5 pt-10 lg:pt-0"
          style={{
            x: textX,
            y: textY
          }}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          {/* Welcome text with emerging animation */}
          <motion.div 
            className="overflow-hidden mb-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.2, delay: 0.3 }}
          >
            <motion.p
              className="text-lg md:text-xl text-gray-300"
              initial={{ y: 40 }}
              animate={{ y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              Welcome, I'm
            </motion.p>
          </motion.div>
          
          {/* Name with 3D hover effect */}
          <div className="overflow-hidden perspective-1000">
            <motion.h1
              ref={textRef}
              className="text-5xl md:text-7xl font-extrabold tracking-tight mb-4"
              style={{
                backgroundImage: `linear-gradient(to right, #fff, #f0f0f0)`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                willChange: 'transform',
                transformStyle: 'preserve-3d',
              }}
              onMouseMove={handleTextEffect}
              onMouseLeave={() => {
                if (textRef.current) {
                  textRef.current.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
                }
              }}
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1, 
                delay: 0.5,
                type: "spring", 
                stiffness: 100 
              }}
            >
              Kirthik Ramadoss
            </motion.h1>
          </div>
          
          {/* Animated profession carousel */}
          <div className="h-14 md:h-16 overflow-hidden mb-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeIndex}
                initial={{ y: 40, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -40, opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              >
                <h2 className={`text-2xl md:text-3xl font-light bg-gradient-to-r ${accentGradient} bg-clip-text text-transparent`}>
                  {phrases[activeIndex]}
                </h2>
              </motion.div>
            </AnimatePresence>
          </div>
          
          {/* Bio with character-by-character animation */}
          <div className="max-w-2xl">
            <motion.p
              className="text-gray-300 text-lg leading-relaxed mb-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 1.2 }}
            >
              {isLoaded && "Building exceptional digital experiences with cutting-edge technologies. Passionate about clean designs and intuitive user experiences that deliver real value.".split('').map((char, i) => (
                <motion.span
                  key={i}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.03, delay: 1.2 + i * 0.012 }}
                >
                  {char}
                </motion.span>
              ))}
            </motion.p>
          </div>
          
          {/* Action buttons with premium styling */}
          <motion.div 
            className="flex flex-wrap gap-4 mb-12 lg:mb-0"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.7 }}
          >
            <motion.button
              className="group relative overflow-hidden px-8 py-3 bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-full text-white font-medium hover:border-opacity-30 transition-all"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span className="relative z-10">Explore My Work</span>
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                initial={{ scale: 0, x: "-100%" }}
                whileHover={{ scale: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              />
            </motion.button>
            
            <motion.button
              className="group relative px-8 py-3 rounded-full border border-white border-opacity-20 text-white font-medium transition-all hover:bg-white hover:bg-opacity-5"
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              <span>Contact Me</span>
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
      
      {/* Luxury scroll indicator */}
      <motion.div
        className="absolute bottom-6 left-1/2 transform -translate-x-1/2 z-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 2.4 }}
      >
        <ScrollLink
          to="about"
          smooth={true}
          duration={800}
          className="flex flex-col items-center cursor-pointer group"
        >
          <motion.p
            className="text-sm text-gray-400 mb-2 tracking-widest uppercase"
            animate={{ opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Scroll
          </motion.p>
          <motion.div
            className="w-10 h-14 border-2 border-gray-400 rounded-full flex items-start justify-center pt-2 group-hover:border-white transition-colors duration-300"
            whileHover={{ scale: 1.1 }}
          >
            <motion.div
              className="w-2 h-2 bg-gray-400 rounded-full group-hover:bg-white transition-colors duration-300"
              animate={{
                y: [0, 16, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            />
          </motion.div>
        </ScrollLink>
      </motion.div>
    </motion.div>
  );
};

export default memo(UltraPremiumHeroSection);
