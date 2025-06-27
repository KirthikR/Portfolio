import { motion, useScroll, useSpring, useTransform, useReducedMotion } from 'framer-motion';
import { Link as ScrollLink, Element, Events } from 'react-scroll';
import { useState, useCallback, lazy, memo, useMemo, useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Briefcase, GraduationCap, Code, Cpu, Database, Globe, Phone, MapPin, Send, Sun, Moon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from './hooks/useMediaQuery';
import { withPerformanceOptimizations } from './performance/withPerformanceOptimizations';
import { ScrollOptimizationProvider } from './context/ScrollOptimizationContext';
import { CookieConsentProvider } from './context/CookieConsentContext';
import CookiesConsentBanner from './components/CookiesConsentBanner';
import CookieSettings from './components/CookieSettings';
import LuxuryAboutSection from './components/LuxuryAboutSection';
import OptimizedSkillsSection from './components/OptimizedSkillsSection';
import { AnimatePresence, LayoutGroup, useMotionValue } from 'framer-motion';
import UltraPremiumHeroSection from './components/UltraPremiumHeroSection';
import IntroScreen from './components/IntroScreen';

// === PERFORMANCE OPTIMIZATIONS ===

// Implement a global performance monitoring utility
const PerformanceMonitor = {
  frameDrops: 0,
  lastFrameTime: 0,
  
  init() {
    if (typeof window !== 'undefined') {
      this.lastFrameTime = performance.now();
      this.monitorFrameRate();
    }
  },
  
  monitorFrameRate() {
    const checkFrame = () => {
      const now = performance.now();
      const delta = now - this.lastFrameTime;
      
      // Frame drop detected (assuming 60fps, so frames should be ~16.7ms)
      if (delta > 50) { // More than 3 frames dropped
        this.frameDrops++;
        console.debug(`Frame drop detected: ${Math.round(delta)}ms (${this.frameDrops} total)`);
        
        // If too many frame drops, reduce animation complexity
        if (this.frameDrops > 5 && window.__REDUCE_ANIMATION_COMPLEXITY !== true) {
          console.debug('Reducing animation complexity due to performance issues');
          window.__REDUCE_ANIMATION_COMPLEXITY = true;
        }
      }
      
      this.lastFrameTime = now;
      requestAnimationFrame(checkFrame);
    };
    
    requestAnimationFrame(checkFrame);
  }
};

// Global variable to track if we should reduce animation complexity
if (typeof window !== 'undefined') {
  window.__REDUCE_ANIMATION_COMPLEXITY = false;
}

// Request idle callback polyfill
const requestIdleCallback = 
  typeof window !== 'undefined' 
    ? window.requestIdleCallback || 
      ((cb) => setTimeout(cb, 1))
    : (cb) => setTimeout(cb, 1);

// Image preloader function - preload critical images during idle time
const preloadCriticalImages = () => {
  if (typeof window === 'undefined') return;
  
  const criticalImageUrls = [
    "https://logos-world.net/wp-content/uploads/2023/01/British-Airways-Logo.png",
    "https://d3njjcbhbojbot.cloudfront.net/api/utilities/v1/imageproxy/https://images.ctfassets.net/wp1lcwdav1p1/6JHlaxZYPoTNb5sALLJ2lY/3d3c073c368b63a7f7645fd0a06ea4cf/BA_VEP_Thumbnail_Design.png?w=1500&h=680&q=60&fit=fill&f=faces&fm=jpg&fl=progressive&auto=format%2Ccompress&dpr=1&w=1000&h=",
    // Add other critical images
  ];
  
  requestIdleCallback(() => {
    criticalImageUrls.forEach(url => {
      const img = new Image();
      img.src = url;
    });
  });
};

// Scroll optimization helper - creates a passive, throttled scroll handler
const createOptimizedScrollHandler = (callback, delay = 100) => {
  if (typeof window === 'undefined') return () => {};
  
  let waiting = false;
  let lastArgs = null;
  
  const timeoutFunc = () => {
    if (lastArgs) {
      callback(...lastArgs);
      lastArgs = null;
      setTimeout(timeoutFunc, delay);
    } else {
      waiting = false;
    }
  };
  
  return (...args) => {
    if (waiting) {
      lastArgs = args;
      return;
    }
    
    callback(...args);
    waiting = true;
    setTimeout(timeoutFunc, delay);
  };
};

// === OPTIMIZED COMPONENT IMPORTS ===

// Lazy load heavy components with appropriate loading states and better chunking
const OptimizedFloatingBubbles = lazy(() => 
  import('./components/OptimizedFloatingBubbles')
    .then(module => {
      // Log load complete for debugging
      console.debug('Loaded OptimizedFloatingBubbles component');
      return module;
    })
);

const OptimizedProfessionalNameAnimation = lazy(() => 
  import('./components/OptimizedProfessionalNameAnimation')
    .then(module => {
      console.debug('Loaded OptimizedProfessionalNameAnimation component');
      return module;
    })
);

// === OPTIMIZED DATA HANDLING ===

// Memoize static data to prevent recreating on each render
const experiences = [
  {
    title: "Senior Software Engineer",
    company: "Tech Corp",
    period: "2021 - Present",
    description: "Led development of enterprise applications using React and Node.js",
    type: "work"
  },
  {
    title: "Full Stack Developer",
    company: "Digital Solutions Inc",
    period: "2019 - 2021",
    description: "Developed and maintained multiple client projects",
    type: "work"
  },
  {
    title: "Master's in Data Science",
    company: "University of Essex",
    period: "2023 - 2024",
    description: "Specialized in Software Engineering",
    type: "education"
  },
];

const skills = [
  { name: "Frontend Development", icon: <Globe className="w-6 h-6" />, level: 90 },
  { name: "Backend Development", icon: <Database className="w-6 h-6" />, level: 85 },
  { name: "Cloud Architecture", icon: <Cpu className="w-6 h-6" />, level: 80 },
  { name: "System Design", icon: <Code className="w-6 h-6" />, level: 85 },
];

const projects = [
  {
    id: "proj1",
    title: "Flight Booking Website",
    description: "Built a full-stack Flightbooking platform using React, Node.js, Javascript and API Integration ",
    image: "https://images.unsplash.com/photo-1499063078284-f78f7d89616a?auto=format&fit=crop&q=80&w=1200",
    link: "#",
    github: "https://github.com/KirthikR/Skyjourney_app",
    category: "fullstack",
    technologies: ["React", "Node.js", "MongoDB", "Express"]
  },
  {
    id: "proj2",
    title: "Data Visualization And Analysis",
    description: "Created a data visualization and analysis using python and plotly",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200",
    link: "#",
    github: "https://github.com/KirthikR/MA304-DATA-VISUALISATION-ASSIGNMENT",
    category: "frontend",
    technologies: ["Python", "Pandas", "Plotly", "Matplotlib", "Seaborn", "Numpy", "Sckit_learn"]
  },
  {
    id: "proj3",
    title: "Heart Disease prediction",
    description: "created a heart disease prediction model using python and machine learning",
    image: "https://images.unsplash.com/photo-1576091160550-2173dba999ef?auto=format&fit=crop&q=80&w=1200",
    link: "#",
    github: "https://github.com/KirthikR/Heart-disease-prediction-using-combined-ML-and-DL-models",
    category: "data",
    technologies: ["python", "Machine Learning", "Pandas", "Numpy", "Tensorflow"]
  },
  {
    id: "proj4",
    title: "Mobile Fitness App",
    description: "Cross-platform mobile application for fitness tracking and meal planning",
    image: "https://images.unsplash.com/photo-1605296867724-fa87a8ef53fd?auto=format&fit=crop&q=80&w=1200",
    link: "https://kirthikfitnesspro.netlify.app/",
    github: "https://github.com/KirthikR/Fitness_app",
    category: "mobile",
    technologies: ["React Native", "Firebase", "Redux", "HealthKit"]
  },
 {
  id: "proj5",
    title: "Real-time stock market Dashboard with Forecasting",
    description: " Developed a real-time stock market dashboard with forecasting capabilities using python,streamlit,react, and various APIs, enabling users to track stock prices, visualize trends and make infromed decisions",
    image: "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    link: "https://livestockmarket.netlify.app",
    github: "https://github.com/KirthikR/Real-Time-Stock-Market-Dashboard-with-Forecasting",
    category: "mobile",
    technologies: ["react", "streamlit", "python", "APIs", "data visualizations", "forecasting", "real-time data", "tailwind.css"]
  },
  {
    id: "proj6",
  title: "Healthchechup-AI Powered Health Assistant",
  description: "Built an AI powered health assistant that provides personalized health recommendations and tracks user health data using react, node.js, and various apis, enabling users to manage their health effectively",
  image: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80", 
  link: "https://healthcheckupai.netlify.app/dashboard",
  github: "https://github.com/KirthikR/Healthcheckup-AI-application",
  category: "webapplication",
  technologies: ["Node.js", "React", "tailwind.css", "APIs", "AI", "supabase", "Health data management", "Framer Motion", "React Three Fiber", "React Query", "Machine Learning", "Data Visualization", "Real-time Data", "Responsive Design", "Computer Vision (POC)", "REST APIs", "ChatGPT", "OpenAI", "Firebase", "Stripe"]
  }
];

const testimonials = [
  {
    name: "Jane Doe",
    role: "Product Manager",
    feedback: "Kirthik is an exceptional developer who consistently delivers high-quality work on time.",
    image: "https://via.placeholder.com/150"
  },
  {
    name: "John Smith",
    role: "CTO",
    feedback: "His expertise in full-stack development has been invaluable to our projects.",
    image: "https://via.placeholder.com/150"
  }
];

const services = [
  {
    title: "Web Development",
    description: "Building responsive and modern web applications.",
    icon: <Code className="w-10 h-10 text-blue-500" />
  },
  {
    title: "Cloud Solutions",
    description: "Designing scalable cloud architectures.",
    icon: <Cpu className="w-10 h-10 text-green-500" />
  },
  {
    title: "UI/UX Design",
    description: "Creating user-friendly and visually appealing designs.",
    icon: <Globe className="w-10 h-10 text-purple-500" />
  }
];

const blogs = [
  {
    title: "Understanding React Hooks",
    description: "A deep dive into React Hooks and how to use them effectively.",
    link: "#",
    date: "March 10, 2023"
  },
  {
    title: "Scaling Applications with Microservices",
    description: "Learn how to scale your applications using microservices architecture.",
    link: "#",
    date: "February 25, 2023"
  }
];

// Memoize components that don't need frequent updates
const SkillBar = memo(function SkillBar({ skill, index }: { skill: any; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, x: -50 }}
      animate={inView ? { opacity: 1, x: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="mb-6"
    >
      <div className="flex items-center mb-2">
        <div className="p-2 rounded-full bg-blue-100 mr-3">
          {skill.icon}
        </div>
        <span className="font-medium text-gray-700">{skill.name}</span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full">
        <motion.div
          initial={{ width: 0 }}
          animate={inView ? { width: `${skill.level}%` } : {}}
          transition={{ duration: 1, delay: index * 0.2 }}
          className="h-full bg-blue-500 rounded-full"
        />
      </div>
    </motion.div>
  );
});

const TimelineItem = memo(function TimelineItem({ experience, index }: { experience: any; index: number }) {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 50 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className="flex gap-4 relative"
    >
      <div className="flex flex-col items-center">
        <div className={`p-2 rounded-full ${experience.type === 'work' ? 'bg-blue-500' : 'bg-green-500'}`}>
          {experience.type === 'work' ? <Briefcase className="w-5 h-5 text-white" /> : <GraduationCap className="w-5 h-5 text-white" />}
        </div>
        {index !== experiences.length - 1 && <div className="w-0.5 h-full bg-gray-200 mt-2"></div>}
      </div>
      <div className="pb-8">
        <h3 className="text-xl font-bold text-gray-900">{experience.title}</h3>
        <p className="text-gray-600 font-medium">{experience.company}</p>
        <p className="text-sm text-gray-500">{experience.period}</p>
        <p className="mt-2 text-gray-700">{experience.description}</p>
      </div>
    </motion.div>
  );
});

// Create a minimal fallback for suspense
const MinimalFallback = () => (
  <div className="w-full h-full bg-gray-900 flex items-center justify-center">
    <div className="w-12 h-12 border-t-2 border-blue-500 rounded-full animate-spin"></div>
  </div>
);

