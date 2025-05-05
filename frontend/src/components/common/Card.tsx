import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  elevated?: boolean;
  interactive?: boolean;
  childMode?: boolean;
  onClick?: () => void;
}

const Card: React.FC<CardProps> = ({ 
  children, 
  className = '', 
  elevated = false, 
  interactive = false,
  childMode = false,
  onClick 
}) => {
  const baseClasses = 'rounded-xl overflow-hidden';
  const elevationClasses = elevated 
    ? 'shadow-lg' 
    : 'shadow-md';
  
  const interactiveClasses = interactive 
    ? 'cursor-pointer transition-all duration-300 hover:shadow-xl' 
    : '';
  
  // Additional styles for child-friendly cards
  const childModeClasses = childMode 
    ? 'border-4 border-primary-300' 
    : '';
  
  return (
    <motion.div
      whileHover={interactive ? { y: -5 } : {}}
      whileTap={interactive ? { y: 0 } : {}}
      onClick={onClick}
      className={`${baseClasses} ${elevationClasses} ${interactiveClasses} ${childModeClasses} ${className}`}
    >
      {children}
    </motion.div>
  );
};

export default Card;