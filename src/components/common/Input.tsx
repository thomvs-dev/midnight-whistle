import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => {
  return (
    <div className="space-y-2">
      {label && (
        <label className="text-xs font-bold uppercase tracking-widest text-foreground/40 ml-1">
          {label}
        </label>
      )}
      <input
        className={`w-full bg-white/5 border border-white/10 rounded-xl p-4 focus:ring-2 focus:ring-primary/20 outline-none text-white transition-all hover:bg-white/10 ${className}`}
        {...props}
      />
    </div>
  );
};
