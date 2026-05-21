'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Plan } from '@/lib/types';

export function usePlans() {
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPlans = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/plans');
      if (!res.ok) throw new Error('Error cargando planes');
      const data = await res.json();
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
        const res = await fetch('/plans');
        if (!res.ok) throw new Error('Error cargando planes');
        const data = await res.json() as Plan[];
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
    return () => { cancelled = true; };
  }, []);

  return { plans, loading, error, fetchPlans };
}
