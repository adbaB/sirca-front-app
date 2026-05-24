'use client';

import React from 'react';
import type { Payment, PaginationResponse } from '@/lib/types';
import { Loader2, AlertCircle, CreditCard, ChevronRight } from 'lucide-react';
import { getMethodStyle } from './paymentUtils';

interface PaymentsListProps {
  payments: Payment[];
  selectedPayment: Payment | null;
  onSelectPayment: (payment: Payment) => void;
  loading: boolean;
  error: string | null;
  meta: PaginationResponse<Payment>['meta'];
  onPageChange: (page: number) => void;
}

export function PaymentsList({
  payments,
  selectedPayment,
  onSelectPayment,
  loading,
  error,
  meta,
  onPageChange,
}: PaymentsListProps) {
  return (
    <div className="lg:col-span-5 flex flex-col bg-white rounded-2xl border border-[#e2ebe2] overflow-hidden shadow-sm">
      <div className="p-4 border-b border-[#e2ebe2] bg-[#fcfdfc]">
        <h2 className="text-xs font-bold uppercase tracking-wider text-[#6b7f6b]">Lista de Reportes</h2>
      </div>
      
      <div className="overflow-y-auto max-h-[600px] flex-1 divide-y divide-[#f1f5f1]">
        {loading && payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center text-[#6b7f6b]">
            <Loader2 className="h-8 w-8 animate-spin text-[#16a34a] mb-2" />
            <p className="text-sm font-medium">Buscando pagos en base de datos...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center text-red-600">
            <AlertCircle className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">{error}</p>
          </div>
        ) : payments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-4 text-center text-[#6b7f6b]">
            <CreditCard className="h-10 w-10 mb-2 opacity-40 text-[#6b7f6b]" />
            <p className="text-sm font-medium">No se encontraron pagos</p>
            <p className="text-xs text-[#9ca3af] mt-1">Intenta ajustando los filtros de búsqueda.</p>
          </div>
        ) : (
          payments.map((payment) => {
            const isSelected = selectedPayment?.id === payment.id;
            const method = getMethodStyle(payment.paymentMethod);
            
            return (
              <button
                key={payment.id}
                onClick={() => onSelectPayment(payment)}
                className={`w-full p-4 text-left transition-all flex items-center justify-between border-l-4 cursor-pointer hover:bg-[#fcfdfc]/60 ${
                  isSelected
                    ? 'bg-[#f4fbf4] border-l-[#16a34a] shadow-sm'
                    : 'border-l-transparent hover:border-l-gray-200'
                }`}
              >
                <div className="flex items-center gap-3">
                  {/* Method Icon / Label indicator */}
                  <div className={`h-10 w-10 rounded-xl flex items-center justify-center ${method.bg}`}>
                    <span className={`text-[10px] font-bold ${method.text}`}>
                      {method.label.substring(0, 3).toUpperCase()}
                    </span>
                  </div>
                  
                  {/* Name & Cédula */}
                  <div>
                    <p className="text-sm font-semibold text-[#1a2e1a] line-clamp-1">
                      {payment.person?.name || 'Cliente Sirca'}
                    </p>
                    <p className="text-xs text-[#6b7f6b] mt-0.5 flex items-center gap-1.5">
                      {payment.person ? `${payment.person.typeIdentityCard}-${payment.person.identityCard}` : 'Sin Cédula'}
                      <span className="text-gray-300">•</span>
                      <span className="font-mono text-[10px] bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">
                        Ref: {payment.referenceNumber}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5">
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1a2e1a]">
                      {payment.amountBs ? `Bs. ${Number(payment.amountBs).toLocaleString('es-VE', { minimumFractionDigits: 2 })}` : `$${Number(payment.amount).toFixed(2)}`}
                    </p>
                    <p className="text-[10px] text-[#9ca3af] mt-0.5">
                      {payment.amountBs ? `$${Number(payment.amount).toFixed(2)}` : 'Divisa'}
                    </p>
                  </div>
                  <ChevronRight className={`h-4 w-4 text-gray-300 transition-transform ${isSelected ? 'translate-x-0.5 text-[#16a34a]' : ''}`} />
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* Pagination Controls */}
      {meta.totalPages > 1 && (
        <div className="p-3 border-t border-[#e2ebe2] bg-[#fcfdfc] flex items-center justify-between text-xs">
          <span className="text-[#6b7f6b]">
            Página <strong>{meta.currentPage}</strong> de {meta.totalPages}
          </span>
          <div className="flex gap-1">
            <button
              disabled={meta.currentPage === 1}
              onClick={() => onPageChange(meta.currentPage - 1)}
              className="px-2.5 py-1 border border-[#e2ebe2] rounded-lg bg-white text-[#1a2e1a] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
            >
              Anterior
            </button>
            <button
              disabled={meta.currentPage === meta.totalPages}
              onClick={() => onPageChange(meta.currentPage + 1)}
              className="px-2.5 py-1 border border-[#e2ebe2] rounded-lg bg-white text-[#1a2e1a] hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
