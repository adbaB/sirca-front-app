'use client';

import { useState, useEffect } from 'react';
import type { Advisor } from '@/lib/types';

export function useAdvisors() {
  const [advisors, setAdvisors] = useState<Advisor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function fetchAdvisors() {
      try {
        setLoading(true);
        const res = await fetch('/advisors');
        if (!res.ok) throw new Error('Error cargando asesores');
        const data = await res.json();
        if (!cancelled) {
          setAdvisors(data);
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

    fetchAdvisors();
    return () => { cancelled = true; };
  }, []);

  return { advisors, loading, error };
}
