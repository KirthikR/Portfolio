import React, { useState, useRef, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Code, Database, Cpu, Server, Layout, GitBranch, 
         Terminal, LineChart, Layers, Brain } from 'lucide-react';

interface Skill {
  name: string;
  level: number;
  icon: React.ReactNode;
  category: string;
  description: string;
}

interface SkillCategory {
  name: string;
  icon: React.ReactNode;
  color: string;
}

const PremiumSkillsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCategory, setActiveCategory] = useState<string>('Frontend');
  const [hoveredSkill, setHoveredSkill] = useState<string | null>(null);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  
  // For intersection observer
  const { ref: sectionRef, inView } = useInView({
    threshold: 0.2,
    triggerOnce: false
  });
  
  const titleControls = useAnimation();
  const contentControls = useAnimation();
  
  useEffect(() => {
    if (inView) {
      titleControls.start('visible');
      contentControls.start('visible');
    } else {
      titleControls.start('hidden');
      contentControls.start('hidden');
    }
  }, [inView, titleControls, contentControls]);
  
  // Set container height for absolute positioning
  useEffect(() => {
    if (containerRef.current) {
      const resizeObserver = new ResizeObserver(entries => {
        for (let entry of entries) {
          setContainerHeight(entry.contentRect.height);
        }
      });
      
      resizeObserver.observe(containerRef.current);
      return () => resizeObserver.disconnect();
    }
  }, []);
  
  // Skill data
  const skillCategories: SkillCategory[] = [
    { name: 'Frontend', icon: <Layout className="w-6 h-6" />, color: 'from-blue-500 to-indigo-600' },
    { name: 'Backend', icon: <Server className="w-6 h-6" />, color: 'from-green-500 to-emerald-600' },
    { name: 'DevOps', icon: <GitBranch className="w-6 h-6" />, color: 'from-orange-500 to-amber-600' },
    { name: 'Data', icon: <LineChart className="w-6 h-6" />, color: 'from-purple-500 to-fuchsia-600' },
    { name: 'Design', icon: <Layers className="w-6 h-6" />, color: 'from-pink-500 to-rose-600' }
  ];
  
  const skills: Skill[] = [
    // Frontend Skills
    { name: 'React', level: 95, icon: <Code />, category: 'Frontend', 
      description: 'Expert in React with deep knowledge of hooks, context, and advanced patterns.' },
    { name: 'JavaScript', level: 90, icon: <Code />, category: 'Frontend', 
      description: 'Proficient in modern JavaScript (ES6+) with solid understanding of asynchronous patterns.' },
    { name: 'TypeScript', level: 88, icon: <Code />, category: 'Frontend', 
      description: 'Advanced TypeScript knowledge including generics, utility types, and strict type safety.' },
    { name: 'HTML/CSS', level: 92, icon: <Layout />, category: 'Frontend', 
      description: 'Strong foundation in semantic HTML and modern CSS including Grid, Flexbox, and animations.' },
    { name: 'Tailwind CSS', level: 90, icon: <Layout />, category: 'Frontend', 
      description: 'Expert in utility-first CSS with Tailwind for rapid UI development.' },
    { name: 'Next.js', level: 85, icon: <Code />, category: 'Frontend', 
      description: 'Extensive experience with Next.js for server-side rendering and static site generation.' },

    // Backend Skills
    { name: 'Node.js', level: 88, icon: <Server />, category: 'Backend', 
      description: 'Strong experience building scalable APIs and microservices with Node.js and Express.' },
    { name: 'Python', level: 82, icon: <Terminal />, category: 'Backend', 
      description: 'Proficient in Python for backend services, scripts, and data analysis.' },
    { name: 'GraphQL', level: 85, icon: <Database />, category: 'Backend', 
      description: 'Expert in designing and implementing GraphQL APIs with Apollo Server.' },
    { name: 'REST API', level: 90, icon: <Server />, category: 'Backend', 
      description: 'Extensive experience designing RESTful APIs with proper resource modeling and best practices.' },
    { name: 'MongoDB', level: 86, icon: <Database />, category: 'Backend', 
      description: 'Strong knowledge of MongoDB including schema design, indexing, and aggregation pipelines.' },
    { name: 'SQL', level: 84, icon: <Database />, category: 'Backend', 
      description: 'Proficient in SQL databases with focus on PostgreSQL and MySQL optimization.' },

    // DevOps Skills
    { name: 'Docker', level: 85, icon: <Cpu />, category: 'DevOps', 
      description: 'Experience containerizing applications and creating multi-stage build pipelines.' },
    { name: 'CI/CD', level: 82, icon: <GitBranch />, category: 'DevOps', 
      description: 'Implemented automated CI/CD pipelines using GitHub Actions and Jenkins.' },
    { name: 'AWS', level: 80, icon: <Server />, category: 'DevOps', 
      description: 'Experience with various AWS services including EC2, S3, Lambda, and CloudFormation.' },
    { name: 'Kubernetes', level: 75, icon: <Cpu />, category: 'DevOps', 
      description: 'Knowledge of container orchestration with Kubernetes for scaling applications.' },

    // Data Skills
    { name: 'Data Analysis', level: 88, icon: <LineChart />, category: 'Data', 
      description: 'Strong skills in data collection, cleaning, analysis and visualization.' },
    { name: 'SQL Queries', level: 90, icon: <Database />, category: 'Data', 
      description: 'Expert in complex SQL queries, joins, and data transformation.' },
    { name: 'Python Data', level: 85, icon: <LineChart />, category: 'Data', 
      description: 'Proficient with pandas, NumPy, and other Python data science libraries.' },
    { name: 'Data Viz', level: 82, icon: <LineChart />, category: 'Data', 
      description: 'Experience creating interactive dashboards and visualizations using various tools.' },

    // Design Skills
    { name: 'UI Design', level: 80, icon: <Layers />, category: 'Design', 
      description: 'Strong understanding of UI principles, layouts, and component design.' },
    { name: 'Figma', level: 85, icon: <Layers />, category: 'Design', 
      description: 'Proficient in Figma for UI design, prototyping, and design systems.' },
    { name: 'UX Research', level: 75, icon: <Brain />, category: 'Design', 
      description: 'Knowledge of user research methods, usability testing, and user-centered design.' },
    { name: 'Accessibility', level: 82, icon: <Layout />, category: 'Design', 
      description: 'Focus on creating accessible interfaces that follow WCAG guidelines.' },
  ];
  
  // Get skills for the active category
  const filteredSkills = skills.filter(skill => skill.category === activeCategory);
  
  // Get the gradient class for the active category
  const activeCategoryData = skillCategories.find(cat => cat.name === activeCategory);
  const gradientClass = activeCategoryData ? activeCategoryData.color : 'from-blue-500 to-indigo-600';
  
  return (
    <div 
      ref={sectionRef} 
      className="relative w-full py-24 bg-gradient-to-br from-gray-900 via-gray-800 to-black overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={`bg-${i}`}
            className="absolute rounded-full opacity-10 bg-gradient-to-br from-blue-600/30 to-purple-600/30"
            style={{
              width: 200 + Math.random() * 400,
              height: 200 + Math.random() * 400,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              filter: 'blur(60px)',
            }}
            animate={{
              x: [Math.random() * 40 - 20, Math.random() * 40 - 20],
              y: [Math.random() * 40 - 20, Math.random() * 40 - 20],
              opacity: [0.05, 0.15, 0.05],
              scale: [1, 1.1, 1],
            }}
            transition={{
              repeat: Infinity,
              duration: 10 + Math.random() * 20,
              repeatType: "reverse",
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
      
      {/* Content container */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6">
        {/* Section title */}
        <motion.div 
          initial="hidden"
          animate={titleControls}
          variants={{
            hidden: { opacity: 0, y: -20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" } 
            }
          }}
          className="text-center mb-16"
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-black"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <span className="inline-block bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Professional Skills
            </span>
          </motion.h2>
          <motion.div 
            className="w-24 h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 mx-auto rounded-full mt-4"
            initial={{ width: 0 }}
            animate={inView ? { width: 96 } : {}}
            transition={{ duration: 1, delay: 0.4 }}
          />
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-6 text-gray-300 max-w-3xl mx-auto"
          >
            My technical expertise spans across various domains with a strong foundation in both frontend and backend technologies.
            Click on a category to explore my skills in detail.
          </motion.p>
        </motion.div>
        
        {/* Skill categories navigation */}
        <motion.div 
          initial="hidden"
          animate={contentControls}
          variants={{
            hidden: { opacity: 0, y: 50 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { duration: 0.6, ease: "easeOut" } 
            }
          }}
          className="mb-12"
        >
          <div className="flex flex-wrap justify-center gap-3">
            {skillCategories.map((category, index) => (
              <motion.button
                key={category.name}
                onClick={() => setActiveCategory(category.name)}
                className={`px-4 py-3 rounded-lg flex items-center gap-2 transition-all duration-300 ${
                  activeCategory === category.name
                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                    : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50'
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
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
        </motion.div>
        
        {/* Skills display */}
        <div ref={containerRef} className="relative min-h-[400px]">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {filteredSkills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`relative bg-gray-800/40 backdrop-blur-sm rounded-xl p-6 border border-white/5 transition-all duration-300 ${
                    hoveredSkill === skill.name ? 'shadow-xl shadow-indigo-500/10 scale-105' : ''
                  }`}
                  onMouseEnter={() => setHoveredSkill(skill.name)}
                  onMouseLeave={() => setHoveredSkill(null)}
                  whileHover={{ scale: 1.05 }}
                >
                  {/* Top gradient line for elegance */}
                  <div className={`absolute top-0 left-6 right-6 h-0.5 bg-gradient-to-r ${gradientClass} rounded-full`} />
                  
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-br ${gradientClass}`}>
                      {skill.icon}
                    </div>
                    <div className="text-2xl font-bold text-white">{skill.level}%</div>
                  </div>
                  
                  <h3 className="text-xl font-semibold text-white mb-2">{skill.name}</h3>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${skill.level}%` }}
                    transition={{ duration: 1, delay: 0.2 + index * 0.1 }}
                    className="h-1.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-full mb-3"
                  />
                  
                  {/* Description with elegant transition */}
                  <AnimatePresence>
                    {hoveredSkill === skill.name && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <p className="text-gray-300">{skill.description}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                  
                  {/* When not hovered, show a hint about hovering */}
                  {hoveredSkill !== skill.name && (
                    <motion.p 
                      initial={{ opacity: 0.8 }}
                      animate={{ opacity: 0.6 }}
                      className="text-sm text-gray-400 italic"
                    >
                      Hover for details
                    </motion.p>
                  )}
                </motion.div>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
        
        {/* Professional summary */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16 bg-gradient-to-br from-gray-800/50 to-gray-900/50 p-8 rounded-2xl backdrop-blur-md border border-white/5"
        >
          <h3 className="text-xl md:text-2xl font-bold text-center text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-blue-400 mb-6">
            Professional Experience Summary
          </h3>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <motion.div 
                className="text-5xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 100, delay: 0.9 }}
              >
                5+
              </motion.div>
              <p className="text-gray-300">Years of Experience</p>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-5xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 100, delay: 1.0 }}
              >
                30+
              </motion.div>
              <p className="text-gray-300">Projects Completed</p>
            </div>
            
            <div className="text-center">
              <motion.div 
                className="text-5xl font-bold text-white mb-2"
                initial={{ scale: 0 }}
                animate={inView ? { scale: 1 } : {}}
                transition={{ type: "spring", stiffness: 100, delay: 1.1 }}
              >
                12+
              </motion.div>
              <p className="text-gray-300">Technologies Mastered</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default PremiumSkillsSection;
