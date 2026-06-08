'use client';

import React from 'react';
import type { Payment } from '@/lib/types';
import { X } from 'lucide-react';

interface PaymentZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  payment: Payment | null;
}

export function PaymentZoomModal({ isOpen, onClose, payment }: PaymentZoomModalProps) {
  if (!isOpen || !payment?.url) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 animate-fadeIn"
      onClick={onClose}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white p-2 rounded-full transition-all cursor-pointer border border-white/25"
        aria-label="Cerrar visor"
      >
        <X className="h-6 w-6" />
      </button>

      <div className="max-w-4xl max-h-[85vh] w-full h-full flex items-center justify-center p-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={payment.url}
          alt="Ampliado soporte"
          className="object-contain max-h-[80vh] rounded-xl shadow-2xl select-none"
          onClick={(e) => e.stopPropagation()} // prevent close when clicking image
        />
      </div>

      {/* Caption */}
      <p className="text-white/80 font-mono text-sm mt-3 bg-black/40 px-4 py-1.5 rounded-full select-none">
        Ref: {payment.referenceNumber} • Monto:{' '}
        {payment.amountBs
          ? `Bs. ${Number(payment.amountBs).toLocaleString('es-VE')}`
          : `$${Number(payment.amount).toFixed(2)}`}
      </p>
    </div>
  );
}
