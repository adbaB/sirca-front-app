'use client';

import { useState, useEffect, useCallback } from 'react';
import { api } from '@/lib/api';
import type { User } from '@/lib/types';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const data = await api.get<User[]>('/users');
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
        const data = await api.get<User[]>('/users');
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
    return () => {
      cancelled = true;
    };
  }, []);

  const createUser = async (payload: {
    email: string;
    password: string;
    roleId?: string;
    advisorId?: string | null;
  }) => {
    await api.post('/users', payload);
    await fetchUsers();
  };

  const updateUser = async (
    id: string,
    payload: {
      email?: string;
      isActive?: boolean;
      roleId?: string | null;
      advisorId?: string | null;
    },
  ) => {
    await api.put(`/users/${id}`, payload);
    await fetchUsers();
  };

  const deleteUser = async (id: string) => {
    await api.delete(`/users/${id}`);
    await fetchUsers();
  };

  const assignRole = async (userId: string, roleId: string) => {
    await api.patch(`/users/${userId}/role`, { roleId });
    await fetchUsers();
  };

  return { users, loading, error, fetchUsers, createUser, updateUser, deleteUser, assignRole };
}
