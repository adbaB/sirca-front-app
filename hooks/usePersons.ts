'use client';

import type { Person } from '@/lib/types';
import { useCallback, useState } from 'react';

export function usePersons() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const findByIdentity = useCallback(
    async (typeIdentityCard: string, identityCard: string): Promise<Person | null> => {
      try {
        setLoading(true);
        setError(null);
        const type = encodeURIComponent(typeIdentityCard);
        const id = encodeURIComponent(identityCard);
        const res = await fetch(`/persons/by-identity/${type}/${id}`);
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
    },
    [],
  );

  return { loading, error, findByIdentity };
}
