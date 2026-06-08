'use client';

import React, { useEffect, useRef } from 'react';
import { X } from 'lucide-react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  maxWidth?: string;
}

export function Modal({ isOpen, onClose, title, children, maxWidth = '480px' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    function handleEsc(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose();
    }
    if (isOpen) document.addEventListener('keydown', handleEsc);
    return () => document.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose();
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]" />

      {/* Modal */}
      <div
        className="relative bg-white rounded-2xl shadow-2xl w-full animate-[slideUp_0.3s_ease-out]"
        style={{ maxWidth, border: '1px solid #e2ebe2' }}
      >
        {/* Header */}
        <div
          className="flex items-center justify-between px-6 py-4"
          style={{ borderBottom: '1px solid #e2ebe2' }}
        >
          <h3 className="text-lg font-bold" style={{ color: '#1a2e1a' }}>
            {title}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg transition-all duration-200 hover:bg-[#f1f5f1]"
            style={{ color: '#6b7f6b' }}
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5">{children}</div>
      </div>
    </div>
  );
}
