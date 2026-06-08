'use client';

import { useState, useEffect } from 'react';

interface SessionData {
  userId: string;
  email: string;
  role: string | null;
  permissions: string[];
  advisorId: string | null;
}

interface UsePermissionsReturn {
  /** Lista de permisos del usuario actual, ej: ["users:read", "users:write"] */
  permissions: string[];
  /** Rol del usuario, ej: "admin" */
  role: string | null;
  /** ID del asesor vinculado si lo hay */
  advisorId: string | null;
  /** true mientras se decodifica la sesión */
  loading: boolean;
  /** Devuelve true si el usuario tiene el permiso indicado */
  can: (permission: string) => boolean;
  /** Devuelve true si el usuario tiene AL MENOS UNO de los permisos */
  canAny: (perms: string[]) => boolean;
  /** Devuelve true si el usuario tiene TODOS los permisos */
  canAll: (perms: string[]) => boolean;
  /** Devuelve true si el usuario tiene el rol indicado (comparación case-insensitive) */
  hasRole: (roleName: string) => boolean;
}

/**
 * Hook para consultar los permisos del usuario autenticado.
 * Lee la sesión desde el endpoint /api/auth/me (servidor lee la cookie httpOnly).
 *
 * @example
 * const { can } = usePermissions();
 * if (can('users:write')) { ... }
 */
export function usePermissions(): UsePermissionsReturn {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (!res.ok) {
          if (!cancelled) setSession(null);
          return;
        }
        const data = (await res.json()) as SessionData;
        if (!cancelled) setSession(data);
      } catch {
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const permissions = session?.permissions ?? [];
  const role = session?.role ?? null;
  const advisorId = session?.advisorId ?? null;

  return {
    permissions,
    role,
    advisorId,
    loading,
    can: (permission: string) => permissions.includes(permission),
    canAny: (perms: string[]) => perms.some((p) => permissions.includes(p)),
    canAll: (perms: string[]) => perms.every((p) => permissions.includes(p)),
    hasRole: (roleName: string) => role?.toLowerCase() === roleName.toLowerCase(),
  };
}
