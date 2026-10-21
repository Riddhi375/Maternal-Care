import React from 'react';

export interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  as?: 'input' | 'textarea' | 'select';
  options?: Array<{ label: string; value: string }>;
  rows?: number;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  error,
  helperText,
  icon,
  as = 'input',
  options = [],
  rows = 3,
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `field-${label.toLowerCase().replace(/\s+/g, '-')}`;

  const baseInputClasses = `
    w-full px-3.5 py-2.5 rounded-xl border text-sm text-[#29213A] placeholder-[#766C82]/60 
    bg-white transition-all duration-200 outline-none
    ${error ? 'border-[#D6455D] focus:ring-2 focus:ring-[#D6455D]/20 focus:border-[#D6455D]' : 'border-[#DCBEEF]/80 focus:border-[#8B5FBF] focus:ring-2 focus:ring-[#8B5FBF]/20'}
    ${icon ? 'pl-10' : ''}
    ${className}
  `;

  return (
    <div className="w-full space-y-1.5">
      <label htmlFor={inputId} className="block text-xs font-semibold text-[#503477]">
        {label}
        {props.required && <span className="text-[#D6455D] ml-0.5">*</span>}
      </label>

      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#766C82] pointer-events-none">
            {icon}
          </div>
        )}

        {as === 'textarea' ? (
          <textarea
            id={inputId}
            rows={rows}
            className={baseInputClasses}
            {...(props as React.TextareaHTMLAttributes<HTMLTextAreaElement>)}
          />
        ) : as === 'select' ? (
          <select
            id={inputId}
            className={baseInputClasses}
            {...(props as React.SelectHTMLAttributes<HTMLSelectElement>)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        ) : (
          <input id={inputId} className={baseInputClasses} {...props} />
        )}
      </div>

      {error ? (
        <p className="text-xs text-[#D6455D] font-medium flex items-center gap-1">
          <span>•</span> {error}
        </p>
      ) : helperText ? (
        <p className="text-xs text-[#766C82] leading-tight">{helperText}</p>
      ) : null}
    </div>
  );
};
