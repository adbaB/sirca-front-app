'use client';

import React, { useState } from 'react';
import { Briefcase, DollarSign, FileCode2, Activity } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Portfolio } from '@/lib/types';

interface PortfolioFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    code: string;
    commissionAmount: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
  portfolio?: Portfolio | null;
}

export function PortfolioFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = '',
  portfolio,
}: PortfolioFormModalProps) {
  const [name, setName] = useState(portfolio?.name || '');
  const [code, setCode] = useState(portfolio?.code || '');
  const [commissionAmount, setCommissionAmount] = useState(
    portfolio?.commissionAmount?.toString() || '0',
  );
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(portfolio?.status || 'ACTIVE');

  const [prevPortfolio, setPrevPortfolio] = useState<Portfolio | null | undefined>(portfolio);

  if (portfolio !== prevPortfolio) {
    setPrevPortfolio(portfolio);
    setName(portfolio?.name || '');
    setCode(portfolio?.code || '');
    setCommissionAmount(portfolio?.commissionAmount?.toString() || '0');
    setStatus(portfolio?.status || 'ACTIVE');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      code: code.trim().toUpperCase(),
      commissionAmount: Number(commissionAmount) || 0,
      status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={portfolio ? 'Modificar Cartera' : 'Nueva Cartera'}
      maxWidth="440px"
    >
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Código / Siglas */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Siglas (Código Único)
          </label>
          <div className="relative">
            <FileCode2
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <input
              type="text"
              required
              placeholder="Ej. HER, APF, GMP"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Nombre de la Cartera
          </label>
          <div className="relative">
            <Briefcase
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <input
              type="text"
              required
              placeholder="Ej. Hereditario"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Comisión */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Monto de Comisión ($)
          </label>
          <div className="relative">
            <DollarSign
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <input
              type="number"
              step="0.01"
              min="0"
              required
              placeholder="0.00"
              value={commissionAmount}
              onChange={(e) => setCommissionAmount(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900"
              disabled={loading}
            />
          </div>
        </div>

        {/* Estado */}
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
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900"
              disabled={loading}
            >
              <option value="ACTIVE">Activo</option>
              <option value="INACTIVE">Inactivo</option>
            </select>
          </div>
        </div>

        {/* Acciones */}
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
