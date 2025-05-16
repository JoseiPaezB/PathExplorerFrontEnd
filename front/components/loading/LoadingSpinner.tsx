'use client';

import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
  text?: string;
  showText?: boolean;
}

const LoadingSpinner = ({
  size = 'md',
  color = 'primary',
  text = 'Cargando...',
  showText = true
}: LoadingSpinnerProps) => {
  // Mapa de tamaños para los spinners
  const sizeMap = {
    sm: {
      outer: 'w-8 h-8',
      middle: 'w-6 h-6',
      inner: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      outer: 'w-12 h-12',
      middle: 'w-9 h-9',
      inner: 'w-6 h-6',
      text: 'text-base'
    },
    lg: {
      outer: 'w-16 h-16',
      middle: 'w-12 h-12',
      inner: 'w-8 h-8',
      text: 'text-lg'
    }
  };

  // Mapa de colores
  // Mapa de colores usando variables CSS para heredar los colores del tema
const colorMap = {
  primary: {
    outer: 'border-primary',
    middle: 'border-primary/80',
    inner: 'border-primary/60',
    text: 'text-primary'
  },
  secondary: {
    outer: 'border-secondary',
    middle: 'border-secondary/80',
    inner: 'border-secondary/60',
    text: 'text-secondary'
  },
  accent: {
    outer: 'border-accent',
    middle: 'border-accent/80',
    inner: 'border-accent/60',
    text: 'text-accent'
  }
};

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        {/* Spinner exterior */}
        <div 
          className={`${sizeMap[size].outer} border-4 border-t-transparent rounded-full animate-spin ${colorMap[color].outer}`}
          style={{ animationDuration: '1.5s' }}
        />
        
        {/* Spinner medio */}
        <div 
          className={`${sizeMap[size].middle} border-4 border-t-transparent rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${colorMap[color].middle}`}
          style={{ animationDuration: '1.2s', animationDirection: 'reverse' }}
        />
        
        {/* Spinner interior */}
        <div 
          className={`${sizeMap[size].inner} border-4 border-t-transparent rounded-full animate-spin absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${colorMap[color].inner}`}
          style={{ animationDuration: '0.9s' }}
        />
      </div>
      
      {showText && (
        <p className={`mt-4 font-medium ${sizeMap[size].text} ${colorMap[color].text}`}>
          {text}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;