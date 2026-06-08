'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { Role } from '@/lib/types';

export function useRolesCrud() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<Role[]>('/roles');
      setRoles(data || []);
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
        const data = await api.get<Role[]>('/roles');
        if (!cancelled) {
          setRoles(data || []);
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

  const createRole = async (payload: { name: string; description?: string }) => {
    await api.post('/roles', payload);
    await fetchRoles();
  };

  const updateRole = async (id: string, payload: { name?: string; description?: string }) => {
    await api.put(`/roles/${id}`, payload);
    await fetchRoles();
  };

  const assignPermissions = async (id: string, permissionIds: string[]) => {
    await api.put(`/roles/${id}/permissions`, { permissionIds });
    await fetchRoles();
  };

  return { roles, loading, error, fetchRoles, createRole, updateRole, assignPermissions };
}
