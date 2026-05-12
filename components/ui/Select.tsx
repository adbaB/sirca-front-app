import React from 'react';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  id: string;
  label: string;
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  icon?: React.ReactNode;
}

export function Select({ id, label, options, value, onChange, icon }: SelectProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-wider"
        style={{ color: '#6b7f6b' }}
      >
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
            style={{ color: '#9ca3af' }}
          >
            {icon}
          </div>
        )}
        <select
          id={id}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`
            w-full appearance-none rounded-xl border bg-white
            text-sm font-medium
            py-2.5 pr-10 transition-all duration-200
            focus:outline-none
            ${icon ? 'pl-10' : 'pl-4'}
          `}
          style={{
            borderColor: '#e2ebe2',
            color: '#1a2e1a',
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = '#16a34a'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(22,163,74,0.1)'; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = '#e2ebe2'; e.currentTarget.style.boxShadow = 'none'; }}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4"
          style={{ color: '#9ca3af' }}
        />
      </div>
    </div>
  );
}
