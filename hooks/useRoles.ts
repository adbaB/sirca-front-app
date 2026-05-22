'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Role } from '@/lib/types';

export function useRoles() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/roles');
      if (!res.ok) throw new Error('Error cargando roles');
      const data = await res.json();
      console.log(data);
      setRoles(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: run the async function inside the effect body directly
  // to avoid the lint warning about calling setState synchronously in effects.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/roles');
        if (!res.ok) throw new Error('Error cargando roles');
        const data = await res.json() as Role[];
        if (!cancelled) {
          setRoles(data);
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

  return { roles, loading, error, fetchRoles };
}
