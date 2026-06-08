'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { buildMonthBilling } from '@/lib/constants';
import type { StatisticsResponse, DashboardFilters } from '@/lib/types';

export function useStatistics(filters: DashboardFilters) {
  const [data, setData] = useState<StatisticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { year, month, advisorUuid } = filters;

  useEffect(() => {
    let cancelled = false;

    async function fetchStats() {
      setLoading(true);
      try {
        const monthBilling = buildMonthBilling(year, month);
        const params = new URLSearchParams({ month_billing: monthBilling });
        if (advisorUuid !== 'all') params.set('advisor_uuid', advisorUuid);

        const json = await api.get<StatisticsResponse>(`/statistics?${params.toString()}`);
        if (!cancelled) {
          setData(json || null);
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

    fetchStats();
    return () => {
      cancelled = true;
    };
  }, [year, month, advisorUuid]);

  return { data, loading, error };
}
