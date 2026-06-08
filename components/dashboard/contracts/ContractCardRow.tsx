'use client';

import React from 'react';
import { FileText, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import Link from 'next/link';
import type { Contract } from '@/lib/types';

export type PipelineStage = 'pending' | 'rejected' | 'partial' | 'paid';

interface ContractCardRowProps {
  contract: Contract;
  index: number;
  metrics: { paid: number; total: number; pct: number };
  currentStage: PipelineStage;
  stageStyles: { color: string; bg: string; border: string; label: string };
}

export const ContractCardRow = React.memo(function ContractCardRow({
  contract,
  index,
  metrics,
  currentStage,
  stageStyles,
}: ContractCardRowProps) {
  const owner = contract.contractPersons?.find((cp) => cp.isBillingOwner)?.person;

  return (
    <div
      className="group relative flex flex-col md:grid md:grid-cols-12 md:items-center gap-4 p-5 bg-white rounded-2xl border transition-all duration-300 hover:shadow-md hover:scale-[1.01] animate-fade-in"
      style={{
        borderColor: '#e2ebe2',
        animationDelay: `${index * 25}ms`,
        animationFillMode: 'both',
      }}
    >
      {/* Left Side: Info & Icon */}
      <div className="md:col-span-5 flex items-center gap-3.5 min-w-0">
        <div
          className="h-12 w-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-105"
          style={{
            background:
              contract.status === 'ACTIVE'
                ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 100%)'
                : 'linear-gradient(135deg, #9ca3af 0%, #d1d5db 100%)',
          }}
        >
          <FileText className="h-6 w-6 text-white" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-mono font-bold text-sm" style={{ color: '#1a2e1a' }}>
              {contract.code}
            </span>
            <span
              className="text-[10px] font-bold uppercase tracking-wider"
              style={{ color: '#8c9e8c' }}
            >
              {format(new Date(contract.affiliationDate), 'd MMM, yyyy', { locale: es })}
            </span>
          </div>

          <p className="text-sm font-semibold truncate mt-1" style={{ color: '#374151' }}>
            {owner?.name ?? 'Sin titular asignado'}
          </p>
          {owner && (
            <p className="text-xs font-medium" style={{ color: '#6b7f6b' }}>
              CI: {owner.typeIdentityCard} - {owner.identityCard}
            </p>
          )}
        </div>
      </div>

      {/* Center / Payment Progress Indicator for Partially Paid / Paid Invoices */}
      <div className="md:col-span-4 w-full max-w-sm px-2 md:px-6">
        {currentStage === 'partial' ? (
          <div className="flex flex-col gap-1.5 animate-fade-in">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span style={{ color: '#2563eb' }}>Progreso de Pago</span>
              <span style={{ color: '#1a2e1a' }}>
                ${metrics.paid} / ${metrics.total} ({metrics.pct}%)
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-gray-100 overflow-hidden relative border border-gray-200/50">
              <div
                className="h-full rounded-full transition-all duration-500 ease-out"
                style={{
                  width: `${metrics.pct}%`,
                  background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                }}
              />
            </div>
          </div>
        ) : currentStage === 'paid' ? (
          <div className="flex flex-col gap-1 text-xs font-medium text-right md:text-left">
            <div className="flex items-center gap-1.5" style={{ color: '#16a34a' }}>
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              <span className="font-bold">Factura Totalmente Verificada</span>
            </div>
            <p className="text-[11px]" style={{ color: '#6b7f6b' }}>
              Recaudación consolidada de ${metrics.total}
            </p>
          </div>
        ) : currentStage === 'rejected' ? (
          <div className="flex flex-col gap-1 text-xs font-medium">
            <div className="flex items-center gap-1.5" style={{ color: '#dc2626' }}>
              <XCircle className="h-4 w-4 shrink-0" />
              <span className="font-bold">Acción Requerida</span>
            </div>
            <p className="text-[11px]" style={{ color: '#6b7f6b' }}>
              Pago rechazado. Contactar al afiliado.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-1 text-xs font-medium">
            <div className="flex items-center gap-1.5" style={{ color: '#d97706' }}>
              <Clock className="h-4 w-4 shrink-0" />
              <span className="font-bold">Cobro Pendiente</span>
            </div>
            <p className="text-[11px]" style={{ color: '#6b7f6b' }}>
              Mensualidad regular de ${metrics.total}
            </p>
          </div>
        )}
      </div>

      {/* Right Side: Amount & Action Link */}
      <div className="md:col-span-3 flex items-center justify-between md:justify-end gap-4 shrink-0">
        <div className="text-right">
          <p className="text-sm font-semibold" style={{ color: '#6b7f6b' }}>
            Costo Mensual
          </p>
          <p className="text-lg font-bold mt-0.5" style={{ color: '#1a2e1a' }}>
            ${Number(contract.monthlyAmount).toFixed(2)}
          </p>
        </div>

        <Link
          href={`/dashboard/contratos/${contract.id}?from=seguimiento`}
          className="inline-flex items-center justify-center h-10 px-4 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-105 shadow-sm"
          style={{
            backgroundColor: stageStyles.bg,
            color: stageStyles.color,
            border: `1px solid ${stageStyles.border}`,
          }}
        >
          Detalles
          <ChevronRight className="h-3.5 w-3.5 ml-1" />
        </Link>
      </div>
    </div>
  );
});