// Testimonial Card Component with futuristic design
const TestimonialCard = memo(function TestimonialCard({ 
  name, 
  role, 
  feedback, 
  image, 
  delay, 
  gradient,
  icon
}: { 
  name: string; 
  role: string; 
  feedback: string; 
  image: string; 
  delay: number;
  gradient: string;
  icon: string;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Icon based on testimonial type
  const renderIcon = useCallback(() => {
    switch (icon) {
      case 'tech':
        return <Cpu className="w-5 h-5 text-white" />;
      case 'product':
        return <Briefcase className="w-5 h-5 text-white" />;
      case 'data':
        return <Database className="w-5 h-5 text-white" />;
      case 'research':
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'mobile':
        return <Globe className="w-5 h-5 text-white" />;
      default:
        return <Code className="w-5 h-5 text-white" />;
    }
  }, [icon]);

  return (
    <motion.div
      ref={ref}
      variants={{
        hidden: { opacity: 0, y: 30 },
        show: { 
          opacity: 1, 
          y: 0,
          transition: { 
            type: "spring",
            stiffness: 100,
            duration: 0.8, 
            delay 
          }
        }
      }}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <motion.div 
        className={`h-full relative overflow-hidden rounded-2xl backdrop-blur-sm bg-white/5 p-6 border border-white/10 flex flex-col`}
        animate={isHovered ? { y: -8, boxShadow: '0 20px 30px -10px rgba(0,0,0,0.3)' } : {}}
        transition={{ duration: 0.4 }}
      >
        {/* Animated gradient outline when hovered */}
        <motion.div
          className={`absolute inset-0 bg-gradient-to-r ${gradient} rounded-2xl opacity-0`}
          animate={{ opacity: isHovered ? 0.1 : 0 }}
          transition={{ duration: 0.3 }}
        />
        
        {/* Animated corner accent */}
        <div className="absolute -top-8 -right-8 w-24 h-24">
          <motion.div 
            className={`absolute inset-0 bg-gradient-to-br ${gradient} rounded-full opacity-40 blur-md`}
            animate={{
              scale: isHovered ? [1, 1.2, 1] : 1,
              opacity: isHovered ? [0.3, 0.5, 0.3] : 0.3
            }}
            transition={{
              duration: 2,
              repeat: isHovered ? Infinity : 0,
              repeatType: "reverse"
            }}
          />
        </div>
        
        {/* Quote marks */}
        <div className="absolute top-5 left-5 text-5xl opacity-10 leading-none font-serif text-white">"</div>
        
        {/* Content */}
        <div className="flex-1">
          {/* Testimonial text */}
          <p className="text-gray-200 mb-6 relative z-10 leading-relaxed">
            {feedback}
          </p>
        </div>
        
        {/* Persona */}
        <div className="flex items-center mt-4">
          {/* Image with animated border */}
          <div className="relative mr-4">
            <motion.div
              className={`absolute -inset-0.5 rounded-full bg-gradient-to-r ${gradient} opacity-70`}
              animate={{
                rotate: isHovered ? 360 : 0
              }}
              transition={{
                duration: 3,
                ease: "linear",
                repeat: isHovered ? Infinity : 0
              }}
            />
            <img 
              src={image} 
              alt={name}
              className="w-14 h-14 rounded-full object-cover border-2 border-black relative z-10"
            />
            
            {/* Icon badge */}
            <div className={`absolute -bottom-1 -right-1 p-1.5 rounded-full bg-gradient-to-r ${gradient} z-20 flex items-center justify-center`}>
              {renderIcon()}
            </div>
          </div>
          
          <div>
            <motion.h4 
              className="font-semibold text-white text-base"
              animate={{ 
                color: isHovered ? "#fff" : "#f5f5f5",
                textShadow: isHovered ? "0 0 8px rgba(255,255,255,0.3)" : "none"
              }}
            >
              {name}
            </motion.h4>
            <p className="text-sm text-gray-400">{role}</p>
          </div>
        </div>
        
        {/* Futuristic decorative element */}
        <motion.div
          className="absolute bottom-3 right-3 h-8 w-12 opacity-20"
          style={{
            background: `linear-gradient(45deg, transparent 40%, rgba(255,255,255,0.8) 40%, rgba(255,255,255,0.8) 60%, transparent 60%)`,
          }}
          animate={{ opacity: isHovered ? [0.2, 0.4, 0.2] : 0.2 }}
          transition={{ 
            duration: 2, 
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse" 
          }}
        />
      </motion.div>
    </motion.div>
  );
});

// Add this after TestimonialCard component definition
const CertificateCard = memo(function CertificateCard({ 
  title, 
  issuer, 
  date, 
  credentialId,
  description,
  image,
  featured = false,
  glowColor,
  iconSet = []
}: { 
  title: string;
  issuer: string;
  date: string;
  credentialId: string;
  description: string;
  image: string;
  featured?: boolean;
  glowColor: string;
  iconSet: string[];
}) {
  const [isHovered, setIsHovered] = useState(false);
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1
  });

  // Icon rendering based on type
  const renderIcon = useCallback((type: string) => {
    switch (type) {
      case 'ai':
        return (
          <div className="p-1.5 rounded-full bg-indigo-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-indigo-200">
              <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm-1 16v-5H8l4-7v5h3l-4 7z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'cloud':
        return (
          <div className="p-1.5 rounded-full bg-blue-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-blue-200">
              <path d="M6.5 20q-2.3 0-3.9-1.6T1 14.5q0-2 1.15-3.6T5 9.05q.75-2.3 2.7-3.65T12 4q2.55 0 4.525 1.5T19.3 9.3q2.3.35 3.5 1.975T24 15q0 2.075-1.463 3.538T19 20H6.5z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'code':
        return (
          <div className="p-1.5 rounded-full bg-emerald-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-emerald-200">
              <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'security':
        return (
          <div className="p-1.5 rounded-full bg-red-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-red-200">
              <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 10.99h7c-.53 4.12-3.28 7.79-7 8.94V12H5V6.3l7-3.11v8.8z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'chart':
        return (
          <div className="p-1.5 rounded-full bg-amber-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-amber-200">
              <path d="M3.5 18.5l6-6 4 4L22 6.92 20.59 5.5l-8.09 8.09-4-4-7 7z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'data':
        return (
          <div className="p-1.5 rounded-full bg-purple-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-purple-200">
              <path d="M12 3C7.58 3 4 4.79 4 7v10c0 2.21 3.59 4 8 4s8-1.79 8-4V7c0-2.21-3.58-4-8-4zm0 2c3.87 0 6 1.5 6 2s-2.13 2-6 2-6-1.5-6-2 2.13-2 6-2zm0 14c-3.87 0-6-1.5-6-2v-7.18c1.34.84 3.49 1.18 6 1.18 2.51 0 4.66-.34 6-1.18V17c0 .5-2.13 2-6 2z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'web':
        return (
          <div className="p-1.5 rounded-full bg-teal-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-teal-200">
              <path d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zm6.93 6h-2.95A15.65 15.65 0 0014.9 4.46c2.12.71 3.9 2.24 4.92 4.07zM12 4.04c.83 1.2 1.48 2.53 1.91 3.96h-3.82c.43-1.43 1.08-2.76 1.91-3.96zM4.26 14C4.1 13.36 4 12.69 4 12s.1-1.36.26-2h3.38c-.08.66-.14 1.32-.14 2s.06 1.34.14 2H4.26zm.82 2h2.95c.32 1.25.78 2.45 1.38 3.56-2.12-.72-3.9-2.25-4.93-4.08zm2.95-8H5.08c1.03-1.83 2.8-3.36 4.93-4.07C9.41 5.55 8.95 6.75 8.63 8zM12 19.96c-.83-1.2-1.48-2.53-1.91-3.96h3.82c-.43 1.43-1.08 2.76-1.91 3.96zM14.34 14H9.66c-.09-.66-.16-1.32-.16-2s.07-1.35.16-2h4.68c.09.65.16 1.32.16 2s-.07 1.34-.16 2zm.25 5.56c.6-1.11 1.06-2.31 1.38-3.56h2.95c-1.02 1.82-2.8 3.35-4.93 4.07zM16.36 14c.08-.66.14-1.32.14-2s-.06-1.34-.14-2h3.38c.16.64.26 1.31.26 2s-.1 1.36-.26 2h-3.38z" fill="currentColor"/>
            </svg>
          </div>
        );
      case 'mobile':
        return (
          <div className="p-1.5 rounded-full bg-pink-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-pink-200">
              <path d="M17 1.01L7 1c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h10c1.1 0 2-.9 2-2V3c0-1.1-.9-1.99-2-1.99zM17 19H7V5h10v14z" fill="currentColor"/>
            </svg>
          </div>
        );
      default:
        return (
          <div className="p-1.5 rounded-full bg-gray-900/80">
            <svg viewBox="0 0 24 24" fill="none" className="h-4 w-4 text-gray-200">
              <path d="M20 3h-4v2h4v18H4V5h4V3H4c-1.1 0-2 .9-2 2v18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" fill="currentColor"/>
              <path d="M17 13H12c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" />
              <path d="M12 17H7c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" />
            </svg>
          </div>
        );
    }
  }, []);

  return (
    <motion.div
      ref={ref}
      className="h-full"
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Main Card - Glass morphism */}
      <motion.div 
        className={`relative rounded-2xl p-6 h-full backdrop-blur-sm bg-white/[0.03] bg-opacity-5 border border-white/10 overflow-hidden group
          shadow-[0_8px_32px_0_rgba(0,0,0,0.36)] ${featured ? '' : ''}`}
        animate={isHovered ? { 
          y: -10,
          boxShadow: '0 30px 60px -12px rgba(0,0,0,0.7), 0 18px 36px -18px rgba(0,0,0,0.7)',
          backdropFilter: 'blur(20px)'
        } : {}}
        transition={{ 
          duration: 0.3,
          type: "spring",
          stiffness: 500,
          damping: 30
        }}
        style={{ 
          transform: "translateZ(0)",
          backfaceVisibility: "hidden"
        }}
      >
        {/* Animated border gradient */}
        <motion.div
          className={`absolute inset-0 rounded-2xl bg-gradient-to-r ${glowColor} opacity-0 -z-10`}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Animated glow effect on hover */}
        <motion.div 
          className={`absolute -inset-1 bg-gradient-to-r ${glowColor} opacity-0 blur-xl rounded-xl -z-10`}
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 0.2 : 0 }}
          transition={{ duration: 0.3 }}
        />

        {/* Floating holographic badge */}
        <motion.div 
          className="absolute top-4 right-4 opacity-80"
          animate={isHovered ? { 
            y: [0, -5, 0], 
            rotateZ: [0, 5, 0],
          } : {}}
          transition={{ 
            duration: 3, 
            repeat: isHovered ? Infinity : 0,
            repeatType: "reverse",
            ease: "easeInOut"
          }}
        >
          <div className={`w-16 h-16 rounded-full bg-gradient-to-r ${glowColor} flex items-center justify-center relative overflow-hidden`}>
            <div className="text-xs font-bold text-white uppercase tracking-wider text-center">Verified</div>
            {/* Holographic effect */}
            <motion.div
              className="absolute inset-0 opacity-50 bg-gradient-to-tr from-white/20 to-transparent"
              animate={{
                backgroundPosition: ['0% 0%', '100% 100%'],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                repeat: Infinity,
                repeatType: "mirror",
                duration: 3
              }}
              style={{
                backgroundSize: '200% 200%'
              }}
            />
            {/* Scanning line effect */}
            <motion.div
              className="absolute inset-0 w-full h-[2px] bg-white/80 blur-[1px]"
              animate={{
                top: ['0%', '100%', '0%'],
              }}
              transition={{
                repeat: Infinity,
                duration: 2.5,
                ease: "linear"
              }}
            />
          </div>
        </motion.div>
        
        <div className="flex flex-col h-full">
          <motion.div 
            className="mb-6 flex items-center"
            animate={isHovered ? { y: 0 } : { y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="mr-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${glowColor} bg-opacity-20 w-12 h-12 flex items-center justify-center relative group-hover:shadow-lg`}>
                {/* Add an appropriate icon for the certification, you can replace this */}
                <div className="opacity-80">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" className="text-white">
                    <path d="M20 3h-1V1h-2v2H7V1H5v2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 18H4V8h16v13z" fill="currentColor"/>
                    <path d="M17 13H12c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" />
                    <path d="M12 17H7c-.55 0-1-.45-1-1s.45-1 1-1h5c.55 0 1 .45 1 1s-.45 1-1 1z" fill="currentColor" />
                  </svg>
                </div>
                {/* Pulsing effect */}
                <motion.div 
                  className="absolute inset-0 rounded-lg opacity-0"
                  animate={{
                    boxShadow: ['0 0 0 0px rgba(255,255,255,0)', '0 0 0 3px rgba(255,255,255,0.3)', '0 0 0 10px rgba(255,255,255,0)'],
                    opacity: [0, 0.5, 0]
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    delay: 1
                  }}
                />
              </div>
            </div>

            <div>
              {/* Title with mask effect on hover */}
              <div className="overflow-hidden">
                <motion.h3 
                  className={`font-bold text-xl md:text-2xl text-white tracking-tight`}
                  animate={{ y: isHovered ? [0, 0] : 0 }}
                  transition={{ duration: 0.4 }}
                >
                  {title}
                </motion.h3>
              </div>
              
              <div className="flex items-center mt-1">
                <p className="text-sm text-blue-300">{issuer}</p>
                <div className="mx-2 w-1 h-1 bg-blue-500/50 rounded-full"></div>
                <p className="text-sm text-gray-400">{date}</p>
              </div>
            </div>
          </motion.div>
          
          <div className="flex-grow relative">
            {/* Description */}
            <p className="text-gray-300 text-sm mb-4 leading-relaxed">
              {description}
            </p>
            
            {/* Credential ID */}
            <div className="text-xs text-gray-400 font-mono backdrop-blur-sm bg-white/5 py-2 px-3 rounded inline-flex items-center">
              <span className="mr-2">Credential ID:</span>
              <span className="text-indigo-300">{credentialId}</span>
            </div>
            
            {/* Skills/technologies tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {iconSet.map((icon, i) => (
                <motion.div
                  key={`${icon}-${i}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    delay: 0.5 + i * 0.1,
                    type: "spring",
                    stiffness: 500,
                  }}
                >
                  {renderIcon(icon)}
                </motion.div>
              ))}
            </div>
          </div>
          
          {/* Verification button/link */}
          <motion.div 
            className="mt-6 pt-4 border-t border-white/5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              delay: 0.7,
              duration: 0.5
            }}
          >
            <motion.button
              className={`px-4 py-2 rounded-lg bg-gradient-to-r ${glowColor} text-white text-sm font-medium w-full flex items-center justify-center space-x-2 relative overflow-hidden group`}
              whileHover={{ 
                boxShadow: `0 0 20px 2px rgba(120, 100, 255, 0.3)`,
              }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.2 }}
            >
              <span>Verify Certificate</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              
              {/* Animated shine effect */}
              <motion.div 
                className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"
                animate={{ left: ['0%', '150%'] }}
                transition={{
                  repeat: Infinity,
                  repeatDelay: 3,
                  duration: 1.5,
                  ease: "easeInOut"
                }}
              />
            </motion.button>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
});

const EnhancedProjectSection = memo(function EnhancedProjectSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState<Record<string, boolean>>({});
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [visibleProjects, setVisibleProjects] = useState(projects);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const categories = useMemo(() => [
    { id: "all", name: "All Projects" },
    { id: "frontend", name: "Frontend" },
    { id: "fullstack", name: "Full-Stack" },
    { id: "data", name: "Data Science" },
    { id: "mobile", name: "Mobile" }
  ], []);

  const handleImageLoad = useCallback((id: string) => {
    setIsLoaded(prev => ({ ...prev, [id]: true }));
  }, []);

  // Filter projects when category changes
  useEffect(() => {
    if (selectedCategory === "all") {
      setVisibleProjects(projects);
    } else {
      setVisibleProjects(projects.filter(p => p.category === selectedCategory));
    }
    // Scroll to top of container when filtering changes
    if (containerRef.current) {
      containerRef.current.scrollTop = 0;
    }
  }, [selectedCategory]);

  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  return (
    <motion.section 
      id="projects"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : {}}
      transition={{ duration: 0.6 }}
      className="py-20 px-8 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
    >
      <motion.div 
        className="max-w-6xl mx-auto"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <motion.h2 
          className="text-4xl font-extrabold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500"
          animate={{ 
            textShadow: ["0px 0px 0px rgba(255, 0, 255, 0)", "0px 0px 10px rgba(255, 0, 255, 0.5)", "0px 0px 0px rgba(255, 0, 255, 0)"],
          }}
          transition={{ duration: 3, repeat: Infinity }}
        >
          Featured Projects
        </motion.h2>

        <motion.p 
          className="text-center text-gray-400 mb-12 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Explore my latest work across various technologies and domains
        </motion.p>

        {/* Category Filter */}
        <motion.div 
          className="flex flex-wrap justify-center gap-3 mb-12"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-4 py-2 rounded-full transition-all duration-300 ${
                selectedCategory === category.id
                ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-purple-500/30'
                : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>

        {/* Projects Grid */}
        <div ref={containerRef} className="relative">
          <LayoutGroup>
            <motion.div 
              layout 
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8 will-change-transform"
            >
              <AnimatePresence mode="sync">
                {visibleProjects.map((project, index) => (
                  <motion.div
                    layout
                    key={project.id}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ 
                      opacity: isLoaded[project.id] ? 1 : 0.5, 
                      y: 0,
                      transition: { duration: 0.6, delay: index * 0.15 }
                    }}
                    exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
                    whileHover={{ 
                      y: -10,
                      transition: { duration: 0.2 }
                    }}
                    className="relative group aspect-video bg-gradient-to-br from-gray-800 via-gray-700 to-gray-900 rounded-xl overflow-hidden shadow-xl"
                    style={{ willChange: "transform, opacity" }}
                    onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  >
                    {/* Background image with overlay */}
                    <div className="absolute inset-0 overflow-hidden">
                      <motion.div 
                        className="absolute inset-0 bg-black bg-opacity-20 z-10 group-hover:bg-opacity-10 transition-all duration-500"
                        whileHover={{ backgroundColor: "rgba(0,0,0,0.1)" }}
                      />
                      <motion.img 
                        src={project.image} 
                        alt={project.title} 
                        onLoad={() => handleImageLoad(project.id)}
                        className="w-full h-full object-cover transform duration-1000"
                        initial={{ scale: 1.1 }}
                        whileHover={{ scale: 1.15 }}
                        style={{ willChange: "transform" }}
                      />
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-20 h-full flex flex-col justify-end">
                      <motion.div 
                        layout
                        className={`p-6 ${expandedId === project.id ? 'bg-gradient-to-t from-black to-transparent via-black/80' : 'bg-gradient-to-t from-black to-transparent'}`}
                        initial={{ y: 40, opacity: 0.8 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                      >
                        <motion.h3 
                          layout="position"
                          className="text-xl md:text-2xl font-bold text-white mb-2"
                        >
                          {project.title}
                        </motion.h3>
                        
                        {/* Description - visible on hover or when expanded */}
                        <motion.div
                          layout
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: expandedId === project.id ? 1 : 0,
                            height: expandedId === project.id ? "auto" : 0,
                            transition: { duration: 0.3 }
                          }}
                          className="overflow-hidden"
                        >
                          <p className="text-gray-300 mb-4">{project.description}</p>
                          
                          {/* Technologies */}
                          <div className="flex flex-wrap gap-2 mb-4">
                            {project.technologies.map(tech => (
                              <span key={tech} className="px-2 py-1 text-xs rounded-full bg-purple-900/50 text-purple-200">
                                {tech}
                              </span>
                            ))}
                          </div>
                          
                          {/* Links */}
                          <div className="flex space-x-4">
                            <motion.a 
                              href={project.link} 
                              className="flex items-center space-x-1 text-blue-400 hover:text-blue-300"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Live Demo</span>
                              <ExternalLink className="w-4 h-4" />
                            </motion.a>
                            <motion.a 
                              href={project.github} 
                              className="flex items-center space-x-1 text-gray-400 hover:text-white"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <span>Code</span>
                              <Github className="w-4 h-4" />
                            </motion.a>
                          </div>
                        </motion.div>
                        
                        {/* Preview indicator - only visible when not expanded */}
                        <motion.p
                          initial={{ opacity: 0.6 }}
                          animate={{ 
                            opacity: expandedId === project.id ? 0 : 0.8,
                            height: expandedId === project.id ? 0 : "auto" 
                          }}
                          className="text-sm text-gray-400 italic cursor-pointer"
                        >
                          Click to see details
                        </motion.p>
                      </motion.div>
                    </div>
                    
                    {/* Animated border effect */}
                    <motion.div
                      className="absolute inset-0 border-2 border-transparent rounded-xl opacity-0 group-hover:opacity-100"
                      initial={{ opacity: 0 }}
                      whileHover={{ 
                        opacity: 1,
                        borderColor: "rgba(168, 85, 247, 0.5)", // Purple border
                        boxShadow: "0 0 20px 2px rgba(168, 85, 247, 0.3)",
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
          
          {/* Empty state when no projects match filter */}
          {visibleProjects.length === 0 && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12 text-gray-400"
            >
              No projects found in this category.
            </motion.div>
          )}
        </div>
        
        <motion.div 
          className="mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
        >
          <motion.a
            href="#"
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-full shadow-lg hover:shadow-purple-500/50"
            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(168, 85, 247, 0.5)" }}
            whileTap={{ scale: 0.98 }}
          >
            View All Projects <ExternalLink className="w-4 h-4 ml-2" />
          </motion.a>
        </motion.div>
      </motion.div>
    </motion.section>
  );
});

const EnhancedContactSection = memo(function EnhancedContactSection() {
  // State for form validation and submission
  const [formState, setFormState] = useState({
    name: '',
    email: '',
    message: '',
    nameValid: true,
    emailValid: true,
    messageValid: true,
    nameError: '',
    emailError: '',
    messageError: '',
    submitted: false,
    submitting: false,
    error: null as string | null
  });
  
  // Debounce validation to avoid excessive checks while typing
  const [debouncedName] = useState(formState.name);
  const [debouncedEmail] = useState(formState.email);
  
  // Mouse position for magnetic effect on button
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Transform mouse position to button movement with spring physics
  const buttonX = useSpring(useTransform(mouseX, [-100, 100], [-15, 15]), {
    stiffness: 200,
    damping: 15
  });
  const buttonY = useSpring(useTransform(mouseY, [-100, 100], [-10, 10]), {
    stiffness: 200,
    damping: 15
  });

  // Card hover effect state
  const [activeCard, setActiveCard] = useState<number | null>(null);

  // Intersection observer for section entry animation
  const [ref, inView] = useInView({
    triggerOnce: false,
    threshold: 0.2
  });
  
  // Validate name with specific error message
  const validateName = useCallback((name: string) => {
    if (name.trim() === '') {
      return { valid: false, error: 'Please enter your name' };
    }
    if (name.trim().length < 2) {
      return { valid: false, error: 'Name is too short' };
    }
    // Basic name validation - checks if name looks legitimate
    if (!/^[a-zA-Z]+(([',. -][a-zA-Z ])?[a-zA-Z]*)*$/.test(name.trim())) {
      return { valid: false, error: 'Please enter a valid name' };
    }
    return { valid: true, error: '' };
  }, []);
  
  // Validate email with specific error message
  const validateEmail = useCallback((email: string) => {
    if (email.trim() === '') {
      return { valid: false, error: 'Please enter your email address' };
    }
    // More comprehensive email validation pattern
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return { valid: false, error: 'Please enter a valid email address' };
    }
    return { valid: true, error: '' };
  }, []);
  
  // Validate message with specific error message
  const validateMessage = useCallback((message: string) => {
    if (message.trim() === '') {
      return { valid: false, error: 'Please enter your message' };
    }
    if (message.trim().length < 10) {
      return { valid: false, error: 'Your message is too short. Please provide more details.' };
    }
    return { valid: true, error: '' };
  }, []);
  
  // Contact cards data - updated with href links
  const contactCards = [
    {
      icon: <Phone className="w-6 h-6 text-white" />,
      title: "Phone",
      value: "+447901354115",
      color: "from-blue-600 to-indigo-600",
      delay: 0.1,
      href: "tel:+447901354115", // Phone protocol link
    },
    {
      icon: <Mail className="w-6 h-6 text-white" />,
      title: "Email",
      value: "kirthikramadoss@gmail.com",
      color: "from-purple-600 to-pink-600",
      delay: 0.2,
      href: "mailto:kirthikramadoss@gmail.com", // Email protocol link
    },
    {
      icon: <MapPin className="w-6 h-6 text-white" />,
      title: "Location",
      value: "London, UK",
      color: "from-emerald-500 to-teal-500",
      delay: 0.3,
      href: "https://www.google.com/maps/place/London,+UK", // Google Maps link
    }
  ];

  // Effect for debounced validation while typing
  useEffect(() => {
    if (formState.name !== debouncedName && formState.name.trim() !== '') {
      const { valid, error } = validateName(formState.name);
      setFormState(prev => ({ 
        ...prev, 
        nameValid: valid,
        nameError: error 
      }));
    }
  }, [formState.name, debouncedName, validateName]);
  
  useEffect(() => {
    if (formState.email !== debouncedEmail && formState.email.trim() !== '') {
      const { valid, error } = validateEmail(formState.email);
      setFormState(prev => ({ 
        ...prev, 
        emailValid: valid,
        emailError: error 
      }));
    }
  }, [formState.email, debouncedEmail, validateEmail]);

  // Handle form input changes with inline validation
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Update state with new value
    setFormState(prev => ({ ...prev, [name]: value }));
    
    // Validate field if user has started typing
    if (value.trim() !== '') {
      if (name === 'name') {
        const { valid, error } = validateName(value);
        setFormState(prev => ({ 
          ...prev, 
          [name]: value,
          nameValid: valid, 
          nameError: error 
        }));
      } else if (name === 'email') {
        const { valid, error } = validateEmail(value);
        setFormState(prev => ({ 
          ...prev, 
          [name]: value,
          emailValid: valid, 
          emailError: error 
        }));
      } else if (name === 'message') {
        const { valid, error } = validateMessage(value);
        setFormState(prev => ({ 
          ...prev, 
          [name]: value,
          messageValid: valid, 
          messageError: error 
        }));
      }
    } else {
      // Clear error when field is emptied
      if (name === 'name') {
        setFormState(prev => ({ ...prev, [name]: value, nameValid: true, nameError: '' }));
      } else if (name === 'email') {
        setFormState(prev => ({ ...prev, [name]: value, emailValid: true, emailError: '' }));
      } else if (name === 'message') {
        setFormState(prev => ({ ...prev, [name]: value, messageValid: true, messageError: '' }));
      }
    }
  };

  // Handle input blur for validation
  const handleInputBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Always validate on blur, even if empty
    if (name === 'name') {
      const { valid, error } = validateName(value);
      setFormState(prev => ({ 
        ...prev, 
        nameValid: valid, 
        nameError: error 
      }));
    } else if (name === 'email') {
      const { valid, error } = validateEmail(value);
      setFormState(prev => ({ 
        ...prev, 
        emailValid: valid, 
        emailError: error 
      }));
    } else if (name === 'message') {
      const { valid, error } = validateMessage(value);
      setFormState(prev => ({ 
        ...prev, 
        messageValid: valid, 
        messageError: error 
      }));
    }
  };

  // Magnetic effect handlers for button
  const handleMouseMove = (event: React.MouseEvent<HTMLButtonElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    mouseX.set(event.clientX - centerX);
    mouseY.set(event.clientY - centerY);
  };

  const resetMousePosition = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  // Form submission handler
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Run validations
    const nameValidation = validateName(formState.name);
    const emailValidation = validateEmail(formState.email);
    const messageValidation = validateMessage(formState.message);
    
    // Update validation states
    setFormState(prev => ({
      ...prev,
      nameValid: nameValidation.valid,
      emailValid: emailValidation.valid,
      messageValid: messageValidation.valid,
      nameError: nameValidation.error,
      emailError: emailValidation.error,
      messageError: messageValidation.error
    }));
    
    // Stop submission if any validation fails
    if (!nameValidation.valid || !emailValidation.valid || !messageValidation.valid) {
      return;
    }
    
    // Show submitting state
    setFormState(prev => ({ 
      ...prev, 
      submitting: true,
      error: null 
    }));
    
    try {
      // Use Formspree to submit form - replace YOUR_FORM_ID with the ID from your Formspree form
      const response = await fetch('https://formspree.io/f/mdkernly', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formState.name,
          email: formState.email,
          message: formState.message
        }),
      });
      
      if (response.ok) {
        // Show success message
        setFormState(prev => ({
          ...prev,
          submitted: true,
          submitting: false
        }));
        
        // Reset form after showing success
        setTimeout(() => {
          setFormState({
            name: '',
            email: '',
            message: '',
            nameValid: true,
            emailValid: true,
            messageValid: true,
            nameError: '',
            emailError: '',
            messageError: '',
            submitted: false,
            submitting: false,
            error: null
          });
        }, 3000);
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      setFormState(prev => ({
        ...prev,
        submitting: false,
        error: "Failed to send message. Please try again or email me directly."
      }));
    }
  };

  return (
    <motion.section 
      id="contact"
      ref={ref}
      initial={{ opacity: 0 }}
      animate={inView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
      className="relative py-24 px-8 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute opacity-10 blur-3xl">
          {[1, 2, 3].map(i => (
            <motion.div
              key={i}
              className={`absolute rounded-full bg-gradient-to-br ${
                i === 1 ? 'from-pink-500 to-purple-600' : 
                i === 2 ? 'from-blue-500 to-indigo-600' : 
                'from-green-500 to-teal-600'
              }`}
              style={{
                width: 120 * i + 'px', 
                height: 120 * i + 'px',
                left: `${30 * i}%`,
                top: `${15 * i}%`,
                willChange: 'transform, opacity'
              }}
              initial={{ opacity: 0.2 }}
              animate={{ 
                x: [0, i * 30, 0], 
                y: [0, i * -20, 0],
                opacity: [0.2, 0.3, 0.2]
              }}
              transition={{ 
                repeat: Infinity, 
                duration: 10 + i * 5, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto relative">
        {/* Heading with animation */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
            animate={{ 
              backgroundPosition: ['0% center', '100% center', '0% center'],
            }}
            transition={{ 
              duration: 8, 
              repeat: Infinity, 
              repeatType: "mirror" 
            }}
            style={{
              backgroundSize: '300% auto',
            }}
          >
            Get in Touch
          </motion.h2>
          <motion.p 
            className="text-gray-300 max-w-lg mx-auto"
            initial={{ opacity: 0 }}
            animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Have a project in mind or want to collaborate? Reach out and let's create something amazing together.
          </motion.p>
        </motion.div>
        
        {/* Main content */}
        <div className="grid md:grid-cols-5 gap-8 items-center">
          {/* Contact cards - takes 2 columns on desktop */}
          <motion.div 
            className="md:col-span-2 space-y-6"
            variants={{
              hidden: { opacity: 0 },
              show: {
                opacity: 1,
                transition: { staggerChildren: 0.15 }
              }
            }}
            initial="hidden"
            animate={inView ? "show" : "hidden"}
          >
            {contactCards.map((card, index) => (
              <motion.a
                href={card.href}
                key={card.title}
                className="relative block cursor-pointer"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  show: { 
                    opacity: 1, 
                    y: 0,
                    transition: { duration: 0.5, delay: card.delay }
                  }
                }}
                whileHover="hover"
                onMouseEnter={() => setActiveCard(index)}
                onMouseLeave={() => setActiveCard(null)}
                target={card.title === "Location" ? "_blank" : undefined}
                rel={card.title === "Location" ? "noopener noreferrer" : undefined}
              >
                <motion.div
                  className={`relative flex items-start gap-4 p-6 rounded-xl transition-all duration-300 border border-white/10 backdrop-blur-sm will-change-transform
                    bg-gradient-to-r ${card.color} bg-opacity-10 shadow-lg`}
                  initial={{ boxShadow: '0 0px 0px rgba(0,0,0,0)' }}
                  whileHover={{ 
                    y: -5,
                    boxShadow: '0 15px 30px rgba(0,0,0,0.25)'
                  }}
                  animate={activeCard === index ? { scale: 1.03 } : { scale: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Glow effect on active */}
                  <motion.div 
                    className="absolute inset-0 rounded-xl opacity-0"
                    initial={{ boxShadow: '0 0 0px rgba(120, 100, 255, 0)' }}
                    animate={activeCard === index ? 
                      { boxShadow: '0 0 40px rgba(120, 100, 255, 0.2)', opacity: 1 } : 
                      { boxShadow: '0 0 0px rgba(120, 100, 255, 0)', opacity: 0 }
                    }
                    transition={{ duration: 0.4 }}
                  />
                  
                  <div className={`p-2 rounded-full bg-gradient-to-br ${card.color}`}>
                    {card.icon}
                  </div>
                  
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-1">{card.title}</h3>
                    <p className="text-white/80">{card.value}</p>
                  </div>
                  
                  {/* Decorative circle */}
                  <motion.div 
                    className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white/5"
                    variants={{
                      hover: { scale: 1.5, opacity: 0.2, transition: { duration: 0.8 } }
                    }}
                  />

                  {/* Add visual indicator that these cards are clickable */}
                  <div className="absolute top-2 right-2 opacity-70">
                    <ExternalLink className="w-4 h-4 text-white opacity-50" />
                  </div>
                </motion.div>
              </motion.a>
            ))}
          </motion.div>
          
          {/* Contact form - takes 3 columns on desktop */}
          <motion.div 
            className="md:col-span-3 bg-white/5 backdrop-blur-lg rounded-2xl overflow-hidden border border-white/10 shadow-xl"
            initial={{ opacity: 0, x: 30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <div className="p-8">
              <h3 className="text-2xl font-bold text-white mb-6">Send a Message</h3>
              
              <AnimatePresence mode="sync">
                {formState.submitted ? (
                  <motion.div
                    key="success"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-center"
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        type: "spring", 
                        stiffness: 200, 
                        damping: 20,
                        delay: 0.2
                      }}
                      className="w-20 h-20 bg-white rounded-full mx-auto mb-4 flex items-center justify-center"
                    >
                      <svg 
                        className="w-12 h-12 text-green-500" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <motion.path
                          initial={{ pathLength: 0 }}
                          animate={{ pathLength: 1 }}
                          transition={{ duration: 0.5, delay: 0.5 }}
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M5 13l4 4L19 7" 
                        />
                      </svg>
                    </motion.div>
                    <h4 className="text-xl font-bold text-white mb-2">Message Sent!</h4>
                    <p className="text-white/80">I'll get back to you as soon as possible.</p>
                  </motion.div>
                ) : (
                  <motion.form
                    key="form" 
                    onSubmit={handleSubmit}
                    className="space-y-6"
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                  >
                    {/* Error message display */}
                    <AnimatePresence>
                      {formState.error && (
                        <motion.div 
                          initial={{ opacity: 0, y: -10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0 }}
                          className="p-4 bg-red-500/20 border border-red-500/50 rounded-lg text-white mb-4"
                        >
                          <p>{formState.error}</p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  
                    {/* Name input with animation and validation feedback */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4 }}
                    >
                      <label className="block text-gray-300 mb-1 text-sm">Your Name</label>
                      <div className="relative">
                        <input
                          type="text"
                          name="name"
                          value={formState.name}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.nameValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : formState.name.trim() !== '' 
                                  ? 'border-green-500 focus:border-green-500'
                                  : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400`}
                          placeholder="John Doe"
                        />
                        <AnimatePresence mode="popLayout">
                          {!formState.nameValid && formState.nameError && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-red-400 text-sm mt-1 ml-1"
                            >
                              {formState.nameError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Success check icon for valid input */}
                        <AnimatePresence>
                          {formState.nameValid && formState.name.trim() !== '' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute right-3 top-3"
                            >
                              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    {/* Email input with animation and validation feedback */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.1 }}
                    >
                      <label className="block text-gray-300 mb-1 text-sm">Your Email</label>
                      <div className="relative">
                        <input
                          type="email"
                          name="email"
                          value={formState.email}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.emailValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : formState.email.trim() !== '' 
                                  ? 'border-green-500 focus:border-green-500'
                                  : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400`}
                          placeholder="john@example.com"
                        />
                        <AnimatePresence mode="popLayout">
                          {!formState.emailValid && formState.emailError && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-red-400 text-sm mt-1 ml-1"
                            >
                              {formState.emailError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Success check icon for valid input */}
                        <AnimatePresence>
                          {formState.emailValid && formState.email.trim() !== '' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute right-3 top-3"
                            >
                              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    {/* Message input with animation and validation feedback */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.2 }}
                    >
                      <label className="block text-gray-300 mb-1 text-sm">Your Message</label>
                      <div className="relative">
                        <textarea
                          name="message"
                          value={formState.message}
                          onChange={handleInputChange}
                          onBlur={handleInputBlur}
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.messageValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : formState.message.trim() !== '' 
                                  ? 'border-green-500 focus:border-green-500'
                                  : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400 resize-none`}
                          placeholder="Your message here..."
                        ></textarea>
                        <AnimatePresence mode="popLayout">
                          {!formState.messageValid && formState.messageError && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              transition={{ duration: 0.2 }}
                              className="text-red-400 text-sm mt-1 ml-1"
                            >
                              {formState.messageError}
                            </motion.p>
                          )}
                        </AnimatePresence>

                        {/* Success check icon for valid input */}
                        <AnimatePresence>
                          {formState.messageValid && formState.message.trim() !== '' && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="absolute right-3 top-3"
                            >
                              <svg className="w-6 h-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    {/* Submit button with magnetic effect and loading animation */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 0.3 }}
                      className="pt-2"
                    >
                      <motion.button
                        type="submit"
                        className="relative w-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 bg-size-200 text-white font-medium py-3 px-6 rounded-lg overflow-hidden group disabled:opacity-70"
                        style={{
                          backgroundSize: '300% auto',
                          backgroundPosition: '0% center',
                          x: buttonX,
                          y: buttonY,
                          willChange: 'transform, background-position',
                        }}
                        whileHover={{ 
                          backgroundPosition: '100% center',
                          transition: { duration: 0.8 } 
                        }}
                        whileTap={{ scale: 0.95 }}
                        onMouseMove={handleMouseMove}
                        onMouseLeave={resetMousePosition}
                        disabled={formState.submitting}
                      >
                        <div className="relative flex items-center justify-center">
                          <AnimatePresence mode="sync">
                            {formState.submitting ? (
                              <motion.div
                                key="spinner"
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.5 }}
                                className="flex items-center justify-center"
                              >
                                <div className="w-5 h-5 border-t-2 border-b-2 border-white rounded-full animate-spin mr-2"></div>
                                <span>Sending...</span>
                              </motion.div>
                            ) : (
                              <motion.div
                                key="send"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center justify-center"
                              >
                                <span>Send Message</span>
                                <Send className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform duration-200" />
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                        
                        {/* Button hover effect */}
                        <motion.div 
                          className="absolute inset-0 -z-10 opacity-0 group-hover:opacity-20 bg-white"
                          initial={{ scale: 0 }}
                          whileHover={{ scale: 1.5 }}
                          transition={{ duration: 0.4 }}
                        />
                      </motion.button>
                    </motion.div>
                  </motion.form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
});

const AdvancedCertificationShowcase = memo(function AdvancedCertificationShowcase() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [selectedCert, setSelectedCert] = useState<number | null>(null);
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Track which card is being hovered for hover effects
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  
  // Updated certifications with proper path references to images
  const certifications = [
    {
      id: "british-airways Data Science",
      title: "Data Science Virtual Experience",
      issuer: "British Airways",
      date: "December 2023",
      credentialId: "vPaWPWeLB9fbLzrS3",
      description: "Completed a virtual data science internship with British Airways where I applied web scraping and sentiment analysis to customer reviews, and built a classification model to predict customer purchasing behavior.",
      logo: "/certificates/British_Airways.png",
      image: "/certificates/British_Airways.png",
      certificateUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/British%20Airways/NjynCWzGSaWXQCxSX_British%20Airways_dzz8iZuAAdX3YD6KC_1701898649252_completion_certificate.pdf",
      skills: ["Airport Planning, Assumption Building, Communication, Data Modeling, Data Science, Data Visualization, Machine Learning, Power point"]
    },
    {
      id: "BCG Data Science",
      title: "Data Science Virtual Experience",
      issuer: "BCG",
      date: "December 2023",
      credentialId: "LjJbavuCxTjfNdAss",
      description: "Completed the BCG X Data Science Virtual Internship, where I developed a churn prediction model for a major energy client (PowerCo), performed EDA, feature engineering, and used a Random Forest classifier to inform pricing strategy and reduce customer attrition.",
      logo: "/certificates/BCG_X.jpg",
      image: "/certificates/BCG_X.jpg",
      certificateUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/BCG%20/Tcz8gTtprzAS4xSoK_BCG_dzz8iZuAAdX3YD6KC_1702928416915_completion_certificate.pdf",
      skills: ["Business Understanding, Client Communication, Communication, Creativity, Hypothesis Framing, Exploratory Data Analysis (EDA), Data Visualization, Mathematical Modelling, Model Evaluation, Model Interpretation, Programming, Synthesis"]
    },
    {
      id: "Quantium Data Analystics",
      title: "Data Analytics with Quantium computing",
      issuer: "Quantium",
      date: "January 2024",
      credentialId: "LjJbavuCxTjfNdAss",
      description: "Completed a real-world data analytics project simulating industry workflows. Applied data wrangling, validation, statistical testing, and visualization using Python to extract insights. Developed dashboards and communicated findings through presentations, showcasing commercial thinking, programming, and communication skills to support data-driven decision-making.",
      logo: "/certificates/Quantium.jpg",
      image: "/certificates/Quantium.jpg",
      certificateUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Quantium/NkaC7knWtjSbi6aYv_Quantium_dzz8iZuAAdX3YD6KC_1704417772874_completion_certificate.pdf",
      skills: ["Commercial Thinking, Communication Skills, Data Analysis, Data Validation, Data Visualization, Data Wrangling, Presentation Skills Programming, Statistical Testing"]
    },
    {
      id: "PWC Switzerland Power BI",
      title: "Power BI Virtual Experience",
      issuer: "PWC Switzerland",
      date: "January 2024",
      credentialId: "fKNpebdZgXg7XakT4",
      description: "Completed PwC Switzerland's Power BI Virtual Internship, developing dashboards for call center analysis, customer retention, and diversity metrics. Utilized data modeling, DAX, and visualization techniques to deliver clear business insights.",
      logo: "/certificates/PWC_Switzerland.png", 
      image: "/certificates/PWC_Switzerland.png",
      certificateUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/PwC%20Switzerland/a87GpgE6tiku7q3gu_PwC%20Switzerland_dzz8iZuAAdX3YD6KC_1705367103774_completion_certificate.pdf",
      skills: ["Power BI Development, Dashboard Design & Visualization, Calculating Measures (DAX), Defining and Tracking KPIs, Insight Generation & Business Actions, Data-Driven Decision Making, Self-Reflection & Continuous Improvement"]
    },
    {
      id: "Accenture Data Analytics and Data Visualization",
      title: "Data Analytics and Data Visualization",
      issuer: "Accenture",
      date: "January 2024",
      credentialId: "puq3dn8d6vnKYK5fD",
      description: "Completed Accenture Analyzed Social Buzz's content data to identify top-performing categories. Cleaned and modeled datasets, created visual dashboards, and presented strategic insights to support IPO readiness using data analysis, visualization, and storytelling skills.",
      logo: "/certificates/Accenture.jpg",
      image: "/certificates/Accenture.jpg",
      certificateUrl: "https://forage-uploads-prod.s3.amazonaws.com/completion-certificates/Accenture%20North%20America/hzmoNKtzvAzXsEqx8_Accenture%20North%20America_dzz8iZuAAdX3YD6KC_1718480772884_completion_certificate.pdf",
      skills: ["Data Modeling, Data Understanding, Data Visualization, Communication, Public Speaking, Teamwork, Storytelling, Project Planning, Presentations, Strategic Thinking"]
    }
  ];

  // Navigate to previous certificate
  const prevCertificate = () => {
    if (activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
      scrollToIndex(activeIndex - 1);
    } else {
      // Loop to the end if at the beginning
      setActiveIndex(certifications.length - 1);
      scrollToIndex(certifications.length - 1);
    }
  };

  // Navigate to next certificate
  const nextCertificate = () => {
    if (activeIndex < certifications.length - 1) {
      setActiveIndex(activeIndex + 1);
      scrollToIndex(activeIndex + 1);
    } else {
      // Loop to the beginning if at the end
      setActiveIndex(0);
      scrollToIndex(0);
    }
  };

  // Scroll to a specific certificate index
  const scrollToIndex = (index: number) => {
    if (sliderRef.current) {
      const certElement = sliderRef.current.children[index] as HTMLElement;
      if (certElement) {
        sliderRef.current.scrollTo({
          left: certElement.offsetLeft - sliderRef.current.offsetWidth / 2 + certElement.offsetWidth / 2,
          behavior: 'smooth'
        });
      }
    }
  };

  // Open modal with certificate details
  const openCertificateModal = (index: number) => {
    setSelectedCert(index);
    setShowModal(true);
  };

  // Mouse/touch drag handling for slider
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setStartX(e.pageX - sliderRef.current!.offsetLeft);
    setScrollLeft(sliderRef.current!.scrollLeft);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    
    // Find closest certificate to snap to after dragging
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const certWidth = sliderRef.current.scrollWidth / certifications.length;
      const nearestIndex = Math.round(scrollPosition / certWidth);
      const boundedIndex = Math.max(0, Math.min(nearestIndex, certifications.length - 1));
      
      setActiveIndex(boundedIndex);
      scrollToIndex(boundedIndex);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.pageX - sliderRef.current!.offsetLeft;
    const dragDistance = x - startX;
    sliderRef.current!.scrollLeft = scrollLeft - dragDistance;
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setIsDragging(true);
    setStartX(e.touches[0].pageX - sliderRef.current!.offsetLeft);
    setScrollLeft(sliderRef.current!.scrollLeft);
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
    
    // Find closest certificate to snap to after dragging
    if (sliderRef.current) {
      const scrollPosition = sliderRef.current.scrollLeft;
      const certWidth = sliderRef.current.scrollWidth / certifications.length;
      const nearestIndex = Math.round(scrollPosition / certWidth);
      const boundedIndex = Math.max(0, Math.min(nearestIndex, certifications.length - 1));
      
      setActiveIndex(boundedIndex);
      scrollToIndex(boundedIndex);
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const x = e.touches[0].pageX - sliderRef.current!.offsetLeft;
    const dragDistance = x - startX;
    sliderRef.current!.scrollLeft = scrollLeft - dragDistance;
  };

  // Add body scroll lock effect when modal is open
  useEffect(() => {
    if (showModal) {
      // Prevent background scrolling when modal is openx
      document.body.style.overflow = 'hidden';
      
      // Add escape key listener
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          setShowModal(false);
        }
      };
      
      document.addEventListener('keydown', handleEscape);
      
      return () => {
        // Restore scrolling when modal is closed
        document.body.style.overflow = 'auto';
        document.removeEventListener('keydown', handleEscape);
      };
    }
  }, [showModal]);

  // Add the custom scrollbar styles
  const customScrollbarStyles = `
    .certificate-modal-scrollbar::-webkit-scrollbar {
      width: 6px;
    }
    .certificate-modal-scrollbar::-webkit-scrollbar-track {
      background: rgba(0, 0, 0, 0.2);
      border-radius: 3px;
    }
    .certificate-modal-scrollbar::-webkit-scrollbar-thumb {
      background: rgba(139, 92, 246, 0.5);
      border-radius: 3px;
    }
    .certificate-modal-scrollbar::-webkit-scrollbar-thumb:hover {
      background: rgba(139, 92, 246, 0.8);
    }
  `;

  return (
    <motion.section 
      className="py-24 px-8 relative bg-gradient-to-b from-black via-gray-900 to-black overflow-hidden"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true, amount: 0.2 }}
    >
      {/* Abstract animated background elements */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        {/* Neural network-like animated connections */}
        <svg className="absolute w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="certGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#4F46E5" stopOpacity="1" />
              <stop offset="100%" stopColor="#9333EA" stopOpacity="1" />
            </linearGradient>
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="8" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <g filter="url(#glow)">
            {[...Array(15)].map((_, i) => (
              <motion.line
                key={`line-${i}`}
                x1={`${Math.random() * 100}%`}
                y1={`${Math.random() * 100}%`}
                x2={`${Math.random() * 100}%`}
                y2={`${Math.random() * 100}%`}
                stroke="url(#certGrad)"
                strokeWidth="0.5"
                initial={{ pathLength: 0, opacity: 0.1 }}
                animate={{ 
                  pathLength: [0, 1, 0],
                  opacity: [0.1, 0.5, 0.1]
                }}
                transition={{
                  duration: 8 + i * 2,
                  ease: "easeInOut",
                  repeat: Infinity,
                  repeatType: "loop",
                  delay: i * 0.5
                }}
              />
            ))}
          </g>
        </svg>

        {/* Particle system */}
        {[...Array(50)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-blue-500"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              opacity: Math.random() * 0.3,
              filter: "blur(1px)"
            }}
            animate={{
              x: [0, Math.random() * 40 - 20],
              y: [0, Math.random() * 40 - 20],
              opacity: [0, Math.random() * 0.5, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              repeatType: "mirror"
            }}
          />
        ))}

        {/* Larger glowing orbs */}
        <motion.div 
          className="absolute w-[600px] h-[600px] rounded-full bg-indigo-600/20 blur-[120px]"
          style={{ top: '-10%', left: '-5%' }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 8, repeat: Infinity }}
        />
        <motion.div 
          className="absolute w-[500px] h-[500px] rounded-full bg-violet-600/20 blur-[100px]"
          style={{ bottom: '-10%', right: '-5%' }}
          animate={{ 
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 7, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Digital circuit pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03] mix-blend-screen" 
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h100v100H0z' fill='none'/%3E%3Cpath d='M1 1h98v98H1z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3Cpath d='M10 10h80v80H10z' fill='none' stroke='%23fff' stroke-width='0.5'/%3E%3Cpath d='M10 50h80' stroke='%23fff' stroke-width='0.5'/%3E%3Cpath d='M50 10v80' stroke='%23fff' stroke-width='0.5'/%3E%3Cpath d='M1 1l98 98M1 99l98-98' stroke='%23fff' stroke-width='0.5'/%3E%3Ccircle cx='50' cy='50' r='5' fill='%23fff'/%3E%3Ccircle cx='20' cy='20' r='2' fill='%23fff'/%3E%3Ccircle cx='80' cy='20' r='2' fill='%23fff'/%3E%3Ccircle cx='20' cy='80' r='2' fill='%23fff'/%3E%3Ccircle cx='80' cy='80' r='2' fill='%23fff'/%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px',
            }}
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section heading with futuristic design */}
        <motion.div 
          className="text-center mb-20 relative"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          {/* Decorative elements */}
          <motion.div 
            className="absolute left-1/2 -top-12 w-[300px] h-[2px] -ml-[150px]"
            initial={{ scaleX: 0, opacity: 0 }}
            whileInView={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <div className="w-full h-full bg-gradient-to-r from-transparent via-indigo-500 to-transparent"></div>
          </motion.div>

          <motion.h2 
            className="text-5xl md:text-6xl font-black mb-4 tracking-tight relative inline-block"
          >
            {/* Glowing text effect */}
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-blue-100 to-blue-100 opacity-90">
              Achievements
            </span>
            
            {/* Accent glow */}
            <motion.span 
              className="absolute -inset-2 rounded-lg bg-blue-500/20 blur-xl -z-10"
              animate={{ 
                opacity: [0.4, 0.8, 0.4],
              }}
              transition={{ duration: 3, repeat: Infinity }}
            />
            
            {/* Animated highlight */}
            <motion.span
              className="absolute bottom-0 left-0 w-full h-[6px] bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full"
              initial={{ scaleX: 0, opacity: 0 }}
              whileInView={{ scaleX: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              viewport={{ once: true }}
            />
          </motion.h2>

          <motion.p 
            className="text-gray-300 max-w-2xl mx-auto mt-6 text-lg relative z-10"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            viewport={{ once: true }}
          >
            Professional certifications and recognition in the field
          </motion.p>
        </motion.div>

        {/* Horizontal certification showcase */}
        <div 
          className="relative flex items-center justify-center overflow-hidden"
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onTouchMove={handleTouchMove}
        >
          {/* Left arrow */}
          <motion.button
            className="absolute left-0 z-20 p-2 bg-gradient-to-r from-gray-800 to-transparent text-white rounded-full shadow-lg"
            onClick={prevCertificate}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </motion.button>

          {/* Certification cards - UPDATED FOR CLEANER LOOK */}
          <div 
            ref={sliderRef} 
            className="flex space-x-6 overflow-x-auto py-6 px-4"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {certifications.map((cert, index) => (
              <motion.div
                key={index}
                className="flex-shrink-0 w-80 h-96 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/10 shadow-lg overflow-hidden cursor-pointer group"
                style={{ scrollSnapAlign: 'center' }}
                onClick={() => openCertificateModal(index)}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                onHoverStart={() => setHoveredIndex(index)}
                onHoverEnd={() => setHoveredIndex(null)}
              >
                {/* Card with cover image and hover effect */}
                <div className="relative h-full flex flex-col">
                  {/* Certificate image with shine effect */}
                  <div className="relative w-full h-48 overflow-hidden">
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-tr from-black/60 via-black/20 to-transparent z-10"
                      animate={hoveredIndex === index ? { opacity: 0.4 } : { opacity: 0.7 }}
                    />
                    
                    <motion.img 
                      src={cert.image} 
                      alt={cert.title}
                      className="w-full h-full object-cover"
                      animate={hoveredIndex === index ? { scale: 1.05 } : { scale: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    {/* Animated shine effect */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-100%]"
                      animate={hoveredIndex === index ? {
                        translateX: ['100%']
                      } : {}}
                      transition={hoveredIndex === index ? {
                        duration: 1.5,
                        ease: "easeOut"
                      } : {}}
                    />
                    
                    {/* Logo badge */}
                    <div className="absolute top-4 left-4 z-20 bg-black/50 backdrop-blur-md rounded-full p-1 border border-white/10">
                      <img 
                        src={cert.logo} 
                        alt={cert.issuer}
                        className="w-10 h-10 object-contain rounded-full"
                      />
                    </div>
                  </div>
                  
                  {/* Content area */}
                  <div className="p-5 flex-1 flex flex-col justify-between relative">
                    {/* Text content */}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1 line-clamp-2">{cert.title}</h3>
                      <div className="flex items-center text-sm text-gray-400">
                        <span>{cert.issuer}</span>
                        <span className="mx-2">•</span>
                        <span>{cert.date}</span>
                      </div>
                    </div>
                    
                    {/* View details button */}
                    <motion.div 
                      className="mt-4 flex items-center justify-between"
                      animate={hoveredIndex === index ? { y: 0, opacity: 1 } : { y: 5, opacity: 0.8 }}
                    >
                      <motion.div 
                        className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-lg text-white text-sm font-medium space-x-2 group-hover:bg-gradient-to-r from-blue-600/80 to-purple-600/80 transition-all duration-300"
                      >
                        <span>View Certificate</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                          <polyline points="15 3 21 3 21 9"></polyline>
                          <line x1="10" y1="14" x2="21" y2="3"></line>
                        </svg>
                      </motion.div>
                      
                      {/* Badge showing number of skills */}
                      <motion.div
                        className="px-3 py-1 bg-purple-900/50 text-purple-200 text-xs rounded-full"
                        whileHover={{ scale: 1.1 }}
                      >
                        {cert.skills.length} Skills
                      </motion.div>
                    </motion.div>
                    
                    {/* Decorative corner accent */}
                    <motion.div 
                      className="absolute -bottom-6 -right-6 w-12 h-12 rounded-full bg-gradient-to-br from-blue-600/30 to-purple-600/30 blur-md"
                      animate={hoveredIndex === index ? { 
                        scale: 1.5, 
                        opacity: 0.8 
                      } : { 
                        scale: 1, 
                        opacity: 0.3 
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </div>
                  
                  {/* Pulsing verification badge */}
                  <motion.div 
                    className="absolute top-3 right-3 z-20 flex items-center justify-center"
                    animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-2 py-0.5 flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                      <span>Verified</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Right arrow */}
          <motion.button
            className="absolute right-0 z-20 p-2 bg-gradient-to-l from-gray-800 to-transparent text-white rounded-full shadow-lg"
            onClick={nextCertificate}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6" />
            </svg>
          </motion.button>
        </div>

        {/* Modal for detailed certificate view */}
        <AnimatePresence>
          {showModal && selectedCert !== null && (
            <motion.div 
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
            >
              {/* Backdrop with blur effect */}
              <motion.div
                className="absolute inset-0 bg-black/75 backdrop-blur-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              />
              
              {/* Modal container with fixed max-height */}
              <motion.div 
                className="bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl max-w-lg w-full relative z-[101] flex flex-col"
                style={{ maxHeight: "calc(100vh - 40px)" }} // Fixed height with margin
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ 
                  type: "spring", 
                  damping: 20, 
                  stiffness: 300 
                }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="certificate-modal-title"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Animated glow effect around modal */}
                <motion.div 
                  className="absolute -inset-1 rounded-2xl opacity-50 z-[-1]"
                  animate={{ 
                    boxShadow: [
                      '0 0 20px 5px rgba(79, 70, 229, 0.5)', 
                      '0 0 30px 5px rgba(139, 92, 246, 0.5)', 
                      '0 0 20px 5px rgba(79, 70, 229, 0.5)'
                    ],
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    repeatType: "reverse" 
                  }}
                />
                
                {/* Fixed Header Section */}
                <div className="p-6 border-b border-white/10 sticky top-0 bg-[rgba(15,15,15,0.7)] backdrop-blur-xl z-10">
                  {/* Close button */}
                  <motion.button 
                    className="absolute top-4 right-4 text-white bg-black/30 rounded-full p-2 hover:bg-black/50 z-10 group"
                    onClick={() => setShowModal(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Close certificate details"
                  >
                    <motion.svg 
                      width="20" 
                      height="20" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                      animate={{ rotate: [0, 90, 180, 270, 360] }}
                      transition={{ duration: 0.5, ease: "easeInOut" }}
                      className="opacity-80 group-hover:opacity-100"
                    >
                      <path d="M18 6L6 18M6 6l12 12" />
                    </motion.svg>
                  </motion.button>
                  
                  {/* Header with logo and title */}
                  <div className="flex items-center pr-8">
                    <div className="w-16 h-16 mr-4 relative">
                      <motion.div
                        className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                      />
                      <img 
                        src={certifications[selectedCert].logo} 
                        alt={certifications[selectedCert].issuer}
                        className="w-full h-full object-contain rounded-full border-2 border-white/10 p-2 relative z-10 bg-black/30 backdrop-blur-sm"
                      />
                    </div>
                    <div>
                      <h3 
                        id="certificate-modal-title"
                        className="text-2xl font-bold text-white"
                      >
                        {certifications[selectedCert].title}
                      </h3>
                      <div className="flex items-center text-gray-300">
                        <span>{certifications[selectedCert].issuer}</span>
                        <span className="mx-2 text-gray-500">•</span>
                        <span className="text-blue-400">{certifications[selectedCert].date}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="flex-1 overflow-y-auto certificate-modal-scrollbar">
                  <div className="p-6">
                    {/* Background glow effect */}
                    <motion.div
                      className="absolute inset-0 -z-10 opacity-30 pointer-events-none"
                      animate={{ 
                        background: [
                          'radial-gradient(circle at 30% 20%, rgba(79, 70, 229, 0.4) 0%, transparent 70%)',
                          'radial-gradient(circle at 70% 60%, rgba(124, 58, 237, 0.4) 0%, transparent 70%)'
                        ],
                      }}
                      transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
                    />
                    
                    {/* Certificate image with enhanced hover effect */}
                    <motion.div 
                      className="w-full h-56 rounded-xl mb-6 overflow-hidden bg-white/5 flex items-center justify-center relative group"
                      whileHover={{ boxShadow: "0 0 30px rgba(124, 58, 237, 0.3)" }}
                      transition={{ duration: 0.3 }}
                    >
                      <img 
                        src={certifications[selectedCert].image} 
                        alt={certifications[selectedCert].title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      {/* Credential ID overlaid on image */}
                      <div className="absolute bottom-3 left-3 right-3 flex justify-between">
                        <div className="text-xs bg-black/60 backdrop-blur-sm py-1 px-2 rounded text-gray-300 flex items-center">
                          <span className="mr-1 text-gray-400">ID:</span> 
                          <span className="font-mono text-blue-300">{certifications[selectedCert].credentialId}</span>
                        </div>
                        {/* Verified badge */}
                        <div className="bg-green-900/60 backdrop-blur-sm text-green-300 text-xs py-1 px-2 rounded flex items-center">
                          <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                          </svg>
                          <span>Verified</span>
                        </div>
                      </div>
                    </motion.div>
                    
                    {/* Description */}
                    <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Description</h4>
                      <motion.p 
                        className="text-gray-200 text-base leading-relaxed"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        {certifications[selectedCert].description}
                      </motion.p>
                    </div>
                    
                    {/* Skills tags with staggered animation */}
                    <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Skills & Competencies</h4>
                      <div className="flex flex-wrap gap-2">
                        {certifications[selectedCert].skills.map((skill, i) => (
                          <motion.span 
                            key={i} 
                            className="px-3 py-1.5 text-sm rounded-full bg-gradient-to-r from-purple-900/50 to-blue-900/50 text-purple-200 border border-purple-500/20"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.1 + i * 0.05, type: "spring", stiffness: 300 }}
                          >
                            {skill}
                          </motion.span>
                        ))}
                      </div>
                    </div>
                    
                    {/* Extra content to demonstrate scrolling */}
                    <div className="mb-6">
                      <h4 className="text-sm uppercase tracking-wider text-gray-400 mb-2">Certificate Details</h4>
                      <div className="space-y-3 text-gray-300">
                        <div className="flex items-center">
                          <div className="w-32 text-gray-400">Date Issued:</div>
                          <div>{certifications[selectedCert].date}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-400">Credential ID:</div>
                          <div className="font-mono text-blue-300">{certifications[selectedCert].credentialId}</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-400">Type:</div>
                          <div>Professional Certificate</div>
                        </div>
                        <div className="flex items-center">
                          <div className="w-32 text-gray-400">Expiry:</div>
                          <div>No Expiration</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Fixed Footer/Actions */}
                <div className="p-6 border-t border-white/10 sticky bottom-0 bg-[rgba(15,15,15,0.7)] backdrop-blur-xl z-10">
                  <div className="flex justify-between items-center">
                    <motion.a 
                      href={certifications[selectedCert].certificateUrl} 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="group inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-lg hover:shadow-blue-500/30 hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <span className="relative z-10">View Certificate</span>
                      <motion.svg 
                        className="ml-2 w-5 h-5 relative z-10 group-hover:translate-x-1 transition-transform" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </motion.svg>
                      
                      {/* Shimmering effect on button hover */}
                      <motion.div 
                        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000"
                        aria-hidden="true"
                      />
                    </motion.a>
                    
                    <button 
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-white transition-colors"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Indicator dots for navigation */}
        <div className="flex justify-center gap-2 mt-6">
          {certifications.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                setActiveIndex(index);
                scrollToIndex(index);
              }}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                activeIndex === index 
                  ? 'bg-blue-500 w-8' 
                  : 'bg-gray-500/50 hover:bg-gray-400/60'
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>
      </div>
    </motion.section>
  );
});

const TestimonialCarousel = memo(function TestimonialCarousel() {
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [width, setWidth] = useState(0);
  
  // Testimonials data (you already have this data elsewhere)
  const testimonials = [
    {
      name: "Robert Chen",
      role: "CTO, DLK Technology",
      image: "https://images.unsplash.com/photo-1568602471122-7832951cc4c5?q=80&w=1000&auto=format&fit=crop",
      feedback: "I've worked with dozens of developers over my career, but Kirthik stands out. His ability to grasp complex problems and deliver elegant solutions helped us launch months ahead of schedule. A genuine talent who's now our go-to for challenging projects.",
      gradient: "from-blue-600 to-purple-600",
      icon: "tech"
    },
    {
      name: "Jessica Williams",
      role: "Director of Product Innovation, DLK Technology",
      image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1000&auto=format&fit=crop",
      feedback: "Working with Kirthik has been refreshing. He doesn't just code – he understands business objectives and delivers solutions that actually drive results. After implementing his recommendations, our user engagement increased by 32%. Would hire again in a heartbeat.",
      gradient: "from-purple-600 to-pink-600",
      icon: "data"
    },
    {
      name: "Michael Rodriguez",
      role: "Head of Engineering, NXVOY",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1000&auto=format&fit=crop",
      feedback: "When our team got stuck on a critical integration issue, Kirthik stepped in and solved it in days. His technical knowledge is impressive, but it's his problem-solving mindset that truly sets him apart. Couldn't ask for a better collaborator when facing tight deadlines.",
      gradient: "from-cyan-500 to-blue-500",
      icon: "product"
    },
    {
      name: "Dr. Amelia Patel",
      role: "AI Research Lead, NXVOY",
      image: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=1000&auto=format&fit=crop",
      feedback: "Kirthik has that rare combination of deep technical knowledge and excellent communication skills. He translated our complex requirements into a working solution that exceeded expectations. The models he built are still core to our product two years later. A true professional.",
      gradient: "from-emerald-500 to-teal-500",
      icon: "research"
    },
    {
      name: "David Foster",
      role: "VP of Mobile Development, NXVOY",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1000&auto=format&fit=crop",
      feedback: "I've recommended Kirthik to several colleagues because he consistently delivers. On our last project, he identified an approach that cut our cloud costs by 40% while improving performance. He's not just a coder – he's a strategic thinker who makes the entire team better.",
      gradient: "from-orange-500 to-pink-600",
      icon: "mobile"
    }
  ];

  // Measure carousel width
  useEffect(() => {
    if (carouselRef.current) {
      // Get the actual rendered width
      setWidth(carouselRef.current.scrollWidth - carouselRef.current.offsetWidth);
    }
  }, []);

  // Auto-scroll functionality
  useEffect(() => {
    if (isPaused || !carouselRef.current) return;
    
    const interval = setInterval(() => {
      if (!carouselRef.current) return;
      
      const newIndex = (activeIndex + 1) % testimonials.length;
      setActiveIndex(newIndex);
      
      // Calculate the position to scroll to
      const testimonialWidth = carouselRef.current.scrollWidth / testimonials.length;
      carouselRef.current.scrollTo({
        left: newIndex * testimonialWidth,
        behavior: 'smooth'
      });
    }, 8000); // Scroll every 8 seconds
    
    return () => clearInterval(interval);
  }, [activeIndex, testimonials.length, isPaused]);

  // Navigate to a specific testimonial
  const navigateTo = useCallback((index: number) => {
    if (!carouselRef.current) return;
    
    setActiveIndex(index);
    const testimonialWidth = carouselRef.current.scrollWidth / testimonials.length;
    carouselRef.current.scrollTo({
      left: index * testimonialWidth,
      behavior: 'smooth'
    });
  }, [testimonials.length]);

  // Previous testimonial
  const prevTestimonial = useCallback(() => {
    const newIndex = activeIndex === 0 ? testimonials.length - 1 : activeIndex - 1;
    navigateTo(newIndex);
  }, [activeIndex, navigateTo, testimonials.length]);

  // Next testimonial
  const nextTestimonial = useCallback(() => {
    const newIndex = (activeIndex + 1) % testimonials.length;
    navigateTo(newIndex);
  }, [activeIndex, navigateTo, testimonials.length]);

  // Handle scroll event to update active index
  const handleScroll = useCallback(() => {
    if (!carouselRef.current) return;
    
    const scrollPosition = carouselRef.current.scrollLeft;
    const testimonialWidth = carouselRef.current.scrollWidth / testimonials.length;
    const newIndex = Math.round(scrollPosition / testimonialWidth);
    
    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex, testimonials.length]);

  // Add scroll event listener
  useEffect(() => {
    const carousel = carouselRef.current;
    if (!carousel) return;
    
    carousel.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      carousel.removeEventListener('scroll', handleScroll);
    };
  }, [handleScroll]);

  return (
    <div className="relative">
      {/* Beautiful dynamic background gradient that follows active testimonial */}
      <motion.div 
        className={`absolute inset-0 opacity-20 blur-3xl -z-10 rounded-3xl transition-all duration-700`}
        animate={{
          background: activeIndex === 0 ? 'linear-gradient(to right, #2563eb, #7c3aed)' :
                      activeIndex === 1 ? 'linear-gradient(to right, #7c3aed, #db2777)' :
                      activeIndex === 2 ? 'linear-gradient(to right, #06b6d4, #3b82f6)' :
                      activeIndex === 3 ? 'linear-gradient(to right, #10b981, #0d9488)' :
                      'linear-gradient(to right, #f59e0b, #db2777)'
        }}
      />
      
      {/* Carousel container with overflow */}
      <motion.div 
        ref={carouselRef}
        className="overflow-x-hidden cursor-grab"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <motion.div 
          drag="x"
          dragConstraints={{ right: 0, left: -width }}
          className="flex gap-6 md:gap-8 py-4"
          style={{ paddingBottom: '20px' }} // Room for indicator dots
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.name}
              className="min-w-[300px] md:min-w-[400px] lg:min-w-[450px]"
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ 
                duration: 0.6, 
                delay: index * 0.1, 
                type: "spring", 
                stiffness: 100
              }}
            >
              <TestimonialCard
                name={testimonial.name}
                role={testimonial.role}
                image={testimonial.image}
                feedback={testimonial.feedback}
                delay={index * 0.1}
                gradient={testimonial.gradient}
                icon={testimonial.icon}
              />
            </motion.div>
          ))}
        </motion.div>
      </motion.div>

      {/* Navigation arrows */}
      <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full flex justify-between items-center px-2 pointer-events-none">
        <motion.button
          onClick={prevTestimonial}
          className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transform -translate-x-2 hover:bg-black/50 pointer-events-auto"
          whileHover={{ scale: 1.1, x: -8 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
          </svg>
        </motion.button>

        <motion.button
          onClick={nextTestimonial}
          className="bg-black/30 backdrop-blur-sm text-white p-3 rounded-full transform translate-x-2 hover:bg-black/50 pointer-events-auto"
          whileHover={{ scale: 1.1, x: 8 }}
          whileTap={{ scale: 0.9 }}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
          </svg>
        </motion.button>
      </div>

      {/* Indicator dots */}
      <div className="flex justify-center gap-2 mt-2">
        {testimonials.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => navigateTo(index)}
            className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${
              activeIndex === index
                ? 'bg-white w-8'
                : 'bg-white/40 hover:bg-white/60'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </div>
      
      {/* Auto-scroll indicator */}
      <motion.div 
        className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-60"
        initial={{ width: '0%' }}
        animate={{
          width: isPaused ? '0%' : '100%'
        }}
        transition={{
          duration: isPaused ? 0 : 8, // Match interval time
          ease: "linear",
          repeat: isPaused ? 0 : Infinity,
          repeatType: "loop"
        }}
      />
    </div>
  );
});

function App() {
  const [showIntro, setShowIntro] = useState(true);
  const [declinedAccess, setDeclinedAccess] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('hero');
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const isDesktop = useMediaQuery('(min-width: 768px)');
  const [isHovering, setIsHovering] = useState<string | null>(null);
  
  // Handle intro completion
  const handleIntroComplete = useCallback(() => {
    setShowIntro(false);
  }, []);

  // Handle intro declined - make sure this function works properly
  const handleIntroDeclined = useCallback(() => {
    console.log("User declined access"); // Add logging for debugging
    setDeclinedAccess(true);
    setShowIntro(false);
  }, []);
  
  // Memoize handlers to prevent unnecessary re-renders
  const handleSectionActive = useCallback((section: string) => {
    setActiveSection(section);
  }, []);
  
  const handleDarkModeToggle = useCallback(() => {
    setDarkMode(prev => !prev);
  }, []);

  // Animation variants for staggered animations
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 24 
      }
    }
  };

  // Logo text animation for splitting characters
  const logoText = "Portfolio";
  const logoChars = Array.from(logoText);

  // In the declined access UI, enhance the button to make it more noticeable
  if (declinedAccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white flex flex-col items-center justify-center p-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-xl w-full text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring", 
              stiffness: 200, 
              damping: 15,
              delay: 0.3
            }}
            className="w-24 h-24 bg-gradient-to-br from-purple-600 to-blue-600 rounded-full mx-auto mb-8 flex items-center justify-center"
          >
            <motion.div
              animate={{ 
                rotate: 360,
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                ease: "linear"
              }}
              className="w-full h-full flex items-center justify-center"
            >
              <svg width="50" height="50" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-white">
                <path d="M9 19l-7-7 7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12h16a4 4 0 0 0 0-8 4 4 0 0 0-8 0M19 12a4 4 0 0 1 0 8H3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </motion.div>
          </motion.div>
          
          <motion.h1 
            className="text-4xl md:text-5xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            animate={{
              backgroundPosition: ['0% center', '100% center', '0% center'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              repeatType: "mirror"
            }}
            style={{
              backgroundSize: '300% auto',
            }}
          >
            Come Back Soon
          </motion.h1>
          
          <motion.p 
            className="text-gray-400 text-xl mb-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            You've chosen to postpone exploring my portfolio. I'd love to show you my work when you're ready.
          </motion.p>
          
          <motion.button
            onClick={() => {
              console.log("User wants to try again"); // Add logging for debugging
              setDeclinedAccess(false);
              setShowIntro(true);
            }}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full text-white font-medium"
            whileHover={{ scale: 1.05, boxShadow: "0 0 20px rgba(139, 92, 246, 0.5)" }}
            whileTap={{ scale: 0.98 }}
          >
            Give It Another Try
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <CookieConsentProvider>
      <ScrollOptimizationProvider>
        <AnimatePresence>
          {showIntro && (
            <IntroScreen 
              onComplete={handleIntroComplete} 
              onDecline={handleIntroDeclined}
            />
          )}
        </AnimatePresence>

        <AnimatePresence>
          {!showIntro && (
            <motion.div 
              className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black text-white force-hardware-acceleration`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1 }}
            >
              {/* Enhanced Premium Navigation Bar */}
              <motion.nav
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ 
                  duration: 0.8, 
                  type: "spring", 
                  stiffness: 100, 
                  damping: 20,
                  delay: 0.5
                }}
                className="fixed top-0 left-0 w-full backdrop-blur-lg bg-black/30 shadow-[0_2px_20px_rgba(0,0,0,0.4)] z-50 will-change-transform border-b border-white/5"
              >
                <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
                  {/* Premium Animated Logo */}
                  <div className="relative">
                    {/* Animated glow effect background */}
                    <motion.div 
                      className="absolute -inset-1 rounded-lg bg-gradient-to-r from-purple-600 to-blue-500 opacity-30 blur-xl"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.2, 0.3, 0.2],
                      }}
                      transition={{
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                    />
                    
                    <motion.div 
                      className="relative px-3 py-1 rounded-lg"
                      whileHover={{ scale: 1.03 }}
                    >
                      <motion.div className="flex overflow-hidden">
                        {logoChars.map((char, index) => (
                          <motion.span
                            key={`char-${index}`}
                            className="text-2xl font-extrabold inline-block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500"
                            style={{
                              textShadow: "0 0 10px rgba(139, 92, 246, 0.5)",
                              willChange: "transform"
                            }}
                            initial={{ y: 40 }}
                            animate={{ y: 0 }}
                            transition={{
                              duration: 0.5,
                              delay: 1 + index * 0.05,
                              type: "spring",
                              stiffness: 200,
                              damping: 13
                            }}
                            whileHover={{
                              y: -3,
                              color: "#fff",
                              transition: { duration: 0.2 }
                            }}
                          >
                            {char}
                          </motion.span>
                        ))}
                      </motion.div>
                      
                      {/* Subtle line animation under logo */}
                      <motion.div
                        className="h-0.5 w-full bg-gradient-to-r from-transparent via-purple-500 to-transparent absolute bottom-0 left-0"
                        initial={{ width: 0 }}
                        animate={{ 
                          scaleX: [0, 1, 0], 
                          opacity: [0, 0.8, 0],
                          left: ["0%", "0%", "100%"] 
                        }}
                        transition={{ 
                          duration: 6,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </motion.div>
                  </div>
                  
                  {/* Ultra Premium Navigation Links */}
                  <motion.div 
                    className="flex space-x-2 md:space-x-4 items-center"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {['about', 'skills', 'projects', 'contact'].map((section) => {
                      const isActive = activeSection === section;
                      
                      return (
                        <motion.div
                          key={section}
                          variants={itemVariants}
                          className="relative will-change-transform"
                          onHoverStart={() => setIsHovering(section)}
                          onHoverEnd={() => setIsHovering(null)}
                        >
                          {/* Animated background for hover state */}
                          <AnimatePresence>
                            {(isHovering === section || isActive) && (
                              <motion.div
                                className="absolute inset-0 rounded-lg"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ 
                                  opacity: 1, 
                                  scale: 1.05,
                                  background: isActive 
                                    ? "linear-gradient(135deg, rgba(124, 58, 237, 0.6), rgba(139, 92, 246, 0.6))" 
                                    : "linear-gradient(135deg, rgba(124, 58, 237, 0.2), rgba(139, 92, 246, 0.2))"
                                }}
                                exit={{ opacity: 0, scale: 0.8 }}
                                transition={{ duration: 0.2 }}
                                style={{
                                  boxShadow: isActive 
                                    ? "0 0 20px 2px rgba(139, 92, 246, 0.3)" 
                                    : "0 0 10px rgba(139, 92, 246, 0.2)"
                                }}
                              />
                            )}
                          </AnimatePresence>

                          <ScrollLink
                            to={section}
                            smooth={true}
                            duration={500}
                            offset={-80}
                            className={`relative px-4 py-2 block rounded-lg transition-all duration-300 z-10`}
                            onSetActive={() => handleSectionActive(section)}
                          >
                            <motion.div 
                              className="relative z-10 text-sm md:text-base font-medium flex items-center justify-center"
                              animate={{ 
                                y: isActive ? [0, -2, 0] : 0,
                                transition: { 
                                  y: { repeat: isActive ? Infinity : 0, duration: 2, repeatType: "reverse" } 
                                }
                              }}
                            >
                              <motion.span 
                                className={isActive ? "text-white" : "text-gray-200"}
                                animate={{ scale: isActive ? [1, 1.05, 1] : 1 }}
                                transition={{ 
                                  duration: 2, 
                                  repeat: isActive ? Infinity : 0, 
                                  repeatType: "reverse" 
                                }}
                              >
                                {section.charAt(0).toUpperCase() + section.slice(1)}
                              </motion.span>

                              {/* Underline animation effect */}
                              <motion.div
                                className="absolute -bottom-1 left-0 h-[2px] bg-gradient-to-r from-purple-500 to-blue-500"
                                initial={{ width: 0 }}
                                animate={{ width: isActive || isHovering === section ? "100%" : 0 }}
                                transition={{ duration: 0.3 }}
                              />
                            </motion.div>
                          </ScrollLink>
                        </motion.div>
                      );
                    })}

                    {/* Enhanced dark mode toggle */}
                    <motion.div
                      variants={itemVariants}
                      className="relative"
                    >
                      <motion.button
                        onClick={handleDarkModeToggle}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="relative p-2 rounded-full overflow-hidden"
                        style={{ 
                          background: "linear-gradient(135deg, rgb(236, 72, 153), rgb(124, 58, 237))",
                          boxShadow: "0 0 10px rgba(236, 72, 153, 0.5)"
                        }}
                        transition={{
                          duration: 0.2,
                          type: "spring",
                          stiffness: 300,
                          damping: 15
                        }}
                      >
                        <motion.div
                          className="absolute inset-0 opacity-30"
                          animate={{ 
                            background: [
                              "radial-gradient(circle at 20% 20%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)",
                              "radial-gradient(circle at 80% 80%, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
                            ],
                          }}
                          transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                        />
                        <motion.div
                          animate={{ rotate: darkMode ? 180 : 0 }}
                          transition={{ duration: 0.5, type: "spring" }}
                        >
                          {darkMode ? 
                            <Sun className="w-5 h-5 text-white" /> : 
                            <Moon className="w-5 h-5 text-white" />
                          }
                        </motion.div>
                      </motion.button>
                    </motion.div>
                  </motion.div>
                </div>
              </motion.nav>

              {/* Hero Section - Now using UltraPremiumHeroSection */}
              <Element name="hero">
                <UltraPremiumHeroSection isDarkMode={darkMode} />
              </Element>

              {/* About Section */}
              <Element name="about" className="relative z-10 optimize-scroll">
                <section id="about" className="w-full">
                  <LuxuryAboutSection />
                </section>
              </Element>

              {/* Skills Section */}
              <Element name="skills" className="relative z-10 optimize-scroll">
                <section id="skills" className="w-full">
                  <OptimizedSkillsSection />
                </section>
              </Element>

              <Element name="projects" className="optimize-scroll">
                <EnhancedProjectSection />
              </Element>

              {/* Ultra-Futuristic Achievements/Certifications Section - 2050 Style */}
              <AdvancedCertificationShowcase />

              {/* Ultra-Modern Testimonials Section */}
              <motion.section 
                className="py-20 px-8 relative bg-gradient-to-b from-gray-900 to-black overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true, amount: 0.2 }}
              >
                {/* Animated background elements */}
                <div className="absolute inset-0 z-0">
                  <motion.div 
                    className="absolute w-[500px] h-[500px] rounded-full bg-purple-700/30 blur-[100px]"
                    style={{ top: '10%', left: '5%' }}
                    animate={{ 
                      opacity: [0.3, 0.5, 0.3], 
                      scale: [1, 1.2, 1] 
                    }}
                    transition={{ 
                      duration: 10, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                  <motion.div 
                    className="absolute w-[400px] h-[400px] rounded-full bg-blue-500/20 blur-[100px]"
                    style={{ bottom: '5%', right: '10%' }}
                    animate={{ 
                      opacity: [0.2, 0.4, 0.2], 
                      scale: [1.2, 1, 1.2] 
                    }}
                    transition={{ 
                      duration: 12, 
                      repeat: Infinity,
                      repeatType: "reverse" 
                    }}
                  />
                  
                  {/* Geometric tech pattern overlay */}
                  <div className="absolute inset-0 opacity-5 mix-blend-screen" 
                       style={{ 
                         backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                         backgroundPosition: 'center',
                       }}
                  />
                </div>

                <div className="max-w-6xl mx-auto relative z-10">
                  {/* Section heading with animated gradient */}
                  <motion.div 
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    viewport={{ once: true }}
                  >
                    <motion.h2 
                      className="text-4xl md:text-5xl font-extrabold mb-4 text-transparent bg-clip-text"
                      style={{ 
                        backgroundImage: 'linear-gradient(to right, #c084fc, #818cf8, #38bdf8, #818cf8, #c084fc)',
                        backgroundSize: '300% auto',
                      }}
                      animate={{ 
                        backgroundPosition: ['0% center', '100% center', '0% center'],
                      }}
                      transition={{ 
                        duration: 10, 
                        repeat: Infinity,
                        repeatType: "loop" 
                      }}
                    >
                      Client Testimonials
                    </motion.h2>
                    <motion.div
                      className="h-1 w-24 mx-auto bg-gradient-to-r from-purple-600 via-blue-600 to-purple-600"
                      animate={{ 
                        scaleX: [1, 1.5, 1],
                        opacity: [0.6, 1, 0.6],
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity,
                        repeatType: "reverse" 
                      }}
                    />
                    <motion.p 
                      className="text-gray-300 max-w-2xl mx-auto mt-4 text-lg"
                      initial={{ opacity: 0 }}
                      whileInView={{ opacity: 1 }}
                      transition={{ duration: 1, delay: 0.2 }}
                      viewport={{ once: true }}
                    >
                      Hear what clients and collaborators have to say about working with me
                    </motion.p>
                  </motion.div>

                  {/* Testimonials carousel */}
                  <TestimonialCarousel />
                </div>
              </motion.section>

              <Element name="contact" className="optimize-scroll">
                <EnhancedContactSection />
              </Element>

              <footer className="py-10 px-8 bg-gray-900">
                <div className="max-w-4xl mx-auto text-center">
                  <p className="text-gray-400 mb-4">© 2025 Kirthik Ramadoss. All rights reserved.</p>
                  <div className="flex justify-center gap-6 mb-4">
                    <a 
                      href="https://github.com/KirthikR" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-pink-500 transition-colors"
                    >
                      <Github className="w-6 h-6" />
                    </a>
                    <a 
                      href="https://www.linkedin.com/in/kirthik-r-3413a7233/" 
                      target="_blank" 
                      rel="noopener noreferrer" 
                      className="text-gray-400 hover:text-blue-500 transition-colors"
                    >
                      <Linkedin className="w-6 h-6" />
                    </a>
                    <a 
                      href="mailto:kirthikramadoss@gmail.com" 
                      className="text-gray-400 hover:text-green-500 transition-colors"
                    >
                      <Mail className="w-6 h-6" />
                    </a>
                  </div>
                  
                  {/* Add cookie settings button to footer */}
                  <div className="flex justify-center">
                    <CookieSettings />
                  </div>
                </div>
              </footer>
              
              {/* Cookie Consent Banner */}
              <CookiesConsentBanner />
            </motion.div>
          )}
        </AnimatePresence>
      </ScrollOptimizationProvider>
    </CookieConsentProvider>
  );
}

// Apply global performance optimizations
export default withPerformanceOptimizations(App, { 
  memoize: true,
  enableHardwareAcceleration: true,
  displayName: 'OptimizedApp'
});