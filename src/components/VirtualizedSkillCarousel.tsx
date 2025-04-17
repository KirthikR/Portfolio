import React from 'react';
import { motion } from 'framer-motion';
import { Award, ChevronLeft, ChevronRight } from 'lucide-react';
import './VirtualizedSkillCarousel.css';

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

interface VirtualizedSkillCarouselProps {
  skills: SkillData[];
  selectedSkill: string | null;
  hoveredSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  setHoveredSkill: (skill: string | null) => void;
  currentCategory?: CategoryData;
  carouselRef: React.RefObject<HTMLDivElement>;
}

const VirtualizedSkillCarousel: React.FC<VirtualizedSkillCarouselProps> = ({
  skills,
  selectedSkill,
  hoveredSkill,
  setSelectedSkill,
  setHoveredSkill,
  currentCategory,
  carouselRef
}) => {
  const scroll = (direction: 'left' | 'right') => {
    if (carouselRef.current) {
      const scrollAmount = carouselRef.current.clientWidth * 0.8;
      const newPosition = carouselRef.current.scrollLeft + (direction === 'left' ? -scrollAmount : scrollAmount);
      
      carouselRef.current.scrollTo({
        left: newPosition,
        behavior: 'smooth'
      });
    }
  };

  if (skills.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No skills available in this category.
      </div>
    );
  }

  return (
    <div className="carousel-container relative">
      {/* Navigation buttons */}
      <button 
        onClick={() => scroll('left')} 
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full shadow-lg"
      >
        <ChevronLeft className="w-6 h-6 text-gray-300" />
      </button>
      
      <button 
        onClick={() => scroll('right')} 
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-gray-800/80 rounded-full shadow-lg"
      >
        <ChevronRight className="w-6 h-6 text-gray-300" />
      </button>
      
      {/* Carousel container */}
      <div 
        ref={carouselRef}
        className="flex overflow-x-auto pb-6 pt-4 px-4 hide-scrollbar snap-x snap-mandatory carousel-scroll"
      >
        {skills.map((skill) => (
          <motion.div
            key={skill.name}
            className={`skill-card flex-shrink-0 w-[280px] snap-center mx-3 p-5 rounded-xl transition-all duration-300 cursor-pointer
                      ${selectedSkill === skill.name 
                        ? 'bg-gradient-to-br from-gray-800/80 to-gray-700/80 border border-indigo-500/30 shadow-lg' 
                        : hoveredSkill === skill.name 
                          ? 'bg-gradient-to-br from-gray-800/60 to-gray-700/60 border border-gray-700'
                          : 'bg-gradient-to-br from-gray-800/40 to-gray-700/40 border border-gray-800/50 hover:border-gray-700'
                      }
                     `}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            onClick={() => setSelectedSkill(skill.name !== selectedSkill ? skill.name : null)}
            onMouseEnter={() => setHoveredSkill(skill.name)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-br ${currentCategory?.color || 'from-blue-500 to-indigo-600'}`}>
                {skill.icon}
              </div>
              {skill.featured && (
                <div className="bg-amber-900/20 p-1 rounded-md">
                  <Award className="w-4 h-4 text-amber-400" />
                </div>
              )}
            </div>
            
            <h3 className="font-bold text-lg mb-1 text-white">{skill.name}</h3>
            
            <div className="mb-3">
              <div className="flex justify-between mb-1">
                <span className="text-xs font-medium text-gray-400">Mastery</span>
                <span className="text-xs text-indigo-300 font-medium">{skill.level}%</span>
              </div>
              <div className="h-1.5 bg-gray-700/50 rounded-full overflow-hidden">
                <motion.div 
                  className={`h-full rounded-full bg-gradient-to-r ${currentCategory?.color || 'from-blue-500 to-indigo-600'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
              </div>
            </div>
            
            <p className="text-sm text-gray-400">{skill.description}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default VirtualizedSkillCarousel;
