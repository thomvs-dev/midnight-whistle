import React from 'react';
import { LucideIcon } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'accent';
  isLoading?: boolean;
  loadingText?: string;
  icon?: LucideIcon;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  isLoading,
  loadingText,
  icon: Icon,
  className = '',
  fullWidth = false,
  disabled,
  ...props
}) => {
  const baseStyles = "transition-all font-bold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20",
    secondary: "bg-white/5 hover:bg-white/10 text-white border border-white/10",
    outline: "border border-current bg-transparent hover:bg-white/5",
    ghost: "hover:bg-white/5 text-foreground/60 hover:text-white",
    accent: "bg-accent hover:bg-accent/90 text-white shadow-xl shadow-accent/20"
  };

  const sizes = "p-4 rounded-xl"; 

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes} ${fullWidth ? 'w-full' : ''} ${className}`}
      disabled={isLoading || disabled}
      {...props}
    >
      {isLoading ? (
        <>
          <div className="w-5 h-5 border-3 border-white/30 border-t-white rounded-full animate-spin" />
          {loadingText || children}
        </>
      ) : (
        <>
          {children}
          {Icon && <Icon className="w-5 h-5" />}
        </>
      )}
    </button>
  );
};
