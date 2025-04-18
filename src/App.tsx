import { motion } from 'framer-motion';
import { Link as ScrollLink, Element } from 'react-scroll';
import { useState, useCallback, lazy, memo, useMemo, useRef, useEffect } from 'react';
import { Github, Linkedin, Mail, ExternalLink, Briefcase, GraduationCap, Code, Cpu, Database, Globe, Phone, MapPin, Send, Sun, Moon } from 'lucide-react';
import { useInView } from 'react-intersection-observer';
import { useMediaQuery } from './hooks/useMediaQuery';
import { withPerformanceOptimizations } from './performance/withPerformanceOptimizations';
import { ScrollOptimizationProvider } from './context/ScrollOptimizationContext';
import LuxuryAboutSection from './components/LuxuryAboutSection';
import OptimizedSkillsSection from './components/OptimizedSkillsSection';
import { AnimatePresence, LayoutGroup, useMotionValue, useTransform, useSpring } from 'framer-motion';
import UltraPremiumHeroSection from './components/UltraPremiumHeroSection';
import IntroScreen from './components/IntroScreen';

// Lazy load heavy components with appropriate loading states
const OptimizedFloatingBubbles = lazy(() => 
  import('./components/OptimizedFloatingBubbles')
);

const OptimizedProfessionalNameAnimation = lazy(() => 
  import('./components/OptimizedProfessionalNameAnimation')
);

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
    title: "E-commerce Platform",
    description: "Built a full-stack e-commerce platform using React, Node.js, and MongoDB",
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?auto=format&fit=crop&q=80&w=800",
    link: "#",
    github: "https://github.com/yourusername/ecommerce",
    category: "fullstack",
    technologies: ["React", "Node.js", "MongoDB", "Express"]
  },
  {
    id: "proj2",
    title: "AI Chat Application",
    description: "Developed a real-time chat application with AI integration",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=800",
    link: "#",
    github: "https://github.com/yourusername/ai-chat",
    category: "frontend",
    technologies: ["React", "WebSocket", "AI API", "TailwindCSS"]
  },
  {
    id: "proj3",
    title: "Data Visualization Dashboard",
    description: "Interactive dashboard for big data visualization with real-time updates",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800",
    link: "#",
    github: "https://github.com/yourusername/data-viz",
    category: "data",
    technologies: ["D3.js", "React", "Python", "PostgreSQL"]
  },
  {
    id: "proj4",
    title: "Mobile Fitness App",
    description: "Cross-platform mobile application for fitness tracking and meal planning",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=800",
    link: "#",
    github: "https://github.com/yourusername/fitness-app",
    category: "mobile",
    technologies: ["React Native", "Firebase", "Redux", "HealthKit"]
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
              <AnimatePresence mode="wait">
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
    submitted: false,
    submitting: false,
    error: null as string | null
  });

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

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormState(prev => ({ ...prev, [name]: value }));
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
    
    // Basic validation
    const nameValid = formState.name.length > 0;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email);
    const messageValid = formState.message.length > 0;
    
    if (!nameValid || !emailValid || !messageValid) {
      setFormState(prev => ({
        ...prev,
        nameValid,
        emailValid,
        messageValid
      }));
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
                  
                  <div className={`p-3 rounded-full bg-gradient-to-br ${card.color}`}>
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
              
              <AnimatePresence mode="wait">
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
                  
                    {/* Name input with animation */}
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
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.nameValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400`}
                          placeholder="John Doe"
                        />
                        <AnimatePresence>
                          {!formState.nameValid && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm mt-1"
                            >
                              Please enter your name
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    {/* Email input with animation */}
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
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.emailValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400`}
                          placeholder="john@example.com"
                        />
                        <AnimatePresence>
                          {!formState.emailValid && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm mt-1"
                            >
                              Please enter a valid email
                            </motion.p>
                          )}
                        </AnimatePresence>
                      </div>
                    </motion.div>
                    
                    {/* Message input with animation */}
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
                          rows={4}
                          className={`w-full px-4 py-3 rounded-lg focus:outline-none transition-all duration-300
                            bg-white/5 border ${
                              !formState.messageValid 
                                ? 'border-red-500 focus:border-red-500' 
                                : 'border-white/10 focus:border-blue-500'
                            } text-white placeholder-gray-400 resize-none`}
                          placeholder="Your message here..."
                        ></textarea>
                        <AnimatePresence>
                          {!formState.messageValid && (
                            <motion.p
                              initial={{ opacity: 0, y: -10 }}
                              animate={{ opacity: 1, y: 0 }}
                              exit={{ opacity: 0, y: -10 }}
                              className="text-red-500 text-sm mt-1"
                            >
                              Please enter your message
                            </motion.p>
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
                          <AnimatePresence mode="wait">
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
                      initial={{ scaleX: 0, opacity: 0 }}
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

            <Element name="contact" className="optimize-scroll">
              <EnhancedContactSection />
            </Element>

            <footer className="py-10 px-8 bg-gray-900">
              <div className="max-w-4xl mx-auto text-center">
                <p className="text-gray-400 mb-4">© 2025 Kirthik Ramadoss. All rights reserved.</p>
                <div className="flex justify-center gap-6">
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
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </ScrollOptimizationProvider>
  );
}

// Apply global performance optimizations
export default withPerformanceOptimizations(App, { 
  memoize: true,
  enableHardwareAcceleration: true,
  displayName: 'OptimizedApp'
});