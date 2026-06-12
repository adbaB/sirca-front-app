'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Portfolio } from '@/lib/types';

export function usePortfolios() {
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPortfolios = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Portfolio[]>('/portfolios');
      setPortfolios(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const data = await api.get<Portfolio[]>('/portfolios');
        if (!cancelled) {
          setPortfolios(data || []);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : 'Error desconocido');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const createPortfolio = async (payload: {
    name: string;
    code: string;
    status?: 'ACTIVE' | 'INACTIVE';
    commissionAmount: number;
  }) => {
    await api.post('/portfolios', payload);
    await fetchPortfolios();
  };

  const updatePortfolio = async (
    id: string,
    payload: {
      name?: string;
      code?: string;
      status?: 'ACTIVE' | 'INACTIVE';
      commissionAmount?: number;
    },
  ) => {
    await api.patch(`/portfolios/${id}`, payload);
    await fetchPortfolios();
  };

  const deletePortfolio = async (id: string) => {
    await api.delete(`/portfolios/${id}`);
    await fetchPortfolios();
  };

  return {
    portfolios,
    loading,
    error,
    fetchPortfolios,
    createPortfolio,
    updatePortfolio,
    deletePortfolio,
  };
}
