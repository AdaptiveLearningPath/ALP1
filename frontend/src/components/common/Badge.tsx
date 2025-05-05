import React from 'react';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  childMode?: boolean;
}

const Badge: React.FC<BadgeProps> = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '',
  childMode = false,
}) => {
  const variants = {
    primary: 'bg-primary-100 text-primary-800',
    secondary: 'bg-secondary-100 text-secondary-800',
    success: 'bg-success-100 text-success-800',
    warning: 'bg-warning-100 text-warning-800',
    error: 'bg-error-100 text-error-800',
  };
  
  const sizes = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-sm px-2.5 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  // Child-friendly badge styles
  const childVariants = {
    primary: 'bg-primary-200 text-primary-800 border-2 border-primary-400',
    secondary: 'bg-secondary-200 text-secondary-800 border-2 border-secondary-400',
    success: 'bg-success-200 text-success-800 border-2 border-success-400',
    warning: 'bg-warning-200 text-warning-800 border-2 border-warning-400',
    error: 'bg-error-200 text-error-800 border-2 border-error-400',
  };

  const childSizes = {
    sm: 'text-sm px-2 py-0.5',
    md: 'text-base px-3 py-1',
    lg: 'text-lg px-4 py-1.5',
  };
  
  const variantClass = childMode ? childVariants[variant] : variants[variant];
  const sizeClass = childMode ? childSizes[size] : sizes[size];
  const roundedClass = childMode ? 'rounded-xl' : 'rounded-full';
  
  return (
    <span className={`inline-flex items-center font-medium ${variantClass} ${sizeClass} ${roundedClass} ${className}`}>
      {children}
    </span>
  );
};

export default Badge;