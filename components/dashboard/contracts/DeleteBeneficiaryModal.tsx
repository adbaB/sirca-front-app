'use client';

import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';

interface DeleteBeneficiaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  beneficiaryName: string;
  loading: boolean;
}

export function DeleteBeneficiaryModal({
  isOpen,
  onClose,
  onConfirm,
  beneficiaryName,
  loading,
}: DeleteBeneficiaryModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Eliminar Beneficiario" maxWidth="440px">
      <div className="flex flex-col items-center text-center gap-4 py-2">
        <div
          className="h-16 w-16 rounded-2xl flex items-center justify-center animate-[pulse_2s_infinite]"
          style={{ backgroundColor: '#fef2f2' }}
        >
          <AlertTriangle className="h-8 w-8" style={{ color: '#dc2626' }} />
        </div>

        <div>
          <p className="text-base font-semibold mb-1" style={{ color: '#1a2e1a' }}>
            ¿Estás seguro?
          </p>
          <p className="text-sm px-2" style={{ color: '#6b7f6b' }}>
            Esta acción desvinculará y eliminará permanentemente al beneficiario{' '}
            <span className="font-semibold text-red-600">{beneficiaryName}</span>. Esto recalculará
            el monto mensual del contrato de forma automática.
          </p>
        </div>

        <div className="flex gap-3 w-full pt-2">
          <Button
            type="button"
            variant="secondary"
            className="flex-1"
            onClick={onClose}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="danger"
            className="flex-1"
            onClick={onConfirm}
            loading={loading}
          >
            Confirmar
          </Button>
        </div>
      </div>
    </Modal>
  );
}
