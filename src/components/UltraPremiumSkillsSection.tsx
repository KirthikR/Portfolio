import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useAnimation, useMotionValue, useTransform } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code, Database, Cpu, Server, Layout, GitBranch, 
  Terminal, LineChart, Layers, Briefcase, Brain,
  Sparkles, Award, Zap, Bookmark, Star
} from 'lucide-react';

// Import components
import VirtualizedSkillGrid from './VirtualizedSkillGrid';
import VirtualizedSkillCarousel from './VirtualizedSkillCarousel';
import VirtualizedSkillMasonry from './VirtualizedSkillMasonry';

// Import styles
import '../styles/animations.css';

// Import scroll optimization context
import { useScrollOptimization } from '../context/ScrollOptimizationContext';

// Define interfaces
interface SkillData {
  name: string;
  level: number;
  icon: React.ReactNode;
  category: string;
  description: string;
  featured?: boolean;
  showcases?: string[];
}

interface CategoryData {
  name: string;
  icon: React.ReactNode;
  color: string;
  description: string;
}

// Default scroll optimization values if context isn't available
const defaultScrollState = { 
  isScrolling: false, 
  scrollPosition: 0,
  lastScrollTime: 0,
  scrollDirection: null as 'up' | 'down' | null 
};

const UltraPremiumSkillsSection: React.FC = () => {
  // State for interactive elements
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState<boolean>(true);
  const [skillViewMode, setSkillViewMode] = useState<'grid' | 'carousel' | 'masonry'>('grid');
  const [isExploding, setIsExploding] = useState<boolean>(false);
  
  // Use scroll optimization context with safer implementation
  let scrollState = defaultScrollState;
  try {
    scrollState = useScrollOptimization() || defaultScrollState;
  } catch (error) {
    console.warn("ScrollOptimizationContext not available, using default values");
  }
  
  const { isScrolling } = scrollState;
  const containerRef = useRef<HTMLDivElement>(null);
  const carouselRef = useRef<HTMLDivElement>(null);
  const { ref: sectionRef, inView } = useInView({ threshold: 0.05, triggerOnce: false });
  
  // Mouse position for interactive effects
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Animation controls
  const headerControls = useAnimation();
  const categoryControls = useAnimation();
  const skillsControls = useAnimation();
  const summaryControls = useAnimation();
  
  // Transform for parallax light effect
  const lightX = useTransform(mouseX, [-500, 500], [0, 100]);
  const lightY = useTransform(mouseY, [-500, 500], [0, 100]);

  // Categories with rich metadata
  const categories: CategoryData[] = [
    { 
      name: 'Frontend', 
      icon: <Layout className="w-6 h-6" />, 
      color: 'from-blue-500 to-indigo-600',
      description: 'Building beautiful, responsive user interfaces with modern frameworks and techniques.'
    },
    { 
      name: 'Backend', 
      icon: <Server className="w-6 h-6" />, 
      color: 'from-green-500 to-emerald-600',
      description: 'Developing robust server-side applications with focus on performance and reliability.'
    },
    { 
      name: 'DevOps', 
      icon: <GitBranch className="w-6 h-6" />, 
      color: 'from-orange-500 to-amber-600',
      description: 'Streamlining deployment workflows and building resilient infrastructure.'
    },
    { 
      name: 'Data', 
      icon: <LineChart className="w-6 h-6" />, 
      color: 'from-purple-500 to-fuchsia-600',
      description: 'Transforming raw data into actionable insights through analysis and visualization.'
    },
    { 
      name: 'Design', 
      icon: <Layers className="w-6 h-6" />, 
      color: 'from-pink-500 to-rose-600',
      description: 'Creating intuitive and aesthetically pleasing user experiences.'
    }
  ];

  // Comprehensive skills data
  const skills: SkillData[] = [
    // Frontend Skills
    { 
      name: 'React', 
      level: 96, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Expert in React with deep knowledge of hooks, context, advanced patterns, and the latest React ecosystem features.',
      featured: true,
      showcases: ['Built complex SPAs', 'Created reusable component libraries', 'Implemented custom hooks patterns']
    },
    { 
      name: 'JavaScript', 
      level: 94, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Proficient in modern JavaScript (ES6+) with comprehensive understanding of asynchronous patterns, closures, and functional programming concepts.',
      featured: true,
      showcases: ['Complex async workflows', 'Performance optimization', 'Modern JS applications']
    },
    { 
      name: 'TypeScript', 
      level: 90, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Advanced TypeScript knowledge including generics, utility types, strict type safety, and creating maintainable type systems.',
      featured: true,
      showcases: ['Type-safe applications', 'Custom utility types', 'Complex TypeScript architectures']
    },
    { 
      name: 'HTML/CSS', 
      level: 92, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Strong foundation in semantic HTML and modern CSS including Grid, Flexbox, animations, and CSS architecture patterns.',
      showcases: ['Responsive layouts', 'Cross-browser compatibility', 'Advanced animations']
    },
    { 
      name: 'Tailwind CSS', 
      level: 95, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Expert in utility-first CSS with Tailwind for rapid UI development and consistent design implementation.',
      showcases: ['Custom design systems', 'Component libraries', 'Responsive interfaces']
    },
    { 
      name: 'Next.js', 
      level: 88, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Extensive experience with Next.js for server-side rendering, static site generation, and building performant React applications.',
      showcases: ['Server components', 'API routes', 'Static optimization']
    },
    { 
      name: 'Framer Motion', 
      level: 86, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Creating fluid, beautiful animations and interactions with Framer Motion for enhanced UI/UX.',
      showcases: ['Page transitions', 'Micro-interactions', 'SVG animations']
    },

    // Backend Skills
    { 
      name: 'Node.js', 
      level: 92, 
      icon: <Server className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Building high-performance, scalable server applications and APIs using Node.js and its ecosystem.',
      featured: true,
      showcases: ['RESTful APIs', 'Real-time applications', 'Microservices']
    },
    { 
      name: 'Python', 
      level: 85, 
      icon: <Terminal className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Developing robust backend solutions and data processing pipelines with Python and its popular frameworks.',
      showcases: ['Django/Flask APIs', 'Data processing', 'Automation scripts']
    },
    { 
      name: 'GraphQL', 
      level: 88, 
      icon: <Database className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Designing and implementing efficient GraphQL APIs with Apollo Server and integrating with various data sources.',
      featured: true,
      showcases: ['Schema design', 'API federation', 'Subscription services']
    },
    { 
      name: 'REST API', 
      level: 94, 
      icon: <Server className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Expert in designing well-architected RESTful APIs with proper resource modeling, versioning, and best practices.',
      showcases: ['API versioning', 'Authentication/authorization', 'Documentation']
    },
    { 
      name: 'MongoDB', 
      level: 90, 
      icon: <Database className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Strong knowledge of MongoDB including schema design, indexing, aggregation pipelines, and performance optimization.',
      showcases: ['Complex aggregations', 'Indexing strategies', 'Schema design']
    },
    { 
      name: 'SQL', 
      level: 88, 
      icon: <Database className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Proficient in SQL databases with focus on PostgreSQL and MySQL optimization, complex queries, and performance tuning.',
      showcases: ['Query optimization', 'Schema migrations', 'Complex joins']
    },

    // DevOps Skills
    { 
      name: 'Docker', 
      level: 89, 
      icon: <Cpu className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Containerizing applications and creating efficient multi-stage build pipelines for consistent deployment environments.',
      featured: true,
      showcases: ['Multi-stage builds', 'Docker Compose', 'Optimized images']
    },
    { 
      name: 'CI/CD', 
      level: 87, 
      icon: <GitBranch className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Implementing automated CI/CD pipelines using GitHub Actions, Jenkins, and other tools for reliable deployments.',
      showcases: ['Automated testing', 'Deployment pipelines', 'Release automation']
    },
    { 
      name: 'AWS', 
      level: 82, 
      icon: <Server className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Experience with various AWS services including EC2, S3, Lambda, and CloudFormation for building scalable cloud solutions.',
      showcases: ['Serverless architecture', 'Infrastructure as code', 'Cloud optimization']
    },
    { 
      name: 'Kubernetes', 
      level: 78, 
      icon: <Cpu className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Knowledge of container orchestration with Kubernetes for scaling applications and managing microservices.',
      showcases: ['Service deployment', 'Scaling strategies', 'Resource management']
    },

    // Data Skills
    { 
      name: 'Data Analysis', 
      level: 88, 
      icon: <LineChart className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Strong skills in data collection, cleaning, analysis and visualization to extract meaningful insights.',
      featured: true,
      showcases: ['Trend analysis', 'Data cleaning pipelines', 'Statistical modeling']
    },
    { 
      name: 'SQL Queries', 
      level: 92, 
      icon: <Database className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Expert in complex SQL queries, joins, and data transformation for comprehensive data analysis.',
      showcases: ['Complex aggregations', 'Performance tuning', 'ETL processes']
    },
    { 
      name: 'Python Data', 
      level: 86, 
      icon: <LineChart className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Proficient with pandas, NumPy, and other Python data science libraries for data manipulation and analysis.',
      showcases: ['Data pipelines', 'Statistical analysis', 'Jupyter notebooks']
    },
    { 
      name: 'Data Viz', 
      level: 84, 
      icon: <LineChart className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Creating impactful, interactive dashboards and visualizations using D3.js, Tableau, and other tools.',
      showcases: ['Interactive dashboards', 'Storytelling with data', 'Business intelligence']
    },

    // Design Skills
    { 
      name: 'UI Design', 
      level: 80, 
      icon: <Layers className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Strong understanding of UI principles, layouts, and component design for creating visually appealing interfaces.',
      showcases: ['Design systems', 'Component libraries', 'Visual hierarchy']
    },
    { 
      name: 'Figma', 
      level: 85, 
      icon: <Layers className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Proficient in Figma for UI design, prototyping, and design systems to create cohesive digital experiences.',
      featured: true,
      showcases: ['Interactive prototypes', 'Design handoff', 'Component libraries']
    },
    { 
      name: 'UX Research', 
      level: 75, 
      icon: <Brain className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Knowledge of user research methods, usability testing, and user-centered design to create intuitive experiences.',
      showcases: ['User interviews', 'Usability testing', 'Journey mapping']
    },
    { 
      name: 'Accessibility', 
      level: 82, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Focus on creating accessible interfaces that follow WCAG guidelines and provide inclusive experiences.',
      showcases: ['ARIA implementation', 'Screen reader testing', 'Keyboard navigation']
    },
  ];

  // Handle mouse movement for 3D and lighting effects
  const handleMouseMove = (e: React.MouseEvent) => {
    if (isScrolling || !containerRef.current) return;
    
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    
    mouseX.set(x);
    mouseY.set(y);
  };

  // Filtered skills
  const getSkills = () => {
    let filtered = skills.filter(skill => skill.category === activeCategory);
    
    if (showFeatured) {
      return filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.level - a.level;
      });
    }
    
    return filtered.sort((a, b) => b.level - a.level);
  };

  // Get the current category data
  const currentCategory = categories.find(cat => cat.name === activeCategory);
  
  // Animation control based on viewport visibility
  useEffect(() => {
    if (inView && !isScrolling) {
      headerControls.start('visible');
      categoryControls.start('visible');
      skillsControls.start('visible');
      summaryControls.start('visible');
    }
  }, [inView, isScrolling, headerControls, categoryControls, skillsControls, summaryControls]);
  
  // Carousel scroll based on selected skill
  useEffect(() => {
    if (skillViewMode === 'carousel' && selectedSkill && carouselRef.current) {
      const skillElements = carouselRef.current.querySelectorAll('.skill-card');
      const selectedIndex = getSkills().findIndex(s => s.name === selectedSkill);
      
      if (selectedIndex >= 0 && skillElements[selectedIndex]) {
        const element = skillElements[selectedIndex] as HTMLElement;
        const centerPosition = element.offsetLeft - (carouselRef.current.clientWidth / 2) + (element.offsetWidth / 2);
        
        carouselRef.current.scrollTo({
          left: centerPosition,
          behavior: 'smooth'
        });
      }
    }
  }, [selectedSkill, skillViewMode]);
  
  // Special explosion animation effect
  const triggerExplosionEffect = () => {
    if (isExploding) return;
    setIsExploding(true);
    setTimeout(() => setIsExploding(false), 1000);
  };
  
  // Navigation buttons for skill view modes
  const ViewModeButton = ({ mode, label, icon }: { mode: 'grid' | 'carousel' | 'masonry', label: string, icon: React.ReactNode }) => (
    <motion.button
      onClick={() => setSkillViewMode(mode)}
      className={`px-3 py-2 rounded-lg flex items-center space-x-2 transition-all ${
        skillViewMode === mode 
          ? `bg-gradient-to-r ${currentCategory?.color} text-white shadow-lg` 
          : 'bg-gray-800/40 text-gray-300 hover:bg-gray-700/60'
      }`}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon}
      <span className="text-sm">{label}</span>
    </motion.button>
  );
  
  // Interactive card for the featured skill
  const FeaturedSkillCard = ({ skill }: { skill: SkillData }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    
    useEffect(() => {
      // Check if running in browser environment
      if (typeof window !== 'undefined') {
        setIsMobile(window.innerWidth < 768);
        
        const handleResize = () => {
          setIsMobile(window.innerWidth < 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
      }
    }, []);
    
    return (
      <div className="col-span-full bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-800/60 p-1 rounded-xl backdrop-blur-md">
        <div className="relative overflow-hidden rounded-xl backdrop-blur-lg border border-white/5 h-full">
          {/* Animated gradient border */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 animate-gradient-x"></div>
          </div>
          
          <div className="relative p-6 h-full bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80">
            <div className="flex flex-col md:flex-row gap-6">
              {/* Skill info */}
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`p-3 rounded-lg bg-gradient-to-br ${currentCategory?.color}`}>
                    {skill.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-white flex items-center space-x-2">
                      <span>{skill.name}</span>
                      <Sparkles className="w-5 h-5 text-yellow-400" />
                    </h3>
                    <p className="text-gray-300">{skill.category}</p>
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium text-gray-300">Mastery Level</span>
                    <span className="text-sm text-indigo-300 font-medium">{skill.level}%</span>
                  </div>
                  <div className="h-2.5 bg-gray-700/50 rounded-full overflow-hidden">
                    <motion.div 
                      className={`h-full rounded-full bg-gradient-to-r ${currentCategory?.color}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: 0.2 }}
                    />
                  </div>
                </div>
                
                <p className="text-gray-300 mb-4">{skill.description}</p>
                
                <motion.button
                  onClick={() => setIsExpanded(!isExpanded)}
                  className={`px-4 py-2 rounded-lg text-sm transition-all ${
                    isExpanded ? 'bg-gray-700/60 text-white' : 'bg-gray-800/40 text-gray-300'
                  }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {isExpanded ? 'Show Less' : 'Learn More'}
                </motion.button>
              </div>
              
              {/* Skill showcases */}
              {skill.showcases && (
                <AnimatePresence mode="sync">
                  {(isExpanded || !isMobile) && (
                    <motion.div 
                      key={`showcase-${skill.name}`}
                      className="md:w-2/5 space-y-2"
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <h4 className="text-lg font-semibold text-indigo-300 mb-3">Key Applications</h4>
                      <div className="grid grid-cols-1 gap-2">
                        {skill.showcases.map((showcase, idx) => (
                          <motion.div 
                            key={`${skill.name}-showcase-${idx}`}
                            className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 p-3 rounded-lg flex items-start space-x-2"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                          >
                            <Bookmark className="w-5 h-5 text-indigo-400 mt-0.5" />
                            <span className="text-gray-200">{showcase}</span>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Animated counters for experience summary
  const AnimatedCounter = ({ value, label, icon, delay = 0 }: { value: number, label: string, icon: React.ReactNode, delay?: number }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      let startTime: number;
      let animFrame: number | null = null;
      
      if (inView) {
        const animate = (timestamp: number) => {
          if (!startTime) startTime = timestamp;
          const progress = timestamp - startTime;
          const percentage = Math.min(progress / 2000, 1);
          setDisplayValue(Math.floor(value * percentage));
          if (percentage < 1) {
            animFrame = requestAnimationFrame(animate);
          }
        };
        // Delay start of animation based on index
        const timer = setTimeout(() => {
          animFrame = requestAnimationFrame(animate);
        }, delay);
        
        return () => {
          clearTimeout(timer);
          if (animFrame !== null) {
            cancelAnimationFrame(animFrame);
          }
        };
      }
      
      return undefined;
    }, [inView, value, delay]);
    
    return (
      <motion.div 
        ref={ref} 
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8, delay: delay / 1000 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-400">
          {icon}
        </div>
        <div className="text-5xl font-bold text-white mb-2">{displayValue}+</div>
        <p className="text-gray-400">{label}</p>
      </motion.div>
    );
  };

  return (
    <div 
      ref={sectionRef}
      className="relative w-full py-28 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Background Particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={`particle-${i}`}
            className="absolute rounded-full bg-blue-600/10"
            style={{
              width: 100 + Math.random() * 300,
              height: 100 + Math.random() * 300,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              filter: 'blur(80px)',
            }}
            animate={{
              x: [
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
              ],
              y: [
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
                Math.random() * 40 - 20,
              ],
              opacity: [0.1, 0.2, 0.1],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15 + Math.random() * 15,
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Explosion effect particles */}
      <AnimatePresence mode="sync">
        {isExploding && (
          <motion.div
            key="explosion-container"
            className="absolute inset-0 pointer-events-none z-20"
          >
            {[...Array(20)].map((_, i) => (
              <motion.div 
                key={`explosion-particle-${i}`}
                className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-indigo-500 to-purple-500"
                style={{
                  left: '50%',
                  top: '50%',
                }}
                initial={{ 
                  scale: 0,
                  opacity: 1,
                  x: 0,
                  y: 0,
                }}
                animate={{ 
                  scale: Math.random() * 5,
                  x: (Math.random() - 0.5) * 500,
                  y: (Math.random() - 0.5) * 500,
                  opacity: 0,
                }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 0.8 + Math.random() * 0.5,
                  ease: "easeOut"
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Light Gradient Effect based on mouse position */}
      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at ${lightX.get()}% ${lightY.get()}%, rgba(99, 102, 241, 0.08), transparent 40%)`,
        }}
      />
      
      <div className="relative container mx-auto px-4 sm:px-6 z-10">
        {/* Section Header */}
        <motion.div 
          className="text-center mb-16"
          initial="hidden"
          animate={headerControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { 
                duration: 0.8,
                staggerChildren: 0.2
              } 
            }
          }}
        >
          <motion.div
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
            }}
            className="inline-block mb-2 px-4 py-1.5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-full backdrop-blur-md"
          >
            <span className="text-indigo-400 flex items-center text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Expertise
            </span>
          </motion.div>
          <motion.h2 
            variants={{
              hidden: { opacity: 0, y: -20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.1 } }
            }}
            className="text-4xl md:text-5xl font-black mb-4"
          >
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Professional Skills & Expertise
            </span>
          </motion.h2>
          <motion.div 
            variants={{
              hidden: { width: 0 },
              visible: { width: 100, transition: { duration: 0.8, delay: 0.3 } }
            }}
            className="h-1 w-24 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6"
          />
          <motion.p
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.4 } }
            }}
            className="max-w-3xl mx-auto text-gray-300 text-lg"
          >
            My skillset spans multiple domains with deep specialization in modern web technologies 
            and a focus on creating exceptional user experiences. Explore my expertise below.
          </motion.p>
        </motion.div>
        
        {/* Category Selector */}
        <motion.div 
          className="mb-12"
          initial="hidden"
          animate={categoryControls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.6, 
                when: "beforeChildren",
                staggerChildren: 0.1
              } 
            }
          }}
        >
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category, index) => (
              <motion.button
                key={category.name}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 }
                }}
                onClick={() => {
                  setActiveCategory(category.name);
                  setSelectedSkill(null);
                }}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all ${
                  activeCategory === category.name 
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg` 
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <span className={activeCategory === category.name ? 'text-white' : 'text-gray-400'}>
                  {category.icon}
                </span>
                <span className="font-medium">{category.name}</span>
              </motion.button>
            ))}
          </div>
          {/* Category Description */}
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="text-center mb-8"
            >
              <p className="text-gray-300 max-w-3xl mx-auto">
                {currentCategory?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </motion.div>
        
        {/* View Mode and Filter Controls */}
        <div className="flex flex-wrap justify-center gap-4 items-center">
          <div className="flex gap-2">
            <ViewModeButton 
              mode="grid" 
              label="Grid" 
              icon={<Layers className="w-4 h-4" />} 
            />
            <ViewModeButton 
              mode="carousel" 
              label="Carousel" 
              icon={<Cpu className="w-4 h-4" />} 
            />
            <ViewModeButton 
              mode="masonry" 
              label="Masonry" 
              icon={<Layout className="w-4 h-4" />} 
            />
          </div>
          <div className="h-6 border-r border-gray-700"></div>
          <motion.button
            onClick={() => setShowFeatured(!showFeatured)}
            className={`px-3 py-2 rounded-lg flex items-center space-x-2 ${
              showFeatured 
                ? 'bg-gradient-to-r from-amber-600 to-orange-600 text-white' 
                : 'bg-gray-800/40 text-gray-300'
            }`}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Star className="w-4 h-4" />
            <span className="text-sm">Featured First</span>
          </motion.button>
        </div>
        
        {/* Skills Display - Adaptive layout based on view mode */}
        <motion.div 
          initial="hidden"
          animate={skillsControls}
          variants={{
            hidden: { opacity: 0 },
            visible: { 
              opacity: 1, 
              transition: { staggerChildren: 0.05 } 
            }
          }}
        >
          {/* Featured Skill rendered separately from the view modes */}
          {showFeatured && getSkills().some(s => s.featured) && (
            <motion.div
              key="featured-skill-container"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <FeaturedSkillCard skill={getSkills().find(s => s.featured)!} />
            </motion.div>
          )}
          
          {/* View mode switching */}
          <AnimatePresence mode="sync">
            {/* Grid View - Virtualized */}
            {skillViewMode === 'grid' && (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
              >
                <VirtualizedSkillGrid 
                  skills={getSkills().filter(skill => !(showFeatured && skill.featured))}
                  selectedSkill={selectedSkill}
                  hoveredSkill={hoveredSkill}
                  setSelectedSkill={setSelectedSkill}
                  setHoveredSkill={setHoveredSkill}
                  currentCategory={currentCategory}
                />
              </motion.div>
            )}
            
            {/* Carousel View - Virtualized */}
            {skillViewMode === 'carousel' && (
              <motion.div
                key="carousel-view"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <VirtualizedSkillCarousel
                  skills={getSkills().filter(skill => !(showFeatured && skill.featured))}
                  selectedSkill={selectedSkill}
                  hoveredSkill={hoveredSkill}
                  setSelectedSkill={setSelectedSkill}
                  setHoveredSkill={setHoveredSkill}
                  currentCategory={currentCategory}
                  carouselRef={carouselRef}
                />
              </motion.div>
            )}
            
            {/* Masonry View - Virtualized */}
            {skillViewMode === 'masonry' && (
              <motion.div
                key="masonry-view"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.5 }}
                className="mt-8"
              >
                <VirtualizedSkillMasonry
                  skills={getSkills().filter(skill => !(showFeatured && skill.featured))}
                  selectedSkill={selectedSkill}
                  hoveredSkill={hoveredSkill}
                  setSelectedSkill={setSelectedSkill}
                  setHoveredSkill={setHoveredSkill}
                  currentCategory={currentCategory}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        
        {/* Experience Summary - Using counters for visual interest */}
        <motion.div 
          className="mt-20 relative z-20"
          initial="hidden"
          animate={summaryControls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { opacity: 1, y: 0 }
          }}
        >
          <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 rounded-2xl p-8 md:p-12 backdrop-blur-md border border-indigo-900/20 shadow-xl shadow-indigo-900/5">
            <h3 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 via-purple-300 to-pink-300 mb-10">
              Professional Experience & Achievements
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <AnimatedCounter 
                value={8} 
                label="Years Experience" 
                icon={<Briefcase className="w-8 h-8" />} 
                delay={0} 
              />
              <AnimatedCounter 
                value={75} 
                label="Projects Completed" 
                icon={<Code className="w-8 h-8" />} 
                delay={200} 
              />
              <AnimatedCounter 
                value={12} 
                label="Technologies Mastered" 
                icon={<Star className="w-8 h-8" />} 
                delay={400} 
              />
              <AnimatedCounter 
                value={24} 
                label="Client Satisfaction" 
                icon={<Award className="w-8 h-8" />} 
                delay={600} 
              />
            </div>
            <div className="text-center mt-10">
              <motion.button
                className="px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium shadow-lg shadow-indigo-600/20 transition-all"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 20px 25px -5px rgba(79, 70, 229, 0.2), 0 10px 10px -5px rgba(79, 70, 229, 0.1)"
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => window.open('#contact', '_self')}
              >
                <span className="flex items-center space-x-2">
                  <span>Work With Me</span> 
                  <Zap className="w-5 h-5" />
                </span>
              </motion.button> 
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Add custom CSS for the gradient animation */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes gradient-x {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .animate-gradient-x {
          background-size: 200% 200%;
          animation: gradient-x 15s ease infinite;
        }
      `}} />
    </div>
  ); 
};

export { UltraPremiumSkillsSection };
