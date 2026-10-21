import React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'elevated' | 'glass' | 'highlight' | 'critical' | 'soft';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  padding = 'md',
  interactive = false,
  className = '',
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-3 sm:p-4',
    md: 'p-4 sm:p-5',
    lg: 'p-5 sm:p-6',
  };

  const variantClasses = {
    default: 'bg-white border border-[#EDE3F7] shadow-soft-sm',
    elevated: 'bg-white border border-[#EDE3F7]/80 shadow-soft-md',
    glass: 'bg-white/90 backdrop-blur-md border border-white/60 shadow-soft',
    highlight: 'bg-gradient-to-br from-white via-[#FAF6FE] to-[#F7DCE8]/30 border border-[#DCBEEF] shadow-soft',
    critical: 'bg-[#FDECEF] border border-[#F8BCC7] shadow-soft-sm',
    soft: 'bg-[#F6F0FC] border border-[#EDE3F7]',
  };

  const interactiveClasses = interactive
    ? 'cursor-pointer hover:shadow-soft-md hover:border-[#8B5FBF]/40 transition-all duration-200 active:scale-[0.99]'
    : '';

  return (
    <div
      className={`rounded-2xl transition-all ${variantClasses[variant]} ${paddingClasses[padding]} ${interactiveClasses} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};
