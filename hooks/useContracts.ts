'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Contract, PaginationResponse } from '@/lib/types';

export function useContracts(initialPage = 1, initialLimit = 10) {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [meta, setMeta] = useState<PaginationResponse<Contract>['meta']>({
    totalItems: 0,
    itemCount: 0,
    currentPage: initialPage,
    totalPages: 1,
    itemsPerPage: initialLimit,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchContracts = useCallback(async (page: number, limit: number, search?: string) => {
    try {
      setLoading(true);
      const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
      const res = await fetch(`/contracts?page=${page}&limit=${limit}${searchParam}`);
      if (!res.ok) throw new Error('Error cargando contratos');
      const data: PaginationResponse<Contract> = await res.json();
      setContracts(data.data || []);
      setMeta(data.meta || { total: 0, page, lastPage: 1, limit });
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
        const res = await fetch(`/contracts?page=${initialPage}&limit=${initialLimit}`);
        if (!res.ok) throw new Error('Error cargando contratos');
        const data = await res.json() as PaginationResponse<Contract>;
        if (!cancelled) {
          setContracts(data.data || []);
          setMeta(data.meta || { total: 0, page: initialPage, lastPage: 1, limit: initialLimit });
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
    return () => { cancelled = true; };
  }, [initialPage, initialLimit]);

  return { contracts, meta, loading, error, fetchContracts };
}
