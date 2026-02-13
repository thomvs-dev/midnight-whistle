import React from 'react';

interface CardProps {
  children: React.ReactNode;
  variant?: 'glass' | 'terminal' | 'simple';
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, variant = 'glass', className = '' }) => {
  const variants = {
    glass: "glass p-8",
    terminal: "terminal-glass p-6",
    simple: "bg-white/5 border border-white/10 rounded-3xl p-8",
  };

  return (
    <div className={`${variants[variant]} ${className}`}>
      {children}
    </div>
  );
};
