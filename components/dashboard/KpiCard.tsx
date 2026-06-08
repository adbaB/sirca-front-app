import { Card } from '@/components/ui/Card';
import React from 'react';

interface KpiCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  color: string;
  subtitle?: string;
}

export function KpiCard({ title, value, icon, color, subtitle }: KpiCardProps) {
  return (
    <Card hover className="relative overflow-hidden p-5 animate-[fadeIn_0.5s_ease-out]">
      {/* Top accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl"
        style={{ background: `linear-gradient(90deg, ${color}, ${color}88)` }}
      />

      {/* Left border */}
      <div
        className="absolute left-0 top-4 bottom-4 w-0.75 rounded-r-full"
        style={{ backgroundColor: color }}
      />

      <div className="flex items-start gap-4">
        {/* Icon */}
        <div
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl mt-1"
          style={{ backgroundColor: `${color}15`, color: color }}
        >
          {icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className="text-xs font-semibold uppercase tracking-wider truncate"
            style={{ color: '#6b7f6b' }}
          >
            {title}
          </p>
          <p
            className="text-2xl font-bold mt-0.5 font-[family-name:var(--font-geist-mono)] tracking-tight"
            style={{ color: '#1a2e1a' }}
          >
            {value}
          </p>
          {subtitle && (
            <p className="text-xs mt-0.5" style={{ color: '#9ca3af' }}>
              {subtitle}
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
