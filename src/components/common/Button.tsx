import React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'sos' | 'success';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  isLoading?: boolean;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  isLoading = false,
  icon,
  iconPosition = 'left',
  className = '',
  disabled,
  ...props
}) => {
  const baseClasses = 'inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 active:scale-[0.98] focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none disabled:active:scale-100 cursor-pointer select-none';

  const sizeClasses = {
    sm: 'text-xs px-3 py-1.5 gap-1.5 font-semibold',
    md: 'text-sm px-4 py-2.5 gap-2 font-medium',
    lg: 'text-base px-6 py-3.5 gap-2.5 font-semibold',
  };

  const variantClasses = {
    primary: 'bg-[#8B5FBF] hover:bg-[#7346A8] text-white shadow-soft focus:ring-[#8B5FBF]',
    secondary: 'bg-[#EDE3F7] hover:bg-[#DCBEEF] text-[#503477] focus:ring-[#8B5FBF]',
    outline: 'border border-[#8B5FBF]/40 hover:bg-[#F6F0FC] text-[#503477] focus:ring-[#8B5FBF]',
    danger: 'bg-[#D6455D] hover:bg-[#B0263E] text-white shadow-soft focus:ring-[#D6455D]',
    success: 'bg-[#36866A] hover:bg-[#24634E] text-white shadow-soft focus:ring-[#36866A]',
    ghost: 'text-[#503477] hover:bg-[#EDE3F7]/50 focus:ring-[#8B5FBF]',
    sos: 'bg-gradient-to-r from-[#D6455D] to-[#B0263E] text-white font-bold shadow-sos tracking-wider uppercase focus:ring-[#D6455D]',
  };

  return (
    <button
      className={`
        ${baseClasses}
        ${sizeClasses[size]}
        ${variantClasses[variant]}
        ${fullWidth ? 'w-full' : ''}
        ${className}
      `}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : (
        <>
          {icon && iconPosition === 'left' && <span className="flex-shrink-0">{icon}</span>}
          <span>{children}</span>
          {icon && iconPosition === 'right' && <span className="flex-shrink-0">{icon}</span>}
        </>
      )}
    </button>
  );
};
