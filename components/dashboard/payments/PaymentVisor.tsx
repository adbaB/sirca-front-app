'use client';

import type { Payment } from '@/lib/types';
import {
  AlertCircle,
  AlertTriangle,
  Calendar,
  Check,
  CheckCircle2,
  Edit2,
  Eye,
  FileText,
  Landmark,
  Loader2,
  User,
  X,
  ZoomIn,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatDate, getMethodStyle, getStatusStyle } from './paymentUtils';
import { usePermissions } from '@/hooks/usePermissions';
import { DatePicker } from '@/components/ui/DatePicker';

const toLocalInputDate = (dateStr: string): string => {
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return '';
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  } catch {
    return '';
  }
};

interface PaymentVisorProps {
  selectedPayment: Payment | null;
  onApprove: () => Promise<void>;
  onReject: (reason: string) => Promise<void>;
  onUpdateDate: (date: string) => Promise<void>;
  actionLoading: boolean;
  actionError: string | null;
  setActionError: (error: string | null) => void;
  onZoomOpen: () => void;
}

export function PaymentVisor({
  selectedPayment,
  onApprove,
  onReject,
  onUpdateDate,
  actionLoading,
  actionError,
  setActionError,
  onZoomOpen,
}: PaymentVisorProps) {
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [isEditingDate, setIsEditingDate] = useState(false);
  const [editDate, setEditDate] = useState('');

  const { can } = usePermissions();
  const canUpdatePayments = can('update:payments');

  // Reset local state when active payment changes
  useEffect(() => {
    const resetTimeout = window.setTimeout(() => {
      setIsRejecting(false);
      setRejectionReason('');
      setActionError(null);
      setIsEditingDate(false);
      if (selectedPayment) {
        const dateVal = selectedPayment.paymentDate || selectedPayment.createdAt || '';
        setEditDate(toLocalInputDate(dateVal));
      } else {
        setEditDate('');
      }
    }, 0);

    return () => window.clearTimeout(resetTimeout);
  }, [selectedPayment?.id, setActionError, selectedPayment]);

  const handleSaveDate = async () => {
    if (!editDate) return;
    try {
      await onUpdateDate(editDate);
      setIsEditingDate(false);
    } catch (err) {
      // Error is already handled by parent/visor state
    }
  };

  const handleLocalReject = () => {
    if (!rejectionReason.trim()) {
      setActionError('Debes ingresar un motivo para rechazar el pago.');
      return;
    }
    onReject(rejectionReason);
  };

  if (!selectedPayment) {
    return (
      <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-[#e2ebe2] overflow-hidden min-h-137.5 shadow-sm">
        <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-[#6b7f6b] my-auto">
          <div className="h-16 w-16 rounded-2xl bg-[#f4fbf4] flex items-center justify-center text-[#16a34a] mb-4">
            <FileText className="h-8 w-8" />
          </div>
          <h3 className="text-base font-bold text-[#1a2e1a]">Visor de Verificación</h3>
          <p className="text-sm text-[#6b7f6b] max-w-sm mt-1">
            Selecciona cualquier reporte de pago de la lista de la izquierda para verificar su
            comprobante bancario, revisar metadatos y emitir tu veredicto.
          </p>
        </div>
      </div>
    );
  }

  const method = getMethodStyle(selectedPayment.paymentMethod);
  const status = getStatusStyle(selectedPayment.status);

  return (
    <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-[#e2ebe2] overflow-hidden min-h-137.5 shadow-sm">
      <div className="flex-1 flex flex-col h-full">
        {/* Header inside visor */}
        <div className="p-4 border-b border-[#e2ebe2] bg-[#fcfdfc] flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-[#1a2e1a] text-sm">Detalles del Reporte</h3>
            <span
              className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs font-semibold ring-1 ring-inset ${status.bg}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`}></span>
              {status.label}
            </span>
          </div>

          <span
            className={`inline-flex items-center gap-1 rounded-md px-2.5 py-0.5 text-xs font-bold ${method.bg} ${method.text}`}
          >
            {method.label}
          </span>
        </div>

        {/* Visor Content */}
        <div className="p-6 flex-1 flex flex-col gap-6 overflow-y-auto max-h-145">
          {/* 🟩 ELEGANT HIGHLIGHT: MES DE PAGO */}
          <div className="bg-[#f0f9f0] border border-[#d2eed2] p-4 rounded-xl flex items-center gap-3">
            <Calendar className="h-5 w-5 text-[#16a34a]" />
            <div>
              <p className="text-xs text-[#6b7f6b] uppercase tracking-wider font-semibold">
                Mes de Pago a Abonar
              </p>
              <p className="text-sm font-bold text-[#1a2e1a] capitalize">
                {selectedPayment.invoice?.billingMonth
                  ? selectedPayment.invoice.billingMonth
                  : 'No especificado (Abono directo)'}
              </p>
            </div>
          </div>

          {/* 2-Columns grid: Details & Image */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Left Column: Metadata */}
            <div className="flex flex-col gap-4">
              <div>
                <h4 className="text-xs font-bold text-[#6b7f6b] uppercase tracking-wider flex items-center gap-1.5">
                  <User className="h-3.5 w-3.5" /> Contrato & Titular
                </h4>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl">
                  <p className="text-xs text-[#6b7f6b]">Código del Contrato</p>
                  <p className="text-sm font-bold text-[#1a2e1a] font-mono mt-0.5">
                    {selectedPayment.invoice?.contract?.code || 'S/N'}
                  </p>

                  <p className="text-xs text-[#6b7f6b] mt-3">Nombre del Titular</p>
                  <p className="text-sm font-semibold text-[#1a2e1a] mt-0.5">
                    {selectedPayment.person?.name || 'Cliente Sirca'}
                  </p>
                  <p className="text-xs text-[#6b7f6b] mt-3">Monto a Pagar</p>
                  <p className="text-sm font-semibold text-[#1a2e1a] mt-0.5">
                    {`$${Number(selectedPayment.invoice?.totalAmount || 0).toFixed(2)}`}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-[#6b7f6b] uppercase tracking-wider flex items-center gap-1.5">
                  <Landmark className="h-3.5 w-3.5" /> Metadatos Bancarios
                </h4>
                <div className="mt-2 p-3 bg-gray-50 border border-gray-100 rounded-xl space-y-3">
                  <div>
                    <p className="text-[10px] text-[#6b7f6b] uppercase">Número de Referencia</p>
                    <p className="text-sm font-bold text-[#1a2e1a] font-mono">
                      {selectedPayment.referenceNumber}
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b7f6b] uppercase flex items-center gap-1.5">
                      Fecha de Operación
                      {canUpdatePayments && !isEditingDate && (
                        <button
                          onClick={() => setIsEditingDate(true)}
                          disabled={actionLoading}
                          title="Editar fecha de pago"
                          className="text-gray-400 hover:text-gray-600 disabled:opacity-50 transition-colors cursor-pointer"
                        >
                          <Edit2 className="h-3 w-3" />
                        </button>
                      )}
                    </p>
                    {isEditingDate ? (
                      <div className="flex items-center gap-1.5 mt-1 animate-fadeIn">
                        <div className="w-40">
                          <DatePicker
                            value={editDate}
                            onChange={(val) => setEditDate(val)}
                            disabled={actionLoading}
                            size="sm"
                          />
                        </div>
                        <button
                          onClick={handleSaveDate}
                          disabled={actionLoading || !editDate}
                          className="p-1 bg-[#16a34a] text-white rounded-lg hover:bg-[#15803d] disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center"
                          title="Guardar"
                        >
                          {actionLoading ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <Check className="h-3.5 w-3.5" />
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsEditingDate(false);
                            const dateVal =
                              selectedPayment.paymentDate || selectedPayment.createdAt || '';
                            setEditDate(toLocalInputDate(dateVal));
                          }}
                          disabled={actionLoading}
                          className="p-1 border border-gray-200 text-gray-500 rounded-lg hover:bg-gray-100 disabled:opacity-50 transition-colors cursor-pointer flex items-center justify-center"
                          title="Cancelar"
                        >
                          <X className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    ) : (
                      <p className="text-xs font-medium text-[#1a2e1a]">
                        {formatDate(selectedPayment.paymentDate || selectedPayment.createdAt)}
                      </p>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] text-[#6b7f6b] uppercase">Monto Reportado</p>
                    <div className="flex items-baseline gap-2 mt-0.5">
                      <span className="text-base font-extrabold text-[#1a2e1a]">
                        {selectedPayment.amountBs
                          ? `Bs. ${Number(selectedPayment.amountBs).toLocaleString('es-VE', { minimumFractionDigits: 2 })}`
                          : `$${Number(selectedPayment.amount).toFixed(2)}`}
                      </span>
                      {selectedPayment.amountBs && (
                        <span className="text-xs text-[#6b7f6b] font-medium">
                          (${Number(selectedPayment.amount).toFixed(2)})
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Receipt Image Visor */}
            <div>
              <h4 className="text-xs font-bold text-[#6b7f6b] uppercase tracking-wider flex items-center gap-1.5 mb-2">
                <Eye className="h-3.5 w-3.5" /> Comprobante Digital
              </h4>

              {selectedPayment.url ? (
                <div className="relative group border border-gray-200 rounded-xl overflow-hidden bg-gray-50 flex items-center justify-center min-h-55 max-h-65 shadow-sm">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={selectedPayment.url}
                    alt="Soporte de pago"
                    className="object-contain max-h-55 w-full"
                  />

                  {/* Zoom overlay trigger */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center gap-2">
                    <button
                      onClick={onZoomOpen}
                      className="bg-white/95 hover:bg-white text-gray-800 p-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-md transform translate-y-2 group-hover:translate-y-0 transition-all cursor-pointer"
                    >
                      <ZoomIn className="h-3.5 w-3.5" /> Ampliar Comprobante
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center p-8 text-center text-gray-400 bg-gray-50/50 min-h-55">
                  <AlertTriangle className="h-8 w-8 text-amber-400 mb-2" />
                  <p className="text-xs font-semibold">Sin imagen adjunta</p>
                  <p className="text-[10px] text-gray-400 mt-1 max-w-40">
                    El reporte se registró sin comprobante físico.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Status-specific warning banners */}
          {selectedPayment.status === 'COMPLETED' && (
            <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex gap-3 text-emerald-800 text-sm">
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pago Verificado Satisfactoriamente</p>
                <p className="text-xs text-emerald-700 mt-0.5">
                  Este abono fue aprobado y transferido a la cuenta del afiliado. El saldo del
                  contrato está al día.
                </p>
              </div>
            </div>
          )}

          {selectedPayment.status === 'REJECTED' && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 flex gap-3 text-gray-800 text-sm">
              <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Pago Rechazado</p>
                <p className="text-xs text-gray-600 mt-0.5">Este reporte fue descartado.</p>
                <div className="mt-2 p-2 bg-red-50 rounded-lg text-xs font-mono text-red-900 border border-red-100">
                  <strong>Motivo: </strong>&quot;
                  {(selectedPayment.metadata?.rejectionReason as string) ||
                    'No especificado por el administrador'}
                  &quot;
                </div>
              </div>
            </div>
          )}

          {actionError && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex gap-2 text-red-800 text-xs">
              <AlertCircle className="h-4 w-4 text-red-500 shrink-0" />
              <p className="font-medium">{actionError}</p>
            </div>
          )}
        </div>

        {/* Visor Footer Action Bar */}
        {(selectedPayment.status === 'PROCESSING' ||
          selectedPayment.status === 'COMPLETED' ||
          selectedPayment.status === 'REJECTED') && (
          <div className="p-4 border-t border-[#e2ebe2] bg-[#fcfdfc] flex flex-col gap-3">
            {!isRejecting ? (
              <div className="flex justify-end gap-3">
                {(selectedPayment.status === 'PROCESSING' ||
                  selectedPayment.status === 'COMPLETED') && (
                  <button
                    onClick={() => {
                      setIsRejecting(true);
                      setRejectionReason('');
                      setActionError(null);
                    }}
                    disabled={actionLoading}
                    className="px-4 py-2.5 border border-red-200 text-red-600 hover:bg-red-50 disabled:opacity-50 font-semibold rounded-xl text-sm transition-all cursor-pointer"
                  >
                    Rechazar Pago
                  </button>
                )}
                {(selectedPayment.status === 'PROCESSING' ||
                  selectedPayment.status === 'REJECTED') && (
                  <button
                    onClick={onApprove}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-[#16a34a] hover:bg-[#15803d] text-white disabled:opacity-50 font-semibold rounded-xl text-sm flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                  >
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    Aprobar Pago
                  </button>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-2 bg-red-50/50 p-3 rounded-xl border border-red-100 animate-fadeIn">
                <p className="text-xs font-bold text-red-700">Especifica el motivo del rechazo:</p>
                <div className="flex gap-2 items-center">
                  <input
                    type="text"
                    placeholder="Ej. Soporte duplicado, monto incorrecto..."
                    className="flex-1 px-3 py-2 border border-red-200 focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 rounded-xl text-sm bg-white text-red-900"
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                  <button
                    onClick={() => setIsRejecting(false)}
                    className="p-2 border border-gray-200 text-gray-500 hover:bg-gray-100 rounded-xl text-xs font-semibold cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    onClick={handleLocalReject}
                    disabled={actionLoading}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    {actionLoading && <Loader2 className="h-3 w-3 animate-spin mr-1" />}
                    Confirmar Rechazo
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
