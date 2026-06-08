'use client';

import React, { useState, useEffect } from 'react';
import { usePayments } from '@/hooks/usePayments';
import { PaymentFilters } from './PaymentFilters';
import { PaymentsList } from './PaymentsList';
import { PaymentVisor } from './PaymentVisor';
import { PaymentZoomModal } from './PaymentZoomModal';

export function PaymentsManager() {
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [statusFilter, setStatusFilter] = useState<'PROCESSING' | 'COMPLETED' | 'REJECTED' | ''>(
    'PROCESSING',
  );
  const [searchText, setSearchText] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [monthFilter, setMonthFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  // Action state
  const [actionLoading, setActionLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  // Zoom Modal State
  const [zoomOpen, setZoomOpen] = useState(false);

  // Hook integrations
  const {
    payments,
    selectedPayment,
    setSelectedPayment,
    meta,
    loading,
    error,
    pendingCount,
    fetchPayments,
    approvePayment,
    rejectPayment,
  } = usePayments(page, limit);

  // Debounce search text and reset page to 1 asynchronously
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchText);
      setPage(1);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchText]);

  // Fetch when page, filters or search change
  useEffect(() => {
    fetchPayments(page, limit, statusFilter, debouncedSearch, monthFilter, yearFilter);
  }, [page, statusFilter, debouncedSearch, monthFilter, yearFilter, limit, fetchPayments]);

  const handleStatusFilterChange = (status: 'PROCESSING' | 'COMPLETED' | 'REJECTED' | '') => {
    setStatusFilter(status);
    setPage(1);
  };

  const handleMonthFilterChange = (month: string) => {
    setMonthFilter(month);
    setPage(1);
  };

  const handleYearFilterChange = (year: string) => {
    setYearFilter(year);
    setPage(1);
  };

  // Fetch when page changes
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  const handleApprove = async () => {
    if (!selectedPayment) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await approvePayment(selectedPayment.id);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al aprobar el pago');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (reason: string) => {
    if (!selectedPayment) return;
    try {
      setActionLoading(true);
      setActionError(null);
      await rejectPayment(selectedPayment.id, reason);
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Error al rechazar el pago');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#1a2e1a] flex items-center gap-3">
            Control de Pagos
            {pendingCount > 0 && (
              <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-2.5 py-0.5 text-xs font-semibold text-red-700 ring-1 ring-inset ring-red-600/10 animate-pulse">
                <span className="h-1.5 w-1.5 rounded-full bg-red-500"></span>
                {pendingCount} Pendientes
              </span>
            )}
          </h1>
          <p className="text-sm text-[#6b7f6b] mt-1">
            Verifica, aprueba o rechaza los reportes de pago de los afiliados.
          </p>
        </div>
      </div>

      <PaymentFilters
        searchText={searchText}
        onSearchChange={setSearchText}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        monthFilter={monthFilter}
        onMonthFilterChange={handleMonthFilterChange}
        yearFilter={yearFilter}
        onYearFilterChange={handleYearFilterChange}
      />

      {/* DOUBLE PANEL / SPLIT-SCREEN LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT PANEL: Payments List */}
        <PaymentsList
          payments={payments}
          selectedPayment={selectedPayment}
          onSelectPayment={setSelectedPayment}
          loading={loading}
          error={error}
          meta={meta}
          onPageChange={handlePageChange}
        />

        {/* RIGHT PANEL: Static Visor */}
        <PaymentVisor
          selectedPayment={selectedPayment}
          onApprove={handleApprove}
          onReject={handleReject}
          actionLoading={actionLoading}
          actionError={actionError}
          setActionError={setActionError}
          onZoomOpen={() => setZoomOpen(true)}
        />
      </div>

      {/* FULL RESOLUTION ZOOM OVERLAY MODAL */}
      <PaymentZoomModal
        isOpen={zoomOpen}
        onClose={() => setZoomOpen(false)}
        payment={selectedPayment}
      />
    </div>
  );
}
