import React from 'react';
import { Button } from './Button';

export interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center p-8 bg-white/60 rounded-3xl border border-dashed border-[#DCBEEF] ${className}`}>
      <div className="w-14 h-14 rounded-2xl bg-[#EDE3F7] text-[#8B5FBF] flex items-center justify-center mb-3.5 shadow-soft-sm">
        {icon}
      </div>
      <h4 className="text-base font-bold text-[#29213A] mb-1">{title}</h4>
      <p className="text-xs sm:text-sm text-[#766C82] max-w-sm mb-4 leading-relaxed">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
