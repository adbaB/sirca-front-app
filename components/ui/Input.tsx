import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'> {
  label: string;
  icon?: React.ReactNode;
  error?: string;
}

export function Input({ label, icon, error, type, className = '', id, ...props }: InputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPassword ? 'text' : 'password') : type;

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-semibold" style={{ color: '#374151' }}>
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2"
            style={{ color: '#9ca3af' }}
          >
            {icon}
          </div>
        )}
        <input
          id={id}
          type={inputType}
          className={`
            w-full rounded-xl border bg-white
            text-sm transition-all duration-200
            focus:outline-none
            ${error ? '' : ''}
            ${icon ? 'pl-11' : 'pl-4'}
            ${isPassword ? 'pr-11' : 'pr-4'}
            py-3
            ${className}
          `}
          style={{
            borderColor: error ? '#fca5a5' : '#e2ebe2',
            color: '#1a2e1a',
          }}
          onFocus={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = '#16a34a';
              e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)';
            }
          }}
          onBlur={(e) => {
            if (!error) {
              e.currentTarget.style.borderColor = '#e2ebe2';
              e.currentTarget.style.boxShadow = 'none';
            }
          }}
          placeholder={props.placeholder}
          {...props}
        />
        {isPassword && (
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors"
            style={{ color: '#9ca3af' }}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        )}
      </div>
      {error && (
        <p className="text-xs mt-0.5 animate-[fadeIn_0.2s_ease-out]" style={{ color: '#b91c1c' }}>
          {error}
        </p>
      )}
    </div>
  );
}
