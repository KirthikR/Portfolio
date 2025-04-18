import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import {
  Code, Database, Cpu, Server, Layout, GitBranch, 
  Terminal, LineChart, Layers, Briefcase, Brain,
  Sparkles, Award, Zap, Bookmark, Star
} from 'lucide-react';

// Import styles
import '../styles/animations.css';

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

const OptimizedSkillsSection: React.FC = () => {
  // State for interactive elements
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const [showFeatured, setShowFeatured] = useState<boolean>(true);
  const [skillViewMode, setSkillViewMode] = useState<'grid' | 'carousel'>('grid');
  
  // Custom hook to detect if user is actively scrolling
  const [isScrolling, setIsScrolling] = useState(false);
  const scrollTimer = useRef<NodeJS.Timeout | null>(null);
  
  // Performance optimization - only animate when in view
  const { ref: sectionRef, inView } = useInView({ 
    threshold: 0.05,
    triggerOnce: false,
    rootMargin: '100px 0px'
  });
  
  // Container references
  const containerRef = useRef<HTMLDivElement>(null);
  const gridContainerRef = useRef<HTMLDivElement>(null);
  
  // Animation controls
  const headerControls = useAnimation();
  const categoryControls = useAnimation();
  const skillsControls = useAnimation();
  const summaryControls = useAnimation();

  // Use throttled handler for mouse movement
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isScrolling || !containerRef.current) return;
    
    // We don't need precise tracking for the effect, so we 
    // throttle implicitly by only updating on animation frame
    if (!window.requestAnimationFrame) return;
    
    requestAnimationFrame(() => {
      if (!containerRef.current) return;
      // Use simpler calculations
      const rect = containerRef.current.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      containerRef.current.style.setProperty('--mouse-x', `${x}%`);
      containerRef.current.style.setProperty('--mouse-y', `${y}%`);
    });
  }, [isScrolling]);
  
  // Detect scroll events globally
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true);
      
      // Clear existing timer
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
      
      // Set a timeout to mark scrolling as finished
      scrollTimer.current = setTimeout(() => {
        setIsScrolling(false);
      }, 150);
    };
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) {
        clearTimeout(scrollTimer.current);
      }
    };
  }, []);

  // Categories with rich metadata
  const categories: CategoryData[] = useMemo(() => [
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
  ], []);

  // Skills data - memoized to prevent recalculation
  const skills: SkillData[] = useMemo(() => [
    // Frontend Skills
    { 
      name: 'React', 
      level: 96, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Expert in React with deep knowledge of hooks, context, advanced patterns, and the ecosystem.',
      featured: true,
      showcases: ['Built complex SPAs', 'Created reusable component libraries', 'Implemented custom hooks']
    },
    { 
      name: 'JavaScript', 
      level: 94, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Proficient in modern JavaScript (ES6+) with understanding of asynchronous patterns and functional concepts.',
      featured: true,
      showcases: ['Complex async workflows', 'Performance optimization', 'Modern JS applications']
    },
    { 
      name: 'TypeScript', 
      level: 90, 
      icon: <Code className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Advanced TypeScript knowledge including generics, utility types, and type-safe code.',
      featured: true,
      showcases: ['Type-safe applications', 'Custom utility types', 'Complex TypeScript architectures']
    },
    // Add more frontend skills...
    { 
      name: 'HTML/CSS', 
      level: 92, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Strong foundation in semantic HTML and modern CSS including Grid, Flexbox, and animations.',
      showcases: ['Responsive layouts', 'Cross-browser compatibility', 'Advanced animations']
    },
    { 
      name: 'Tailwind CSS', 
      level: 95, 
      icon: <Layout className="w-6 h-6" />, 
      category: 'Frontend', 
      description: 'Expert in utility-first CSS with Tailwind for rapid UI development.',
      showcases: ['Custom design systems', 'Component libraries', 'Responsive interfaces']
    },
    
    // Backend Skills
    { 
      name: 'Node.js', 
      level: 92, 
      icon: <Server className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Building high-performance, scalable server applications and APIs using Node.js.',
      featured: true,
      showcases: ['RESTful APIs', 'Real-time applications', 'Microservices']
    },
    { 
      name: 'Python', 
      level: 85, 
      icon: <Terminal className="w-6 h-6" />, 
      category: 'Backend', 
      description: 'Developing robust backend solutions and data processing pipelines with Python.',
      showcases: ['Django/Flask APIs', 'Data processing', 'Automation scripts']
    },
    
    // DevOps Skills
    { 
      name: 'Docker', 
      level: 89, 
      icon: <Cpu className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Containerizing applications and creating efficient multi-stage build pipelines.',
      featured: true,
      showcases: ['Multi-stage builds', 'Docker Compose', 'Optimized images']
    },
    { 
      name: 'AWS', 
      level: 82, 
      icon: <Server className="w-6 h-6" />, 
      category: 'DevOps', 
      description: 'Experience with various AWS services for building scalable cloud solutions.',
      showcases: ['Serverless architecture', 'Infrastructure as code', 'Cloud optimization']
    },
    
    // Data Skills
    { 
      name: 'Data Analysis', 
      level: 88, 
      icon: <LineChart className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Strong skills in data collection, cleaning, analysis and visualization.',
      featured: true,
      showcases: ['Trend analysis', 'Data cleaning pipelines', 'Statistical modeling']
    },
    { 
      name: 'Python Data', 
      level: 86, 
      icon: <LineChart className="w-6 h-6" />, 
      category: 'Data', 
      description: 'Proficient with pandas, NumPy, and other Python data science libraries.',
      showcases: ['Data pipelines', 'Statistical analysis', 'Jupyter notebooks']
    },
    
    // Design Skills
    { 
      name: 'UI Design', 
      level: 80, 
      icon: <Layers className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Strong understanding of UI principles and component design.',
      showcases: ['Design systems', 'Component libraries', 'Visual hierarchy']
    },
    { 
      name: 'Figma', 
      level: 85, 
      icon: <Layers className="w-6 h-6" />, 
      category: 'Design', 
      description: 'Proficient in Figma for UI design, prototyping, and design systems.',
      featured: true,
      showcases: ['Interactive prototypes', 'Design handoff', 'Component libraries']
    },
  ], []);

  // Get filtered and sorted skills - memoized for performance
  const filteredSkills = useMemo(() => {
    let filtered = skills.filter(skill => skill.category === activeCategory);
    
    if (showFeatured) {
      return filtered.sort((a, b) => {
        if (a.featured && !b.featured) return -1;
        if (!a.featured && b.featured) return 1;
        return b.level - a.level;
      });
    }
    
    return filtered.sort((a, b) => b.level - a.level);
  }, [skills, activeCategory, showFeatured]);

  // Get current category
  const currentCategory = useMemo(() => 
    categories.find(cat => cat.name === activeCategory),
    [categories, activeCategory]
  );

  // Animation control based on viewport visibility
  useEffect(() => {
    if (inView && !isScrolling) {
      headerControls.start('visible');
      categoryControls.start('visible');
      skillsControls.start('visible');
      summaryControls.start('visible');
    }
  }, [inView, isScrolling, headerControls, categoryControls, skillsControls, summaryControls]);

  // Component for each skill card - memoized to prevent unnecessary re-renders
  const SkillCard = React.memo(({ skill }: { skill: SkillData }) => {
    const isSelected = selectedSkill === skill.name;
    
    return (
      <motion.div
        className={`bg-gradient-to-br from-gray-800/60 to-gray-900/80 p-0.5 rounded-lg overflow-hidden ${
          isSelected ? 'ring-2 ring-offset-2 ring-offset-gray-900 ring-indigo-500' : ''
        }`}
        whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
        whileTap={{ scale: 0.98 }}
        style={{ 
          willChange: 'transform',
          transform: 'translateZ(0)'
        }}
      >
        <div className="bg-gray-900/80 p-4 h-full rounded-lg border border-white/5">
          <div className="flex justify-between items-start mb-3">
            <div className="flex items-center">
              <div className={`p-2 mr-3 rounded-md bg-gradient-to-br ${currentCategory?.color}`}>
                {skill.icon}
              </div>
              <h4 className="font-bold text-white">{skill.name}</h4>
            </div>
            {skill.featured && (
              <div className="bg-amber-500/10 p-1 rounded">
                <Star className="w-4 h-4 text-amber-400" />
              </div>
            )}
          </div>
          
          <div className="mb-3">
            <div className="flex justify-between text-xs text-gray-400 mb-1">
              <span>Mastery Level</span>
              <span className="text-indigo-400">{skill.level}%</span>
            </div>
            <div className="h-1.5 bg-gray-800 rounded-full overflow-hidden">
              <motion.div 
                className={`h-full rounded-full bg-gradient-to-r ${currentCategory?.color}`}
                initial={{ width: 0 }}
                animate={{ width: `${skill.level}%` }}
                transition={{ duration: 0.6, delay: 0.1 }}
              />
            </div>
          </div>
          
          <p className="text-gray-400 text-sm line-clamp-2 mb-auto">
            {skill.description}
          </p>
        </div>
      </motion.div>
    );
  });

  // The ViewModeButton component - memoized
  const ViewModeButton = React.memo(({ mode, label, icon }: { 
    mode: 'grid' | 'carousel', 
    label: string, 
    icon: React.ReactNode 
  }) => (
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
  ));

  // Featured Skill Card - with reduced animations for performance
  const FeaturedSkillCard = React.memo(({ skill }: { skill: SkillData }) => (
    <div className="col-span-full bg-gradient-to-br from-gray-800/60 via-gray-800/40 to-gray-800/60 p-1 rounded-xl">
      <div className="relative overflow-hidden rounded-xl border border-white/5 h-full">
        <div className="relative p-5 h-full bg-gradient-to-br from-gray-900/80 via-gray-800/80 to-gray-900/80">
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
                <div className="h-2 bg-gray-700/50 rounded-full overflow-hidden">
                  <motion.div 
                    className={`h-full rounded-full bg-gradient-to-r ${currentCategory?.color}`}
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
              </div>
              
              <p className="text-gray-300 mb-4">{skill.description}</p>
            </div>
            
            {/* Skill showcases */}
            {skill.showcases && (
              <div className="md:w-2/5">
                <h4 className="text-lg font-semibold text-indigo-300 mb-3">Key Applications</h4>
                <div className="space-y-2">
                  {skill.showcases.slice(0, 3).map((showcase, idx) => (
                    <div 
                      key={`${skill.name}-showcase-${idx}`}
                      className="bg-gradient-to-r from-gray-800/40 to-gray-700/40 p-3 rounded-lg flex items-start space-x-2"
                    >
                      <Bookmark className="w-5 h-5 text-indigo-400 mt-0.5" />
                      <span className="text-gray-200">{showcase}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  ));

  // Animated counter for summary section
  const AnimatedCounter = React.memo(({ value, label, icon, delay = 0 }: { 
    value: number, 
    label: string, 
    icon: React.ReactNode, 
    delay?: number 
  }) => {
    const { ref, inView } = useInView({ triggerOnce: true, threshold: 0.3 });
    const [displayValue, setDisplayValue] = useState(0);
    
    useEffect(() => {
      if (!inView) return;
      
      let startTime = Date.now();
      let frameId: number | null = null;
      
      // Only animate when in view and after delay
      const timeout = setTimeout(() => {
        const animate = () => {
          const now = Date.now();
          const progress = Math.min((now - startTime) / 1500, 1);
          setDisplayValue(Math.floor(value * progress));
          
          if (progress < 1) {
            frameId = requestAnimationFrame(animate);
          }
        };
        
        frameId = requestAnimationFrame(animate);
      }, delay);
      
      return () => {
        clearTimeout(timeout);
        if (frameId !== null) cancelAnimationFrame(frameId);
      };
    }, [inView, value, delay]);
    
    return (
      <motion.div 
        ref={ref} 
        initial={{ opacity: 0, y: 30 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.6 }}
        className="text-center"
      >
        <div className="inline-flex items-center justify-center w-14 h-14 mb-4 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-600/20 text-indigo-400">
          {icon}
        </div>
        <div className="text-4xl font-bold text-white mb-2">{displayValue}+</div>
        <p className="text-gray-400">{label}</p>
      </motion.div>
    );
  });

  // Standard grid implementation (non-virtualized fallback)
  const StandardSkillGrid = () => {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {filteredSkills
          .filter(skill => !(showFeatured && skill.featured))
          .map((skill) => (
            <SkillCard key={skill.name} skill={skill} />
          ))}
      </div>
    );
  };

  // Standard carousel implementation (non-virtualized fallback)
  const StandardSkillCarousel = () => {
    return (
      <div className="flex space-x-6 overflow-x-auto py-6 px-2 snap-x snap-mandatory scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-900">
        {filteredSkills
          .filter(skill => !(showFeatured && skill.featured))
          .map((skill) => (
            <div key={skill.name} className="snap-start w-[280px] flex-shrink-0">
              <SkillCard skill={skill} />
            </div>
          ))}
      </div>
    );
  };

  return (
    <div 
      ref={sectionRef}
      id="skills"
      className="relative w-full py-20 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
    >
      {/* Simplified background effect with fewer particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <div
            key={`particle-${i}`}
            className="absolute rounded-full opacity-20"
            style={{
              width: 200,
              height: 200,
              left: `${i * 25}%`,
              top: `${Math.random() * 100}%`,
              background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15), transparent 70%)',
              transform: 'translateZ(0)',
              willChange: 'transform, opacity'
            }}
          />
        ))}
      </div>
      
      {/* Optimized light effect - using CSS variables instead of JS-driven motion values */}
      <div 
        ref={containerRef} 
        onMouseMove={handleMouseMove}
        className="absolute inset-0 pointer-events-none light-effect"
        style={{ 
          '--mouse-x': '50%',
          '--mouse-y': '50%'
        } as React.CSSProperties}
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
              transition: { duration: 0.8 } 
            }
          }}
        >
          <motion.div className="inline-block mb-2 px-4 py-1.5 bg-gradient-to-r from-indigo-900/30 to-purple-900/30 rounded-full backdrop-blur-md">
            <span className="text-indigo-400 flex items-center text-sm font-medium">
              <Sparkles className="w-4 h-4 mr-2" />
              Professional Expertise
            </span>
          </motion.div>
          
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Professional Skills & Expertise
            </span>
          </h2>
          
          <div className="h-1 w-24 mx-auto bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-6" />
          
          <p className="max-w-3xl mx-auto text-gray-300 text-lg">
            My skillset spans multiple domains with deep specialization in modern web technologies 
            and a focus on creating exceptional user experiences.
          </p>
        </motion.div>
        
        {/* Category Selector - optimized with fewer animations */}
        <div className="mb-10">
          <div className="flex flex-wrap justify-center gap-3 mb-8">
            {categories.map((category) => (
              <motion.button
                key={category.name}
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
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="text-center mb-8"
            >
              <p className="text-gray-300 max-w-3xl mx-auto">
                {currentCategory?.description}
              </p>
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* View Mode Controls - simplified */}
        <div className="flex flex-wrap justify-center gap-4 items-center mb-8">
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
        
        {/* Featured Skill - if available and enabled */}
        {showFeatured && filteredSkills.some(s => s.featured) && (
          <div className="mb-8">
            <FeaturedSkillCard skill={filteredSkills.find(s => s.featured)!} />
          </div>
        )}
        
        {/* Skills Display - non-virtualized fallback */}
        <div className="mb-16" ref={gridContainerRef}>
          <AnimatePresence mode="wait">
            {/* Grid View */}
            {skillViewMode === 'grid' && (
              <motion.div
                key="grid-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StandardSkillGrid />
              </motion.div>
            )}
            
            {/* Carousel View */}
            {skillViewMode === 'carousel' && (
              <motion.div
                key="carousel-view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
              >
                <StandardSkillCarousel />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        
        {/* Experience Summary - Using static values to reduce computation */}
        <div className="mt-16">
          <div className="bg-gradient-to-br from-indigo-900/10 to-purple-900/10 rounded-2xl p-8 backdrop-blur-md border border-indigo-900/20">
            <h3 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-300 to-purple-300 mb-10">
              Professional Experience & Achievements
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <AnimatedCounter 
                value={8} 
                label="Years Experience" 
                icon={<Briefcase className="w-6 h-6" />} 
                delay={0} 
              />
              <AnimatedCounter 
                value={75} 
                label="Projects" 
                icon={<Code className="w-6 h-6" />} 
                delay={100} 
              />
              <AnimatedCounter 
                value={12} 
                label="Technologies" 
                icon={<Star className="w-6 h-6" />} 
                delay={200} 
              />
              <AnimatedCounter 
                value={24} 
                label="Happy Clients" 
                icon={<Award className="w-6 h-6" />} 
                delay={300} 
              />
            </div>
            <div className="text-center mt-10">
              <motion.a
                href="#contact"
                className="inline-block px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="flex items-center space-x-2">
                  <span>Work With Me</span> 
                  <Zap className="w-5 h-5" />
                </span>
              </motion.a> 
            </div>
          </div>
        </div>
      </div>
      
      {/* CSS for optimized light effect */}
      <style dangerouslySetInnerHTML={{__html: `
        .light-effect {
          background: radial-gradient(
            circle at var(--mouse-x) var(--mouse-y), 
            rgba(99, 102, 241, 0.08), 
            transparent 40%
          );
          transform: translateZ(0);
          will-change: background;
        }
      `}} />
    </div>
  );
};

export default OptimizedSkillsSection;
