'use client';

import { AlertCircle, X } from 'lucide-react';

interface ErrorBannerProps {
  message: string;
  onClose?: () => void;
  className?: string;
}

/**
 * Reusable error banner with dismiss button.
 * Replaces the inline error pattern repeated across modals and managers.
 */
export function ErrorBanner({ message, onClose, className = '' }: ErrorBannerProps) {
  if (!message) return null;

  return (
    <div
      role="alert"
      aria-live="assertive"
      className={`flex items-center gap-2 rounded-xl px-4 py-3 text-sm font-medium animate-[shake_0.4s_ease-in-out] ${className}`}
      style={{
        backgroundColor: '#fef2f2',
        border: '1px solid #fecaca',
        color: '#b91c1c',
      }}
    >
      <AlertCircle className="h-4 w-4 shrink-0" />
      <span className="flex-1">{message}</span>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="ml-auto p-0.5 rounded hover:bg-red-100 transition-colors"
          aria-label="Cerrar"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
