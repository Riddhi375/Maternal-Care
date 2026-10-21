import React from 'react';

export type BadgeVariant = 
  | 'normal' 
  | 'attention' 
  | 'critical' 
  | 'info' 
  | 'success' 
  | 'warning' 
  | 'pending' 
  | 'taken' 
  | 'skipped'
  | 'lavender';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  dot?: boolean;
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'info',
  size = 'md',
  dot = false,
  className = '',
}) => {
  const variantStyles: Record<BadgeVariant, { bg: string; text: string; dotColor: string; border: string }> = {
    normal: { bg: 'bg-[#EAF5F1]', text: 'text-[#24634E]', dotColor: 'bg-[#36866A]', border: 'border-[#B6E2D3]' },
    success: { bg: 'bg-[#EAF5F1]', text: 'text-[#24634E]', dotColor: 'bg-[#36866A]', border: 'border-[#B6E2D3]' },
    taken: { bg: 'bg-[#EAF5F1]', text: 'text-[#24634E]', dotColor: 'bg-[#36866A]', border: 'border-[#B6E2D3]' },
    
    attention: { bg: 'bg-[#FDF5EC]', text: 'text-[#A7661C]', dotColor: 'bg-[#D58A35]', border: 'border-[#F6D9B4]' },
    warning: { bg: 'bg-[#FDF5EC]', text: 'text-[#A7661C]', dotColor: 'bg-[#D58A35]', border: 'border-[#F6D9B4]' },
    pending: { bg: 'bg-[#FDF5EC]', text: 'text-[#A7661C]', dotColor: 'bg-[#D58A35]', border: 'border-[#F6D9B4]' },
    
    critical: { bg: 'bg-[#FDECEF]', text: 'text-[#B0263E]', dotColor: 'bg-[#D6455D]', border: 'border-[#F8BCC7]' },
    skipped: { bg: 'bg-[#FDECEF]', text: 'text-[#B0263E]', dotColor: 'bg-[#D6455D]', border: 'border-[#F8BCC7]' },
    
    info: { bg: 'bg-[#F6F0FC]', text: 'text-[#503477]', dotColor: 'bg-[#8B5FBF]', border: 'border-[#EDE3F7]' },
    lavender: { bg: 'bg-[#EDE3F7]', text: 'text-[#503477]', dotColor: 'bg-[#8B5FBF]', border: 'border-[#DCBEEF]' },
  };

  const style = variantStyles[variant] || variantStyles.info;

  const sizeClasses = size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-2.5 py-1 text-xs font-semibold';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${style.bg} ${style.text} ${style.border} ${sizeClasses} ${className}`}
    >
      {dot && <span className={`w-1.5 h-1.5 rounded-full ${style.dotColor} animate-pulse`} />}
      <span>{children}</span>
    </span>
  );
};
