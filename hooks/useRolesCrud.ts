'use client';

import { useState, useEffect, useCallback } from 'react';
import type { Role } from '@/lib/types';

export function useRolesCrud() {
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchRoles = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/roles');
      if (!res.ok) throw new Error('Error cargando roles');
      const data = await res.json() as Role[];
      setRoles(data);
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

  const createRole = async (payload: { name: string; description?: string }) => {
    const res = await fetch('/roles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error creando rol');
    }
    await fetchRoles();
    return res.json();
  };

  const updateRole = async (id: string, payload: { name?: string; description?: string }) => {
    const res = await fetch(`/roles/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error actualizando rol');
    }
    await fetchRoles();
    return res.json();
  };

  const assignPermissions = async (id: string, permissionIds: string[]) => {
    const res = await fetch(`/roles/${id}/permissions`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ permissionIds }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error asignando permisos');
    }
    await fetchRoles();
    return res.json();
  };

  return { roles, loading, error, fetchRoles, createRole, updateRole, assignPermissions };
}
