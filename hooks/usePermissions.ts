'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

interface SessionData {
  userId: string;
  email: string;
  role: string | null;
  permissions: string[];
  advisorId: string | null;
}

interface PermissionsContextType {
  session: SessionData | null;
  loading: boolean;
  refetchSession: () => Promise<void>;
}

const PermissionsContext = createContext<PermissionsContextType | undefined>(undefined);

export function PermissionsProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<SessionData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = (await res.json()) as SessionData;
          if (!cancelled) setSession(data);
        } else {
          if (!cancelled) setSession(null);
        }
      } catch {
        if (!cancelled) setSession(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchSession();
    return () => {
      cancelled = true;
    };
  }, []);

  const refetchSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = (await res.json()) as SessionData;
        setSession(data);
      } else {
        setSession(null);
      }
    } catch {
      setSession(null);
    }
  };

  return React.createElement(
    PermissionsContext.Provider,
    { value: { session, loading, refetchSession } },
    children,
  );
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
  /** Refresca los permisos desde el backend */
  refetchPermissions: () => Promise<void>;
}

/**
 * Hook para consultar los permisos del usuario autenticado.
 * Utiliza el contexto de PermissionsProvider, con fallback a fetch individual si se usa fuera del proveedor.
 */
export function usePermissions(): UsePermissionsReturn {
  const context = useContext(PermissionsContext);

  // Standalone fallback state if used outside PermissionsProvider
  const [localSession, setLocalSession] = useState<SessionData | null>(null);
  const [localLoading, setLocalLoading] = useState(true);

  useEffect(() => {
    if (context) return;
    let cancelled = false;

    async function fetchLocalSession() {
      try {
        const res = await fetch('/api/auth/me');
        if (res.ok) {
          const data = (await res.json()) as SessionData;
          if (!cancelled) setLocalSession(data);
        } else {
          if (!cancelled) setLocalSession(null);
        }
      } catch {
        if (!cancelled) setLocalSession(null);
      } finally {
        if (!cancelled) setLocalLoading(false);
      }
    }

    fetchLocalSession();
    return () => {
      cancelled = true;
    };
  }, [context]);

  const refetchLocalSession = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const data = (await res.json()) as SessionData;
        setLocalSession(data);
      } else {
        setLocalSession(null);
      }
    } catch {
      setLocalSession(null);
    }
  };

  const session = context ? context.session : localSession;
  const loading = context ? context.loading : localLoading;
  const refetchPermissions = context ? context.refetchSession : refetchLocalSession;

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
    refetchPermissions,
  };
}
