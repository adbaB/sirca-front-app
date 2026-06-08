'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Plan } from '@/lib/types';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Plan[]>('/plans');
      setPlans(data);
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
        const data = await api.get<Plan[]>('/plans');
        if (!cancelled) {
          setPlans(data);
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

  return { plans, loading, error, fetchPlans };
}
