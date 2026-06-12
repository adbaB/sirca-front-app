'use client';

import React, { useState } from 'react';
import { Layers, Percent, Activity, Calendar, DollarSign } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Button } from '@/components/ui/Button';
import { ErrorBanner } from '@/components/ui/ErrorBanner';
import type { Plan } from '@/lib/types';

interface PlanFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    name: string;
    maxAge: number;
    amount: number;
    commissionAmount: number;
    status: 'ACTIVE' | 'INACTIVE';
  }) => Promise<void>;
  loading?: boolean;
  error?: string;
  plan?: Plan | null;
}

export function PlanFormModal({
  isOpen,
  onClose,
  onSubmit,
  loading = false,
  error = '',
  plan,
}: PlanFormModalProps) {
  const [name, setName] = useState(plan?.name || '');
  const [maxAge, setMaxAge] = useState(plan?.maxAge?.toString() || '0');
  const [amount, setAmount] = useState(plan?.amount?.toString() || '0');
  const [commissionAmount, setCommissionAmount] = useState(
    plan?.commissionAmount?.toString() || '0',
  );
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>(plan?.status || 'ACTIVE');

  const [prevPlan, setPrevPlan] = useState<Plan | null | undefined>(plan);

  if (plan !== prevPlan) {
    setPrevPlan(plan);
    setName(plan?.name || '');
    setMaxAge(plan?.maxAge?.toString() || '0');
    setAmount(plan?.amount?.toString() || '0');
    setCommissionAmount(plan?.commissionAmount?.toString() || '0');
    setStatus(plan?.status || 'ACTIVE');
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit({
      name: name.trim(),
      maxAge: Number(maxAge) || 0,
      amount: Number(amount) || 0,
      commissionAmount: Number(commissionAmount) || 0,
      status,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={plan ? 'Modificar Plan' : 'Nuevo Plan'}
      maxWidth="440px"
    >
      <ErrorBanner message={error} />

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Nombre */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Nombre del Plan
          </label>
          <div className="relative">
            <Layers
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <input
              type="text"
              required
              placeholder="Ej. Plan Básico"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Edad Máxima */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Edad Máxima (Años)
          </label>
          <div className="relative">
            <Calendar
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4"
              style={{ color: '#6b7f6b' }}
            />
            <input
              type="number"
              min="0"
              required
              placeholder="Ej. 65"
              value={maxAge}
              onChange={(e) => setMaxAge(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Monto / Cuota base */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Monto Cuota Base ($)
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
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full h-11 pl-10 pr-4 bg-[#f1f5f1] border border-[#e2ebe2] rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-[#16a34a]/20 transition-all text-gray-900 placeholder:text-gray-400"
              disabled={loading}
            />
          </div>
        </div>

        {/* Comisión */}
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-semibold" style={{ color: '#1a2e1a' }}>
            Comisión por Afiliado ($)
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
