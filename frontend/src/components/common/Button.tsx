import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'outline' | 'ghost';
type ButtonSize = 'sm' | 'md' | 'lg' | 'xl';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  childMode?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  childMode = false,
  className = '',
  disabled,
  ...props
}) => {
  const variants = {
    primary: 'bg-primary-600 hover:bg-primary-700 text-white',
    secondary: 'bg-secondary-500 hover:bg-secondary-600 text-white',
    success: 'bg-success-500 hover:bg-success-600 text-white',
    warning: 'bg-warning-500 hover:bg-warning-600 text-white',
    error: 'bg-error-500 hover:bg-error-600 text-white',
    outline: 'bg-transparent border border-primary-600 text-primary-600 hover:bg-primary-50',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700',
  };

  const sizes = {
    sm: childMode ? 'px-3 py-2 text-sm' : 'px-2 py-1 text-xs',
    md: childMode ? 'px-5 py-3 text-base' : 'px-4 py-2 text-sm',
    lg: childMode ? 'px-7 py-4 text-xl' : 'px-5 py-2.5 text-base',
    xl: childMode ? 'px-10 py-5 text-2xl' : 'px-6 py-3 text-lg',
  };

  const baseClasses = 'rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50 flex items-center justify-center gap-2';
  const widthClass = fullWidth ? 'w-full' : '';
  const loadingClass = isLoading ? 'opacity-80 cursor-not-allowed' : '';
  const disabledClass = disabled ? 'opacity-60 cursor-not-allowed' : '';
  
  // Add special styling for child mode buttons
  const childModeClasses = childMode 
    ? 'shadow-md hover:shadow-lg transform hover:-translate-y-1 rounded-xl' 
    : '';

  const buttonClasses = `${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${loadingClass} ${disabledClass} ${childModeClasses} ${className}`;

  return (
    <motion.button
      whileTap={{ scale: 0.97 }}
      className={buttonClasses}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <span className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-current"></span>
          <span>Loading...</span>
        </>
      ) : (
        <>
          {leftIcon && <span className="inline-flex">{leftIcon}</span>}
          {children}
          {rightIcon && <span className="inline-flex">{rightIcon}</span>}
        </>
      )}
    </motion.button>
  );
};

export default Button;