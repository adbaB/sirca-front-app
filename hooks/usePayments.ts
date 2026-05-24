'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Payment, PaginationResponse } from '@/lib/types';

export function usePayments(initialPage = 1, initialLimit = 10) {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
  const [meta, setMeta] = useState<PaginationResponse<Payment>['meta']>({
    totalItems: 0,
    itemCount: 0,
    currentPage: initialPage,
    totalPages: 1,
    itemsPerPage: initialLimit,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [pendingCount, setPendingCount] = useState<number>(0);

  const fetchPendingCount = useCallback(async () => {
    try {
      const res = await fetch('/billing/payments/pending-count');
      if (res.ok) {
        const data = await res.json();
        setPendingCount(data.count || 0);
      }
    } catch (err) {
      console.error('Error al cargar conteo de pagos pendientes:', err);
    }
  }, []);

  const fetchPayments = useCallback(async (page: number, limit: number, status?: string, search?: string, month?: string, year?: string) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('page', String(page));
      params.append('limit', String(limit));
      if (status) params.append('status', status);
      if (search) params.append('search', search);
      if (month) params.append('month', month);
      if (year) params.append('year', year);

      const res = await fetch(`/billing/payments?${params.toString()}`);
      if (!res.ok) throw new Error('Error cargando pagos');
      const data: PaginationResponse<Payment> = await res.json();
      
      setPayments(data.data || []);
      setMeta(data.meta || { totalItems: 0, currentPage: page, totalPages: 1, itemsPerPage: limit, itemCount: 0 });
      
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  const approvePayment = async (id: string) => {
    try {
      const res = await fetch(`/billing/payments/${id}/approve`, {
        method: 'PATCH',
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al aprobar pago');
      }
      const updatedPayment: Payment = await res.json();
      
      // Update states
      setSelectedPayment(updatedPayment);
      setPayments(prev => prev.map(p => p.id === id ? updatedPayment : p));
      
      // Refresh dynamic badge counts
      fetchPendingCount();
      return updatedPayment;
    } catch (err) {
      throw err;
    }
  };

  const rejectPayment = async (id: string, reason: string) => {
    try {
      const res = await fetch(`/billing/payments/${id}/reject`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ reason }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Error al rechazar pago');
      }
      const updatedPayment: Payment = await res.json();
      
      // Update states
      setSelectedPayment(updatedPayment);
      setPayments(prev => prev.map(p => p.id === id ? updatedPayment : p));
      
      // Refresh dynamic badge counts
      fetchPendingCount();
      return updatedPayment;
    } catch (err) {
      throw err;
    }
  };

  useEffect(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  return {
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
    fetchPendingCount,
  };
}
