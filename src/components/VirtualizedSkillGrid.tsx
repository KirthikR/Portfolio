import React from 'react';
import { motion } from 'framer-motion';
import { Award } from 'lucide-react';

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

interface VirtualizedSkillGridProps {
  skills: SkillData[];
  selectedSkill: string | null;
  hoveredSkill: string | null;
  setSelectedSkill: (skill: string | null) => void;
  setHoveredSkill: (skill: string | null) => void;
  currentCategory?: CategoryData;
}

const VirtualizedSkillGrid: React.FC<VirtualizedSkillGridProps> = ({
  skills,
  selectedSkill,
  hoveredSkill,
  setSelectedSkill,
  setHoveredSkill,
  currentCategory
}) => {
  if (skills.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400">
        No skills available in this category.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-8">
      {skills.map((skill) => (
        <motion.div
          key={skill.name}
          className={`skill-card group p-5 rounded-xl transition-all duration-300 cursor-pointer
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
          
          <p className="text-sm text-gray-400 line-clamp-2">{skill.description}</p>
        </motion.div>
      ))}
    </div>
  );
};

export default VirtualizedSkillGrid;
