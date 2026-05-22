'use client';

import { useState, useEffect, useCallback } from 'react';
import type { User } from '@/lib/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const res = await fetch('/users');
      if (!res.ok) throw new Error('Error cargando usuarios');
      const data = await res.json();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load: inline async inside the effect body to satisfy the
  // "no setState synchronously in effects" lint rule.
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        setLoading(true);
        const res = await fetch('/users');
        if (!res.ok) throw new Error('Error cargando usuarios');
        const data = await res.json() as User[];
        if (!cancelled) {
          setUsers(data);
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

  const createUser = async (payload: { email: string; password: string; roleId?: string }) => {
    const res = await fetch('/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error creando usuario');
    }
    await fetchUsers();
    return res.json();
  };

  const updateUser = async (id: string, payload: { email?: string; isActive?: boolean }) => {
    const res = await fetch(`/users/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error actualizando usuario');
    }
    await fetchUsers();
    return res.json();
  };

  const deleteUser = async (id: string) => {
    const res = await fetch(`/users/${id}`, { method: 'DELETE' });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error eliminando usuario');
    }
    await fetchUsers();
  };

  const assignRole = async (userId: string, roleId: string) => {
    const res = await fetch(`/users/${userId}/role`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ roleId }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error(data.message || 'Error asignando rol');
    }
    await fetchUsers();
    return res.json();
  };

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, assignRole };
}
