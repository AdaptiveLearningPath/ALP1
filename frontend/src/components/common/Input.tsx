import React, { forwardRef } from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  fullWidth?: boolean;
  childMode?: boolean;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    leftIcon, 
    rightIcon, 
    fullWidth = false, 
    childMode = false,
    className = '', 
    id, 
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substring(2, 9)}`;
    
    const baseInputClasses = `
      px-4 py-2 bg-white border border-gray-300 rounded-lg focus:outline-none 
      focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all
    `;
    
    const iconClasses = leftIcon || rightIcon 
      ? 'pl-10' 
      : '';
    
    const widthClasses = fullWidth 
      ? 'w-full' 
      : '';
    
    const errorClasses = error 
      ? 'border-error-500 focus:border-error-500 focus:ring-error-500' 
      : '';
    
    // Additional styles for child-friendly inputs
    const childModeClasses = childMode 
      ? 'text-lg py-3 border-2 rounded-xl' 
      : '';
    
    return (
      <div className={`${fullWidth ? 'w-full' : ''} ${className}`}>
        {label && (
          <label 
            htmlFor={inputId} 
            className={`block text-gray-700 mb-1 ${childMode ? 'text-lg font-medium' : 'text-sm font-medium'}`}
          >
            {label}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            className={`
              ${baseInputClasses} 
              ${iconClasses} 
              ${widthClasses} 
              ${errorClasses} 
              ${childModeClasses}
            `}
            {...props}
          />
          {rightIcon && (
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500">
              {rightIcon}
            </div>
          )}
        </div>
        {error && <p className="mt-1 text-error-500 text-sm">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;