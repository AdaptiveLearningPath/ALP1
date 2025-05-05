import React from 'react';
import { motion } from 'framer-motion';

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  showValue?: boolean;
  colorScheme?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  className?: string;
  childMode?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  showValue = false,
  colorScheme = 'primary',
  size = 'md',
  animated = true,
  className = '',
  childMode = false,
}) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);
  
  const colorSchemes = {
    primary: 'bg-primary-500',
    secondary: 'bg-secondary-500',
    success: 'bg-success-500',
    warning: 'bg-warning-500',
    error: 'bg-error-500',
  };
  
  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  // Add special styling for child mode progress bars
  const childModeClasses = childMode 
    ? 'rounded-xl border-4 border-gray-200 p-1 bg-gray-100' 
    : 'rounded-full bg-gray-200';

  // Enhanced size for child mode
  const childSizes = {
    sm: 'h-3',
    md: 'h-5',
    lg: 'h-7',
  };

  const sizeClass = childMode ? childSizes[size] : sizes[size];
  
  return (
    <div className={`w-full ${className}`}>
      {label && (
        <div className="flex justify-between mb-1">
          <span className={`text-gray-700 ${childMode ? 'text-base font-medium' : 'text-sm'}`}>
            {label}
          </span>
          {showValue && (
            <span className={`text-gray-700 ${childMode ? 'text-base font-medium' : 'text-sm'}`}>
              {value}/{max}
            </span>
          )}
        </div>
      )}
      <div className={`w-full ${childModeClasses} overflow-hidden`}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: animated ? 1 : 0, ease: 'easeInOut' }}
          className={`${colorSchemes[colorScheme]} ${childMode ? 'rounded-lg' : 'rounded-full'} ${sizeClass}`}
        />
      </div>
      {showValue && !label && (
        <div className="mt-1 text-right">
          <span className={`text-gray-700 ${childMode ? 'text-base font-medium' : 'text-sm'}`}>
            {percentage.toFixed(0)}%
          </span>
        </div>
      )}
    </div>
  );
};

export default ProgressBar;