'use client';

import type { Contract, PaginationResponse } from '@/lib/types';
import { useCallback, useState } from 'react';
import { api } from '../lib/api';

export function useContracts(initialPage = 1, initialLimit = 10, advisorId: string | null = null) {
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

  const fetchContracts = useCallback(
    async (
      page: number,
      limit: number,
      search?: string,
      advId?: string | null,
      stage?: string,
      month?: string | null,
      year?: string | null,
      status?: string,
    ) => {
      try {
        setLoading(true);
        const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
        const filterAdvisorId = advId !== undefined ? advId : advisorId;
        const advisorParam = filterAdvisorId
          ? `&advisorId=${encodeURIComponent(filterAdvisorId)}`
          : '';
        const stageParam = stage ? `&stage=${encodeURIComponent(stage)}` : '';
        const monthParam = month ? `&month=${encodeURIComponent(month)}` : '';
        const yearParam = year ? `&year=${encodeURIComponent(year)}` : '';
        const statusParam = status ? `&status=${encodeURIComponent(status)}` : '';

        const data = await api.get<PaginationResponse<Contract>>(
          `/contracts?page=${page}&limit=${limit}${searchParam}${advisorParam}${stageParam}${monthParam}${yearParam}${statusParam}`,
        );
        setContracts(data?.data || []);
        setMeta(
          data?.meta || {
            totalItems: 0,
            itemCount: 0,
            itemsPerPage: limit,
            totalPages: 1,
            currentPage: page,
          },
        );
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    },
    [advisorId],
  );

  return { contracts, meta, loading, error, fetchContracts };
}
