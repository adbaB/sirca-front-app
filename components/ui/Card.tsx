import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
}

export function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`
        rounded-2xl border bg-white
        shadow-sm
        ${hover ? 'transition-all duration-300 hover:scale-[1.02] hover:shadow-md' : ''}
        ${className}
      `}
      style={{ borderColor: '#e2ebe2' }}
    >
      {children}
    </div>
  );
}
