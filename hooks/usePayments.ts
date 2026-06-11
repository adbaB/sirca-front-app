'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
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
      const data = await api.get<{ count: number }>('/billing/payments/pending-count');
      setPendingCount(data?.count || 0);
    } catch (err) {
      console.error('Error al cargar conteo de pagos pendientes:', err);
    }
  }, []);

  const fetchPayments = useCallback(
    async (
      page: number,
      limit: number,
      status?: string,
      search?: string,
      month?: string,
      year?: string,
    ) => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        params.append('page', String(page));
        params.append('limit', String(limit));
        if (status) params.append('status', status);
        if (search) params.append('search', search);
        if (month) params.append('month', month);
        if (year) params.append('year', year);

        const data = await api.get<PaginationResponse<Payment>>(
          `/billing/payments?${params.toString()}`,
        );

        setPayments(data?.data || []);
        setMeta(
          data?.meta || {
            totalItems: 0,
            currentPage: page,
            totalPages: 1,
            itemsPerPage: limit,
            itemCount: 0,
          },
        );

        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    },
    [],
  );

  const approvePayment = async (id: string) => {
    const updatedPayment = await api.patch<Payment>(`/billing/payments/${id}/approve`);

    // Update states
    if (updatedPayment) {
      setSelectedPayment(updatedPayment);
      setPayments((prev) => prev.map((p) => (p.id === id ? updatedPayment : p)));
    }

    // Refresh dynamic badge counts
    fetchPendingCount();
    return updatedPayment;
  };

  const rejectPayment = async (id: string, reason: string) => {
    const updatedPayment = await api.patch<Payment>(`/billing/payments/${id}/reject`, { reason });

    // Update states
    if (updatedPayment) {
      setSelectedPayment(updatedPayment);
      setPayments((prev) => prev.map((p) => (p.id === id ? updatedPayment : p)));
    }

    // Refresh dynamic badge counts
    fetchPendingCount();
    return updatedPayment;
  };

  const updatePaymentDate = async (id: string, paymentDate: string): Promise<Payment | undefined> => {
    const updatedPayment = await api.patch<Payment>(`/billing/payments/${id}/date`, { paymentDate });

    // Update states
    if (updatedPayment) {
      setSelectedPayment(updatedPayment);
      setPayments((prev) => prev.map((p) => (p.id === id ? updatedPayment : p)));
    }

    return updatedPayment;
  };

  useEffect(() => {
    let active = true;
    async function loadPendingCount() {
      try {
        const data = await api.get<{ count: number }>('/billing/payments/pending-count');
        if (active) {
          setPendingCount(data?.count || 0);
        }
      } catch (err) {
        console.error('Error al cargar conteo de pagos pendientes:', err);
      }
    }
    loadPendingCount();
    return () => {
      active = false;
    };
  }, []);

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
    updatePaymentDate,
    fetchPendingCount,
  };
}
