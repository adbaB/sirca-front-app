'use client';

import { useState, useCallback } from 'react';
import type { Person } from '@/lib/types';

export function usePersons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findByIdentity = useCallback(async (typeIdentityCard: string, identityCard: string): Promise<Person | null> => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch(`/persons/by-identity/${typeIdentityCard}/${identityCard}`);
      if (!res.ok) {
        if (res.status === 404) return null;
        throw new Error('Error buscando persona');
      }
      return await res.json();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return { loading, error, findByIdentity };
}
