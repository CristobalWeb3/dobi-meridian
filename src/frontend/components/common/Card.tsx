/**
 * Card Component
 * Reusable card container with different variants
 */

import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined' | 'filled';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  className = '',
  onClick,
  hover = false
}) => {
  const baseClasses = 'rounded-lg transition-all duration-200';
  
  const variantClasses = {
    default: 'bg-gray-800 border border-gray-700',
    elevated: 'bg-gray-800 shadow-lg border border-gray-700',
    outlined: 'bg-transparent border-2 border-gray-600',
    filled: 'bg-gray-700 border border-gray-600'
  };

  const paddingClasses = {
    none: '',
    sm: 'p-3',
    md: 'p-6',
    lg: 'p-8'
  };

  const hoverClasses = hover ? 'hover:bg-gray-750 cursor-pointer' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const classes = `${baseClasses} ${variantClasses[variant]} ${paddingClasses[padding]} ${hoverClasses} ${clickableClasses} ${className}`;

  return (
    <div
      className={classes}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default Card;
