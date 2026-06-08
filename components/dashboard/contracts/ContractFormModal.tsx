'use client';

import React, { useState } from 'react';
import { Activity } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Contract } from '@/lib/types';
import { format } from 'date-fns';

interface ContractFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<Contract>) => Promise<void>;
  loading?: boolean;
  error?: string;
  contract?: Contract;
}

export function ContractFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = '',
  contract,
}: ContractFormModalProps) {
  const [status, setStatus] = useState(contract?.status || 'ACTIVE');
  const [affiliationDate, setAffiliationDate] = useState(
    contract?.affiliationDate ? format(new Date(contract.affiliationDate), 'yyyy-MM-dd') : '',
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      status: status as 'ACTIVE' | 'INACTIVE',
      affiliationDate: affiliationDate ? new Date(affiliationDate) : undefined,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={contract ? 'Modificar Contrato' : 'Nuevo Contrato'}
      maxWidth="440px"
    >
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Estado
          </label>
          <div className="relative">
            <Activity
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all"
              style={{ color: '#1a2e1a' }}
              disabled={loading}
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
              Fecha de Afiliación
            </label>
            <Input
              label=""
              id="affiliationDate"
              type="date"
              required
              value={affiliationDate}
              onChange={(e) => setAffiliationDate(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        <div
          className="mt-4 pt-4 border-t flex justify-end gap-3"
          style={{ borderColor: '#e2ebe2' }}
        >
          <Button type="button" variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button type="submit" disabled={loading}>
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}
